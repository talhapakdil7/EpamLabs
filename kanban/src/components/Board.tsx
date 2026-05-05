import type { DragEvent } from 'react';
import { Task, TaskStatus, statusLabels } from '../types';
import Column from './Column';

interface BoardProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, status: TaskStatus) => void;
}

const statuses: TaskStatus[] = ['todo', 'inProgress', 'done'];

export default function Board({ tasks, onTaskEdit, onTaskDelete, onTaskMove }: BoardProps) {
  const handleDrop = (status: TaskStatus, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskMove(taskId, status);
    }
  };

  return (
    <div className="board-grid">
      {statuses.map((status) => (
        <Column
          key={status}
          status={status}
          label={statusLabels[status]}
          tasks={tasks.filter((task) => task.status === status)}
          onDrop={(event) => handleDrop(status, event)}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      ))}
    </div>
  );
}
