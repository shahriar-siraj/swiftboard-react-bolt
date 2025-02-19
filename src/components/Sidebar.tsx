import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Plus,
  Archive,
  Inbox,
  HelpCircle,
  Coffee,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import * as Config from '../lib/config';

export default function Sidebar() {
  const location = useLocation();
  const user = auth.currentUser;
  // Set initial state based on window width
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1700);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setIsExpanded(width >= 1700);
  }, []);

  const openSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (sidebar && overlay) {
      sidebar.style.display = 'block';
      overlay.style.display = 'block';
      // overlay.classList.toggle('hidden');
    }

    setIsExpanded(true);
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (sidebar && overlay) {
      sidebar.style.display = 'none';
      overlay.style.display = 'none';
      // overlay.classList.toggle('hidden');
    }

    setIsExpanded(false);
  };

  useEffect(() => {
    if (windowWidth < 640) {
      closeSidebar();
    }
  }, [location, windowWidth]);

  useEffect(() => {
    // Set initial state immediately
    handleResize();

    // Then add the event listener for future changes
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
      <div>
        <div id="overlay" className="hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeSidebar}></div>
        <div className="pl-4 pt-4">
          <div
              id="sidebarToggle"
              className="rounded-lg w-[48px] h-[48px] flex items-center justify-center cursor-pointer
               bg-primary-600 text-white shadow-lg sm:hidden z-50 fixed"
              onClick={openSidebar}
          >
            <svg className="h-[24px] w-[24px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 24H42M6 12H42M6 36H42" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
            {/*{sidebarOpen ? (*/}
            {/*    <svg className="h-[30px] w-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*      <path d="M6 12L24 30L42 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"*/}
            {/*            strokeLinejoin="round"/>*/}
            {/*    </svg>*/}
            {/*) : (*/}
            {/*    <svg className="h-[30px] w-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*      <path d="M6 24H42M6 12H42M6 36H42" stroke="currentColor" strokeWidth="4" strokeLinecap="round"*/}
            {/*            strokeLinejoin="round"/>*/}
            {/*    </svg>*/}
            {/*)}*/}
          </div>
        </div>


        <div
            id="sidebar"
            className={cn(
                "hidden sm:block fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50",
                isExpanded ? "w-64" : "w-20"
            )}
        >
          <div className="flex flex-col h-full">
            {windowWidth < 1700 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:block absolute -right-3 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isExpanded ? (
                      <ChevronLeft className="h-4 w-4"/>
                  ) : (
                      <ChevronRight className="h-4 w-4"/>
                  )}
                </button>
            )}

            {/* Logo */}
            <div className={cn(
                "p-6",
                !isExpanded && "flex justify-center"
            )}>
              {isExpanded ? (
                  <div className="flex items-center space-x-2">
                    <FolderKanban className="h-7 w-7 text-primary-600"/>
                    <h1 className="text-xl font-bold text-primary-600">
                      {Config.APP_NAME}
                    </h1>
                  </div>
              ) : (
                  <FolderKanban className="h-8 w-8 text-primary-600"/>
              )}
            </div>

            {/* New Project Button */}
            <div className={cn(
                "px-4 mb-6",
                !isExpanded && "flex justify-center"
            )}>
              <Link
                  to="/new-project"
                  className={cn(
                      "flex items-center justify-center text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                      isExpanded ? "w-full px-4 py-2" : "w-12 h-12"
                  )}
                  title="New Project"
              >
                <Plus className={cn(
                    "w-4 h-4",
                    isExpanded && "mr-2"
                )}/>
                {isExpanded && "New Project"}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <Link
                  to="/dashboard"
                  className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                      isActive('/dashboard')
                          ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
                      !isExpanded && "justify-center"
                  )}
                  title="Dashboard"
              >
                <LayoutDashboard className={cn(
                    "w-5 h-5",
                    isExpanded && "mr-3"
                )}/>
                {isExpanded && "Dashboard"}
              </Link>

              <Link
                  to="/projects"
                  className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                      isActive('/projects')
                          ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
                      !isExpanded && "justify-center"
                  )}
                  title="All Projects"
              >
                <Inbox className={cn(
                    "w-5 h-5",
                    isExpanded && "mr-3"
                )}/>
                {isExpanded && "All Projects"}
              </Link>

              <Link
                  to="/archived"
                  className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                      isActive('/archived')
                          ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
                      !isExpanded && "justify-center"
                  )}
                  title="Archived"
              >
                <Archive className={cn(
                    "w-5 h-5",
                    isExpanded && "mr-3"
                )}/>
                {isExpanded && "Archived"}
              </Link>

              <Link
                  to="/help"
                  className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                      isActive('/help')
                          ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
                      !isExpanded && "justify-center"
                  )}
                  title="Help & Support"
              >
                <HelpCircle className={cn(
                    "w-5 h-5",
                    isExpanded && "mr-3"
                )}/>
                {isExpanded && "Help & Support"}
              </Link>

              <Link
                  target="_blank"
                  to="https://ko-fi.com/shahriarsiraj"
                  className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                      isActive('/coffee')
                          ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
                      !isExpanded && "justify-center"
                  )}
                  title="Buy Us a Coffee"
              >
                <Coffee className={cn(
                    "w-5 h-5",
                    isExpanded && "mr-3"
                )}/>
                {isExpanded && "Buy Us a Coffee"}
              </Link>
            </nav>

            {/* User Section */}
            <div className={cn(
                "p-4 border-t border-gray-200 dark:border-gray-700",
                !isExpanded && "flex flex-col items-center"
            )}>
              {isExpanded ? (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <div
                            className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {user?.displayName?.[0] || user?.email?.[0] || '?'}
                    </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <Settings className="w-5 h-5 mr-3"/>
                        Settings
                      </Link>
                      <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <LogOut className="w-5 h-5 mr-3"/>
                        Sign Out
                      </button>
                    </div>
                  </>
              ) : (
                  <>
                    <div
                        className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  {user?.displayName?.[0] || user?.email?.[0] || '?'}
                </span>
                    </div>
                    <Link
                        to="/settings"
                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg mb-2"
                        title="Settings"
                    >
                      <Settings className="w-5 h-5"/>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg"
                        title="Sign Out"
                    >
                      <LogOut className="w-5 h-5"/>
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
