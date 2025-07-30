import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
    >
      <span
        className={`${
          isDark ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 transition-transform duration-200 ease-in-out shadow-sm`}
      />
      
      {/* Icons */}
      <Sun
        className={`absolute left-1 h-3 w-3 text-yellow-500 transition-opacity duration-200 ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Moon
        className={`absolute right-1 h-3 w-3 text-blue-400 transition-opacity duration-200 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  );
}
