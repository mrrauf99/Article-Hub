import { Link } from "react-router-dom";

export default function SwitchPage({ question, linkText, linkTo, icon: Icon }) {
  return (
    <p className="mt-6 text-center text-base text-slate-600">
      {question && <span className="mr-1">{question}</span>}

      <Link
        to={linkTo}
        className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors focus:outline-none"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {linkText}
      </Link>
    </p>
  );
}
