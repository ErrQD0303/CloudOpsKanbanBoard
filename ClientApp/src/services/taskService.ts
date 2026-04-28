import { tasksEndpoint } from "@/utilities/constants";
import api from "./api";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskStatusPayload,
  UpdateTaskPayload,
} from "@/types/Task";
import { AxiosError } from "axios";

const tasksUrl = `${api.defaults.baseURL}${tasksEndpoint}`;

export const tasksService = {
  getAll: () => api.get<Task[]>(tasksUrl),
  get: (id: string) => api.get<Task>(`${tasksUrl}/${id}`),
  create: (task: CreateTaskPayload) => api.post<Task>(tasksUrl, task),
  update: async (task: UpdateTaskPayload): Promise<Task> => {
    const response = await api.put<Task>(`${tasksUrl}/${task.id}`, task);

    if (response.status === 200) {
      return response.data; // Return the updated task from the response
    }

    if (response.status === 409) {
      throw new AxiosError(
        "Conflict",
        "ERR_CONFLICT",
        response.config,
        response.request,
        response,
      );
    }

    if (response.status == 404) {
      throw new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        response.config,
        response.request,
        response,
      );
    }

    throw new Error(`Failed to update task: ${response.statusText}`);
  },
  updateStatus: async ({
    id,
    status,
    row_version,
  }: UpdateTaskStatusPayload): Promise<string | undefined> => {
    const response = await api.patch<Task>(`${tasksUrl}/${id}`, {
      id,
      status,
      row_version,
    });

    if (response.status === 200) {
      return response.data.row_version; // Return the new row_version from the response
    }

    if (response.status === 409) {
      throw new AxiosError(
        "Conflict",
        "ERR_CONFLICT",
        response.config,
        response.request,
        response,
      );
    }

    if (response.status == 404) {
      throw new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        response.config,
        response.request,
        response,
      );
    }

    throw new Error(`Failed to update task status: ${response.statusText}`);
  },
  delete: (id: string) => api.delete(`${tasksUrl}/${id}`),
};
