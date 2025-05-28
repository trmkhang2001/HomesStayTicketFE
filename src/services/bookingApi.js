import api from "./axios";

export const getBookings = async ({ name, email, roomId, status, page = 1, limit = 10 }) => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (email) params.append("email", email);
    if (roomId) params.append("roomId", roomId);
    if (status) params.append("status", status);
    params.append("page", page);
    params.append("limit", limit);

    const res = await api.get(`/bookings?${params.toString()}`);
    return res.data;
};

export const createBooking = async (data) => {
    const res = await api.post("/bookings/create", data);
    return res.data;
};

export const updateBooking = async (id, data) => {
    const res = await api.put(`/bookings/${id}`, data);
    return res.data;
};

export const updateBookingStatus = async (id, status) => {
    const res = await api.patch(`/bookings/status/${id}`, { status });
    return res.data;
};
export const getBookingStatistics = async () => {
    const res = await api.get("/bookings/statistics");
    return res.data;
};