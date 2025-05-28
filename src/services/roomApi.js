import api from "./axios";

// Lấy danh sách phòng có filter và phân trang
export const getRooms = async ({
    description = "",
    type = "",
    branchId = "",
    minPrice = "",
    maxPrice = "",
    orderBy = "",
    page = 1,
    limit = 10,
}) => {
    const params = new URLSearchParams();

    if (description) params.append("description", description);
    if (type) params.append("type", type);
    if (branchId) params.append("branchId", branchId);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (orderBy) params.append("orderBy", orderBy);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const res = await api.get(`/rooms?${params.toString()}`);
    return res.data;
};

// Xoá phòng
export const deleteRoom = async (id) => {
    const res = await api.delete(`/rooms/${id}`);
    return res.data;
};

// (Tuỳ chọn) Thêm / Sửa phòng - sẽ dùng nếu bạn làm modal tạo phòng
export const createRoom = async (formData) => {
    const res = await api.post("/rooms/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateRoom = async (id, formData) => {
    const res = await api.put(`/rooms/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
export const getSubRooms = async (parentRoomId) => {
    const res = await api.get(`/rooms/${parentRoomId}/units`);
    return res.data;
};