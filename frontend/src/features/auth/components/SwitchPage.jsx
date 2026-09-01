import { Link } from "react-router-dom";

export default function SwitchPage({ question, linkText, linkTo, icon: Icon }) {
  return (
    <p className="mt-6 text-center text-[0.9375rem] text-ink-muted font-ui">
      {question && <span className="mr-1">{question}</span>}

      <Link
        to={linkTo}
        className="inline-flex items-center gap-1 font-semibold text-moss-700 hover:text-moss-800 transition-colors focus:outline-none underline-offset-4 hover:underline"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {linkText}
      </Link>
    </p>
  );
}
