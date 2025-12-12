export default function AlertMessageBox({ message, setAlertMessage }) {
  return (
    <div
      className="flex items-center justify-between  bg-red-100 text-red-700 
        border border-red-300 p-3 rounded-md text-sm my-4 animate-fadeIn"
    >
      <span>{message}</span>
      <button
        onClick={() => setAlertMessage("")}
        className="text-red-700 hover:text-red-900 text-xl leading-none"
      >
        &times;
      </button>
    </div>
  );
}
