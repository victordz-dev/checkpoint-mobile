import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus } from '../types/task';
import { loadTasks, saveTasks } from '../services/taskStorage';
import { generateId } from '../utils/generateId';

interface TaskContextData {
  tasks: Task[];
  isLoading: boolean;
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  filterByStatus: (status: TaskStatus | 'todas') => Task[];
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredTasks();
  }, []);

  async function loadStoredTasks() {
    try {
      const stored = await loadTasks();
      setTasks(stored);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function persist(updated: Task[]) {
    setTasks(updated);
    await saveTasks(updated);
  }

  async function addTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await persist([...tasks, newTask]);
  }

  async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
    );
    await persist(updated);
  }

  async function removeTask(id: string) {
    await persist(tasks.filter((t) => t.id !== id));
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
  }

  function filterByStatus(status: TaskStatus | 'todas'): Task[] {
    if (status === 'todas') return tasks;
    return tasks.filter((t) => t.status === status);
  }

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, addTask, updateTask, removeTask, getTaskById, filterByStatus }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextData {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks deve ser usado dentro de TaskProvider');
  return context;
}