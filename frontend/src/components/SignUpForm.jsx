import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import PasswordField from "./PasswordField";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const interestOptions = ["Male", "Female", "Both"];

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    interestedIn: "",
  });
  const { isSigningUp, signUp } = useAuthStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signUp({ ...formData, age: Number(formData.age) });
  };

  return (
    <form
      aria-busy={isSigningUp}
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="signup-name">
          Name
        </label>
        <input
          autoComplete="name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="signup-name"
          name="name"
          onChange={handleChange}
          required
          type="text"
          value={formData.name}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="signup-email">
          Email
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="signup-email"
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={formData.email}
        />
      </div>

      <PasswordField
        autoComplete="new-password"
        id="signup-password"
        label="Password"
        name="password"
        onChange={handleChange}
        value={formData.password}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="signup-age">
          Age
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="signup-age"
          max="120"
          min="18"
          name="age"
          onChange={handleChange}
          required
          step="1"
          type="number"
          value={formData.age}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="signup-gender">
          Gender
        </label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="signup-gender"
          name="gender"
          onChange={handleChange}
          required
          value={formData.gender}
        >
          <option disabled value="">
            Select your gender
          </option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="signup-interested-in">
          Interested in
        </label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id="signup-interested-in"
          name="interestedIn"
          onChange={handleChange}
          required
          value={formData.interestedIn}
        >
          <option disabled value="">
            Select who you are interested in
          </option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full rounded-md bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSigningUp}
        type="submit"
      >
        {isSigningUp ? (
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
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
