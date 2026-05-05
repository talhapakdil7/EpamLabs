import { useMemo, useState } from 'react';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { useTasks } from './hooks/useTasks';
import Board from './components/Board';
import TaskFormModal from './components/TaskFormModal';
import { Task, TaskStatus, statusLabels } from './types';

function App() {
  const { tasks, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const taskCounts = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'inProgress').length,
      done: tasks.filter((task) => task.status === 'done').length,
    }),
    [tasks]
  );

  const openNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  useKeyboardShortcut('n', openNewTask);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (formData: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });
    } else {
      createTask(formData.title, formData.description, formData.status);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Personal Task Board</p>
          <h1>Kanban-style task tracker</h1>
          <p className="subtitle">Create, update, drag tasks across stages, and keep state in your browser.</p>
        </div>
        <div className="header-actions">
          <span className="shortcut-hint">Press <strong>n</strong> to add a task</span>
          <button className="primary-button" type="button" onClick={openNewTask}>
            New Task
          </button>
        </div>
      </header>

      <section className="summary-row">
        {(['todo', 'inProgress', 'done'] as TaskStatus[]).map((status) => (
          <div key={status} className="summary-card">
            <span>{statusLabels[status]}</span>
            <strong>{taskCounts[status]}</strong>
          </div>
        ))}
      </section>

      <Board
        tasks={tasks}
        onTaskEdit={handleEdit}
        onTaskDelete={deleteTask}
        onTaskMove={moveTask}
      />

      <TaskFormModal
        open={isModalOpen}
        task={editingTask ?? undefined}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
