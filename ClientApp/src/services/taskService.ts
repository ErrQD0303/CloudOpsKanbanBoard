import { tasksEndpoint } from "@/utilities/constants";
import api from "./api";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskStatusPayload,
  UpdateTaskPayload,
} from "@/types/Task";
import { store } from "@/store/store";

const tasksUrl = `${api.defaults.baseURL}${tasksEndpoint}`;

export const tasksService = {
  getAll: () => api.get<Task[]>(tasksUrl),
  create: (task: CreateTaskPayload) => api.post<Task>(tasksUrl, task),
  update: (task: UpdateTaskPayload) =>
    api.put<Task>(`${tasksUrl}/${task.id}`, task),
  updateStatus: ({ id, status }: UpdateTaskStatusPayload) => {
    const currentTask = store.getState().tasks.items.find((t) => t.id === id);
    if (!currentTask) {
      return Promise.reject(new Error(`Task with id ${id} not found`));
    }

    const updatedTask: UpdateTaskPayload = {
      ...currentTask,
      status,
    };

    tasksService.update(updatedTask);
  },
  delete: (id: string) => api.delete(`${tasksUrl}/${id}`),
};
