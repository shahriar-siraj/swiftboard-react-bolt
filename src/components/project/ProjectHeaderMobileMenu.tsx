import {Archive, FilePenLine, Pencil, Rocket, Trash2} from "lucide-react";
import React from "react";

export default function ProjectHeaderMobileMenu() {
  return <div
      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1">
          <button
              onClick={() => setIsEditingName(true)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
              <Pencil className="h-4 w-4 mr-2"/>
              Edit Name
          </button>
          <button
              onClick={() => setIsEditingDescription(true)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
              <FilePenLine className="h-4 w-4 mr-2"/>
              Edit Description
          </button>
          <button
              onClick={handleStatusUpdate}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
              <Rocket className="h-4 w-4 mr-2"/>
              {project.status === 'pre_launch' ? 'Launch Project' : 'Revert to Pre-launch'}
          </button>
          <button
              onClick={handleArchive}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
              <Archive className="h-4 w-4 mr-2"/>
              Archive Project
          </button>
          {isAdmin && (
              <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
              >
                  <Trash2 className="h-4 w-4 mr-2"/>
                  Delete Project
              </button>
          )}
      </div>
  </div>;
};
