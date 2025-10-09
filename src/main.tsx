import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile"; // ✅ เพิ่ม import หน้านี้เข้ามา
import "./index.css";

/**
 * Router setup (frontend only)
 *  - ยังไม่ใช้ AuthProvider / ProtectedRoute
 *  - ตอนนี้ทุกหน้าสามารถเข้าถึงได้อิสระ
 */

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/edit-profile", element: <EditProfile /> }, // ✅ เพิ่ม path หน้านี้
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
