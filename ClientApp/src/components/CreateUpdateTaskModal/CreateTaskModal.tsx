import { useCreateUpdateTaskModal } from "./useCreateUpdateTaskModal";
import { type CreateUpdateTaskPayload } from "@/types/Task";
import CreateUpdateTaskModalLayout from "./CreateUpdateTaskModalLayout";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (props: CreateUpdateTaskPayload) => void;
}

function CreateTaskModal(props: CreateTaskModalProps) {
  const {
    title,
    handleTitleChange,
    description,
    handleDescriptionChange,
    status,
    handleTaskStatusChange,
    errors,
    validateAndCreate,
  } = useCreateUpdateTaskModal({ onSubmit: props.onSubmit });

  return (
    <CreateUpdateTaskModalLayout
      {...props}
      modalTitle={"Create New Task"}
      modalButtonText={"Create"}
      modalButtonOnClick={validateAndCreate}
      title={title}
      description={description}
      status={status}
      errors={errors}
      handleTitleChange={handleTitleChange}
      handleDescriptionChange={handleDescriptionChange}
      handleTaskStatusChange={handleTaskStatusChange}
    ></CreateUpdateTaskModalLayout>
  );
}

export default CreateTaskModal;
