import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Task, TaskStatus } from "@/types/Task";
import type { SelectChangeEvent } from "node_modules/@mui/material";
import { COLUMNS } from "@/utilities/constants";
import { useAppDispatch } from "@/store/hooks";
import { deleteTask } from "@/store/tasksSlice";
import { tasksService } from "@/services/taskService";
import { type MouseEvent, memo } from "react";

interface TaskCardProps {
  task: Task;
  // Later, we will pass down an 'onMove' or 'onClick' function here
  onMove: (id: string, newStatus: TaskStatus, rowVersion: string) => void;
  onCardClick?: (id?: string) => void; // Optional click handler for the card itself (e.g., to open a details modal)
}

export default memo(function TaskCard({
  task,
  onMove,
  onCardClick,
}: TaskCardProps) {
  const dispatch = useAppDispatch(); // dispatch will not change, so it's safe to use directly without useCallback or useMemo
  // without useState, the component will re-render whenever the parent re-renders or when the task prop changes, which is what we want, since we want to reflect the latest task data and allow the parent to control when the card re-renders by changing the task prop
  // So we don't need to use useCallback for the event handlers, since they don't need to be memoized and won't cause unnecessary re-renders of the card itself, and we can just define them directly in the component body

  const handleDeleteTask = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card's onClick (if we add one later)
    // Dispatch delete action here

    tasksService.delete(task.id);
    dispatch(deleteTask(task.id));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const newStatus = e.target.value as TaskStatus;
    onMove(task.id, newStatus, task.row_version); // Pass the current
  };

  const handleTaskStatusClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card's onClick (if we add one later)
  };

  const handleCardClick = () => {
    onCardClick?.(task.id); // Call the onCardClick prop if it exists, passing the task ID
  };

  return (
    <Card sx={{ mb: 2 }} onClick={handleCardClick}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 0,
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              flexGrow: 1,
            }}
          >
            {task.title}
          </Typography>

          <IconButton
            aria-label="delete"
            size="small"
            onClick={handleDeleteTask}
            sx={{
              color: "error.main",
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.disabled">
            ID: {task.id.length > 5 ? task.id.slice(0, 5) + "..." : task.id}
          </Typography>

          {/* Simple Dropdown to move the task */}
          <Select
            size="small"
            value={task.status}
            onChange={handleStatusChange}
            sx={{ minWidth: 120, height: 30, fontSize: "0.8rem" }}
            onClick={handleTaskStatusClick} // Prevent the click from bubbling up to the card's onClick (if we add one later)
          >
            {COLUMNS.map(({ id, title }) => (
              <MenuItem
                key={id}
                value={id}
                sx={{ minWidth: 120, height: 50, fontSize: "0.8rem" }}
              >
                {title}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </CardContent>
    </Card>
  );
});
