import React, { useState } from 'react';
import {Key, Lock, Trash2, Plus, Eye, EyeOff, Shield, Pencil} from 'lucide-react';
import type {Secret} from '../../lib/types';

interface SecretListProps {
  secrets: Secret[];
  onDeleteSecret: (id: string) => Promise<void>;
  onAddSecret: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onEditSecret: (id: string, name: string, value: string) => Promise<void>;
}

export default function SecretList({ secrets, onDeleteSecret, onAddSecret, onEditSecret }: SecretListProps) {
  const [isAddingSecret, setIsAddingSecret] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [editingSecretId, setEditingSecretId] = useState<string | null>(null);
  const [editSecretName, setEditSecretName] = useState("");
  const [editSecretValue, setEditSecretValue] = useState("");

  const handleAdd = () => {
    setIsAddingSecret(true);
    setEditingSecretId(null);
    setEditSecretName("");
    setEditSecretValue("");
  }

  const handleEdit = (secret: Secret) => {
    setIsAddingSecret(false);
    setEditingSecretId(secret.id);
    setEditSecretName(secret.name);
    setEditSecretValue(secret.value);
  };

  const handleUpdate = async (e: React.FormEvent, secretId: string) => {
    e.preventDefault();
    await onEditSecret(secretId, editSecretName, editSecretValue);
    setEditingSecretId(null);
  };

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Key className="h-5 w-5 mr-2 text-primary-500" />
          Secrets
        </h2>
        {secrets.length > 0 && (
          <button
            onClick={() => handleAdd()}
            className="p-1.5 text-gray-500 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Empty State */}
        {secrets.length === 0 && !isAddingSecret && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No secrets stored
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Securely store API keys, tokens, and other sensitive data
            </p>
            <button
              onClick={() => handleAdd()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add First Secret
            </button>
          </div>
        )}

        {secrets.map(secret => (
            <div key={secret.id}>
              {editingSecretId === secret.id ? (
                  <form
                      onSubmit={(e) => {handleUpdate(e, secret.id)}}
                      className="mt-4 space-y-4"
                  >
                    <div>
                      <input
                          type="text"
                          name="secretName"
                          value={editSecretName}
                          onChange={(e) => setEditSecretName(e.target.value)}
                          placeholder="Secret name (e.g., API_KEY)"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          required
                          autoFocus
                      />
                    </div>
                    <div>
                      <input
                          type="text"
                          name="secretValue"
                          value={editSecretValue}
                          onChange={(e) => setEditSecretValue(e.target.value)}
                          placeholder="Secret value"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Update Secret
                      </button>
                      <button
                          type="button"
                          onClick={() => setEditingSecretId(null)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
              ) : (
              <div
                key={secret.id}
                className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {secret.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="relative">
                        <code className={`px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded font-mono transition-all duration-200 ${
                          !visibleSecrets[secret.id] ? 'blur-sm select-none' : ''
                        }`}>
                          {secret.value}
                        </code>
                        <button
                          onClick={() => toggleSecretVisibility(secret.id)}
                          className="ml-2 text-gray-500 hover:text-primary-500"
                        >
                          {visibleSecrets[secret.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {visibleSecrets[secret.id] && (
                        <button
                          onClick={() => navigator.clipboard.writeText(secret.value)}
                          className="ml-2 text-primary-500 hover:text-primary-600"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(secret)}
                    className="p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSecret(secret.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              )}
            </div>
        ))}

        {isAddingSecret && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddSecret(e);
              setIsAddingSecret(false);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <input
                type="text"
                name="secretName"
                placeholder="Secret name (e.g., API_KEY)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
                autoFocus
              />
            </div>
            <div>
              <input
                type="text"
                name="secretValue"
                placeholder="Secret value"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Add Secret
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSecret(false)}
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
