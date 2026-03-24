import { create } from "zustand";
import { tasks as seedTasks, Task, Status } from "../data/seedData";

// ✅ LOAD FROM LOCAL STORAGE
const storedTasks = localStorage.getItem("tasks");

const initialTasks: Task[] = storedTasks
  ? JSON.parse(storedTasks)
  : seedTasks;

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,

  setTasks: (tasks: Task[]) => set({ tasks }),

  updateTaskStatus: (taskId: string, newStatus: Status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),
}));