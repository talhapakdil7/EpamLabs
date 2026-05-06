import { Task } from 'src/types/task.types';
import { formatDate } from 'src/utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 break-words pr-2">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 text-lg leading-none"
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {task.projectTag && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {task.projectTag}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
        )}
      </div>

      <button
        onClick={() => onEdit(task)}
        className="text-xs text-blue-500 hover:text-blue-700 mt-2"
      >
        Edit
      </button>
    </div>
  );
}
