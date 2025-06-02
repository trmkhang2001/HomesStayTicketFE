"use client";

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createBooking } from "../services/bookingApi";
import dayjs from "dayjs";
import Modal from "../components/Modal";

export default function BookingPage() {
  const location = useLocation();
  const roomFromNav = location.state?.room;
  const roomUnitsFromNav = roomFromNav.units;
  const images =
    roomFromNav?.images && roomFromNav.images.length > 0
      ? roomFromNav.images
      : roomFromNav?.imageUrl
      ? [roomFromNav.imageUrl]
      : [];
  const [dateError, setDateError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const sliderInterval = useRef(null);
  useEffect(() => {
    if (images.length > 1) {
      sliderInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(sliderInterval.current);
  }, [images.length]);
  const openLightbox = (index) => {
    clearInterval(sliderInterval.current); // dừng slider khi mở ảnh lớn
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Khi đóng lightbox, bật lại slider nếu có >1 ảnh
    if (images.length > 1) {
      sliderInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  console.log(roomFromNav.images);

  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const navigate = useNavigate();
  // Bank details from environment variables (would normally be loaded from .env)
  const BANK_NAME = import.meta.env.BANK_NAME || "Vietcombank";
  const BANK_ACCOUNT = import.meta.env.BANK_ACCOUNT || "1038697915";

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    note: "",
    roomUnitId: null,
    checkInDate: dayjs().format("YYYY-MM-DD"),
    checkOutDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    paymentMethod: "Thanh toán khi nhận phòng",
    roomId: roomFromNav?.id || 1,
  });
  const [success, setSuccess] = useState(null);

  const nights = dayjs(form.checkOutDate).diff(form.checkInDate, "day") || 1;
  const totalPrice = roomFromNav?.price ? roomFromNav.price * nights : 0;

  // Generate QR code URL with dynamic amount
  const qrCodeUrl = `https://qr.sepay.vn/img?bank=${BANK_NAME}&acc=${BANK_ACCOUNT}&template=qronly&amount=${totalPrice}&des=Thanh+Toan+GD`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkInDate" || name === "checkOutDate") {
      const newForm = { ...form, [name]: value };
      validateDates(
        name === "checkInDate" ? value : form.checkInDate,
        name === "checkOutDate" ? value : form.checkOutDate
      );
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const validateDates = (checkIn, checkOut) => {
    const checkInDate = dayjs(checkIn);
    const checkOutDate = dayjs(checkOut);

    if (checkOutDate.isBefore(checkInDate)) {
      setDateError("Ngày trả phòng không được trước ngày nhận phòng");
      return false;
    }

    setDateError(null);
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates(form.checkInDate, form.checkOutDate)) {
      return;
    }
    if (!form.roomUnitId) {
      setModalInfo({
        isOpen: true,
        title: "Thiếu thông tin",
        message: "Vui lòng chọn số phòng cụ thể để tiếp tục đặt phòng.",
        onConfirm: null,
      });
      return;
    }
    try {
      await createBooking({ ...form });
      setModalInfo({
        isOpen: true,
        title: "Đặt phòng thành công",
        message: "Cảm ơn bạn đã đặt phòng. Bấm xác nhận để về trang chủ.",
        onConfirm: () => {
          setModalInfo({ ...modalInfo, isOpen: false });
          navigate("/");
        },
      });
    } catch (err) {
      if (
        err?.response?.data?.message ===
        "This room unit is already booked during the selected dates"
      ) {
        setModalInfo({
          isOpen: true,
          title: "Lỗi đặt phòng",
          message:
            "Lịch đặt đã có người trong khoảng thời gian này. Vui lòng chọn ngày khác.",
          onConfirm: null,
        });
      } else {
        setModalInfo({
          isOpen: true,
          title: "Lỗi đặt phòng",
          message: "Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.",
          onConfirm: null,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Đặt phòng</h1>
          <p className="text-gray-600 mt-2">
            Vui lòng điền thông tin để hoàn tất đặt phòng
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                Thông tin liên hệ
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ tên
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkInDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày nhận phòng
                    </label>
                    <input
                      id="checkInDate"
                      type="date"
                      name="checkInDate"
                      value={form.checkInDate}
                      onChange={handleChange}
                      min={dayjs().format("YYYY-MM-DD")} // Không cho chọn ngày trong quá khứ
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkOutDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày trả phòng
                    </label>
                    <input
                      id="checkOutDate"
                      type="date"
                      name="checkOutDate"
                      value={form.checkOutDate}
                      onChange={handleChange}
                      min={form.checkInDate} // Không cho chọn ngày trước ngày nhận
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                    />
                    {dateError && (
                      <p className="text-red-500 text-sm mt-1">{dateError}</p>
                    )}
                  </div>
                </div>
                {roomUnitsFromNav?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                      Chọn số phòng cụ thể
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {roomUnitsFromNav.map((unit) => (
                        <label
                          key={unit.id}
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                            unit.isBooked
                              ? "border-gray-200 hover:bg-gray-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="roomUnitId"
                            value={unit.id}
                            checked={form.roomUnitId === unit.id}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                roomUnitId: parseInt(e.target.value),
                              }))
                            }
                            className="accent-gray-800"
                          />
                          <span>{unit.roomNumber}</span>
                        </label>
                      ))}
                    </div>
                    {!form.roomUnitId && (
                      <p className="text-red-500 text-sm mt-2">
                        Vui lòng chọn một số phòng để tiếp tục.
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800"
                  ></textarea>
                </div>
              </div>
            </div>

            {roomFromNav && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Thông tin phòng
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-full sm:w-1/3 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {/* {roomFromNav.imageUrl ? (
                      <img
                        src={roomFromNav.imageUrl || "/placeholder.svg"}
                        alt={roomFromNav.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                    )} */}
                    {images.length > 0 && (
                      <div className="relative w-full max-w-xl mx-auto mb-6">
                        <div
                          className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
                          onClick={() => openLightbox(currentImageIndex)}
                        >
                          <img
                            src={images[currentImageIndex].imageUrl}
                            alt={`Room image ${currentImageIndex + 1}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>

                        {/* Nút điều hướng ảnh (prev/next) */}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                showPrevImage();
                                clearInterval(sliderInterval.current);
                              }}
                              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                              aria-label="Previous image"
                            >
                              &#10094;
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                showNextImage();
                                clearInterval(sliderInterval.current);
                              }}
                              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                              aria-label="Next image"
                            >
                              &#10095;
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Lightbox mở ảnh lớn */}
                    {isLightboxOpen && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                        onClick={closeLightbox}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            showPrevImage();
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl select-none"
                          aria-label="Previous image"
                        >
                          &#10094;
                        </button>

                        <img
                          src={images[currentImageIndex].imageUrl}
                          alt={`Room image large ${currentImageIndex + 1}`}
                          className="max-h-[90vh] max-w-[90vw] object-contain rounded"
                          onClick={(e) => e.stopPropagation()}
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            showNextImage();
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl select-none"
                          aria-label="Next image"
                        >
                          &#10095;
                        </button>

                        <button
                          type="button"
                          onClick={closeLightbox}
                          className="absolute top-4 right-4 text-white text-3xl font-bold"
                          aria-label="Close lightbox"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {roomFromNav.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{roomFromNav.type}</p>
                    {roomFromNav.description && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: roomFromNav.description || "Chưa có mô tả",
                        }}
                      />
                    )}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá phòng:</span>
                        <span className="font-medium">
                          {roomFromNav.price?.toLocaleString()}đ / đêm
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Số đêm:</span>
                        <span className="font-medium">{nights} đêm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                Thông tin thanh toán
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tiền phòng</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thu khác</span>
                    <span>0đ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2"></div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Tổng cộng</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Thanh toán khi nhận phòng"
                        checked={
                          form.paymentMethod === "Thanh toán khi nhận phòng"
                        }
                        onChange={handleChange}
                        className="text-gray-800 focus:ring-gray-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          Thanh toán khi nhận phòng
                        </p>
                        <p className="text-xs text-gray-500">
                          Thanh toán trực tiếp tại quầy lễ tân
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Thanh toán online"
                        checked={form.paymentMethod === "Thanh toán online"}
                        onChange={handleChange}
                        className="text-gray-800 focus:ring-gray-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          Thanh toán online
                        </p>
                        <p className="text-xs text-gray-500">
                          Chuyển khoản qua mã QR
                        </p>
                      </div>
                    </label>

                    {form.paymentMethod === "Thanh toán online" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-center mb-3">
                          <p className="font-medium text-gray-800 mb-1">
                            Quét mã QR để thanh toán
                          </p>
                          <p className="text-xs text-gray-600 mb-3">
                            Số tiền:{" "}
                            <span className="font-medium">
                              {totalPrice.toLocaleString()}đ
                            </span>
                          </p>
                          <div className="bg-white p-3 rounded-lg inline-block mx-auto">
                            <img
                              src={qrCodeUrl || "/placeholder.svg"}
                              alt="QR Code thanh toán"
                              className="w-48 h-48 mx-auto"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://sjc.microlink.io/LxR1A7lIi2sGzj8RN4wBAdTlwhWFiunZNdo3DcTWTa9Qzx3447Tze5nlOBFkrRBZathKfsQnxqPHu6sgdwvc_A.jpeg";
                              }}
                            />
                          </div>
                          <div className="mt-3 text-xs text-gray-600">
                            <p>Ngân hàng: {BANK_NAME}</p>
                            <p>Số tài khoản: {BANK_ACCOUNT}</p>
                            <p>Nội dung: Thanh Toan GD</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors mt-6"
                >
                  Hoàn tất đặt phòng
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng cách nhấn nút "Hoàn tất đặt phòng", bạn đồng ý với các
                  điều khoản và điều kiện của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </form>
        <Modal
          isOpen={modalInfo.isOpen}
          title={modalInfo.title}
          message={modalInfo.message}
          onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
          onConfirm={modalInfo.onConfirm}
        />
      </main>
      <Footer />
    </div>
  );
}
