import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { useBoardLogic } from "./useBoardLogic";
import CreateTaskModal from "@/components/CreateUpdateTaskModal/CreateTaskModal";
import { COLUMNS } from "@/utilities/constants";
import TaskCard from "@/components/TaskCard";
import UpdateTaskModal from "@/components/CreateUpdateTaskModal/UpdateTaskModal";

export default function Board() {
  const {
    tasks,
    isLoading,
    isCreateTaskModalOpen,
    handleCreateTaskModalClose,
    handleCreateTaskModalOpen,
    handleCreateTask,
    handleMoveTask,
    handleUpdateTaskModalOpen,
    handleUpdateTaskModalClose,
    handleUpdateTask,
    isUpdateTaskModalOpen,
    selectedTask,
  } = useBoardLogic();

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Sprint Board
        </Typography>
        <Button variant="contained" onClick={handleCreateTaskModalOpen}>
          + New Task
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          const columnTotalItems = columnTasks.length;

          return (
            <Grid key={col.id} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "grey.100", minHeight: "70vh" }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {col.title} ({columnTotalItems})
                </Typography>
                <Box>
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={handleMoveTask}
                      onCardClick={handleUpdateTaskModalOpen}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onClose={handleCreateTaskModalClose}
        onSubmit={handleCreateTask}
      />
      <UpdateTaskModal
        open={isUpdateTaskModalOpen}
        onClose={handleUpdateTaskModalClose}
        onSubmit={handleUpdateTask}
        task={selectedTask!}
      />
    </Box>
  );
}
