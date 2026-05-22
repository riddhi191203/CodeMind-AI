import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";
import { AuthContext } from "../context/auth-context";
import Brand from "../components/ui/Brand";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }) =>
    setFormData((data) => ({
      ...data,
      [target.name]: target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/auth/login",
        formData
      );

      login(data.user, data.token);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#050716] text-white lg:grid-cols-[1fr_1.02fr]">
      
      {/* Left Section */}
      <section className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#342f82,#071b38_58%,#050716)] p-9 lg:flex lg:flex-col">
        
        {/* Align Brand to Top Left */}
        <div className="absolute left-9 top-9">
          <Brand />
        </div>

        <div className="mt-auto max-w-2xl pb-12">
          <p className="text-3xl leading-snug">
            "CodeMind caught three security bugs in our auth flow before
            staging - in under a minute."
          </p>

          <p className="mt-7 text-slate-400">
            Priya R., Lead Engineer @ Stackline
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex items-center justify-center px-5 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b0e20] p-10 shadow-2xl shadow-black/30"
        >
          <h1 className="text-3xl font-black">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to your CodeMind workspace.
          </p>

          {/* Removed OAuth Buttons */}

          {[ 
            ["email", "Email", "you@dev.io", "email"],
            ["password", "Password", "••••••••", "password"],
          ].map(([name, label, placeholder, type]) => (
            <label key={name} className="mb-5 mt-6 block">
              <span className="mb-2 block text-sm font-bold text-slate-200">
                {label}
              </span>

              <input
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#080b19] px-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60"
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="brand-gradient mt-2 h-12 w-full rounded-xl font-bold text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-4 text-center text-sm">
            <Link
              to="/forgot-password"
              className="font-bold text-indigo-300"
            >
              Forgot password?
            </Link>
          </p>

          <p className="mt-7 text-center text-sm text-slate-500">
            No account?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-300"
            >
              Create one
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;