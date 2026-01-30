"use client";

import { useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Timesheet, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimesheetListProps {
  timesheet: Timesheet | null;
  onAddTask: (date: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

// Group tasks by date within the week
function groupTasksByDate(timesheet: Timesheet): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();

  // Generate all weekdays
  const startDate = parseISO(timesheet.startDate);
  for (let i = 0; i < 5; i++) {
    const date = addDays(startDate, i);
    const dateKey = format(date, "yyyy-MM-dd");
    grouped.set(dateKey, []);
  }

  // Group tasks by their actual date field
  timesheet.tasks.forEach((task) => {
    const taskDateKey = task.date || format(startDate, "yyyy-MM-dd");
    const existing = grouped.get(taskDateKey) || [];
    grouped.set(taskDateKey, [...existing, task]);
  });

  return grouped;
}

// Calculate total hours
function calculateTotalHours(timesheet: Timesheet): number {
  return timesheet.tasks.reduce((sum, task) => sum + task.hours, 0);
}

export function TimesheetList({
  timesheet,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TimesheetListProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!timesheet) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Select a timesheet to view details
        </p>
      </div>
    );
  }

  const tasksByDate = groupTasksByDate(timesheet);
  const totalHours = calculateTotalHours(timesheet);
  const targetHours = 40;
  const progressPercent = Math.min(
    100,
    Math.round((totalHours / targetHours) * 100),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {"This week's timesheet"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {format(parseISO(timesheet.startDate), "d")} -{" "}
            {format(parseISO(timesheet.endDate), "d MMMM, yyyy")}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {totalHours}/{targetHours} hrs
            <span className="ml-3 text-muted-foreground">
              {progressPercent}%
            </span>
          </p>
          <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all bg-gradient-to-r from-orange-400 to-orange-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks grouped by date */}
      <div className="space-y-6">
        {Array.from(tasksByDate.entries()).map(([dateKey, tasks]) => (
          <div key={dateKey}>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {format(parseISO(dateKey), "MMM d")}
            </h3>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between px-4 py-3 bg-white border border-border rounded-lg"
                >
                  <span className="font-medium text-foreground">
                    {task.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {task.hours} hrs
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-[#4169E1] bg-blue-50 rounded">
                      {task.projectName}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditTask(task)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteTask(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* Add new task button */}
              <button
                type="button"
                onClick={() => onAddTask(dateKey)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-[#4169E1] hover:bg-blue-50 transition-colors"
              >
                <Plus className="size-4" />
                <span className="font-medium">Add new task</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
