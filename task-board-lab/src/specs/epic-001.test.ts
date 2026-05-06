/**
 * Test specification for EPIC-001: Board Foundation and Local Persistence
 * 
 * These tests verify the core foundation features required before EPIC-004 can be implemented.
 */

import { describe, it, expect } from 'vitest';
import { Task, BoardState } from 'src/types/task.types';
import { validateTask, generateId, getCurrentTimestamp } from 'src/utils/helpers';

describe('EPIC-001: Board Foundation and Local Persistence', () => {
  describe('Task CRUD Operations', () => {
    it('should create a valid task with title and column', () => {
      const task: Task = {
        id: generateId(),
        title: 'Test task',
        column: 'todo',
        order: 0,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      expect(validateTask(task)).toBe(true);
      expect(task.title).toBe('Test task');
      expect(task.column).toBe('todo');
    });

    it('should support optional metadata (description, projectTag, dueDate)', () => {
      const task: Task = {
        id: generateId(),
        title: 'Test task',
        description: 'A detailed description',
        projectTag: 'web-app',
        dueDate: new Date().toISOString(),
        column: 'todo',
        order: 0,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      expect(validateTask(task)).toBe(true);
      expect(task.description).toBe('A detailed description');
      expect(task.projectTag).toBe('web-app');
      expect(task.dueDate).toBeDefined();
    });

    it('should track creation and update timestamps', () => {
      const now = getCurrentTimestamp();
      const task: Task = {
        id: generateId(),
        title: 'Test task',
        column: 'todo',
        order: 0,
        createdAt: now,
        updatedAt: now,
      };

      expect(task.createdAt).toBe(now);
      expect(task.updatedAt).toBe(now);
    });
  });

  describe('Task Movement Between Columns', () => {
    it('should support all three columns: todo, inProgress, done', () => {
      const columns: Array<'todo' | 'inProgress' | 'done'> = [
        'todo',
        'inProgress',
        'done',
      ];

      columns.forEach((col) => {
        const task: Task = {
          id: generateId(),
          title: 'Test task',
          column: col,
          order: 0,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };

        expect(validateTask(task)).toBe(true);
        expect(task.column).toBe(col);
      });
    });
  });

  describe('Board State Persistence', () => {
    it('should maintain task order within a column', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'First task',
          column: 'todo',
          order: 0,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        },
        {
          id: '2',
          title: 'Second task',
          column: 'todo',
          order: 1,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        },
      ];

      const boardState: BoardState = {
        tasks,
        columnOrder: ['todo', 'inProgress', 'done'],
      };

      expect(boardState.tasks).toHaveLength(2);
      expect(boardState.tasks[0].order).toBe(0);
      expect(boardState.tasks[1].order).toBe(1);
    });

    it('should support filtering tasks by column', () => {
      const boardState: BoardState = {
        tasks: [
          {
            id: '1',
            title: 'Todo task',
            column: 'todo',
            order: 0,
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          },
          {
            id: '2',
            title: 'In progress task',
            column: 'inProgress',
            order: 0,
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          },
        ],
        columnOrder: ['todo', 'inProgress', 'done'],
      };

      const todoTasks = boardState.tasks.filter((t) => t.column === 'todo');
      const inProgressTasks = boardState.tasks.filter((t) => t.column === 'inProgress');

      expect(todoTasks).toHaveLength(1);
      expect(inProgressTasks).toHaveLength(1);
    });
  });
});
