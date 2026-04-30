import { Task } from './task';

export type TaskStackParamList = {
  TaskList: undefined;
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};