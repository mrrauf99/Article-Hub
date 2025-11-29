export default function PasswordRequirements({ errors, visible }) {
  if (!visible || errors.length === 0) return null;

  return (
    <div className="password-requirements">
      <h2 className="text-base text-[#333] pl-0.5">Password Requirements</h2>
      <ul className="bg-white border border-gray-300 rounded-md text-sm space-y-1 px-4">
        {errors.map((error, index) => (
          <li key={index} className="text-red-600 font-medium">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
