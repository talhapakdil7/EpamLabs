import { useState } from 'react';
import { Task, BoardState } from 'src/types/task.types';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { generateId, getCurrentTimestamp, validateTask } from 'src/utils/helpers';
import { Column } from './Column';
import { TaskForm } from './TaskForm';

const INITIAL_BOARD_STATE: BoardState = {
  tasks: [],
  columnOrder: ['todo', 'inProgress', 'done'],
};

export function TaskBoard() {
  const [boardState, setBoardState] = useLocalStorage<BoardState>(
    'task-board-state',
    INITIAL_BOARD_STATE
  );

  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Organize tasks by column
  const tasksByColumn = {
    todo: boardState.tasks.filter((t) => t.column === 'todo').sort((a, b) => a.order - b.order),
    inProgress: boardState.tasks
      .filter((t) => t.column === 'inProgress')
      .sort((a, b) => a.order - b.order),
    done: boardState.tasks.filter((t) => t.column === 'done').sort((a, b) => a.order - b.order),
  };

  /**
   * Create a new task
   */
  const handleCreateTask = (taskData: Partial<Task>) => {
    const maxOrderInColumn = Math.max(
      0,
      ...boardState.tasks
        .filter((t) => t.column === 'todo')
        .map((t) => t.order),
      -1
    );

    const newTask: Task = {
      id: generateId(),
      title: taskData.title || '',
      description: taskData.description,
      projectTag: taskData.projectTag, // US-004.01: AC-2
      dueDate: taskData.dueDate,
      column: 'todo',
      order: maxOrderInColumn + 1,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    if (!validateTask(newTask)) {
      console.error('Invalid task data:', newTask);
      return;
    }

    setBoardState({
      ...boardState,
      tasks: [...boardState.tasks, newTask],
    });

    setFormMode('closed');
  };

  /**
   * Update an existing task
   */
  const handleEditTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      title: taskData.title || editingTask.title,
      description: taskData.description,
      projectTag: taskData.projectTag,
      dueDate: taskData.dueDate,
      updatedAt: getCurrentTimestamp(),
    };

    if (!validateTask(updatedTask)) {
      console.error('Invalid task data:', updatedTask);
      return;
    }

    setBoardState({
      ...boardState,
      tasks: boardState.tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)),
    });

    setFormMode('closed');
    setEditingTask(undefined);
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setBoardState({
      ...boardState,
      tasks: boardState.tasks.filter((t) => t.id !== taskId),
    });
  };

  /**
   * Open create form
   */
  const handleOpenCreateForm = () => {
    setEditingTask(undefined);
    setFormMode('create');
  };

  /**
   * Open edit form
   */
  const handleOpenEditForm = (task: Task) => {
    setEditingTask(task);
    setFormMode('edit');
  };

  /**
   * Close form
   */
  const handleCloseForm = () => {
    setFormMode('closed');
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
        <button
          onClick={handleOpenCreateForm}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          + New Task
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        <Column
          title="To Do"
          columnId="todo"
          tasks={tasksByColumn.todo}
          onEditTask={handleOpenEditForm}
          onDeleteTask={handleDeleteTask}
        />
        <Column
          title="In Progress"
          columnId="inProgress"
          tasks={tasksByColumn.inProgress}
          onEditTask={handleOpenEditForm}
          onDeleteTask={handleDeleteTask}
        />
        <Column
          title="Done"
          columnId="done"
          tasks={tasksByColumn.done}
          onEditTask={handleOpenEditForm}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {formMode === 'create' && (
        <TaskForm onSave={handleCreateTask} onCancel={handleCloseForm} />
      )}

      {formMode === 'edit' && editingTask && (
        <TaskForm
          task={editingTask}
          onSave={handleEditTask}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
