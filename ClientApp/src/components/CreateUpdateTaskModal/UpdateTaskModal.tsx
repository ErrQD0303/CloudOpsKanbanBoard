import { useCreateUpdateTaskModal } from "./useCreateUpdateTaskModal";
import {
  type CreateUpdateTaskPayload,
  type Task,
  type UpdateTaskPayload,
} from "@/types/Task";
import CreateUpdateTaskModalLayout from "./CreateUpdateTaskModalLayout";

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (props: UpdateTaskPayload) => void;
  task: Task;
}

function UpdateTaskModal(props: UpdateTaskModalProps) {
  const {
    title,
    handleTitleChange,
    description,
    handleDescriptionChange,
    status,
    handleTaskStatusChange,
    errors,
    validateAndUpdate,
  } = useCreateUpdateTaskModal({
    onSubmit: props.onSubmit as (props: CreateUpdateTaskPayload) => void,
    task: props.task,
  });

  return (
    <CreateUpdateTaskModalLayout
      {...props}
      modalTitle={title ? "Edit Task" : "Create New Task"}
      modalButtonText={"Update"}
      modalButtonOnClick={validateAndUpdate}
      title={title}
      description={description}
      status={status}
      errors={errors}
      handleTitleChange={handleTitleChange}
      handleDescriptionChange={handleDescriptionChange}
      handleTaskStatusChange={handleTaskStatusChange}
      onSubmit={props.onSubmit as (props: CreateUpdateTaskPayload) => void}
    ></CreateUpdateTaskModalLayout>
  );
}

export default UpdateTaskModal;
