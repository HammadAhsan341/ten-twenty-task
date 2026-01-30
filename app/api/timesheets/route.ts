import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { timesheetStore } from "@/lib/timesheet-store";
import type { TimesheetStatus, Task } from "@/lib/types";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timesheets = timesheetStore.getAll();
  return NextResponse.json(timesheets);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { startDate, endDate, status, tasks } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timesheet = timesheetStore.create({
      startDate,
      endDate,
      status: status as TimesheetStatus,
      tasks: tasks as Task[],
    });

    return NextResponse.json(timesheet, { status: 201 });
  } catch (error) {
    console.error("Error creating timesheet:", error);
    return NextResponse.json(
      { error: "Failed to create timesheet" },
      { status: 500 }
    );
  }
}
