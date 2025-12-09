<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CryptoFuture 2026

一个赛博朋克风格的加密货币视频脚本归档平台，集成了 AI 智能分析功能。

🌐 **在线访问**: [https://sanuei.github.io/CryptoFuture-2026/](https://sanuei.github.io/CryptoFuture-2026/)

## ✨ 功能特性

- 📚 **脚本归档**: 展示和管理 YouTube 视频脚本
- 🤖 **AI 智能分析**: 使用 Google Gemini API 对脚本进行智能分析和问答
- 🌍 **双语支持**: 支持中文和英文界面切换
- 🎨 **赛博朋克 UI**: 独特的赛博朋克风格用户界面
- 👨‍💼 **管理员功能**: 支持创建、编辑和删除脚本
- 💾 **本地存储**: 使用 localStorage 保存脚本数据
- 📱 **响应式设计**: 适配桌面和移动设备

## 🚀 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境变量配置

创建 `.env.local` 文件并添加你的 Gemini API Key：

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **注意**: 如果你没有 Gemini API Key，可以访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取。

### 本地开发

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 🛠️ 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI 服务**: Google Gemini API (@google/genai)
- **图标**: Lucide React

## 📁 项目结构

```
CryptoFuture-2026/
├── components/          # React 组件
│   ├── AdminLogin.tsx   # 管理员登录
│   ├── ChatInterface.tsx # AI 聊天界面
│   ├── CyberButton.tsx  # 赛博朋克风格按钮
│   ├── GlitchText.tsx   # 故障风格文字
│   ├── Icons.tsx        # 图标组件
│   ├── MarkdownRenderer.tsx # Markdown 渲染器
│   └── ScriptEditor.tsx # 脚本编辑器
├── data/                # 数据文件
│   └── mockScripts.ts   # 模拟脚本数据
├── services/            # 服务层
│   └── geminiService.ts # Gemini API 服务
├── utils/               # 工具函数
│   └── translations.ts  # 翻译文件
├── .github/
│   └── workflows/       # GitHub Actions 工作流
│       └── main.yml     # CI/CD 配置
└── public/              # 静态资源
```

## 🚢 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages。每次推送到 `main` 分支时，会自动构建并部署。

**启用步骤**:
1. 进入仓库 Settings → Pages
2. 在 Source 中选择 "GitHub Actions"
3. 保存设置

部署完成后，你的网站将在以下地址可用：
`https://sanuei.github.io/CryptoFuture-2026/`

## 🔐 管理员功能

默认管理员密码: `CryptoFuture2026`

管理员可以：
- 创建新脚本
- 编辑现有脚本
- 删除脚本

## 📝 脚本格式

脚本支持 Markdown 格式，包含以下字段：
- 标题 (Title)
- 日期 (Date)
- 缩略图 URL (Thumbnail URL)
- YouTube URL
- 标签 (Tags)
- 摘要 (Summary)
- 内容 (Content) - Markdown 格式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目仅供学习和研究使用。

## ⚠️ 免责声明

© CryptoFuture2026 // 版权所有 // 非财务建议

---

**View your app in AI Studio**: https://ai.studio/apps/drive/1hy_iLDn59QRgFZt5R72bQTKuvPtU5-Sz
