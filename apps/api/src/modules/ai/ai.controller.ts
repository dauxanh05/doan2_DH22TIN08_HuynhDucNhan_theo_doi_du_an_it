import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { SplitTaskDto } from './dto/split-task.dto';
import { AnalyzeProgressDto } from './dto/analyze-progress.dto';
import { SuggestAssigneeDto } from './dto/suggest-assignee.dto';
import { CodeAssistDto } from './dto/code-assist.dto';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Throttle({ ai: { limit: 5, ttl: 60000 } })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('split-task')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI gợi ý chia nhỏ task thành subtasks' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách subtasks được gợi ý',
    schema: {
      example: {
        suggestions: [
          { title: 'Thiết kế database schema', priority: 'HIGH', estimatedTime: '2 giờ' },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'description is required' })
  @ApiResponse({ status: 429, description: 'Too many AI requests' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  @ApiResponse({ status: 504, description: 'AI service timeout' })
  async splitTask(@Body() dto: SplitTaskDto) {
    return this.aiService.splitTask(dto);
  }

  @Post('analyze-progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI phân tích tiến độ project' })
  @ApiResponse({
    status: 200,
    description: 'Báo cáo phân tích tiến độ',
    schema: {
      example: {
        analysis: 'Dự án đang tiến triển tốt...',
        overallHealth: 'GOOD',
        risks: [{ description: 'Có 2 task bị delay', severity: 'MEDIUM' }],
        recommendations: ['Ưu tiên task có deadline gần nhất'],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'projectId is required' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 429, description: 'Too many AI requests' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  @ApiResponse({ status: 504, description: 'AI service timeout' })
  async analyzeProgress(@Body() dto: AnalyzeProgressDto) {
    return this.aiService.analyzeProgress(dto);
  }

  @Post('suggest-assignee')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI gợi ý người thực hiện task' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách gợi ý người thực hiện',
    schema: {
      example: {
        suggestions: [{ userId: 'clxx...', reason: 'Workload thấp nhất', currentWorkload: 2 }],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Required fields missing' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 429, description: 'Too many AI requests' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  @ApiResponse({ status: 504, description: 'AI service timeout' })
  async suggestAssignee(@Body() dto: SuggestAssigneeDto) {
    return this.aiService.suggestAssignee(dto);
  }

  @Post('code-assist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI hỗ trợ kỹ thuật — trả về hướng dẫn markdown' })
  @ApiResponse({
    status: 200,
    description: 'Hướng dẫn kỹ thuật chi tiết dạng markdown',
    schema: {
      example: {
        instruction: '## JWT Authentication\n\n### Tổng quan...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'prompt is required' })
  @ApiResponse({ status: 429, description: 'Too many AI requests' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  @ApiResponse({ status: 504, description: 'AI service timeout' })
  async codeAssist(@Body() dto: CodeAssistDto) {
    return this.aiService.codeAssist(dto);
  }
}
