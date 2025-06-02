import { useEffect, useState } from "react";
import {
  getRooms,
  deleteRoom,
  createRoom,
  updateRoom,
} from "../../services/roomApi";
import { getBranches } from "../../services/branchApi";
import NotificationModal from "../../components/NotificationModal";
import Pagination from "../../components/Pagination";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    branchId: "",
    minPrice: "",
    maxPrice: "",
    orderBy: "",
  });
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    price: "",
    status: "available",
    description: "",
    branchId: "",
    images: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await getRooms({ ...filters, page });
      setRooms(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Lỗi khi lấy danh sách phòng",
      });
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chi nhánh", err);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchRooms();
  }, [filters, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá phòng này?")) return;
    try {
      await deleteRoom(id);
      setNotification({ type: "success", message: "Xoá phòng thành công" });
      fetchRooms();
    } catch (err) {
      setNotification({ type: "error", message: "Lỗi khi xoá phòng" });
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   Object.entries(form).forEach(([key, value]) => {
  //     if (value !== null) formData.append(key, value);
  //   });

  //   try {
  //     if (form.id) {
  //       await updateRoom(form.id, formData);
  //       setNotification({
  //         type: "success",
  //         message: "Cập nhật phòng thành công",
  //       });
  //     } else {
  //       await createRoom(formData);
  //       setNotification({ type: "success", message: "Thêm phòng thành công" });
  //     }
  //     setForm({
  //       id: null,
  //       name: "",
  //       type: "",
  //       price: "",
  //       status: "available",
  //       description: "",
  //       branchId: "",
  //       image: null,
  //     });
  //     setShowModal(false);
  //     fetchRooms();
  //   } catch (err) {
  //     setNotification({ type: "error", message: "Lỗi khi lưu phòng" });
  //   }
  // };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Các trường thường
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images" && value !== null) {
        formData.append(key, value);
      }
    });

    // Gửi tất cả ảnh
    if (form.images && form.images.length) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]); // key "images" trùng với input backend nhận
      }
    }

    try {
      if (form.id) {
        await updateRoom(form.id, formData);
        setNotification({
          type: "success",
          message: "Cập nhật phòng thành công",
        });
      } else {
        await createRoom(formData);
        setNotification({ type: "success", message: "Thêm phòng thành công" });
      }
      setForm({
        id: null,
        name: "",
        type: "",
        price: "",
        status: "available",
        description: "",
        branchId: "",
        images: null,
      });
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      setNotification({ type: "error", message: "Lỗi khi lưu phòng" });
    }
  };
  const handleEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      type: room.type,
      price: room.price,
      status: room.status,
      description: room.description,
      branchId: room.branchId,
      images: null,
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản Lý Phòng</h1>

      <button
        onClick={() => {
          setForm({
            id: null,
            name: "",
            type: "",
            price: "",
            status: "available",
            description: "",
            branchId: "",
            images: null,
          });
          setShowModal(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Thêm phòng
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Tìm tên phòng..."
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        >
          <option value="">Loại phòng</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="vip">VIP</option>
        </select>
        <select
          name="branchId"
          value={filters.branchId}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        >
          <option value="">Chi nhánh</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Giá từ"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Đến"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        />
        <select
          name="orderBy"
          value={filters.orderBy}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300"
        >
          <option value="">Sắp xếp</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="name_asc">Tên A-Z</option>
          <option value="name_desc">Tên Z-A</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Tên phòng</th>
              <th className="px-6 py-3">Chi nhánh</th>
              <th className="px-6 py-3">Giá</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Loại</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {room.name}
                </td>
                <td className="px-6 py-4">{room.branch?.name || "—"}</td>
                <td className="px-6 py-4">{room.price}</td>
                <td className="px-6 py-4">{room.status}</td>
                <td className="px-6 py-4">{room.type}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-yellow-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Cập nhật phòng" : "Thêm phòng"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Tên phòng"
                required
              />
              <input
                name="price"
                value={form.price}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Giá"
                type="number"
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Mô tả phòng:
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setForm({ ...form, description: data });
                  }}
                />
              </div>
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn loại phòng</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="vip">VIP</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="available">Có sẵn</option>
                <option value="booked">Đã đặt</option>
              </select>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFormChange}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
