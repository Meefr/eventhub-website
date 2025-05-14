import { useTheme } from "../../contexts/ThemeContext";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } ${darkMode ? "bg-secondry text-light" : "bg-light text-dark"}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;
