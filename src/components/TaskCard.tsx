"use client";

import { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-xl border bg-black p-4 cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium">{task.title}</p>
      <p className="text-xs opacity-60 mt-1">{task.status}</p>
    </div>
  );
}
