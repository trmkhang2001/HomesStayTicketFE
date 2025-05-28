"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../services/roomApi";
import { getBranches } from "../services/branchApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({
    description: "",
    branchId: "",
    minPrice: "",
    maxPrice: "",
    orderBy: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await getRooms(filters);
      setRooms(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng", err);
    } finally {
      setIsLoading(false);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center py-32 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-md"
          style={{
            backgroundImage:
              'url("https://vielimousine.com/wp-content/uploads/2023/11/bai-sau-vung-tau.jpg")',
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Tìm phòng nghỉ hoàn hảo
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-100">
              Khám phá các phòng nghỉ chất lượng với giá cả phải chăng tại Vũng
              Tàu
            </p>
            <div className="mt-8">
              <button
                onClick={() => {
                  const roomsSection = document.querySelector("#rooms-section");
                  if (roomsSection) {
                    roomsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-6 py-3 bg-white text-gray-800 text-base font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors shadow-md"
              >
                Xem phòng ngay
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          id="rooms-section"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Section */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  Bộ lọc tìm kiếm
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tìm kiếm nâng cao
                    </label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Nhập thông tin..."
                      value={filters.description}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại phòng
                    </label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    >
                      <option value="">Tất cả loại</option>
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="vip">Vip</option>
                      {/* Các giá trị type bạn muốn */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chi nhánh
                    </label>
                    <select
                      name="branchId"
                      value={filters.branchId}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    >
                      <option value="">Tất cả chi nhánh</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoảng giá
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Từ"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-400"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Đến"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sắp xếp
                    </label>
                    <select
                      name="orderBy"
                      value={filters.orderBy}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    >
                      <option value="">Mặc định</option>
                      <option value="price_asc">Giá tăng dần</option>
                      <option value="price_desc">Giá giảm dần</option>
                      <option value="name_asc">Tên A-Z</option>
                      <option value="name_desc">Tên Z-A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Room List Section */}
            <div id="rooms-section" className="w-full lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Danh sách phòng
                </h2>
                <p className="text-gray-600">
                  {rooms.length} {rooms.length === 1 ? "phòng" : "phòng"} được
                  tìm thấy
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">
                    Không tìm thấy phòng phù hợp
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Hãy thử điều chỉnh bộ lọc của bạn
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        {room.images && room.images.length > 0 ? (
                          <Slider
                            dots={true}
                            infinite={true}
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            arrows={true}
                            autoplay={true}
                            autoplaySpeed={3000}
                          >
                            {room.images.map((img) => (
                              <div key={img.id} className="h-48">
                                <img
                                  src={img.imageUrl}
                                  alt={`${room.name} image ${img.id}`}
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                            ))}
                          </Slider>
                        ) : room.imageUrl ? (
                          <img
                            src={room.imageUrl}
                            alt={room.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            {/* Icon placeholder */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {room.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">
                              {room.type}
                            </p>
                          </div>
                          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {room.branchName || "N/A"}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-600 line-clamp-2">
                          {/* {room.description || "Chưa có mô tả"} */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: room.description || "Chưa có mô tả",
                            }}
                          />
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">
                            {room.price ? formatPrice(room.price) : "Liên hệ"}
                            <span className="text-sm font-normal text-gray-500">
                              /đêm
                            </span>
                          </span>
                          <button
                            onClick={() => goToBooking(room)}
                            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                          >
                            Đặt ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
