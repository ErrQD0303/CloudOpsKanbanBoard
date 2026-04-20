export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const tasksEndpoint = import.meta.env.PROD
  ? `${import.meta.env.VITE_PRODUCTION_BACKEND_API_PREFIX}${import.meta.env.VITE_TASKS_ENDPOINT}`
  : import.meta.env.VITE_TASKS_ENDPOINT;

export const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];
