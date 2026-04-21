import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  taskStatuses,
  type CreateUpdateTaskPayload,
  type Task,
} from "@/types/Task";

interface CreateUpdateTaskModalLayoutProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (props: CreateUpdateTaskPayload) => void;
  modalTitle: string;
  modalButtonText: string;
  modalButtonOnClick: () => void;
  title: string;
  description: string;
  status: string;
  errors: {
    title?: string;
  };
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskStatusChange: (e: SelectChangeEvent) => void;
  task?: Task;
}

function CreateUpdateTaskModalLayout({
  open,
  onClose,
  modalTitle,
  modalButtonText,
  modalButtonOnClick,
  title,
  description,
  status,
  errors,
  handleTitleChange,
  handleDescriptionChange,
  handleTaskStatusChange,
  task,
}: CreateUpdateTaskModalLayoutProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        {task && (
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
            Task ID: {task.id}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          required
          fullWidth
          variant="outlined"
          value={title}
          onChange={handleTitleChange}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={handleDescriptionChange}
        />
        <FormControl required sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="create-task-status-select-lable">Status</InputLabel>
          <Select
            labelId="create-task-status-select-lable"
            id="create-task-status-select"
            value={status}
            label="Status"
            required
            onChange={handleTaskStatusChange}
            size="small"
            sx={{ minWidth: 120, height: 50, fontSize: "0.8rem" }}
          >
            {taskStatuses.map((taskStatus) => (
              <MenuItem
                key={taskStatus}
                value={taskStatus}
                sx={{ minWidth: 120, height: 50, fontSize: "0.8rem" }}
              >
                {taskStatus.replace("_", " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={modalButtonOnClick}
          variant="contained"
          disabled={!title}
        >
          {modalButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUpdateTaskModalLayout;
