import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Settings"
      >
        <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Globe className="h-4 w-4 mr-2" />
              {i18n.language === 'ja' ? 'English' : '日本語'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}