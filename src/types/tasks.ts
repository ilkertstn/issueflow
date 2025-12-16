import { Timestamp } from "firebase/firestore";

export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  uid: string;
  createdAt: Timestamp;
};
