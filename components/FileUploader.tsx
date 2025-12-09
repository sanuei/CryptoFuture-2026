import React, { useRef, useState } from 'react';
import { Script } from '../types';
import { FileText, Upload, X } from './Icons';

interface FileUploaderProps {
  onFilesUploaded: (scripts: Script[]) => void;
  lang: 'zh' | 'en';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUploaded, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  // 解析 Markdown 文件内容，提取 frontmatter 和内容
  const parseMarkdownFile = async (file: File): Promise<Script | null> => {
    try {
      const text = await file.text();
      
      // 检查是否有 frontmatter (YAML 格式)
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = text.match(frontmatterRegex);
      
      let metadata: Record<string, string> = {};
      let content = text;
      
      if (match) {
        // 解析 frontmatter
        const frontmatter = match[1];
        const lines = frontmatter.split('\n');
        lines.forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            metadata[key] = value;
          }
        });
        content = match[2];
      }
      
      // 从文件名提取标题（如果没有 frontmatter）
      const fileName = file.name.replace(/\.md$/i, '');
      const title = metadata.title || fileName;
      
      // 提取第一行作为标题（如果没有 frontmatter title）
      let finalTitle = title;
      if (!metadata.title && !title) {
        const firstLine = content.split('\n').find(line => line.trim().startsWith('#'));
        if (firstLine) {
          finalTitle = firstLine.replace(/^#+\s*/, '').trim();
        } else {
          finalTitle = fileName || '未命名文档';
        }
      }
      
      // 提取摘要（从内容前几行或 frontmatter）
      let summary = metadata.summary || '';
      if (!summary) {
        const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        summary = lines.slice(0, 2).join(' ').substring(0, 100) || '暂无摘要';
      }
      
      // 提取标签
      const tags = metadata.tags 
        ? metadata.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      
      // 生成 ID
      const id = metadata.id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // 日期
      const date = metadata.date || new Date().toISOString().split('T')[0];
      
      // 缩略图 URL
      const thumbnailUrl = metadata.thumbnailUrl || `https://picsum.photos/seed/${id}/600/400`;
      
      // YouTube URL
      const youtubeUrl = metadata.youtubeUrl || 'https://www.youtube.com/@CryptoFuture2026';
      
      return {
        id,
        title: finalTitle,
        date,
        thumbnailUrl,
        youtubeUrl,
        tags,
        content: content.trim(),
        summary: summary.substring(0, 200)
      };
    } catch (error) {
      console.error('解析 Markdown 文件失败:', error);
      return null;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const markdownFiles = Array.from(files).filter(file => 
      file.type === 'text/markdown' || 
      file.name.toLowerCase().endsWith('.md')
    );
    
    if (markdownFiles.length === 0) {
      alert(lang === 'zh' ? '请上传 Markdown (.md) 文件' : 'Please upload Markdown (.md) files');
      return;
    }
    
    setUploadingFiles(markdownFiles.map(f => f.name));
    
    try {
      const scripts: Script[] = [];
      
      for (const file of markdownFiles) {
        const script = await parseMarkdownFile(file);
        if (script) {
          scripts.push(script);
        }
      }
      
      if (scripts.length > 0) {
        onFilesUploaded(scripts);
        alert(
          lang === 'zh' 
            ? `成功上传 ${scripts.length} 个文档！` 
            : `Successfully uploaded ${scripts.length} documents!`
        );
      }
    } catch (error) {
      console.error('处理文件失败:', error);
      alert(lang === 'zh' ? '处理文件时出错' : 'Error processing files');
    } finally {
      setUploadingFiles([]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const t = {
    zh: {
      title: '上传 Markdown 文档',
      description: '拖拽 Markdown 文件到这里，或点击选择文件',
      upload: '选择文件',
      uploading: '上传中...',
      supported: '支持 .md 格式',
      dropHere: '释放文件以上传'
    },
    en: {
      title: 'Upload Markdown Documents',
      description: 'Drag and drop Markdown files here, or click to select',
      upload: 'Select Files',
      uploading: 'Uploading...',
      supported: 'Supports .md format',
      dropHere: 'Drop files to upload'
    }
  }[lang];

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging 
            ? 'border-cyber-cyan bg-cyber-cyan/10 scale-105' 
            : 'border-gray-700 hover:border-cyber-pink/50 hover:bg-cyber-pink/5'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".md,text/markdown"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-cyber-cyan/20' : 'bg-cyber-pink/10'}
            transition-colors
          `}>
            {uploadingFiles.length > 0 ? (
              <div className="animate-spin text-cyber-cyan">
                <Upload className="w-8 h-8" />
              </div>
            ) : (
              <FileText className={`w-8 h-8 ${isDragging ? 'text-cyber-cyan' : 'text-cyber-pink'}`} />
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-2 font-mono">
              {uploadingFiles.length > 0 ? t.uploading : t.title}
            </h4>
            <p className="text-sm text-gray-400 font-mono">
              {isDragging ? t.dropHere : t.description}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              {t.supported}
            </p>
          </div>
          
          {uploadingFiles.length > 0 && (
            <div className="mt-4 w-full max-w-md">
              <div className="space-y-2">
                {uploadingFiles.map((fileName, index) => (
                  <div key={index} className="flex items-center justify-between bg-cyber-dark/50 p-2 rounded text-xs font-mono text-gray-300">
                    <span className="truncate flex-1">{fileName}</span>
                    <X className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-cyber-dark/30 border border-gray-800 rounded text-xs font-mono text-gray-400">
        <p className="mb-2 font-bold text-cyber-cyan">{lang === 'zh' ? '提示：' : 'Tips:'}</p>
        <ul className="list-disc list-inside space-y-1 text-gray-500">
          <li>{lang === 'zh' ? '支持 Markdown (.md) 文件' : 'Supports Markdown (.md) files'}</li>
          <li>
            {lang === 'zh' 
              ? '可在文件开头添加 YAML frontmatter 来设置标题、日期、标签等' 
              : 'Add YAML frontmatter at the beginning to set title, date, tags, etc.'}
          </li>
          <li>
            {lang === 'zh' 
              ? '示例：---\ntitle: 文档标题\ndate: 2024-01-01\ntags: 标签1, 标签2\n---' 
              : 'Example: ---\ntitle: Document Title\ndate: 2024-01-01\ntags: tag1, tag2\n---'}
          </li>
        </ul>
      </div>
    </div>
  );
};

