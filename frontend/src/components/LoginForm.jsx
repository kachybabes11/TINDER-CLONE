import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import PasswordField from "./PasswordField";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoggingIn, login } = useAuthStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(formData);
  };

  return (
    <form
      aria-busy={isLoggingIn}
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="login-email">
          Email
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="login-email"
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={formData.email}
        />
      </div>

      <PasswordField
        autoComplete="current-password"
        id="login-password"
        label="Password"
        name="password"
        onChange={handleChange}
        value={formData.password}
      />

      <button
        className="w-full rounded-md bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoggingIn}
        type="submit"
      >
        {isLoggingIn ? (
          <span className="inline-flex items-center justify-center gap-2" role="status">
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
