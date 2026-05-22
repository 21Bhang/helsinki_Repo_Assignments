const BASE = "/api";

const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handle = async (res) => {
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const login = (credentials) =>
  fetch(`${BASE}/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(credentials),
  }).then(handle);

export const signup = (newUser) =>
  fetch(`${BASE}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(newUser),
  }).then(handle);

export const getBlogs = () => fetch(`${BASE}/blogs`).then(handle);

export const createBlog = (blog, token) =>
  fetch(`${BASE}/blogs`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(blog),
  }).then(handle);

export const updateBlog = (id, blog, token) =>
  fetch(`${BASE}/blogs/${id}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(blog),
  }).then(handle);

export const deleteBlog = (id, token) =>
  fetch(`${BASE}/blogs/${id}`, {
    method: "DELETE",
    headers: headers(token),
  }).then(handle);
