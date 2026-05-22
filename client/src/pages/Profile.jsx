import {
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "../api/api";
import {
  AuthContext,
} from "../context/auth-context";

import MainLayout from "../layouts/MainLayout";

function Profile() {
  const { login } =
    useContext(AuthContext);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      role: "",
      bio: "",
    });

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const { data } =
            await api.get(
              "/api/auth/profile"
            );

          setForm({
            name:
              data.user.name ||
              "",

            role:
              data.user.role ||
              "",

            bio:
              data.user.bio ||
              "",
          });
        } catch (error) {
          toast.error(
            error.response?.data
              ?.message ||
              "Failed to load profile"
          );
        }
      };

    loadProfile();
  }, []);

  const update = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data } =
        await api.put(
          "/api/auth/profile",
          form
        );

      login(
        data.user,
        localStorage.getItem(
          "codemind-token"
        )
      );

      toast.success(
        "Profile updated"
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl">

        <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-400">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Profile Settings
        </h1>

        <p className="mt-3 text-slate-400">
          Manage your CodeMind profile.
        </p>

        <form
          onSubmit={update}
          className="mt-8 rounded-3xl border border-white/10 bg-[#111631]/80 p-6 shadow-2xl shadow-black/20"
        >

          {/* NAME */}
          <label className="mb-5 block">

            <span className="mb-2 block text-sm font-bold text-slate-200">
              Name
            </span>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm(
                  (value) => ({
                    ...value,
                    name:
                      event.target
                        .value,
                  })
                )
              }
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0e20] px-4 text-slate-100 outline-none focus:border-violet-500/60"
            />

          </label>

          {/* ROLE */}
          <label className="mb-5 block">

            <span className="mb-2 block text-sm font-bold text-slate-200">
              Role
            </span>

            <input
              type="text"
              value={form.role}
              onChange={(event) =>
                setForm(
                  (value) => ({
                    ...value,
                    role:
                      event.target
                        .value,
                  })
                )
              }
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0e20] px-4 text-slate-100 outline-none focus:border-violet-500/60"
            />

          </label>

          {/* BIO */}
          <label className="block">

            <span className="mb-2 block text-sm font-bold text-slate-200">
              Bio
            </span>

            <textarea
              rows={5}
              value={form.bio}
              onChange={(event) =>
                setForm(
                  (value) => ({
                    ...value,
                    bio:
                      event.target
                        .value,
                  })
                )
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0e20] px-4 py-3 text-slate-100 outline-none focus:border-violet-500/60"
            />

          </label>

          <button
            type="submit"
            disabled={loading}
            className="brand-gradient mt-6 rounded-xl px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>

      </div>
    </MainLayout>
  );
}

export default Profile;