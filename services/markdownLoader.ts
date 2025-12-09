import { Script } from '../types';

/**
 * 从 newdata 文件夹加载 markdown 文件并转换为 Script 对象
 */
export async function loadMarkdownScripts(): Promise<Script[]> {
  try {
    // 使用 Vite 的 glob 功能动态导入所有 markdown 文件
    const markdownModules = import.meta.glob('../newdata/*.md', { 
      query: '?raw',
      import: 'default',
      eager: false 
    });

    const scripts: Script[] = [];
    const fileNames = Object.keys(markdownModules);

    // 并行加载所有文件
    const fileContents = await Promise.all(
      fileNames.map(async (filePath) => {
        const module = markdownModules[filePath];
        const content = await module();
        const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
        return { fileName, content: content as string };
      })
    );

    // 解析每个文件并转换为 Script
    fileContents.forEach(({ fileName, content }, index) => {
      const script = parseMarkdownToScript(fileName, content, index);
      if (script) {
        scripts.push(script);
      }
    });

    return scripts;
  } catch (error) {
    console.error('加载 Markdown 文件失败:', error);
    return [];
  }
}

/**
 * 解析 Markdown 文件内容并转换为 Script 对象
 */
function parseMarkdownToScript(fileName: string, content: string, index: number): Script | null {
  try {
    // 提取标题（第一行 # 开头的）
    const lines = content.split('\n');
    let title = fileName; // 默认使用文件名作为标题
    let date = new Date().toISOString().split('T')[0]; // 默认使用当前日期
    let summary = '';
    let tags: string[] = [];
    
    // 查找标题（第一个 # 开头的行）
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '').trim();
        break;
      }
    }

    // 尝试从文件名或内容中提取日期
    const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
    }

    // 提取摘要（前几段非标题的内容）
    let summaryLines: string[] = [];
    let foundFirstContent = false;
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      if (line.trim() === '') continue;
      if (line.startsWith('---')) continue;
      
      if (!foundFirstContent && line.trim().length > 0) {
        foundFirstContent = true;
      }
      
      if (foundFirstContent) {
        const cleanLine = line.replace(/^\*\*|^\*|^\-|^>/, '').trim();
        if (cleanLine.length > 0 && !cleanLine.startsWith('|')) {
          summaryLines.push(cleanLine);
          if (summaryLines.length >= 3 || summary.length + cleanLine.length > 150) {
            break;
          }
        }
      }
    }
    summary = summaryLines.join(' ').substring(0, 200) || '暂无摘要';

    // 从内容中提取标签（查找包含常见标签关键词的内容）
    const tagKeywords = ['比特币', '以太坊', '加密货币', '监管', '法律', '交易', '投资', 'AI', '区块链', 'DeFi', 'NFT'];
    tagKeywords.forEach(keyword => {
      if (content.includes(keyword) && !tags.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // 如果没找到标签，使用默认标签
    if (tags.length === 0) {
      tags = ['文章'];
    }

    // 生成缩略图 URL（基于标题的哈希）
    const thumbnailSeed = encodeURIComponent(title);
    const thumbnailUrl = `https://picsum.photos/seed/${thumbnailSeed}/600/400`;

    // 生成唯一 ID（基于文件名和索引）
    const id = `md-${Date.now()}-${index}`;

    return {
      id,
      title,
      date,
      thumbnailUrl,
      youtubeUrl: 'https://www.youtube.com/@CryptoFuture2026',
      tags: tags.slice(0, 5), // 最多5个标签
      content,
      summary
    };
  } catch (error) {
    console.error(`解析 Markdown 文件失败 (${fileName}):`, error);
    return null;
  }
}

