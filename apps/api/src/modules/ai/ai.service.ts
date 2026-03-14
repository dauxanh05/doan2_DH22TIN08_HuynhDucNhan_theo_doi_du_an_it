import {
  Injectable,
  GatewayTimeoutException,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AxiosError } from 'axios';
import { PrismaService } from '@/prisma/prisma.service';
import { SplitTaskDto } from './dto/split-task.dto';
import { AnalyzeProgressDto } from './dto/analyze-progress.dto';
import { SuggestAssigneeDto } from './dto/suggest-assignee.dto';
import { CodeAssistDto } from './dto/code-assist.dto';

const AI_MODEL = 'claude-sonnet-4-5';
const AI_MAX_TOKENS = 4096;

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // ============================================================
  // PRIVATE HELPER — gọi AI API và trả về text response
  // ============================================================

  private async callAI(systemPrompt: string, userContent: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('', {
          model: AI_MODEL,
          max_tokens: AI_MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
        }),
      );

      const content = response.data?.content;
      if (!content || !content[0]?.text) {
        throw new ServiceUnavailableException('AI service returned an unexpected response');
      }

      return content[0].text as string;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException('AI service timeout');
      }
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 408 || error.code === 'ECONNABORTED') {
          throw new GatewayTimeoutException('AI service timeout');
        }
        throw new ServiceUnavailableException('AI service unavailable');
      }
      // Re-throw NestJS HTTP exceptions (NotFoundException, etc.)
      throw error;
    }
  }

  // ============================================================
  // ENDPOINT: POST /ai/split-task
  // ============================================================

  async splitTask(dto: SplitTaskDto) {
    const systemPrompt = `Bạn là một Project Manager chuyên nghiệp. Nhiệm vụ của bạn là chia nhỏ task lớn thành các subtask cụ thể, có thể thực hiện được.

Trả về ĐÚNG FORMAT JSON sau (không thêm text khác):
{
  "suggestions": [
    {
      "title": "Tên subtask ngắn gọn",
      "priority": "HIGH" | "MEDIUM" | "LOW" | "URGENT",
      "estimatedTime": "Thời gian ước tính (VD: 2 giờ, 1 ngày)"
    }
  ]
}

Quy tắc:
- Mỗi subtask phải cụ thể và có thể hoàn thành trong 1 ngày
- Chia 3-8 subtasks tùy độ phức tạp
- Priority dựa trên tầm quan trọng và thứ tự thực hiện`;

    const userContent = `Task description: ${dto.description}${dto.projectContext ? `\n\nProject context: ${dto.projectContext}` : ''}`;

    const rawText = await this.callAI(systemPrompt, userContent);

    try {
      // Extract JSON từ response (AI có thể bọc trong markdown code block)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found');
      }
      const parsed = JSON.parse(jsonMatch[0]) as { suggestions: { title: string; priority: string; estimatedTime: string }[] };
      return parsed;
    } catch {
      // Fallback: trả về raw nếu parse lỗi
      return { suggestions: [], raw: rawText };
    }
  }

  // ============================================================
  // ENDPOINT: POST /ai/analyze-progress
  // ============================================================

  async analyzeProgress(dto: AnalyzeProgressDto) {
    // Query project data từ Prisma trực tiếp
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        tasks: {
          include: {
            assignees: true,
            subtasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasks = project.tasks;
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < new Date() && t.status !== 'DONE',
    );

    const systemPrompt = `Bạn là một Project Analyst chuyên nghiệp. Hãy phân tích dữ liệu tiến độ dự án và đưa ra báo cáo chi tiết.

Trả về ĐÚNG FORMAT JSON sau (không thêm text khác):
{
  "analysis": "Phân tích tổng quan bằng tiếng Việt (2-3 câu)",
  "overallHealth": "GOOD" | "AT_RISK" | "CRITICAL",
  "risks": [
    { "description": "Mô tả rủi ro", "severity": "HIGH" | "MEDIUM" | "LOW" }
  ],
  "recommendations": [
    "Gợi ý cụ thể 1",
    "Gợi ý cụ thể 2"
  ]
}`;

    const userContent = `Project: ${project.name}
Status: ${project.status}
Total tasks: ${totalTasks}
Done: ${doneTasks} (${totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)
In Progress: ${inProgressTasks}
Overdue tasks: ${overdueTasks.length}
Overdue details: ${overdueTasks.map((t) => `"${t.title}" (due: ${t.dueDate?.toISOString()})`).join(', ') || 'None'}`;

    const rawText = await this.callAI(systemPrompt, userContent);

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      const parsed = JSON.parse(jsonMatch[0]) as {
        analysis: string;
        overallHealth: string;
        risks: { description: string; severity: string }[];
        recommendations: string[];
      };
      return parsed;
    } catch {
      return {
        analysis: rawText,
        overallHealth: 'UNKNOWN',
        risks: [],
        recommendations: [],
      };
    }
  }

  // ============================================================
  // ENDPOINT: POST /ai/suggest-assignee
  // ============================================================

  async suggestAssignee(dto: SuggestAssigneeDto) {
    // Query members của workspace
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId: dto.workspaceId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!members.length) {
      return { suggestions: [] };
    }

    // Query task cần gợi ý
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
      select: { title: true, description: true, priority: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Tính workload hiện tại của từng member (số task IN_PROGRESS đang assign)
    const workloadMap = await Promise.all(
      members.map(async (m) => {
        const activeCount = await this.prisma.taskAssignee.count({
          where: {
            userId: m.userId,
            task: { status: 'IN_PROGRESS', project: { workspaceId: dto.workspaceId } },
          },
        });
        return { userId: m.userId, name: m.user.name, email: m.user.email, activeCount };
      }),
    );

    const systemPrompt = `Bạn là một PM chuyên nghiệp. Hãy gợi ý người phù hợp nhất để thực hiện task dựa trên workload hiện tại.

Trả về ĐÚNG FORMAT JSON sau (không thêm text khác):
{
  "suggestions": [
    {
      "userId": "id của user được gợi ý",
      "reason": "Lý do ngắn gọn bằng tiếng Việt",
      "currentWorkload": số task đang làm
    }
  ]
}

Gợi ý 1-3 người phù hợp nhất, ưu tiên người có workload thấp.`;

    const userContent = `Task: "${task.title}"
Description: ${task.description || 'Không có mô tả'}
Priority: ${task.priority}

Team members và workload hiện tại:
${workloadMap.map((m) => `- ${m.name} (${m.userId}): ${m.activeCount} task đang làm`).join('\n')}`;

    const rawText = await this.callAI(systemPrompt, userContent);

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      const parsed = JSON.parse(jsonMatch[0]) as {
        suggestions: { userId: string; reason: string; currentWorkload: number }[];
      };
      return parsed;
    } catch {
      return { suggestions: [] };
    }
  }

  // ============================================================
  // ENDPOINT: POST /ai/code-assist
  // ============================================================

  async codeAssist(dto: CodeAssistDto) {
    const systemPrompt = `Bạn là một Tech Lead giàu kinh nghiệm. Hãy trả lời câu hỏi kỹ thuật bằng hướng dẫn chi tiết, rõ ràng.

Quy tắc:
- Trả lời bằng tiếng Việt
- Format: Markdown (dùng heading, code block, bullet points)
- Bao gồm: kiến trúc tổng quan, code mẫu (nếu cần), các bước thực hiện
- Gợi ý best practices và cảnh báo pitfalls nếu có`;

    const userContent = `${dto.prompt}${dto.projectContext ? `\n\nProject context: ${dto.projectContext}` : ''}`;

    const instruction = await this.callAI(systemPrompt, userContent);

    return { instruction };
  }
}
