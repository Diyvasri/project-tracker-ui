import { Task } from "../../data/seedData";
import React from "react";

interface Props {
  task: Task;
  draggingTask: Task | null;
  setDraggingTask: (task: Task | null) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  usersOnTask: any[];
}

function KanbanCard({
  task,
  draggingTask,
  setDraggingTask,
  setPosition,
  usersOnTask,
}: Props) {
  const isDragging = draggingTask?.id === task.id;

  const handlePointerDown = () => {
    setDraggingTask(task);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingTask?.id !== task.id) return;
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setDraggingTask(null);
  };

  return (
    <div
      id={`card-${task.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`
        p-3 mb-2 bg-white rounded-xl 
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-in-out

        hover:shadow-xl hover:-translate-y-1

        ${isDragging ? "scale-105 opacity-80 shadow-2xl" : ""}
      `}
      title={`${task.title} (${task.dueDate})`}
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

      {/* Avatar Stack */}
      <div className="flex items-center mt-2">
        {usersOnTask.slice(0, 2).map((u) => (
          <div
            key={u.id}
            className="w-6 h-6 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center -ml-1 border-2 border-white"
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

export default React.memo(KanbanCard);