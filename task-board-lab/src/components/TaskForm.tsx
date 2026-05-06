import { useState } from 'react';
import { Task } from 'src/types/task.types';
import { trimProjectTag } from 'src/utils/helpers';

interface TaskFormProps {
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
}

/**
 * TaskForm component for creating and editing tasks.
 * Implements US-004.01: Add Project Tag During Task Creation
 * - AC-1: Optional projectTag field in form
 * - AC-2: projectTag saved with task
 * - AC-3: Tasks created without tag work fine
 * - AC-4: Whitespace trimmed from projectTag
 */
export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [projectTag, setProjectTag] = useState(task?.projectTag || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Task title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      projectTag: trimProjectTag(projectTag), // AC-4: Trim whitespace
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>

          <div className="space-y-4">
            {/* Title (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Description (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Project Tag (optional) - US-004.01: AC-1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Tag
              </label>
              <input
                type="text"
                value={projectTag}
                onChange={(e) => setProjectTag(e.target.value)}
                placeholder="e.g., web-app, documentation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: organize tasks by project</p>
            </div>

            {/* Due Date (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
