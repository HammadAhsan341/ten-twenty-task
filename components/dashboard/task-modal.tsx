"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  hours: z.coerce
    .number()
    .min(0.5, "Minimum 0.5 hours")
    .max(24, "Maximum 24 hours"),
  projectName: z.string().min(1, "Project name is required"),
  date: z.string().optional(), // Date will be passed separately
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  taskDate?: string; // Add date prop
  onSubmit: (data: TaskFormData) => void;
  isLoading: boolean;
}

const projectOptions = [
  "Project Alpha",
  "Project Beta",
  "Website Redesign",
  "Mobile App",
  "Backend API",
  "Dashboard",
  "Analytics Platform",
  "Customer Portal",
];

export function TaskModal({
  open,
  onOpenChange,
  task,
  taskDate,
  onSubmit,
  isLoading,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      hours: 4,
      projectName: "Project Alpha",
    },
  });

  const selectedProject = watch("projectName");

  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          name: task.name,
          hours: task.hours,
          projectName: task.projectName,
        });
      } else {
        reset({
          name: "",
          hours: 4,
          projectName: "Project Alpha",
        });
      }
    }
  }, [open, task, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
          {taskDate && (
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="text"
                value={taskDate}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Task will be added for this date
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              placeholder="e.g., Homepage Development"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              {...register("hours")}
            />
            {errors.hours && (
              <p className="text-sm text-destructive">{errors.hours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">Project</Label>
            <Select
              value={selectedProject}
              onValueChange={(value) => setValue("projectName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectName && (
              <p className="text-sm text-destructive">
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                  Saving...
                </>
              ) : task ? (
                "Update Task"
              ) : (
                "Add Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
