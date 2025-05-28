import { useEffect, useState } from "react";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../services/branchApi";
import NotificationModal from "../../components/NotificationModal";
import Pagination from "../../components/Pagination";

function BranchModal({ isOpen, onClose, onSubmit, form, setForm, editing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Cập nhật chi nhánh" : "Thêm mới chi nhánh"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Tên chi nhánh"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 bg-gray-100 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-2 bg-gray-100 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-2 bg-gray-100 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 bg-gray-100 border rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BranchManagementPage() {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBranches = async () => {
    try {
      const res = await getBranches(search, page);
      setBranches(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Lỗi khi lấy danh sách chi nhánh",
      });
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [search, page]);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateBranch(editingId, form);
        setNotification({ type: "success", message: "Cập nhật thành công" });
      } else {
        await createBranch(form);
        setNotification({ type: "success", message: "Thêm mới thành công" });
      }
      setForm({ name: "", address: "", phone: "", email: "" });
      setEditingId(null);
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      setNotification({ type: "error", message: "Lỗi khi lưu chi nhánh" });
    }
  };

  const handleEdit = (branch) => {
    setForm(branch);
    setEditingId(branch.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá chi nhánh này?")) return;
    try {
      await deleteBranch(id);
      setNotification({ type: "success", message: "Xoá thành công" });
      fetchBranches();
    } catch (err) {
      setNotification({ type: "error", message: "Lỗi khi xoá chi nhánh" });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Quản Lý Chi Nhánh
      </h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên chi nhánh..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="p-2 rounded border border-gray-300 w-full max-w-xs"
        />
        <button
          onClick={() => {
            setForm({ name: "", address: "", phone: "", email: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="ml-4 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
        >
          + Thêm chi nhánh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Tên chi nhánh</th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th className="px-6 py-3">Số điện thoại</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {branch.name}
                </td>
                <td className="px-6 py-4">{branch.address}</td>
                <td className="px-6 py-4">{branch.phone}</td>
                <td className="px-6 py-4">{branch.email}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="bg-yellow-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <BranchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editing={!!editingId}
      />
    </div>
  );
}
