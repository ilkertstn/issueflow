"use client";

import { useState } from "react";
import { Task, TaskPriority } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteTask, updateTask } from "@/lib/tasks";

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-green-900/50 text-green-300 border-green-800",
  medium: "bg-yellow-900/50 text-yellow-300 border-yellow-800",
  high: "bg-red-900/50 text-red-300 border-red-800",
};

import { Modal } from "./Modal";

// ... (existing helper function / imports if not duplicated)

export function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(
    task.priority || "medium"
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    if (!editedTitle.trim()) return;
    await updateTask(task.id, {
      title: editedTitle,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    setDeleteModalOpen(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="rounded-xl border bg-neutral-900/50 p-4 opacity-30 h-[100px]"
      />
    );
  }

  // ... (isEditing block remains same, but we'll include it in the replace for context or leave it if untouched?)
  // Wait, I need to make sure I don't delete the isEditing block. The user Instruction says "Integrate Modal...".
  // I will just replace the "confirm" logic part and add the Modal JSX at the end.
  // Actually, replace_file_content with a large block is safer to ensure order.

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-xl border bg-neutral-900 p-4 space-y-3 cursor-default"
      >
        <input
          className="w-full bg-transparent border-b border-neutral-700 pb-1 outline-none"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
            <button
              key={p}
              onClick={() => setEditedPriority(p)}
              className={`text-xs px-2 py-1 rounded border ${
                editedPriority === p
                  ? priorityColors[p]
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="text-xs bg-white text-black px-3 py-1 rounded font-medium"
          >
            Kaydet
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group rounded-xl border bg-black p-4 cursor-grab active:cursor-grabbing hover:border-neutral-700 transition-all relative"
      >
        <div className="flex justify-between items-start gap-2">
          <p className="font-medium break-words">{task.title}</p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent drag start
                setIsEditing(true);
              }}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-red-400"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
              priorityColors[task.priority || "medium"]
            }`}
          >
            {task.priority || "medium"}
          </span>
          <p className="text-xs opacity-40">{task.status}</p>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Görevi Sil"
      >
        <div className="space-y-4">
          <p className="opacity-80">
            &quot;{task.title}&quot; görevini silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border px-4 py-2 hover:bg-neutral-800 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
            >
              Sil
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
