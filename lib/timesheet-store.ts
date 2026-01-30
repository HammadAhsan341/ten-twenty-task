import type { Timesheet, TimesheetStatus, Task } from "./types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Project names for tasks
const projectNames = [
  "Project Alpha",
  "Project Beta",
  "Website Redesign",
  "Mobile App",
  "Backend API",
  "Dashboard",
  "Analytics Platform",
  "Customer Portal",
];

// Task names
const taskNames = [
  "Homepage Development",
  "API Integration",
  "Database Design",
  "UI/UX Design",
  "Code Review",
  "Bug Fixes",
  "Documentation",
  "Testing",
  "Deployment",
  "Meeting",
];

const statuses: TimesheetStatus[] = ["completed", "incomplete", "missing"];

function generateTasks(count: number, dateStr?: string): Task[] {
  const tasks: Task[] = [];
  const date = dateStr || new Date().toISOString().split("T")[0];
  for (let i = 0; i < count; i++) {
    tasks.push({
      id: generateId(),
      name: taskNames[Math.floor(Math.random() * taskNames.length)],
      hours: Math.floor(Math.random() * 4) + 2, // 2-5 hours
      projectName:
        projectNames[Math.floor(Math.random() * projectNames.length)],
      date,
    });
  }
  return tasks;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getWeekEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 4);
  return endDate;
}

function generateInitialTimesheets(): Timesheet[] {
  const timesheets: Timesheet[] = [];
  const startDate = new Date("2024-01-01");

  // Find the first Monday
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() + 1);
  }

  for (let i = 0; i < 120; i++) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(weekStartDate.getDate() + i * 7);

    const weekEndDate = getWeekEndDate(weekStartDate);
    const weekNum = i + 1;

    let status: TimesheetStatus;
    if (i < 100) {
      const rand = Math.random();
      if (rand < 0.7) status = "completed";
      else if (rand < 0.9) status = "incomplete";
      else status = "missing";
    } else {
      // Recent weeks: mix of all statuses
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }

    let tasks: Task[] = [];
    if (status !== "missing") {
      const taskCount = Math.floor(Math.random() * 3) + 2; // 2-4 tasks per week
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const taskDate = new Date(weekStartDate);
        taskDate.setDate(taskDate.getDate() + dayOffset);
        const tasksForDay =
          Math.floor(Math.random() * (taskCount / 5)) +
          (dayOffset < taskCount % 5 ? 1 : 0);
        tasks.push(...generateTasks(tasksForDay, formatDate(taskDate)));
      }
      tasks = tasks.sort(() => Math.random() - 0.5);
    }

    timesheets.push({
      id: generateId(),
      weekNumber: weekNum,
      startDate: formatDate(weekStartDate),
      endDate: formatDate(weekEndDate),
      status,
      tasks,
      createdAt: weekStartDate.toISOString(),
      updatedAt: weekStartDate.toISOString(),
    });
  }

  return timesheets;
}

const initialTimesheets: Timesheet[] = generateInitialTimesheets();

let timesheets: Timesheet[] = [...initialTimesheets];

export const timesheetStore = {
  getAll(): Timesheet[] {
    return [...timesheets].sort((a, b) => a.weekNumber - b.weekNumber);
  },

  getById(id: string): Timesheet | undefined {
    return timesheets.find((t) => t.id === id);
  },

  create(data: {
    startDate: string;
    endDate: string;
    status?: TimesheetStatus;
    tasks?: Task[];
  }): Timesheet {
    const maxWeek = Math.max(...timesheets.map((t) => t.weekNumber), 0);
    const newTimesheet: Timesheet = {
      id: generateId(),
      weekNumber: maxWeek + 1,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || "incomplete",
      tasks: data.tasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    timesheets.push(newTimesheet);
    return newTimesheet;
  },

  update(
    id: string,
    data: Partial<{
      startDate: string;
      endDate: string;
      status: TimesheetStatus;
      tasks: Task[];
    }>,
  ): Timesheet | undefined {
    const index = timesheets.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...timesheets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    timesheets[index] = updated;
    return updated;
  },

  addTask(timesheetId: string, task: Omit<Task, "id">): Task | undefined {
    const index = timesheets.findIndex((t) => t.id === timesheetId);
    if (index === -1) return undefined;

    const newTask: Task = {
      id: generateId(),
      ...task,
    };
    timesheets[index].tasks.push(newTask);
    timesheets[index].updatedAt = new Date().toISOString();

    // Update status if was missing
    if (timesheets[index].status === "missing") {
      timesheets[index].status = "incomplete";
    }

    return newTask;
  },

  updateTask(
    timesheetId: string,
    taskId: string,
    data: Partial<Omit<Task, "id">>,
  ): Task | undefined {
    const tsIndex = timesheets.findIndex((t) => t.id === timesheetId);
    if (tsIndex === -1) return undefined;

    const taskIndex = timesheets[tsIndex].tasks.findIndex(
      (t) => t.id === taskId,
    );
    if (taskIndex === -1) return undefined;

    timesheets[tsIndex].tasks[taskIndex] = {
      ...timesheets[tsIndex].tasks[taskIndex],
      ...data,
    };
    timesheets[tsIndex].updatedAt = new Date().toISOString();
    return timesheets[tsIndex].tasks[taskIndex];
  },

  deleteTask(timesheetId: string, taskId: string): boolean {
    const tsIndex = timesheets.findIndex((t) => t.id === timesheetId);
    if (tsIndex === -1) return false;

    const taskIndex = timesheets[tsIndex].tasks.findIndex(
      (t) => t.id === taskId,
    );
    if (taskIndex === -1) return false;

    timesheets[tsIndex].tasks.splice(taskIndex, 1);
    timesheets[tsIndex].updatedAt = new Date().toISOString();
    return true;
  },

  delete(id: string): boolean {
    const index = timesheets.findIndex((t) => t.id === id);
    if (index === -1) return false;
    timesheets.splice(index, 1);
    return true;
  },

  reset(): void {
    timesheets = [...initialTimesheets];
  },
};
