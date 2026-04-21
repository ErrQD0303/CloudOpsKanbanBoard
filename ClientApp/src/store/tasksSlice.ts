import type { Task, UpdateTaskStatusPayload } from "@/types/Task";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<UpdateTaskStatusPayload>,
    ) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const getTasks = (state: { tasks: TaskState }) => state.tasks.items;
export const isTasksLoading = (state: { tasks: TaskState }) =>
  state.tasks.loading;

export const { setTasks, addTask, updateTaskStatus, deleteTask, updateTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
