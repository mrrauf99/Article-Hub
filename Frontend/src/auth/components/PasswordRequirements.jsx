export default function PasswordRequirements({ errors, visible }) {
  if (!visible || errors.length === 0) return null;

  const listPadding = errors.length === 1 ? "py-0 px-4" : "p-4";

  return (
    <ul
      className={`bg-white border border-gray-300 rounded-md mt-4 text-sm text-left space-y-1 ${listPadding}`}
    >
      {errors.map((error, index) => (
        <li key={index} className="text-red-600 font-medium">
          {error}
        </li>
      ))}
    </ul>
  );
}
