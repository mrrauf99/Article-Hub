import { Check, X } from "lucide-react";

export default function PasswordRequirements({
  errors,
  passwordEntered,
  confirmEntered,
}) {
  const requirements = [
    {
      valid: errors.minLength && errors.maxLength,
      text: "Between 8-64 characters",
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
    <div className="mt-3 font-ui">
      <h2 className="text-sm font-medium text-ink mb-2">
        Password requirements
      </h2>

      <ul className="text-sm space-y-1.5">
        {requirements.map((rule, index) => {
          const showIcons = rule.show;

          return (
            <li
              key={index}
              className={
                showIcons
                  ? `flex items-center gap-2 ${
                      rule.valid ? "text-moss-700" : "text-red-600"
                    }`
                  : "flex items-center gap-2 text-ink-faint"
              }
            >
              {showIcons ? (
                rule.valid ? (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <X className="h-3.5 w-3.5 shrink-0" />
                )
              ) : (
                <span className="h-1 w-1 shrink-0 rounded-full bg-ink-faint ml-1 mr-0.5" />
              )}
              {rule.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
