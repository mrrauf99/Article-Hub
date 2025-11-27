import { useNavigate } from "react-router-dom";

export default function GoogleAuthButton({ children }) {
  const navigate = useNavigate();

  return (
    <button
      className="w-full mt-2.5 p-3 text-base bg-white border border-gray-300 rounded-lg
             text-black font-medium flex items-center justify-center gap-2
             cursor-pointer transition hover:bg-gray-50"
      onClick={() => navigate("/auth/google")}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        width="20"
        height="20"
      />
      {children}
    </button>
  );
}
