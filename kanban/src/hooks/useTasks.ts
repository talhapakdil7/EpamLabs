import { useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'personal-task-board-tasks';

function formatIso() {
  return new Date().toISOString();
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const createTask = useCallback((title: string, description: string, status: TaskStatus) => {
    const now = formatIso();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((current) => [newTask, ...current]);
  }, [setTasks]);

  const updateTask = useCallback((taskId: string, updatedData: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updatedData,
              updatedAt: formatIso(),
            }
          : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, [setTasks]);

  const moveTask = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              updatedAt: formatIso(),
            }
          : task
      )
    );
  }, [setTasks]);

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
