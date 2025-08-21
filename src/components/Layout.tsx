import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  HomeIcon, 
  MoonIcon, 
  SunIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply or remove the global `dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (state.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.darkMode]);


  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Slim Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 z-40">
        <div className="h-full p-3">
          <div className="h-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700 shadow-sm flex flex-col items-center justify-between py-5">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-4">
              <img src="/logo.png" alt="My Notes" className="w-10 h-10 rounded-xl" />
            </div>

            {/* Nav icons */}
            <nav className="flex-1 flex flex-col items-center space-y-3 mt-4">
              <button
                onClick={handleHomeClick}
                title="Home"
                className={`icon-btn ${location.pathname === '/' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-700 dark:text-gray-200'}`}
              >
                <HomeIcon className="w-5 h-5" />
              </button>
              <button title="Notes" className="icon-btn text-gray-700 dark:text-gray-200">
                <DocumentTextIcon className="w-5 h-5" />
              </button>
              <button title="Search" className="icon-btn text-gray-700 dark:text-gray-200">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </nav>

            {/* Mode toggle */}
            <div className="flex flex-col items-center">
              <button onClick={toggleDarkMode} title={state.darkMode ? 'Light' : 'Dark'} className="icon-btn text-gray-700 dark:text-gray-200">
                {state.darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200/70 dark:border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Let’s continue your learning</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search notes"
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                />
              </div>
              <div className="pill bg-gray-900 text-white dark:bg-white dark:text-gray-900">Pro</div>
              <img src="https://i.pravatar.cc/40?u=you" alt="You" className="w-9 h-9 rounded-xl" />
            </div>
          </div>
        </header>

        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
