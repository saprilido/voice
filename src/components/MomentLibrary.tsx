import React, { useState } from 'react';
import { BookOpen, Sparkles, Feather, Check } from 'lucide-react';
import { PRESET_MOMENTS, MomentItem } from '../data/voices';

interface MomentLibraryProps {
  currentMomentId: string;
  onSelectMoment: (moment: MomentItem) => void;
  onCustomGenerate: (topic: string) => Promise<void>;
  isGeneratingAi: boolean;
}

export const MomentLibrary: React.FC<MomentLibraryProps> = ({
  currentMomentId,
  onSelectMoment,
  onCustomGenerate,
  isGeneratingAi,
}) => {
  const [isOpenAi, setIsOpenAi] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const handleSubmitAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim() && !isGeneratingAi) {
      await onCustomGenerate(topicInput);
      setTopicInput('');
      setIsOpenAi(false);
    }
  };

  return (
    <div id="moment-library-panel" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stone-600" />
          <h3 className="text-sm font-semibold text-stone-800">Moments & Reflections</h3>
        </div>

        <button
          type="button"
          id="toggle-ai-inspiration-btn"
          onClick={() => setIsOpenAi(!isOpenAi)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-900 font-medium hover:text-amber-950 bg-amber-900/10 hover:bg-amber-900/15 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isOpenAi ? 'Close' : 'Inspire with AI'}</span>
        </button>
      </div>

      {isOpenAi && (
        <form
          onSubmit={handleSubmitAi}
          className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3"
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-700 block">
              Describe a reunion, feeling, or memory:
            </label>
            <input
              type="text"
              id="ai-inspiration-topic-input"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. An old diner where we used to sit after midnight..."
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpenAi(false)}
              className="text-xs px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-200/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-ai-inspiration-btn"
              disabled={isGeneratingAi || !topicInput.trim()}
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-50 font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <Sparkles className="w-3 h-3 animate-spin text-amber-300" />
                  <span>Writing vignette...</span>
                </>
              ) : (
                <>
                  <Feather className="w-3 h-3" />
                  <span>Craft Moment</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PRESET_MOMENTS.map((item) => {
          const isSelected = currentMomentId === item.id;
          return (
            <button
              key={item.id}
              id={`select-moment-${item.id}`}
              type="button"
              onClick={() => onSelectMoment(item)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-xs ring-2 ring-stone-900/10'
                  : 'bg-white/80 hover:bg-white text-stone-800 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs tracking-tight">{item.title}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p
                className={`text-xs font-serif-literary line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {item.lines.filter(Boolean).join(' · ')}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
