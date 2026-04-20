import {
  taskStatuses,
  type CreateTaskPayloadError,
  type CreateUpdateTaskPayload,
  type Task,
  type TaskStatus,
} from "@/types/Task";
import { checkTitle } from "@/utilities/helpers";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";

interface useCreateUpdateTaskModalProps {
  onSubmit: (padload: CreateUpdateTaskPayload) => void;
  task?: Task;
}

export const useCreateUpdateTaskModal = ({
  onSubmit,
  task,
}: useCreateUpdateTaskModalProps) => {
  const [cardId, setCardId] = useState<string | undefined>(
    task?.id || undefined,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(
    taskStatuses[0] as TaskStatus,
  ); // Default to "TODO"
  const [errors, setErrors] = useState<CreateTaskPayloadError>({});

  const resetStates = () => {
    setCardId(undefined);
    setTitle("");
    setDescription("");
    setStatus(taskStatuses[0] as TaskStatus);
    setErrors({});
  };

  const validateAndCreate = () => {
    const checkTitleResult = checkTitle(title);
    if (checkTitleResult) {
      setErrors({ title: checkTitleResult });
      return;
    }

    onSubmit({ title, description, status }); // Default to "TODO"

    resetStates();
  };

  const validateAndUpdate = () => {
    const checkTitleResult = checkTitle(title);
    if (checkTitleResult) {
      setErrors({ title: checkTitleResult });
      return;
    }

    onSubmit({ id: cardId, title, description, status });

    resetStates();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTaskStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value as TaskStatus);
  };

  useEffect(() => {
    const setUpdateStates = async () => {
      if (task) {
        setCardId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
      } else {
        resetStates();
      }
    };

    setUpdateStates();
  }, [task]);

  return {
    title,
    handleTitleChange,
    description,
    handleDescriptionChange,
    status,
    handleTaskStatusChange,
    validateAndCreate,
    validateAndUpdate,
    errors,
  };
};
