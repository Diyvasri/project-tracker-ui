import { Task } from "../../data/seedData";

export default function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex justify-between px-4 border-b items-center h-full">
      <span>{task.title}</span>
      <span>{task.priority}</span>
      <span>{task.status}</span>
      <span>{task.assignee}</span>
      <span>{task.dueDate}</span>
    </div>
  );
}