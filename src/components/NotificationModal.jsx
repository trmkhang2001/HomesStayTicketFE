export default function NotificationModal({
  message,
  type = "success",
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className={`bg-white px-6 py-4 rounded shadow-lg text-center min-w-[280px] max-w-sm ${
          type === "error" ? "border-red-500" : "border-green-500"
        } border-l-4`}
      >
        <h4
          className={`text-lg font-semibold mb-2 ${
            type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {type === "error" ? "Thất bại" : "Thành công"}
        </h4>
        <p className="text-sm text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 text-sm"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
