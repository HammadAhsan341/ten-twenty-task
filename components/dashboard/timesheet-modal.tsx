"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Timesheet, TimesheetStatus, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timesheetSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["completed", "incomplete", "missing"]),
});

type TimesheetFormData = z.infer<typeof timesheetSchema>;

interface TimesheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timesheet: Timesheet | null;
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    status: TimesheetStatus;
    tasks: Task[];
  }) => Promise<void>;
  isLoading: boolean;
}

export function TimesheetModal({
  open,
  onOpenChange,
  timesheet,
  onSubmit,
  isLoading,
}: TimesheetModalProps) {
  const isEditing = !!timesheet;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      status: "incomplete",
    },
  });

  const currentStatus = watch("status");

  useEffect(() => {
    if (open) {
      if (timesheet) {
        reset({
          startDate: timesheet.startDate,
          endDate: timesheet.endDate,
          status: timesheet.status,
        });
      } else {
        // Default to current week
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        reset({
          startDate: monday.toISOString().split("T")[0],
          endDate: friday.toISOString().split("T")[0],
          status: "incomplete",
        });
      }
    }
  }, [open, timesheet, reset]);

  const handleFormSubmit = async (data: TimesheetFormData) => {
    await onSubmit({
      ...data,
      tasks: timesheet?.tasks || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Timesheet" : "Add New Timesheet"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the timesheet entry details below."
              : "Fill in the details to create a new timesheet entry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                className="h-10"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                className="h-10"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(value: TimesheetStatus) =>
                setValue("status", value)
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4169E1] hover:bg-[#3457c9]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Timesheet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
