import { Task } from 'src/types/task.types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  columnId: 'todo' | 'inProgress' | 'done';
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Column({ title, tasks, onEditTask, onDeleteTask }: ColumnProps) {
  return (
    <div className="flex-1 min-w-80 bg-gray-50 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{tasks.length} tasks</p>
      </div>
      
      <div className="space-y-0">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
