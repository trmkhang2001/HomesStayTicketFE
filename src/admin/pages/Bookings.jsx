import { useEffect, useState } from "react";
import {
  getBookings,
  updateBookingStatus,
  createBooking,
  updateBooking,
} from "../../services/bookingApi";
import { getRooms, getSubRooms } from "../../services/roomApi";
import { getUsers } from "../../services/authApi";
import NotificationModal from "../../components/NotificationModal";
import Pagination from "../../components/Pagination";
import dayjs from "dayjs";

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [subRooms, setSubRooms] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    roomId: "",
    name: "",
    email: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(Date.now());
  const [form, setForm] = useState({
    // id: null,
    roomId: "",
    roomUnitId: "",
    userId: "",
    checkInDate: dayjs().format("YYYY-MM-DD"),
    checkOutDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    name: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "",
  });

  const fetchBookings = async () => {
    try {
      const res = await getBookings({ ...filters, page });
      setBookings(res.data);
      console.log(res.data);

      setTotalPages(res.totalPages);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Lỗi khi lấy danh sách đặt phòng",
      });
    }
  };

  const fetchRoomsAndUsers = async () => {
    try {
      const roomRes = await getRooms({ limit: 100 });
      const userRes = await getUsers();
      setRooms(roomRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng hoặc người dùng", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRoomsAndUsers();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setNotification({
        type: "success",
        message: "Cập nhật trạng thái thành công",
      });
      fetchBookings();
    } catch (err) {
      setNotification({
        type: "error",
        message: "Lỗi khi cập nhật trạng thái",
      });
    }
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value || prev[name] }));
    if (name === "roomId" && value) {
      try {
        const res = await getSubRooms(value);
        console.log(res);
        setSubRooms(res);
      } catch (err) {
        console.error("Lỗi khi lấy phòng con", err);
        setSubRooms([]);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        checkInDate: form.checkInDate || dayjs().format("YYYY-MM-DD"),
        checkOutDate:
          form.checkOutDate || dayjs().add(1, "day").format("YYYY-MM-DD"),
      };
      if (form.id) {
        await updateBooking(form.id, payload);
        setNotification({ type: "success", message: "Cập nhật thành công" });
      } else {
        await createBooking(payload);
        setNotification({ type: "success", message: "Đặt phòng thành công" });
      }
      setForm({
        id: null,
        roomId: "",
        userId: "",
        checkInDate: dayjs().format("YYYY-MM-DD"),
        checkOutDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
        name: "",
        phoneNumber: "",
        email: "",
        paymentMethod: "",
      });
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      setNotification({ type: "error", message: "Lỗi khi xử lý đặt phòng" });
    }
  };

  const handleEdit = (booking) => {
    setForm({
      id: booking.id,
      roomId: booking.roomId,
      userId: booking.userId || "",
      roomUnitId: booking.roomUnitId || "",
      checkInDate: booking.checkInDate
        ? dayjs(booking.checkInDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      checkOutDate: booking.checkOutDate
        ? dayjs(booking.checkOutDate).format("YYYY-MM-DD")
        : dayjs().add(1, "day").format("YYYY-MM-DD"),
      name: booking.name,
      phoneNumber: booking.phoneNumber,
      email: booking.email,
      paymentMethod: booking.paymentMethod,
    });
    setModalKey(Date.now());
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Quản Lý Đặt Phòng
      </h1>

      <button
        onClick={() => {
          setForm({
            id: null,
            roomId: "",
            userId: "",
            checkInDate: "",
            checkOutDate: "",
            name: "",
            phoneNumber: "",
            email: "",
            paymentMethod: "",
          });
          setShowModal(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Thêm đặt phòng
      </button>

      <div className="overflow-x-auto bg-white rounded shadow mb-4">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Phòng</th>
              <th className="px-4 py-2">Số phòng con</th>
              <th className="px-4 py-2">Nhận Trả</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{booking.name}</td>
                <td className="px-4 py-2">{booking.email}</td>
                <td className="px-4 py-2">{booking.phoneNumber}</td>
                <td className="px-4 py-2">{booking.Room?.name}</td>
                <td className="px-4 py-2">
                  {booking.roomUnit?.roomNumber || "-"}
                </td>{" "}
                <td className="px-4 py-2">
                  {dayjs(booking.checkInDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2 text-center space-x-1">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.id, e.target.value)
                    }
                    className="p-1 rounded border"
                  >
                    <option value="pending">Chờ</option>
                    <option value="confirmed">Xác nhận</option>
                    <option value="canceled">Huỷ</option>
                  </select>
                  <button
                    onClick={() => handleEdit(booking)}
                    className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Sửa
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
        <div
          key={form.id || "new"}
          className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Cập nhật đặt phòng" : "Thêm đặt phòng"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <select
                name="roomId"
                value={form.roomId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Chọn phòng</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </option>
                ))}
              </select>
              {subRooms.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn phòng con
                  </label>
                  <div className="space-y-2">
                    {subRooms.map((room) => (
                      <label
                        key={room.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name="roomUnitId"
                          value={room.id}
                          checked={form.roomUnitId === String(room.id)}
                          onChange={handleFormChange}
                          className="form-radio"
                        />
                        <span>{room.roomNumber}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <select
                name="userId"
                value={form.userId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn người dùng</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.email})
                  </option>
                ))}
              </select>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Ngày nhận phòng
                </label>
                <input
                  name="checkInDate"
                  type="date"
                  value={form.checkInDate}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Ngày trả phòng
                </label>
                <input
                  name="checkOutDate"
                  type="date"
                  value={form.checkOutDate}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Họ tên khách"
                required
              />
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="SĐT"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Email"
                required
              />
              <input
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Phương thức thanh toán"
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
