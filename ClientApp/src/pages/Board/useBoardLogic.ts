import { tasksService } from "@/services/taskService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTask,
  getTasks,
  isTasksLoading,
  setTasks,
  updateTask,
  updateTaskStatus,
} from "@/store/tasksSlice";
import { type CreateTaskPayload } from "@/types/Task";
import { useEffect, useState, useCallback } from "react";
import type {
  CreateUpdateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskPayload,
} from "@/types/Task";

export const useBoardLogic = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(getTasks);
  const isLoading = useAppSelector(isTasksLoading);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksService.getAll();
        dispatch(setTasks(response.data));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [dispatch]);

  // Future logic for handling task updates, drag-and-drop, etc. can be added here
  const handleCreateTask = async ({
    title,
    description,
    status,
  }: CreateUpdateTaskPayload) => {
    try {
      const newTask: CreateTaskPayload = {
        title,
        description,
        status: status,
      };

      const response = await tasksService.create(newTask);
      dispatch(addTask(response.data)); // We need to both add the task to the global state and persistently save it to the backend, if the backend fails to save the task, this line will not execute, and the task will not be added to the global state, which is the desired behavior
      setIsCreateTaskModalOpen(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const handleUpdateTask = async ({
    id,
    title,
    description,
    status,
  }: CreateUpdateTaskPayload) => {
    try {
      const updatedTask: UpdateTaskPayload = {
        id: id!,
        title,
        description,
        status: status,
      };

      await tasksService.update(updatedTask);
      dispatch(updateTask(updatedTask)); // We need to both add the task to the global state and persistently save it to the backend, if the backend fails to save the task, this line will not execute, and the task will not be added to the global state, which is the desired behavior
      setIsUpdateTaskModalOpen(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const handleCreateTaskModalClose = () => {
    setIsCreateTaskModalOpen(false);
  };

  const handleCreateTaskModalOpen = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleMoveTask = useCallback(
    async (id: string, newStatus: TaskStatus) => {
      try {
        await tasksService.updateStatus({ id, status: newStatus });
        dispatch(updateTaskStatus({ id, status: newStatus })); // We need to both update the task in the global state and persistently save it to the backend, if the backend fails to save the task, this line will not execute, and the task will not be updated in the global state, which is the desired behavior
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to move task:", error);
        }
      }
    },
    [dispatch],
  );

  const handleUpdateTaskModalOpen = useCallback(
    (taskId?: string) => {
      if (taskId) {
        // If a task ID is provided, we are opening the modal to update an existing task
        const taskToEdit = tasks.find((t) => t.id === taskId);
        if (taskToEdit) {
          setSelectedTask(taskToEdit);
          setIsUpdateTaskModalOpen(true);
        } else {
          if (import.meta.env.DEV) {
            console.warn(`Task with ID ${taskId} not found for editing.`);
          }
        }
      } else {
        // If no task ID is provided, we are opening the modal to create a new task
        setSelectedTask(undefined);
        setIsUpdateTaskModalOpen(true);
      }
    },
    [tasks],
  );
  const handleUpdateTaskModalClose = () => {
    setIsUpdateTaskModalOpen(false);
    setSelectedTask(undefined);
  };

  return {
    tasks,
    isLoading,
    isCreateTaskModalOpen,
    handleCreateTask,
    handleUpdateTask,
    handleCreateTaskModalClose,
    handleCreateTaskModalOpen,
    handleUpdateTaskModalClose,
    handleUpdateTaskModalOpen,
    handleMoveTask,
    isUpdateTaskModalOpen,
    selectedTask,
  };
};
