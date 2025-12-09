import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText } from './Icons';
import { Script } from '../types';

interface FileUploaderProps {
  onFilesUploaded: (scripts: Script[]) => void;
  lang: 'zh' | 'en';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUploaded, lang }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 从文件名和内容中提取信息
  const parseMarkdownFile = async (file: File): Promise<Script> => {
    const text = await file.text();
    const fileName = file.name.replace(/\.md$/i, '');
    
    // 尝试从文件内容中提取标题（第一个 # 标题）
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : fileName;
    
    // 尝试提取日期（从文件名或内容中）
    const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/) || text.match(/date[:\s]+(\d{4}-\d{2}-\d{2})/i);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    
    // 提取摘要（前200个字符）
    const summaryText = text.replace(/^#.*$/m, '').trim().substring(0, 200);
    const summary = summaryText.length > 200 ? summaryText + '...' : summaryText;
    
    // 尝试提取标签
    const tagMatch = text.match(/tags?[:\s]+(.+)/i);
    const tags = tagMatch 
      ? tagMatch[1].split(/[,，]/).map(t => t.trim()).filter(Boolean)
      : [];
    
    // 生成唯一 ID
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    return {
      id,
      title,
      date,
      thumbnailUrl: `https://picsum.photos/seed/${id}/600/400`,
      youtubeUrl: 'https://www.youtube.com/@CryptoFuture2026',
      tags: tags.length > 0 ? tags : ['文档'],
      content: text,
      summary: summary || '从 Markdown 文件导入的文档'
    };
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const mdFiles = Array.from(files).filter(file => 
      file.name.toLowerCase().endsWith('.md')
    );

    if (mdFiles.length === 0) {
      alert(lang === 'zh' ? '请上传 .md 格式的文件' : 'Please upload .md files');
      return;
    }

    const scripts: Script[] = [];
    const fileNames: string[] = [];

    for (const file of mdFiles) {
      try {
        const script = await parseMarkdownFile(file);
        scripts.push(script);
        fileNames.push(file.name);
      } catch (error) {
        console.error(`处理文件 ${file.name} 时出错:`, error);
      }
    }

    if (scripts.length > 0) {
      onFilesUploaded(scripts);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      
      // 3秒后清除上传文件列表显示
      setTimeout(() => {
        setUploadedFiles([]);
      }, 3000);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging 
            ? 'border-cyber-cyan bg-cyber-cyan/10 scale-105' 
            : 'border-gray-700 hover:border-cyber-pink hover:bg-cyber-pink/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".md"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <Upload className={`w-12 h-12 ${isDragging ? 'text-cyber-cyan' : 'text-gray-500'}`} />
          <div>
            <p className="text-lg font-mono text-white mb-2">
              {lang === 'zh' ? '拖拽 Markdown 文件到这里' : 'Drag Markdown files here'}
            </p>
            <p className="text-sm text-gray-400 font-mono">
              {lang === 'zh' ? '或点击选择文件' : 'or click to select files'}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-2">
              {lang === 'zh' ? '支持 .md 格式文件' : 'Supports .md files'}
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-mono text-cyber-cyan mb-2">
            {lang === 'zh' ? '已上传文件:' : 'Uploaded files:'}
          </p>
          {uploadedFiles.map((fileName, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-cyber-panel border border-gray-700 px-3 py-2 rounded text-sm font-mono"
            >
              <FileText className="w-4 h-4 text-cyber-cyan" />
              <span className="text-gray-300 flex-1">{fileName}</span>
              <span className="text-green-500 text-xs">✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

