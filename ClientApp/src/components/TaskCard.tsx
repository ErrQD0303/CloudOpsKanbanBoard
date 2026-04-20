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
import type { MouseEvent } from "react";

interface TaskCardProps {
  task: Task;
  // Later, we will pass down an 'onMove' or 'onClick' function here
  onMove: (id: string, newStatus: TaskStatus) => void;
  onCardClick?: () => void; // Optional click handler for the card itself (e.g., to open a details modal)
}

export default function TaskCard({ task, onMove, onCardClick }: TaskCardProps) {
  const dispatch = useAppDispatch();

  const handleDeleteTask = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card's onClick (if we add one later)
    // Dispatch delete action here

    tasksService.delete(task.id);
    dispatch(deleteTask(task.id));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const newStatus = e.target.value as TaskStatus;
    onMove(task.id, newStatus);
  };

  const handleTaskStatusClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card's onClick (if we add one later)
  };

  return (
    <Card sx={{ mb: 2 }} onClick={onCardClick}>
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
}
