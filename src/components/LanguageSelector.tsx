import React, { useState } from 'react';
import { Languages, Search } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('en'); // Default to English

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLanguage = languages.find(lang => lang.code === selectedLang);

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
        <Languages className="w-5 h-5" />
        <span className="text-lg leading-none">{selectedLanguage?.flag}</span>
      </button>
      
      <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible">
        {/* Search input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Language list */}
        <div className="max-h-64 overflow-y-auto">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setSelectedLang(lang.code);
                setSearchQuery('');
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2 text-lg leading-none">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
          {filteredLanguages.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              No languages found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 