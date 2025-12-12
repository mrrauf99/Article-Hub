import { Link } from "react-router-dom";

export default function SwitchPage({ question, linkText, linkTo }) {
  return (
    <p className="switch-page mt-5 text-center">
      {question}
      <Link
        className="text-[#4f46e5] text-base font-bold no-underline hover:underline
        focus:outline-none pl-1"
        to={linkTo}
      >
        {linkText}
      </Link>
    </p>
  );
}
