import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import Register from "./pages/register";
import "./index.css";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import { AuthProvider } from "./contexts/AuthContext";

/**
 * Router setup (frontend only)
 *  - ยังไม่ใช้ AuthProvider / ProtectedRoute
 *  - ตอนนี้ทุกหน้าสามารถเข้าถึงได้อิสระ
 *  - backend ให้ import ProtectedRoute หรือ AuthProvider
 */


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);