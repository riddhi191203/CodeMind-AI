import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AnimatePresence,
} from "framer-motion";

import LandingPage from "./pages/LandingPage";

import Dashboard from "./pages/Dashboard";

import Reviewer from "./pages/Reviewer";

import History from "./pages/History";

import Register from "./pages/Register";

import Login from "./pages/Login";

import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import {
  ForgotPassword,
  ResetPassword,
} from "./pages/PasswordReset";
import {
  CodeEditor,
  Complexity,
  ErrorSolver,
  Refactor,
} from "./pages/ToolPages";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <AnimatePresence
        mode="wait"
      >

        <Routes>

          {/* Public Routes */}
          <Route
            path="/"
            element={
              <LandingPage />
            }
          />

          <Route
            path="/register"
            element={
              <Register />
            }
          />

          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password/:id"
            element={
              <ResetPassword />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviewer"
            element={
              <ProtectedRoute>
                <Reviewer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/error-solver"
            element={
              <ProtectedRoute>
                <ErrorSolver />
              </ProtectedRoute>
            }
          />

          <Route
            path="/refactor"
            element={
              <ProtectedRoute>
                <Refactor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complexity"
            element={
              <ProtectedRoute>
                <Complexity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <CodeEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Redirect Unknown Routes */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AnimatePresence>

    </BrowserRouter>
  );
}

export default App;
