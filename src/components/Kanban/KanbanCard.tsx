import { Task } from "../../data/seedData";

interface Props {
  task: Task;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  usersOnTask: any[];
}

export default function KanbanCard({
  task,
  draggingId,
  setDraggingId,
  setPosition,
  usersOnTask,
}: Props) {
  
  const isDragging = draggingId === task.id;

  const handlePointerDown = (e: React.PointerEvent) => {
    setDraggingId(task.id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      id={`card-${task.id}`}  // ✅ IMPORTANT for dynamic placeholder height
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="p-3 mb-2 bg-white rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200"
      style={{
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging
          ? "0 10px 25px rgba(0,0,0,0.25)"
          : "0 2px 6px rgba(0,0,0,0.1)",
        transform: isDragging ? "scale(1.03)" : "scale(1)",
      }}
    >
      {/* Title + Priority */}
      <div className="flex justify-between items-center">
        <span className="font-medium">{task.title}</span>

        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            task.priority === "Critical"
              ? "bg-red-500 text-white"
              : task.priority === "High"
              ? "bg-orange-400 text-white"
              : task.priority === "Medium"
              ? "bg-yellow-400 text-black"
              : "bg-green-400 text-black"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* ✅ Avatar Stack */}
      <div className="flex items-center mt-2">
        {usersOnTask.slice(0, 2).map((u) => (
          <div
            key={u.id}
            className="w-6 h-6 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center -ml-1 border-2 border-white transition-all"
          >
            {u.name}
          </div>
        ))}

        {usersOnTask.length > 2 && (
          <div className="w-6 h-6 text-xs bg-gray-500 text-white rounded-full flex items-center justify-center -ml-1 border-2 border-white">
            +{usersOnTask.length - 2}
          </div>
        )}
      </div>

      {/* Assignee */}
      <div className="text-xs mt-2 text-gray-600">{task.assignee}</div>

      {/* Due Date */}
      <div
        className={`text-xs mt-1 ${
          new Date(task.dueDate) < new Date()
            ? "text-red-600 font-semibold"
            : "text-gray-500"
        }`}
      >
        {task.dueDate}
      </div>
    </div>
  );
}