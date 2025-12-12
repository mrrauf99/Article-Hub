export default function PasswordRequirements({
  errors,
  passwordEntered,
  confirmEntered,
}) {
  const requirements = [
    {
      valid: errors.minLength && errors.maxLength,
      text: "Between 8–64 characters",
      show: passwordEntered,
    },
    {
      valid: errors.hasUpper && errors.hasLower,
      text: "At least one upper and one lower case letter",
      show: passwordEntered,
    },
    {
      valid: errors.hasNumber,
      text: "At least one number",
      show: passwordEntered,
    },
    {
      valid: errors.hasSymbol,
      text: "At least one special character",
      show: passwordEntered,
    },
    {
      valid: errors.match,
      text: "Passwords match",
      show: confirmEntered,
    },
  ];

  return (
    <div className="password-requirements">
      <h2 className="text-base font-semibold text-[#333] pl-0.5">
        Password Requirements
      </h2>

      <ul className="text-sm space-y-1 py-2 pl-1">
        {requirements.map((rule, index) => {
          const showIcons = rule.show;

          return (
            <li
              key={index}
              className={
                showIcons
                  ? `flex items-center gap-2 ${
                      rule.valid ? "text-green-600" : "text-red-600"
                    }`
                  : "text-gray-600 list-disc ml-4"
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
