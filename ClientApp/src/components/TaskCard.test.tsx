// Unit tests for the TaskCard component using Vitest and React Testing Library

import { render, screen } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { type Task } from "@/types/Task";
import { vi, describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { generateRowVersion } from "@/utilities/helpers"; // Import the helper function to generate mock row_version values

describe("TaskCard", () => {
  const mockTask: Task = {
    id: "mock-id-123",
    title: "Deploy to Azure",
    description: "Push static assets to blob storage.",
    status: "TODO",
    row_version: generateRowVersion(), // Mock row_version for testing
  };

  it("renders the task data correctly", () => {
    // 1. Arrange: Render the component with a dummy function for onMove and onCardClick
    render(
      <Provider store={store}>
        <TaskCard task={mockTask} onMove={() => {}} onCardClick={() => {}} />
      </Provider>,
    );
    const printedId =
      mockTask.id.length > 5 ? mockTask.id.slice(0, 5) + "..." : mockTask.id;

    // 2. Assert: Query the simulated DOM exactly how a user would read it
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText("ID: " + printedId)).toBeInTheDocument();
  });

  it("calls onMove when the status dropdown is changed", async () => {
    // 1. Arrange: Create a "spy" function to watch if it gets called
    const handleMoveSpy = vi.fn();
    const user = userEvent.setup(); // Simulates real user mouse clicks

    render(
      <Provider store={store}>
        <TaskCard
          task={mockTask}
          onMove={handleMoveSpy}
          onCardClick={() => {}}
        />
      </Provider>,
    );

    // 2. Act: Find the select dropdown (Material UI renders a hidden input for Selects,
    // so we click the visual button that opens the menu)
    const selectButton = screen.getByRole("combobox");
    await user.click(selectButton);

    // Find the "In Progress" option in the opened menu and click it
    const inProgressOption = screen.getByRole("option", {
      name: "In Progress",
    });
    await user.click(inProgressOption);

    // 3. Assert: Verify our spy function was called with the correct arguments
    expect(handleMoveSpy).toHaveBeenCalledTimes(1);
    expect(handleMoveSpy).toHaveBeenCalledWith(
      mockTask.id,
      "IN_PROGRESS",
      mockTask.row_version,
    );
  });

  it("calls onCardClick when the card is clicked", async () => {
    // 1. Arrange: Create a "spy" function to watch if it gets called
    const handleCardClickSpy = vi.fn();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <TaskCard
          task={mockTask}
          onMove={() => {}}
          onCardClick={handleCardClickSpy}
        />
      </Provider>,
    );

    // 2. Act: Click on the card (we can click on the title as a proxy for the card)
    const cardTitle = screen.getByText(mockTask.title);
    await user.click(cardTitle);

    // 3. Assert: Verify our spy function was called
    expect(handleCardClickSpy).toHaveBeenCalledTimes(1);
  });
});
