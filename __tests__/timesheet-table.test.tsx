import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TimesheetTable } from "@/components/dashboard/timesheet-table";

const mockTimesheets = [
  {
    id: "1",
    weekNumber: 1,
    startDate: "2025-01-06",
    endDate: "2025-01-12",
    status: "completed" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    weekNumber: 2,
    startDate: "2025-01-13",
    endDate: "2025-01-19",
    status: "incomplete" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    weekNumber: 3,
    startDate: "2025-01-20",
    endDate: "2025-01-26",
    status: "missing" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("TimesheetTable", () => {
  it("renders table with timesheet rows", () => {
    const mockOnView = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnCreate = vi.fn();

    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        onView={mockOnView}
        onUpdate={mockOnUpdate}
        onCreate={mockOnCreate}
      />,
    );

    // Check headers exist
    expect(screen.getByText("Week #")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check week numbers rendered (scoped to table to avoid matches from pagination)
    const table = screen.getByRole("table");
    expect(within(table).getByText("1")).toBeInTheDocument();
    expect(within(table).getByText("2")).toBeInTheDocument();
    expect(within(table).getByText("3")).toBeInTheDocument();

    // Check date ranges rendered (Month name should appear)
    expect(within(table).getAllByText(/January/i).length).toBeGreaterThan(0);
  });

  it("renders correct action buttons based on status", () => {
    const mockOnView = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnCreate = vi.fn();

    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        onView={mockOnView}
        onUpdate={mockOnUpdate}
        onCreate={mockOnCreate}
      />,
    );

    // Check action button texts match status types
    const viewButtons = screen.getAllByText("View");
    expect(viewButtons.length).toBeGreaterThan(0);

    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("calls correct callback when action button clicked", async () => {
    const mockOnView = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnCreate = vi.fn();

    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        onView={mockOnView}
        onUpdate={mockOnUpdate}
        onCreate={mockOnCreate}
      />,
    );

    const updateButton = screen.getByText("Update");
    await userEvent.click(updateButton);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockTimesheets[1]);

    const createButton = screen.getByText("Create");
    await userEvent.click(createButton);
    expect(mockOnCreate).toHaveBeenCalledWith(mockTimesheets[2]);
  });

  it("shows empty state when no timesheets provided", () => {
    const mockOnView = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnCreate = vi.fn();

    render(
      <TimesheetTable
        timesheets={[]}
        onView={mockOnView}
        onUpdate={mockOnUpdate}
        onCreate={mockOnCreate}
      />,
    );

    expect(screen.getByText(/No timesheets found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Create your first timesheet entry to get started/i),
    ).toBeInTheDocument();
  });
});
