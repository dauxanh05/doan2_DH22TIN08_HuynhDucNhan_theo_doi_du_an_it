import teamSvg from './team.svg';
import startupSvg from './startup.svg';
import codeSvg from './code.svg';
import designSvg from './design.svg';
import marketingSvg from './marketing.svg';
import dataSvg from './data.svg';
import productSvg from './product.svg';
import supportSvg from './support.svg';
import researchSvg from './research.svg';
import financeSvg from './finance.svg';
import educationSvg from './education.svg';
import gamingSvg from './gaming.svg';

export type WorkspacePreset = {
  id: string;
  name: string;
  src: string;
};

export const workspacePresets: WorkspacePreset[] = [
  { id: 'team', name: 'Team', src: teamSvg },
  { id: 'startup', name: 'Startup', src: startupSvg },
  { id: 'code', name: 'Code', src: codeSvg },
  { id: 'design', name: 'Design', src: designSvg },
  { id: 'marketing', name: 'Marketing', src: marketingSvg },
  { id: 'data', name: 'Data', src: dataSvg },
  { id: 'product', name: 'Product', src: productSvg },
  { id: 'support', name: 'Support', src: supportSvg },
  { id: 'research', name: 'Research', src: researchSvg },
  { id: 'finance', name: 'Finance', src: financeSvg },
  { id: 'education', name: 'Education', src: educationSvg },
  { id: 'gaming', name: 'Gaming', src: gamingSvg },
];
