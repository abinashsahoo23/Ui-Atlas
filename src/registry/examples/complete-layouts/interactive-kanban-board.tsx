'use client';

import React, { useState } from 'react';
import { Kanban, Plus, ArrowRight, ArrowLeft, Trash2, Tag, Clock } from 'lucide-react';
import styles from './interactive-kanban-board.module.css';

type ColumnId = 'todo' | 'in-progress' | 'done';

interface KanbanTask {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  column: ColumnId;
  dueDate: string;
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Migrate Redis cluster to regional replicas',
    category: 'Infra',
    priority: 'high',
    column: 'todo',
    dueDate: 'Tomorrow',
  },
  {
    id: 'task-2',
    title: 'Implement AES-GCM token encryption',
    category: 'Security',
    priority: 'medium',
    column: 'in-progress',
    dueDate: 'Oct 24',
  },
  {
    id: 'task-3',
    title: 'Benchmarking WebAssembly cold start',
    category: 'Perf',
    priority: 'low',
    column: 'in-progress',
    dueDate: 'Oct 28',
  },
  {
    id: 'task-4',
    title: 'Publish Phase 5 design tokens to npm',
    category: 'Design System',
    priority: 'medium',
    column: 'done',
    dueDate: 'Yesterday',
  },
];

const COLUMNS: { id: ColumnId; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#94a3b8' },
  { id: 'in-progress', title: 'In Progress', color: '#38bdf8' },
  { id: 'done', title: 'Completed', color: '#34d399' },
];

export function InteractiveKanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [newTitle, setNewTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let newCol: ColumnId = t.column;
        if (direction === 'next') {
          if (t.column === 'todo') newCol = 'in-progress';
          else if (t.column === 'in-progress') newCol = 'done';
        } else {
          if (t.column === 'done') newCol = 'in-progress';
          else if (t.column === 'in-progress') newCol = 'todo';
        }
        return { ...t, column: newCol };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: 'General',
      priority: 'medium',
      column: 'todo',
      dueDate: 'Upcoming',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Kanban size={13} />
          <span>Sprint Kanban Board</span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={styles.addBtn} data-preview-chrome
          aria-expanded={isAdding}
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>

      {/* Add Task Modal/Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className={styles.addForm}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter concise task title..."
            className={styles.titleInput}
            autoFocus
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              Add to Board
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Columns Grid */}
      <div className={styles.columnsGrid}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.id);

          return (
            <div key={col.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <div className={styles.colTitleGroup}>
                  <div className={styles.colDot} style={{ backgroundColor: col.color }} />
                  <span className={styles.colTitle}>{col.title}</span>
                </div>
                <span className={styles.countBadge}>{colTasks.length}</span>
              </div>

              <div className={styles.taskList}>
                {colTasks.length === 0 ? (
                  <div className={styles.emptyCol}>No tasks</div>
                ) : (
                  colTasks.map((t) => (
                    <div key={t.id} className={styles.taskCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.categoryBadge}>
                          <Tag size={10} /> {t.category}
                        </span>
                        <span className={`${styles.priorityBadge} ${styles[t.priority]}`}>
                          {t.priority}
                        </span>
                      </div>

                      <h4 className={styles.taskTitle}>{t.title}</h4>

                      <div className={styles.cardFooter}>
                        <span className={styles.dueDate}>
                          <Clock size={11} /> {t.dueDate}
                        </span>

                        <div className={styles.moveButtons}>
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => moveTask(t.id, 'prev')}
                              className={styles.actionBtn}
                              title="Move back"
                              aria-label="Move task back"
                            >
                              <ArrowLeft size={12} />
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => moveTask(t.id, 'next')}
                              className={styles.actionBtn}
                              title="Move forward"
                              aria-label="Move task forward"
                            >
                              <ArrowRight size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(t.id)}
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete task"
                            aria-label="Delete task"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
