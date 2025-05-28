import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">403</h1>
      <p className="text-xl text-gray-700 mb-6">
        Bạn không có quyền truy cập trang này.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
