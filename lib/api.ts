import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

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

//api user - FIXED VERSION
export async function fetchUsers() {
  const token = getToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", errorText);
      
      if (res.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        throw new Error("Session expired. Silakan login kembali.");
      }
      
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("API Response:", data);

    // Handle different response formats from Laravel
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      // Laravel resource format: { data: [...] }
      return data.data;
    } else if (data && data.users && Array.isArray(data.users)) {
      // Custom format: { users: [...] }
      return data.users;
    } else if (data && data.success && Array.isArray(data.users)) {
      // Format: { success: true, users: [...] }
      return data.users;
    } else {
      console.error("Unexpected response format:", data);
      // Return empty array instead of throwing error
      return [];
    }
  } catch (error) {
    console.error("fetchUsers error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal mengambil data users");
  }
}

export async function createUser(data: { name: string, email: string, password: string, username?: string }) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Create user failed: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
}

export async function updateUser(id: string | number, data: any, token?: string | null) {
  const authToken = token || getToken();
  if (!authToken) throw new Error("Token tidak ditemukan");

  try {
    const res = await fetch(`${BASE_URL}/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gagal update:", errText);
      throw new Error("Update gagal: " + errText);
    }

    return res.json();
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
}

export async function deleteUser(id: number, token?: string | null) {
  const authToken = token || getToken();
  if (!authToken) throw new Error("Token tidak ditemukan");

  try {
    const res = await fetch(`${BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Delete user failed: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }
}

//api customer
export async function fetchCustomers() {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  try {
    const res = await fetch(`${BASE_URL}/customer`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("fetchCustomers error:", error);
    throw error;
  }
}

export async function createCustomer(data: { customer_name: string, alamat: string, no_hp: string }) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Create customer failed: ${errorText}`);
  }

  return res.json();
}

export async function updateCustomer(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteCustomer(id: number) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Delete customer failed: ${errorText}`);
  }

  return res.json();
}

// api barang

export async function fetchBarang() {
  const res = await fetch(`${BASE_URL}/barang`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createBarang(data: { nama_barang: string, jumlah: number, harga: number }) {
  const res = await fetch(`${BASE_URL}/barang`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateBarang(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Gagal update:", errText)
    throw new Error("Update gagal: " + errText)
  }

  return res.json()
}

export async function deleteBarang(id: number) {
  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}