import React, { useState } from 'react';
import { Link as LinkIcon, ExternalLink, Trash2, Plus, Globe, Github, Server, Bookmark } from 'lucide-react';
import type { ProjectLink } from '../../lib/types';

interface LinkListProps {
  links: ProjectLink[];
  onDeleteLink: (id: string) => Promise<void>;
  onAddLink: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

interface LinkGroup {
  title: string;
  icon: typeof Globe;
  types: ProjectLink['type'][];
  description: string;
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Site Links',
    icon: Globe,
    types: ['production', 'staging', 'development'],
    description: 'Live environments and deployments'
  },
  {
    title: 'Repository Links',
    icon: Github,
    types: ['repository'],
    description: 'Source code and documentation'
  },
  {
    title: 'Useful Links',
    icon: Bookmark,
    types: ['other'],
    description: 'Additional resources and references'
  }
];

export default function LinkList({ links, onDeleteLink, onAddLink }: LinkListProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onAddLink(e);
    setIsAddingLink(false);
  };

  const groupedLinks = LINK_GROUPS.map(group => ({
    ...group,
    links: links.filter(link => group.types.includes(link.type))
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <LinkIcon className="h-5 w-5 mr-2 text-primary-500" />
          Project Links
        </h2>
        {links.length > 0 && (
          <button
            onClick={() => setIsAddingLink(true)}
            className="p-1.5 text-gray-500 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        {/* Empty State */}
        {links.length === 0 && !isAddingLink && (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No links added
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add links to your repositories, deployments, and other resources
            </p>
            <button
              onClick={() => setIsAddingLink(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add First Link
            </button>
          </div>
        )}

        {groupedLinks.map((group, index) => group.links.length > 0 && (
          <div key={index} className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <group.icon className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">{group.title}</h3>
            </div>
            <div className="space-y-3">
              {group.links.map(link => (
                <div
                  key={link.id}
                  className="group bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {link.name}
                      </h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-primary-500 hover:text-primary-600 text-sm"
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <button
                      onClick={() => onDeleteLink(link.id)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {isAddingLink && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <input
                type="text"
                name="linkName"
                placeholder="Link name (e.g., Production Site)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            <div>
              <input
                type="url"
                name="linkUrl"
                placeholder="URL (https://...)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <select
                name="linkType"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <optgroup label="Site Links">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </optgroup>
                <optgroup label="Repository Links">
                  <option value="repository">Repository</option>
                </optgroup>
                <optgroup label="Other Links">
                  <option value="other">Other</option>
                </optgroup>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Add Link
              </button>
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}