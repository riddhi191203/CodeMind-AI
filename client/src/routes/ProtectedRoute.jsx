import {
  useContext,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  Loader2,
} from "lucide-react";

import { AuthContext } from "../context/auth-context";

function ProtectedRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useContext(
    AuthContext
  );

  const location =
    useLocation();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="bg-white border border-slate-200 rounded-3xl shadow-xl px-12 py-10 flex flex-col items-center"
        >

          <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center shadow-lg">

            <Loader2
              size={36}
              className="text-white animate-spin"
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">
            Authenticating
          </h2>

          <p className="text-slate-500 mt-3 text-center leading-relaxed">
            Please wait while we
            securely verify your
            session.
          </p>

        </motion.div>

      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  // Authorized
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
}

export default ProtectedRoute;
