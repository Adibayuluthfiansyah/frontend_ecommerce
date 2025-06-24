import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem('token') // atau dari cookies

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};

export const logout = async (token: string | null) => {
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


//api user
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createUser(data: { name: string, email: string, password: string }) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateUser(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}