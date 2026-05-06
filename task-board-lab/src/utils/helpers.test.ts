import { describe, it, expect, beforeEach } from 'vitest';
import { trimProjectTag, generateId, getCurrentTimestamp, validateTask } from 'src/utils/helpers';
import { Task } from 'src/types/task.types';

describe('Helpers', () => {
  describe('trimProjectTag', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(trimProjectTag('  web-app  ')).toBe('web-app');
    });

    it('should return undefined for whitespace-only input', () => {
      expect(trimProjectTag('   ')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(trimProjectTag('')).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(trimProjectTag(undefined)).toBeUndefined();
    });

    it('should preserve internal spaces', () => {
      expect(trimProjectTag('  web app  ')).toBe('web app');
    });
  });

  describe('generateId', () => {
    it('should generate a valid UUID-like string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return an ISO8601 timestamp', () => {
      const timestamp = getCurrentTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('validateTask', () => {
    let validTask: Task;

    beforeEach(() => {
      validTask = {
        id: 'test-id',
        title: 'Test task',
        column: 'todo',
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    it('should validate a complete task', () => {
      expect(validateTask(validTask)).toBe(true);
    });

    it('should reject task without id', () => {
      const task = { ...validTask, id: '' };
      expect(validateTask(task)).toBe(false);
    });

    it('should reject task without title', () => {
      const task = { ...validTask, title: '' };
      expect(validateTask(task)).toBe(false);
    });

    it('should reject task with whitespace-only title', () => {
      const task = { ...validTask, title: '   ' };
      expect(validateTask(task)).toBe(false);
    });

    it('should reject task with invalid column', () => {
      const task = { ...validTask, column: 'invalid' as any };
      expect(validateTask(task)).toBe(false);
    });

    it('should accept task with optional projectTag', () => {
      const task = { ...validTask, projectTag: 'web-app' };
      expect(validateTask(task)).toBe(true);
    });
  });
});
