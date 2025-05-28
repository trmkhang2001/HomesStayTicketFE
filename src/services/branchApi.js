import api from './axios';

export const getBranches = async (name = '', page = 1, limit = 5) => {
    const res = await api.get(`/branches?name=${name}&page=${page}&limit=${limit}`);
    return res.data;
};

export const createBranch = async (data) => {
    const res = await api.post('/branches/create', data);
    return res.data;
};

export const updateBranch = async (id, data) => {
    const res = await api.put(`/branches/${id}`, data);
    return res.data;
};

export const deleteBranch = async (id) => {
    const res = await api.delete(`/branches/${id}`);
    return res.data;
};
