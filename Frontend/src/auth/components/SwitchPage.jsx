import { Link } from "react-router-dom";

export default function SwitchPage({ question, linkText, linkTo }) {
  return (
    <p className="switch-page mt-5 text-center">
      {question}{" "}
      <Link className="text-[#4f46e5] text-sm font-bold no-underline hover:underline" to={linkTo}>
        {linkText}
      </Link>
    </p>
  );
}
