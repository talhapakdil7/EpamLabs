import type { DragEvent } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="task-card" draggable onDragStart={handleDragStart}>
      <div className="task-card-body">
        <h3>{task.title}</h3>
        {task.description ? <p>{task.description}</p> : <p className="task-empty-description">No description</p>}
      </div>
      <div className="task-card-footer">
        <small>Updated {new Date(task.updatedAt).toLocaleDateString()}</small>
        <div className="task-card-actions">
          <button type="button" className="icon-button" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="icon-button danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
