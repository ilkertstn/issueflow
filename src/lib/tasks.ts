import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, TaskStatus } from "@/types/tasks";

export function listenTasks(uid: string, cb: (tasks: Task[]) => void) {
  const q = query(
    collection(db, "tasks"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const tasks: Task[] = snap.docs.map((d) => {
      const data = d.data() as Omit<Task, "id">;
      return { id: d.id, ...data };
    });
    cb(tasks);
  });
}

export async function addTask(uid: string, title: string) {
  await addDoc(collection(db, "tasks"), {
    uid,
    title,
    status: "todo",
    createdAt: serverTimestamp(),
  });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await updateDoc(doc(db, "tasks", taskId), { status });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}
