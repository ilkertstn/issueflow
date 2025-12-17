# IssueFlow 🚀

IssueFlow is a modern, real-time task management application built with **Next.js** and **Firebase**.  
It provides a Kanban-style board with drag-and-drop interactions, real-time updates, online user presence, and feature flag management.

This project was built as a **production-oriented mini SaaS** to demonstrate modern frontend architecture and hands-on Firebase usage.

🔗 **Live Demo:** https://issueflow-weld.vercel.app/login  
🔗 **GitHub Repo:** https://github.com/ilkertstn/issueflow

---

## ✨ Features

- 🔐 **Authentication**

  - Email/Password authentication using Firebase Auth
  - Protected routes and session handling

- 🗂️ **Task Management**

  - Create, update, delete tasks
  - Task priority support (low / medium / high)
  - Kanban board with **drag & drop** interaction

- ⚡ **Real-time Updates**

  - Real-time task synchronization with Cloud Firestore
  - Live UI updates without page refresh

- 🟢 **Online User Presence**

  - Real-time online user counter using Firebase Realtime Database
  - Automatic online/offline detection using `onDisconnect`

- 🚧 **Maintenance Mode & Feature Flags**

  - Global maintenance mode using Firebase Remote Config
  - Feature toggling without redeploying the application

- 🎨 **UI & UX**
  - Responsive, mobile-first design
  - Modern UI built with Tailwind CSS
  - Skeleton loaders and smooth loading states

---

## 🛠 Tech Stack

### Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- dnd-kit (Drag & Drop)

### Firebase

- Firebase Authentication
- Cloud Firestore
- Realtime Database
- Firebase Remote Config

### Testing & Tools

- Cypress (E2E testing)
- Git

---

## 🧠 Architecture Highlights

- Component-based and scalable frontend architecture
- Custom React hooks for business logic
- Separation of concerns between UI, data, and services
- Real-time data handling optimized for frontend performance
- Feature flag–driven development using Firebase Remote Config

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ilkertstn/issueflow.git
cd issueflow
```
