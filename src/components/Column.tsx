import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

export function Column({
  title,
  status,
  tasks,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}) {
  const statusStyles: Record<TaskStatus, string> = {
    todo: "border-t-slate-500 bg-slate-800/20",
    doing: "border-t-blue-500 bg-blue-900/10",
    done: "border-t-emerald-500 bg-emerald-900/10",
  };

  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-3 rounded-xl border border-white/5 p-4 w-full h-full border-t-2 shadow-sm transition-all ${statusStyles[status]}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-xs font-mono opacity-50 bg-black/20 px-2 py-1 rounded">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[100px] flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
