// Unit tests for the tasksSlice Redux slice using Vitest
import { describe, it, expect } from "vitest";
import tasksReducer, {
  addTask,
  setTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  type TaskState,
} from "./tasksSlice";
import type { Task } from "@/types/Task";
import { generateRowVersion } from "@/utilities/helpers"; // Import the helper function to generate mock row_version values

describe("Tasks Redux Slice", () => {
  // Define a fresh initial state for our tests
  const initialState: TaskState = {
    items: [],
    loading: false,
    error: null,
  };

  const compareTaskItem = (task: Task, stateTask: Task) => {
    expect(stateTask.id).toEqual(task.id);
    expect(stateTask.title).toEqual(task.title);
    expect(stateTask.description).toEqual(task.description);
    expect(stateTask.status).toEqual(task.status);
    expect(stateTask.row_version).toEqual(task.row_version);
  };

  it("should handle setting tasks from API", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Test Task 1",
        description: "Description for Task 1",
        status: "TODO" as const,
        row_version: generateRowVersion(), // Mock row_version for testing
      },
      {
        id: "2",
        title: "Test Task 2",
        description: "Description for Task 2",
        status: "IN_PROGRESS" as const,
        row_version: generateRowVersion(), // Mock row_version for testing
      },
    ];

    const nextState = tasksReducer(initialState, setTasks(mockTasks));

    expect(nextState.items.length).toBe(2);
    mockTasks.forEach((task, index) => {
      compareTaskItem(task, nextState.items[index]);
    });
  });

  it("should handle adding a new task", () => {
    const newTask: Task = {
      id: "test-1",
      title: "Test Infrastructure",
      description: "Setup Vitest",
      status: "TODO",
      row_version: generateRowVersion(), // Mock row_version for testing
    };

    const nextState = tasksReducer(initialState, addTask(newTask));

    expect(nextState.items.length).toBe(1);
    compareTaskItem(
      newTask,
      nextState.items.filter((t) => t.id === "test-1")[0],
    );
  });

  it("should handle updating a task", () => {
    const stateWithOneTask = {
      ...initialState,
      items: [
        {
          id: "test-1",
          title: "Test Infrastructure",
          description: "Setup Vitest",
          status: "TODO" as const,
          row_version: generateRowVersion(), // Mock row_version for testing
        },
      ],
    };

    const updatedTask: Task = {
      id: "test-1",
      title: "Test Infrastructure Updated",
      description: "Setup Vitest with more details",
      status: "IN_PROGRESS",
      row_version: generateRowVersion(), // Mock new row_version for testing
    };

    const nextState = tasksReducer(stateWithOneTask, updateTask(updatedTask));

    expect(nextState.items.length).toBe(1);
    compareTaskItem(updatedTask, nextState.items[0]);
  });

  it("should handle updating a task status", () => {
    // Start with a state that already has one task
    const stateWithOneTask = {
      ...initialState,
      items: [
        {
          id: "test-1",
          title: "Test Infrastructure",
          description: "Setup Vitest",
          status: "TODO" as const,
          row_version: generateRowVersion(), // Mock row_version for testing
        },
      ],
    };

    const nextState = tasksReducer(
      stateWithOneTask,
      updateTaskStatus({
        id: "test-1",
        status: "IN_PROGRESS",
        row_version: generateRowVersion(),
      }),
    );

    expect(nextState.items.length).toBe(1);
    const updatedTask = nextState.items.filter((t) => t.id === "test-1")[0];
    expect(updatedTask.id).toEqual("test-1");
    expect(updatedTask.status).toEqual("IN_PROGRESS");
  });

  it("should delete a task", () => {
    // Start with a state that already has one task
    const stateWithOneTask = {
      ...initialState,
      items: [
        {
          id: "test-1",
          title: "Test Infrastructure",
          description: "Setup Vitest",
          status: "TODO" as const,
          row_version: generateRowVersion(), // Mock row_version for testing
        },
      ],
    };

    const nextState = tasksReducer(
      stateWithOneTask,
      updateTaskStatus({
        id: "test-1",
        status: "IN_PROGRESS",
        row_version: generateRowVersion(),
      }),
    );

    expect(nextState.items.length).toBe(1);
    const updatedTask = nextState.items.filter((t) => t.id === "test-1")[0];
    expect(updatedTask.id).toEqual("test-1");
    expect(updatedTask.status).toEqual("IN_PROGRESS");
    expect(updatedTask.row_version).toBeDefined(); // Ensure row_version is updated when status changes
    expect(updatedTask.row_version).not.toEqual(
      stateWithOneTask.items[0].row_version,
    ); // Ensure row_version has changed after status update
  });

  it("Should delete a task", () => {
    const stateWithOneTask = {
      ...initialState,
      items: [
        {
          id: "test-1",
          title: "Test Infrastructure",
          description: "Setup Vitest",
          status: "TODO" as const,
          row_version: generateRowVersion(), // Mock row_version for testing
        },
      ],
    };

    const nextState = tasksReducer(stateWithOneTask, deleteTask("test-1"));

    expect(nextState.items.length).toBe(0);
  });
});
