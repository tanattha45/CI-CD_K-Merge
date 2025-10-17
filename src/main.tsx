// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import EditProfile from "./pages/Editprofile";
import CreateWork from "./pages/CreateWork";
import WorkView from "./pages/WorkView";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify", element: <VerifyEmail /> },
  { 
    element: <ProtectedRoute />,
    children: [
      { path: "/profile", element: <Profile /> },
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/works/new", element: <CreateWork /> },
    ]
  },
  { path: "/works/:id", element: <WorkView /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
