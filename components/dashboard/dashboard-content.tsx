"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { Timesheet, TimesheetStatus, Task } from "@/lib/types";
import { useTimesheets } from "@/hooks/use-timesheets";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TimesheetTable } from "./timesheet-table";
import { TimesheetList } from "./timesheet-list";
import { TimesheetModal } from "./timesheet-modal";
import { TaskModal } from "./task-modal";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "table" | "list";

export function DashboardContent() {
  const {
    timesheets,
    isLoading,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    addTask,
    updateTask,
    deleteTask,
  } = useTimesheets();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(
    null,
  );
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskDate, setTaskDate] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter timesheets
  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((ts) => {
      // Status filter
      if (statusFilter !== "all" && ts.status !== statusFilter) {
        return false;
      }
      // Date range filter could be implemented here
      return true;
    });
  }, [timesheets, statusFilter, dateRangeFilter]);

  // Handlers for table view actions
  const handleView = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setViewMode("list");
  };

  const handleUpdate = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setViewMode("list");
  };

  const handleCreate = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setViewMode("list");
  };

  // Handlers for list view task actions
  const handleAddTask = (date: string) => {
    setEditingTask(null);
    setTaskDate(date);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDate(task.date || new Date().toISOString().split("T")[0]);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!deleteTaskId || !selectedTimesheet) return;

    try {
      await deleteTask(selectedTimesheet.id, deleteTaskId);
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleTaskSubmit = async (data: {
    name: string;
    hours: number;
    projectName: string;
    date?: string;
  }) => {
    if (!selectedTimesheet) return;
    setIsSubmitting(true);

    try {
      // Include taskDate in the data being sent
      const taskDataWithDate = {
        ...data,
        date: taskDate || new Date().toISOString().split("T")[0],
      };

      if (editingTask) {
        await updateTask(
          selectedTimesheet.id,
          editingTask.id,
          taskDataWithDate,
        );
        toast.success("Task updated successfully");
        // Update local selectedTimesheet with updated task
        setSelectedTimesheet({
          ...selectedTimesheet,
          tasks: selectedTimesheet.tasks.map((t) =>
            t.id === editingTask.id ? { ...t, ...taskDataWithDate } : t,
          ),
        });
      } else {
        const newTask = await addTask(selectedTimesheet.id, taskDataWithDate);
        toast.success("Task added successfully");
        // Update local selectedTimesheet with new task
        setSelectedTimesheet({
          ...selectedTimesheet,
          tasks: [...selectedTimesheet.tasks, newTask],
        });
      }
      setTaskModalOpen(false);
    } catch {
      toast.error(editingTask ? "Failed to update task" : "Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTimesheet(deleteId);
      toast.success("Timesheet deleted successfully");
    } catch {
      toast.error("Failed to delete timesheet");
    } finally {
      setDeleteId(null);
    }
  };

  const handleTimesheetSubmit = async (data: {
    startDate: string;
    endDate: string;
    status: TimesheetStatus;
    tasks: Task[];
  }) => {
    setIsSubmitting(true);

    try {
      if (editingTimesheet) {
        await updateTimesheet(editingTimesheet.id, data);
        toast.success("Timesheet updated successfully");
      } else {
        await createTimesheet(data);
        toast.success("Timesheet created successfully");
      }
      setModalOpen(false);
    } catch {
      toast.error(
        editingTimesheet
          ? "Failed to update timesheet"
          : "Failed to create timesheet",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-6 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Content Card */}
        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            {viewMode === "table" ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-xl font-semibold text-foreground">
                    Your Timesheets
                  </h1>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-6">
                  <Select
                    value={dateRangeFilter}
                    onValueChange={setDateRangeFilter}
                  >
                    <SelectTrigger className="w-[150px] bg-white border-border">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] bg-white border-border">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : (
                  <TimesheetTable
                    timesheets={filteredTimesheets}
                    onView={handleView}
                    onUpdate={handleUpdate}
                    onCreate={handleCreate}
                  />
                )}
              </>
            ) : (
              <>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className="text-[#4169E1] font-medium mb-4 hover:underline"
                >
                  ← Back to timesheets
                </button>

                {/* List View */}
                <TimesheetList
                  timesheet={selectedTimesheet}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 tentwenty. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Timesheet Modal */}
      <TimesheetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        timesheet={editingTimesheet}
        onSubmit={handleTimesheetSubmit}
        isLoading={isSubmitting}
      />

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        task={editingTask}
        taskDate={taskDate}
        onSubmit={handleTaskSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Timesheet Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timesheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this timesheet entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
