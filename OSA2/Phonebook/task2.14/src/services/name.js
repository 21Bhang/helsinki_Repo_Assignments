import axios from "axios";

// ❗ RELATIVE URL (works in dev + production)
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((res) => res.data);
};

// (You won't fully use update yet until later exercises, but keep it)
const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((res) => res.data);
};

export default { getAll, create, update, remove };
