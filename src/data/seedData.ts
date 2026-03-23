export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  status: Status;
  startDate?: string;
  dueDate: string;
}

const users = ["AD", "MK", "SN", "LR", "DV", "RS"];
const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];
const statuses: Status[] = ["To Do", "In Progress", "In Review", "Done"];

// Random date generator
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
}

// Generate 500 tasks
export const tasks: Task[] = Array.from({ length: 500 }, (_, i) => {
  const due = randomDate(new Date(2026, 2, 1), new Date(2026, 2, 31));

  return {
    id: `task-${i}`, // ✅ FIXED (string)
    title: `Task ${i}`,
    assignee: users[Math.floor(Math.random() * users.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    startDate:
      Math.random() > 0.2
        ? randomDate(new Date(2026, 2, 1), new Date(2026, 2, 25))
        : undefined,
    dueDate: due,
  };
});