/**
 * Task type definition with all properties including projectTag for EPIC-004
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  projectTag?: string;
  dueDate?: string;
  column: 'todo' | 'inProgress' | 'done';
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Board state shape for persistence
 */
export interface BoardState {
  tasks: Task[];
  columnOrder: Array<'todo' | 'inProgress' | 'done'>;
  filterProject?: string;
}
