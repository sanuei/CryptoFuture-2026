import { useState, useEffect } from 'react';
import { ViewState, Script, Language } from './types';
import { scripts as initialScripts } from './data/mockScripts';
import { translations } from './utils/translations';
import { loadMarkdownScripts } from './services/markdownLoader';
import { GlitchText } from './components/GlitchText';
import { CyberButton } from './components/CyberButton';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ChatInterface } from './components/ChatInterface';
import { AdminLogin } from './components/AdminLogin';
import { ScriptEditor } from './components/ScriptEditor';
import { Terminal, Youtube, FileText, ArrowLeft, ExternalLink, Sparkles, ShieldAlert, Cpu } from './components/Icons';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [lang, setLang] = useState<Language>('zh');
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load scripts from markdown files and local storage on mount
  useEffect(() => {
    const loadAllScripts = async () => {
      try {
        // 首先加载 newdata 文件夹中的 markdown 文件
        const markdownScripts = await loadMarkdownScripts();
        console.log('已加载 Markdown 文件:', markdownScripts.length, '个');
        
        // 合并初始脚本和 markdown 脚本
        let allScripts = [...initialScripts, ...markdownScripts];
        
        // 然后尝试从 localStorage 加载用户保存的脚本
        const savedScripts = localStorage.getItem('cryptoFutureScripts');
        if (savedScripts) {
          try {
            const parsedScripts = JSON.parse(savedScripts);
            // 合并所有脚本，避免重复（基于 ID）
            const existingIds = new Set(allScripts.map(s => s.id));
            const newScripts = parsedScripts.filter((s: Script) => !existingIds.has(s.id));
            allScripts = [...allScripts, ...newScripts];
          } catch (e) {
            console.error("解析 localStorage 脚本失败", e);
          }
        }
        
        setScripts(allScripts);
      } catch (error) {
        console.error("加载脚本失败:", error);
        // 如果加载失败，至少使用初始脚本
        const savedScripts = localStorage.getItem('cryptoFutureScripts');
        if (savedScripts) {
          try {
            setScripts(JSON.parse(savedScripts));
          } catch (e) {
            setScripts(initialScripts);
          }
        } else {
          setScripts(initialScripts);
        }
      }
    };
    
    loadAllScripts();
  }, []);

  // Save scripts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptoFutureScripts', JSON.stringify(scripts));
  }, [scripts]);

  const t = translations[lang];

  const handleOpenScript = (script: Script) => {
    setSelectedScript(script);
    setView('SCRIPT_DETAIL');
    setIsChatOpen(false);
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setView('HOME');
    setSelectedScript(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setView('ADMIN_DASHBOARD');
    } else {
      setView('ADMIN_LOGIN');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('ADMIN_DASHBOARD');
  };

  const handleSaveScript = (updatedScript: Script) => {
    const exists = scripts.find(s => s.id === updatedScript.id);
    if (exists) {
      setScripts(prev => prev.map(s => s.id === updatedScript.id ? updatedScript : s));
    } else {
      setScripts(prev => [updatedScript, ...prev]);
    }
    setView('ADMIN_DASHBOARD');
  };

  const handleDeleteScript = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setScripts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleEditScript = (script: Script) => {
    setSelectedScript(script);
    setView('SCRIPT_EDITOR');
  };

  const handleCreateScript = () => {
    setSelectedScript(null);
    setView('SCRIPT_EDITOR');
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans">
      {/* Background Grid - Static */}
      <div className="fixed inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10 pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cyber-black/90 backdrop-blur-md border-b border-cyber-cyan/30 h-16 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleGoHome}>
          <Terminal className="w-6 h-6 text-cyber-cyan" />
          <GlitchText 
            text={t.siteTitle} 
            as="h1" 
            className="font-mono font-bold text-lg md:text-xl tracking-tighter text-white" 
            animate 
          />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           {/* Admin Toggle */}
           <button 
            onClick={handleAdminClick}
            className={`text-xs font-mono transition-colors ${isAuthenticated ? 'text-cyber-pink animate-pulse' : 'text-gray-600 hover:text-gray-400'}`}
          >
            {isAuthenticated ? <Cpu className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="font-mono text-sm border border-cyber-cyan/30 px-2 py-1 rounded text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          <a 
            href="https://www.youtube.com/@CryptoFuture2026" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-mono text-sm"
          >
            <Youtube className="w-5 h-5" />
            <span className="hidden md:inline">{t.subscribe}</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {view === 'HOME' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 text-center border-b border-dashed border-gray-800">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-cyber-cyan rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
              <div className="inline-block px-3 py-1 border border-cyber-yellow/50 text-cyber-yellow text-xs font-mono mb-4 rounded-full bg-cyber-yellow/5">
                {t.status}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white uppercase tracking-tighter">
                {t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-pink">{t.heroTitleHighlight}</span>
              </h2>
              <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-mono mb-8">
                {t.heroDesc}
              </p>
              <div className="flex justify-center gap-4">
                 <a href="https://www.youtube.com/@CryptoFuture2026" target="_blank" rel="noreferrer">
                  <CyberButton variant="secondary">
                     <Youtube className="w-4 h-4" /> {t.watchChannel}
                  </CyberButton>
                 </a>
              </div>
            </section>

            {/* Script Grid */}
            <section>
              <div className="flex items-center gap-2 mb-8">
                <FileText className="text-cyber-cyan" />
                <h3 className="text-2xl font-bold text-white tracking-widest font-mono">{t.archives}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                  <div 
                    key={script.id}
                    onClick={() => handleOpenScript(script)}
                    className="group relative bg-cyber-panel border border-gray-800 hover:border-cyber-cyan transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                  >
                    {/* Card Image */}
                    <div className="relative h-48 overflow-hidden border-b border-gray-800">
                      <img 
                        src={script.thumbnailUrl} 
                        alt={script.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-cyber-black/50 group-hover:bg-transparent transition-colors duration-300"></div>
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono text-cyber-cyan border border-cyber-cyan/50">
                        {script.date}
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex gap-2 mb-3">
                        {script.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase font-bold text-cyber-pink bg-cyber-pink/10 px-2 py-1 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2 leading-tight">
                        {script.title}
                      </h4>
                      <p className="text-gray-500 text-sm line-clamp-3 font-mono flex-1">
                        {script.summary}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-mono text-gray-400">{t.id}: {script.id.padStart(4, '0')}</span>
                        <span className="text-cyber-cyan text-xs font-bold flex items-center gap-1">{t.accessFile} <ArrowLeft className="w-3 h-3 rotate-180" /></span>
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'SCRIPT_DETAIL' && selectedScript && (
          <div className={`grid gap-8 animate-fadeIn h-[calc(100vh-140px)] ${isChatOpen ? 'grid-cols-1 lg:grid-cols-[1fr_400px]' : 'grid-cols-1'}`}>
            
            {/* Script Viewer */}
            <div className={`relative bg-cyber-panel border border-gray-800 flex flex-col h-full overflow-hidden shadow-2xl ${!isChatOpen ? 'max-w-5xl mx-auto w-full' : ''}`}>
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-cyber-dark">
                <button 
                  onClick={handleGoHome}
                  className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors font-mono text-sm uppercase"
                >
                  <ArrowLeft className="w-4 h-4" /> {t.returnGrid}
                </button>
                <div className="flex gap-3">
                  <a href={selectedScript.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded bg-red-900/10">
                    <Youtube className="w-3 h-3" /> {t.watchVideo}
                  </a>
                  <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded border transition-all ${isChatOpen ? 'text-cyber-black bg-cyber-pink border-cyber-pink' : 'text-cyber-pink border-cyber-pink/50 hover:bg-cyber-pink/10'}`}
                  >
                    <Sparkles className="w-3 h-3" /> {isChatOpen ? t.closeAi : t.analyze}
                  </button>
                </div>
              </div>

              {/* Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar bg-cyber-black/30">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-10 border-b border-gray-700 pb-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight font-sans">{selectedScript.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-400">
                      <span className="text-cyber-cyan">{t.date}: {selectedScript.date}</span>
                      <span>//</span>
                      <span className="flex items-center gap-1">
                        {t.secure} <ShieldAlert className="w-3 h-3 text-green-500" />
                      </span>
                    </div>
                  </div>
                  <div className="article-content">
                    <MarkdownRenderer content={selectedScript.content} />
                  </div>
                  
                  {/* Footer of script */}
                  <div className="mt-16 pt-8 border-t border-dashed border-gray-800 text-center">
                    <p className="text-gray-500 font-mono text-sm mb-4">{t.endOfFile}</p>
                    <a href={selectedScript.youtubeUrl} target="_blank" rel="noreferrer">
                      <CyberButton className="mx-auto">{t.watchChannel} <ExternalLink className="w-4 h-4" /></CyberButton>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chat Panel */}
            {isChatOpen && (
              <div className="fixed inset-0 z-50 lg:static lg:z-auto lg:h-full">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setIsChatOpen(false)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-[90%] md:w-[400px] lg:w-full lg:static h-full">
                  <ChatInterface script={selectedScript} onClose={() => setIsChatOpen(false)} />
                </div>
              </div>
            )}

          </div>
        )}

        {view === 'ADMIN_LOGIN' && (
          <AdminLogin 
            lang={lang}
            onLogin={handleLoginSuccess}
            onCancel={handleGoHome}
          />
        )}

        {view === 'ADMIN_DASHBOARD' && (
          <div className="animate-fadeIn">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
               <div>
                  <h2 className="text-2xl font-bold text-white font-mono">{t.dashboard}</h2>
                  <p className="text-cyber-cyan text-sm font-mono">{t.welcomeBack}</p>
               </div>
               <div className="flex gap-4">
                 <button 
                  onClick={() => { setIsAuthenticated(false); setView('HOME'); }}
                  className="text-xs font-mono text-red-500 hover:text-red-400"
                 >
                   [{t.logout}]
                 </button>
                 <CyberButton onClick={handleCreateScript}>
                   + {t.createScript}
                 </CyberButton>
               </div>
             </div>

             <div className="bg-cyber-panel border border-gray-800 overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-cyber-dark text-xs font-mono text-gray-500 uppercase">
                   <tr>
                     <th className="p-4 border-b border-gray-800">{t.formTitle}</th>
                     <th className="p-4 border-b border-gray-800">{t.formDate}</th>
                     <th className="p-4 border-b border-gray-800 text-right">ACTION</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800 font-mono text-sm">
                   {scripts.map(s => (
                     <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                       <td className="p-4 text-white group-hover:text-cyber-cyan">{s.title}</td>
                       <td className="p-4 text-gray-400">{s.date}</td>
                       <td className="p-4 text-right space-x-2">
                         <button onClick={() => handleEditScript(s)} className="text-cyber-cyan hover:underline">{t.edit}</button>
                         <button onClick={() => handleDeleteScript(s.id)} className="text-red-500 hover:underline">{t.delete}</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {scripts.length === 0 && (
                 <div className="p-8 text-center text-gray-500 font-mono">NO DATA STREAMS FOUND</div>
               )}
             </div>
          </div>
        )}

        {view === 'SCRIPT_EDITOR' && (
          <ScriptEditor 
            lang={lang}
            initialScript={selectedScript}
            onSave={handleSaveScript}
            onCancel={() => setView('ADMIN_DASHBOARD')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-cyber-dark border-t border-gray-800 py-6 text-center z-10">
        <p className="font-mono text-gray-600 text-xs">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}

export default App;
