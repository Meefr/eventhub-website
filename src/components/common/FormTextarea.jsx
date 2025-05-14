import { useTheme } from "../../contexts/ThemeContext";

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = null,
  rows = 3,
  className = "",
  ...props
}) => {
  const { darkMode } = useTheme();
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${
            darkMode ? "text-light" : "text-dark"
          } mb-1`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } ${darkMode ? "bg-secondry text-light" : "bg-light text-dark"}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormTextarea;
