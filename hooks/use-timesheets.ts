import useSWR from "swr";
import type { Timesheet, TimesheetStatus, Task } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

export function useTimesheets() {
  const { data, error, isLoading, mutate } = useSWR<Timesheet[]>(
    "/api/timesheets",
    fetcher,
  );

  const createTimesheet = async (data: {
    startDate: string;
    endDate: string;
    status: TimesheetStatus;
    tasks: Task[];
  }) => {
    const res = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create timesheet");
    }

    const newTimesheet = await res.json();
    mutate();
    return newTimesheet;
  };

  const updateTimesheet = async (
    id: string,
    data: {
      startDate?: string;
      endDate?: string;
      status?: TimesheetStatus;
      tasks?: Task[];
    },
  ) => {
    const res = await fetch(`/api/timesheets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update timesheet");
    }

    const updatedTimesheet = await res.json();
    mutate();
    return updatedTimesheet;
  };

  const deleteTimesheet = async (id: string) => {
    const res = await fetch(`/api/timesheets/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete timesheet");
    }

    mutate();
  };

  const addTask = async (
    timesheetId: string,
    task: { name: string; hours: number; projectName: string; date?: string },
  ) => {
    const res = await fetch(`/api/timesheets/${timesheetId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to add task");
    }

    const newTask = await res.json();
    mutate();
    return newTask;
  };

  const updateTask = async (
    timesheetId: string,
    taskId: string,
    data: {
      name?: string;
      hours?: number;
      projectName?: string;
      date?: string;
    },
  ) => {
    const res = await fetch(`/api/timesheets/${timesheetId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update task");
    }

    const updatedTask = await res.json();
    mutate();
    return updatedTask;
  };

  const deleteTask = async (timesheetId: string, taskId: string) => {
    const res = await fetch(`/api/timesheets/${timesheetId}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete task");
    }

    mutate();
  };

  return {
    timesheets: data || [],
    isLoading,
    isError: !!error,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    addTask,
    updateTask,
    deleteTask,
    refresh: mutate,
  };
}
