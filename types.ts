export interface Script {
  id: string;
  title: string;
  date: string;
  thumbnailUrl: string; // Using placeholder or real URL
  youtubeUrl: string;
  tags: string[];
  content: string; // Markdown content
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export type ViewState = 'HOME' | 'SCRIPT_DETAIL' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'SCRIPT_EDITOR';
export type Language = 'zh' | 'en';
