import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/api";
import Brand from "../components/ui/Brand";

function AuthShell({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#050716] px-5 py-10 text-white">

      <Brand />

      <div className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-[#0b0e20] p-8 shadow-2xl shadow-black/30">

        <h1 className="text-3xl font-black">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  );
}

/* =========================================
FORGOT PASSWORD
========================================= */

function ForgotPassword() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async (
    event
  ) => {

    event.preventDefault();

    try {

      setLoading(true);

      const { data } =
        await api.post(
          "/api/auth/forgot-password",
          {
            email,
          }
        );

      toast.success(
        "User verified"
      );

      navigate(
        `/reset-password/${data.userId}`
      );

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
          "User not found"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your account email to continue."
    >

      <form
        onSubmit={submit}
        className="mt-8 space-y-5"
      >

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#080b19] px-4 text-slate-100 outline-none focus:border-violet-400/60"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="brand-gradient h-12 w-full rounded-xl font-bold text-white disabled:opacity-60"
        >

          {loading
            ? "Checking..."
            : "Continue"}

        </button>

        <p className="text-center text-sm text-slate-400">

          Remember password?{" "}

          <Link
            to="/login"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Login
          </Link>

        </p>

      </form>

    </AuthShell>
  );
}

/* =========================================
RESET PASSWORD
========================================= */

function ResetPassword() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async (
    event
  ) => {

    event.preventDefault();

    if (
      password !==
      confirmPassword
    ) {

      return toast.error(
        "Passwords do not match"
      );
    }

    try {

      setLoading(true);

      await api.put(
        `/api/auth/reset-password/${id}`,
        {
          password,
        }
      );

      toast.success(
        "Password reset successful"
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
          "Reset failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Create a new secure password."
    >

      <form
        onSubmit={submit}
        className="mt-8 space-y-5"
      >

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-300">
            New Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="New password"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#080b19] px-4 text-slate-100 outline-none focus:border-violet-400/60"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Confirm Password
          </label>

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm password"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#080b19] px-4 text-slate-100 outline-none focus:border-violet-400/60"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="brand-gradient h-12 w-full rounded-xl font-bold text-white disabled:opacity-60"
        >

          {loading
            ? "Updating..."
            : "Reset Password"}

        </button>

      </form>

    </AuthShell>
  );
}

export {
  ForgotPassword,
  ResetPassword,
};