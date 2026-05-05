import type { DragEvent } from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function Column({ status, label, tasks, onDrop, onTaskEdit, onTaskDelete }: ColumnProps) {
  return (
    <div className="column" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
      <div className="column-header">
        <div>
          <h2>{label}</h2>
          <span className="column-count">{tasks.length} task{tasks.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="column-body">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => onTaskEdit(task)} onDelete={() => onTaskDelete(task.id)} />
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks here yet.</p>
            <small>Drag a card in or press <strong>n</strong> to add one.</small>
          </div>
        )}
      </div>
    </div>
  );
}
