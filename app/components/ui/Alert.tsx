import React from "react";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message?: string;
  show?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const typeStyles = {
  success: {
    icon: (
      <svg
        className="h-16 w-16 text-green-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  error: {
    icon: (
      <svg
        className="h-16 w-16 text-red-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9l-6 6m0-6l6 6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  warning: {
    icon: (
      <svg
        className="h-16 w-16 text-yellow-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  info: {
    icon: (
      <svg
        className="h-16 w-16 text-blue-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16h.01M12 8v4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title = "",
  message = "",
  show = true,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Batal",
}) => {
  if (!show) return null;
  const style = typeStyles[type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="animate-fadein fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onCancel}
      ></div>
      {/* Modal */}
      <div className="animate-fadein relative z-10 mx-auto flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-300 hover:text-gray-500 focus:outline-none"
        >
          &times;
        </button>
        <div className="mb-4">{style.icon}</div>
        {title && (
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            {title}
          </h2>
        )}
        {message && (
          <div className="mb-6 text-center text-gray-600">{message}</div>
        )}
        <div className="mt-2 flex w-full justify-center gap-4">
          {onCancel && (
            <button
              className="rounded bg-red-500 px-6 py-2 font-semibold text-white shadow hover:bg-red-600"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              className="rounded bg-green-500 px-6 py-2 font-semibold text-white shadow hover:bg-green-600"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-fadein {
          animation: fadein 0.2s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
