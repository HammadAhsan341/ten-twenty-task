"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowDown } from "lucide-react";
import type { Timesheet, TimesheetStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { Pagination } from "./pagination";

interface TimesheetTableProps {
  timesheets: Timesheet[];
  onView: (timesheet: Timesheet) => void;
  onUpdate: (timesheet: Timesheet) => void;
  onCreate: (timesheet: Timesheet) => void;
}

// Get action text based on status
function getActionForStatus(status: TimesheetStatus): {
  text: string;
  color: string;
} {
  switch (status) {
    case "completed":
      return { text: "View", color: "text-[#4169E1] hover:text-[#3457c9]" };
    case "incomplete":
      return { text: "Update", color: "text-[#4169E1] hover:text-[#3457c9]" };
    case "missing":
      return { text: "Create", color: "text-[#4169E1] hover:text-[#3457c9]" };
  }
}

// Format date range
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = format(start, "d");
  const endDay = format(end, "d");
  const startMonth = format(start, "MMMM");
  const endMonth = format(end, "MMMM");
  const year = format(end, "yyyy");

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${year}`;
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`;
}

export function TimesheetTable({
  timesheets,
  onView,
  onUpdate,
  onCreate,
}: TimesheetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(timesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTimesheets = timesheets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleAction = (timesheet: Timesheet) => {
    switch (timesheet.status) {
      case "completed":
        onView(timesheet);
        break;
      case "incomplete":
        onUpdate(timesheet);
        break;
      case "missing":
        onCreate(timesheet);
        break;
    }
  };

  if (timesheets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No timesheets found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first timesheet entry to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              <span className="flex items-center gap-1">
                Week #
                <ArrowDown className="size-3" />
              </span>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              <span className="flex items-center gap-1">
                Date
                <ArrowDown className="size-3" />
              </span>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              <span className="flex items-center gap-1">
                Status
                <ArrowDown className="size-3" />
              </span>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTimesheets.map((timesheet) => {
            const action = getActionForStatus(timesheet.status);
            return (
              <TableRow key={timesheet.id} className="border-b border-border">
                <TableCell className="font-medium text-foreground py-5">
                  {timesheet.weekNumber}
                </TableCell>
                <TableCell className="text-foreground py-5">
                  {formatDateRange(timesheet.startDate, timesheet.endDate)}
                </TableCell>
                <TableCell className="py-5">
                  <StatusBadge status={timesheet.status} />
                </TableCell>
                <TableCell className="text-right py-5">
                  <button
                    type="button"
                    onClick={() => handleAction(timesheet)}
                    className={`font-medium ${action.color} transition-colors`}
                  >
                    {action.text}
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={timesheets.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
