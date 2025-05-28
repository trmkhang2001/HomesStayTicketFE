import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../services/roomApi";
import { getBranches } from "../services/branchApi";
import dayjs from "dayjs";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    branchId: "",
    minPrice: "",
    maxPrice: "",
    orderBy: "",
  });

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await getRooms(filters);
      setRooms(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng", err);
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
    fetchRooms();
    fetchBranches();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goToBooking = (room) => {
    navigate("/booking", { state: { room } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="home">
        <div className="flex flex-col md:flex-row gap-4 p-6 bg-gray-100 ">
          {/* Filter Section */}
          <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Tìm kiếm phòng</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Tìm theo tên phòng..."
                value={filters.name}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              />

              <select
                name="branchId"
                value={filters.branchId}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả chi nhánh</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Giá từ"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Đến"
                  className="w-full p-2 border rounded"
                />
              </div>

              <select
                name="orderBy"
                value={filters.orderBy}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sắp xếp theo</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
              </select>
            </div>
          </div>

          {/* Room List Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-bold mb-4">Danh sách phòng</h2>
            <div className="grid gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white p-4 rounded shadow flex gap-4"
                >
                  <div className="w-32 h-24 bg-gray-200 overflow-hidden rounded">
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <p className="text-sm text-gray-600">{room.type}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {room.description || "Chưa có mô tả"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">
                      {room.price ? `${room.price}đ / đêm` : "Liên hệ"}
                    </p>
                    <button
                      onClick={() => goToBooking(room)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Đặt phòng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
