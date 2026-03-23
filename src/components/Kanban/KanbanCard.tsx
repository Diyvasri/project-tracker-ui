import { Task } from "../../data/seedData";

interface Props {
  task: Task;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  usersOnTask: any[]; // ✅ FIXED (inside interface)
}

export default function KanbanCard({
  task,
  draggingId,
  setDraggingId,
  setPosition,
  usersOnTask,
}: Props) {
  return (
    <div
      onPointerDown={() => {
        setDraggingId(task.id);
      }}
      onPointerMove={(e) => {
        if (draggingId !== task.id) return;
        setPosition({ x: e.clientX, y: e.clientY });
      }}
      onPointerUp={() => {
        setDraggingId(null);
      }}
      className={`p-2 mb-2 bg-white shadow rounded cursor-grab ${
        draggingId === task.id ? "opacity-50" : ""
      }`}
    >
      {/* Title + Priority */}
      <div className="flex justify-between">
        <span>{task.title}</span>
        <span className="text-xs font-bold px-1 rounded bg-red-300">
          {task.priority}
        </span>
      </div>

      {/* ✅ Avatar Stack */}
      <div className="flex items-center mt-1">
        {usersOnTask.slice(0, 2).map((u) => (
          <div
            key={u.id}
            className="w-5 h-5 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center -ml-1"
          >
            {u.name}
          </div>
        ))}

        {usersOnTask.length > 2 && (
          <div className="w-5 h-5 text-xs bg-gray-500 text-white rounded-full flex items-center justify-center -ml-1">
            +{usersOnTask.length - 2}
          </div>
        )}
      </div>

      {/* Assignee */}
      <div className="text-xs mt-1">{task.assignee}</div>

      {/* Due Date */}
      <div
        className={`text-xs mt-1 ${
          new Date(task.dueDate) < new Date() ? "text-red-600" : ""
        }`}
      >
        {task.dueDate}
      </div>
    </div>
  );
}