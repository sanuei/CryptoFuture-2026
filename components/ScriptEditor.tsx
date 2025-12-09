import React, { useState, useEffect } from 'react';
import { Script, Language } from '../types';
import { CyberButton } from './CyberButton';
import { translations } from '../utils/translations';
import { ArrowLeft } from './Icons';

interface ScriptEditorProps {
  lang: Language;
  initialScript?: Script | null;
  onSave: (script: Script) => void;
  onCancel: () => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ lang, initialScript, onSave, onCancel }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Script>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    thumbnailUrl: 'https://picsum.photos/seed/new/600/400',
    youtubeUrl: 'https://www.youtube.com/@CryptoFuture2026',
    tags: [],
    summary: '',
    content: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialScript) {
      setFormData(initialScript);
      setTagInput(initialScript.tags.join(', '));
    } else {
      setFormData(prev => ({ ...prev, id: Date.now().toString() }));
    }
  }, [initialScript]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({ ...formData, tags: processedTags });
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="text-cyber-cyan hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-bold text-white font-mono">
          {initialScript ? t.edit : t.createScript}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-cyber-panel border border-gray-800 p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formTitle}</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-sans outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formDate}</label>
            <input
              type="text"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-mono outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formThumb}</label>
            <input
              type="text"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-mono text-xs outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formYt}</label>
            <input
              type="text"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-mono text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formTags}</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-mono outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formSummary}</label>
          <textarea
            name="summary"
            rows={2}
            value={formData.summary}
            onChange={handleChange}
            className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-2 font-sans outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono text-cyber-cyan uppercase">{t.formContent}</label>
          <textarea
            name="content"
            rows={15}
            value={formData.content}
            onChange={handleChange}
            className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-cyan text-white p-4 font-mono text-sm outline-none"
          />
        </div>

        <div className="pt-4 flex justify-end gap-4 border-t border-gray-800">
          <button type="button" onClick={onCancel} className="px-6 py-2 font-mono text-gray-400 hover:text-white transition-colors">
            {t.cancel}
          </button>
          <CyberButton type="submit">
            {t.save}
          </CyberButton>
        </div>
      </form>
    </div>
  );
};
