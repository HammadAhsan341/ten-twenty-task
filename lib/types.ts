export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface Task {
  id: string;
  name: string;
  hours: number;
  projectName: string;
  date: string; // Date YYYY-MM-DD)
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetFormData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  tasks: Task[];
}
