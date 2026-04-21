export const taskStatuses = ["TODO", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskStatusPayload {
  id: string;
  status: TaskStatus;
}

export interface CreateTaskPayloadError {
  title?: string;
}

export type CreateTaskPayload = Omit<Task, "id">;

export type CreateUpdateTaskPayload = Omit<Task, "id"> & { id?: string };

export type UpdateTaskPayload = Task;
