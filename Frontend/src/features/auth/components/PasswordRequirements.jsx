export default function PasswordRequirements({ errors, didEdit }) {
  const requirements = [
    {
      valid: errors.minLength && errors.maxLength,
      text: "Between 10–20 characters",
    },
    {
      valid: errors.hasUpper && errors.hasLower,
      text: "At least one upper and one lower case letter",
    },
    {
      valid: errors.hasNumber,
      text: "At least one number",
    },
    {
      valid: errors.hasSymbol,
      text: "At least one special character",
    },
    {
      valid: errors.match,
      text: "Passwords match",
    },
  ];

  const showIcons = didEdit === true;

  return (
    <div className="password-requirements">
      <h2 className="text-base font-semibold text-[#333] pl-0.5">
        Password Requirements
      </h2>

      <ul className={`text-sm space-y-1 py-2 ${showIcons ? "pl-1" : "pl-4"}`}>
        {requirements.map((rule, index) => {
          return (
            <li
              key={index}
              className={`${
                !showIcons
                  ? "text-gray-600"
                  : "text-red-600 flex items-center gap-2 list-none" +
                    (rule.valid ? " !text-green-600" : "")
              }`}
              style={
                !showIcons
                  ? { listStyleType: "circle", display: "list-item" }
                  : {}
              }
            >
              {showIcons && (
                <span className="font-bold">{rule.valid ? "✓" : "✕"}</span>
              )}

              {rule.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
