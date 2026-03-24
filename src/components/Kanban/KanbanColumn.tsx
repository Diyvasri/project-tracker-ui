import { useState } from "react";
import KanbanCard from "./KanbanCard";

function KanbanColumn({
  title,
  status,
  tasks,
  onDrop,
  draggingId,
  setDraggingId,
  setPosition,
  activeUsers, // ✅ added
}: any) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`bg-gray-100 p-3 rounded h-[500px] overflow-y-auto ${
        isOver ? "bg-blue-100" : ""
      }`}
      onPointerEnter={() => setIsOver(true)}
      onPointerLeave={() => setIsOver(false)}
      onPointerUp={(e) => {
  if (draggingId) {
    onDrop(e, status);
  }
  setIsOver(false);
}}
onPointerMove={(e) => {
  if (draggingId) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
}}
    >
      <h3 className="font-bold mb-2">
        {title} ({tasks.length})
      </h3>

    {tasks.length === 0 && (
  <div className="text-center text-gray-400 mt-10">
    <p>No tasks here</p>
  </div>
)}

    {tasks.map((task: any) => {
  const usersOnTask =
    activeUsers?.filter((u: any) => u.taskId === task.id) || [];

  return (
    <div key={task.id}>
      
      {/* ✅ Dynamic Placeholder */}
      {draggingId === task.id && (
        <div
          className="bg-gray-300 mb-2 rounded"
          style={{
            height: document.getElementById(`card-${task.id}`)?.offsetHeight || 80,
          }}
        />
      )}

      {/* ✅ Card */}
      <KanbanCard
        task={task}
        draggingId={draggingId}
        setDraggingId={setDraggingId}
        setPosition={setPosition}
        usersOnTask={usersOnTask}
      />
    </div>
  );
})}
        
    </div>
  );
}

export default KanbanColumn;