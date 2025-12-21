import { Link } from "react-router-dom";

export default function SwitchPage({ question, linkText, linkTo, icon: Icon }) {
  return (
    <p className="mt-5 text-center text-base">
      {question && <span className="mr-1">{question}</span>}

      <Link
        to={linkTo}
        className="inline-flex items-center gap-1 text-[#4f46e5] font-bold hover:underline focus:outline-none"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {linkText}
      </Link>
    </p>
  );
}
