import { Task } from 'src/types/task.types';

/**
 * Generate a simple UUID v4-like string.
 * In production, consider using nanoid or crypto.randomUUID.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Trim whitespace from project tag and return empty string if only whitespace
 */
export function trimProjectTag(tag: string | undefined): string | undefined {
  if (!tag) return undefined;
  const trimmed = tag.trim();
  return trimmed || undefined;
}

/**
 * Validate a task has required fields
 */
export function validateTask(task: Partial<Task>): task is Task {
  return !!(
    task.id &&
    task.title &&
    task.title.trim() &&
    task.column &&
    ['todo', 'inProgress', 'done'].includes(task.column) &&
    typeof task.order === 'number' &&
    task.createdAt &&
    task.updatedAt
  );
}

/**
 * Format a date for display
 */
export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
