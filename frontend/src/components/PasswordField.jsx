import { useState } from "react";

const PasswordField = ({ autoComplete, id, label, name, onChange, value }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className="w-full rounded-md border border-gray-300 px-3 py-2 pr-12 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          id={id}
          name={name}
          onChange={onChange}
          required
          type={isVisible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800"
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            {isVisible ? (
              <>
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a16 16 0 01-3 3.8M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.6" />
              </>
            ) : (
              <>
                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
