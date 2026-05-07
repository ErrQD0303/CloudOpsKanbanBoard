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
import { isAxiosError } from "axios";

export const useBoardLogic = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(getTasks);
  const isLoading = useAppSelector(isTasksLoading);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasksService.getAll();
      dispatch(setTasks(response.data));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to fetch tasks:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [dispatch, fetchTasks]);

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

  const handleUpdateTask = async (updatedTask: UpdateTaskPayload) => {
    try {
      const newUpdatedTask = await tasksService.update(updatedTask);
      dispatch(updateTask(newUpdatedTask)); // We need to both add the task to the global state and persistently save it to the backend, if the backend fails to save the task, this line will not execute, and the task will not be added to the global state, which is the desired behavior
      setIsUpdateTaskModalOpen(false);
    } catch (error) {
      const canHandleErrors: number[] = [409, 404]; // We want to specifically handle 409 Conflict and 404 Not Found errors that can occur during task status updates, other types of errors will be logged but not handled with specific user feedback, as they may indicate different issues that are not related to concurrent modifications or missing tasks
      if (
        isAxiosError(error) &&
        error.response &&
        canHandleErrors.includes(error.response.status)
      ) {
        alert(
          "This task has been modified by another user. Please reload the page and try again.",
        );
        fetchTasks(); // Refresh the tasks to get the latest data from the backend, which should resolve the conflict
      } else {
        if (import.meta.env.DEV) {
          console.error("Failed to move task:", error);
        }
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
    async (id: string, newStatus: TaskStatus, rowVersion: string) => {
      try {
        const newRowVersion = await tasksService.updateStatus({
          id,
          status: newStatus,
          row_version: rowVersion,
        });
        console.log("Received new rowVersion from backend:", newRowVersion);
        dispatch(
          updateTaskStatus({
            id,
            status: newStatus,
            row_version: newRowVersion!, // We can assert that newRowVersion is not undefined here because if the backend successfully updates the task status, it will return the new row_version in the response, and if it fails to update the task status, an error will be thrown and this line will not execute, which is the desired behavior
          }),
        ); // We need to both update the task in the global state and persistently save it to the backend, if the backend fails to save the task, this line will not execute, and the task will not be updated in the global state, which is the desired behavior
      } catch (error) {
        const canHandleErrors: number[] = [409, 404]; // We want to specifically handle 409 Conflict and 404 Not Found errors that can occur during task status updates, other types of errors will be logged but not handled with specific user feedback, as they may indicate different issues that are not related to concurrent modifications or missing tasks
        if (
          isAxiosError(error) &&
          error.response &&
          canHandleErrors.includes(error.response.status)
        ) {
          alert(
            "This task has been modified by another user. Please reload the page and try again.",
          );
          fetchTasks(); // Refresh the tasks to get the latest data from the backend, which should resolve the conflict
        } else {
          if (import.meta.env.DEV) {
            console.error("Failed to move task:", error);
          }
        }
      }
    },
    [dispatch, fetchTasks],
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
