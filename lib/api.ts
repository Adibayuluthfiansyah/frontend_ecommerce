import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token"); // atau dari cookies

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
  });
  return res.json();
}
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  username: string; 
}) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api customer
export async function fetchCustomers() {
  const res = await fetch(`${BASE_URL}/customer`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal fetch customer");
  const json = await res.json();
  return json;
}

export async function createCustomer(data: {
  customer_name: string;
  alamat: string;
  no_hp: string;
}) {
  const res = await fetch(`${BASE_URL}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }
  return res.json();
}

export async function updateCustomer(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }

  return res.json();
}

export async function deleteCustomer(id: number) {
  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api barang
export async function fetchBarang() {
  const res = await fetch(`${BASE_URL}/barang`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal fetch barang");
  const json = await res.json();
  return json;
}
export async function createBarang(data: {
  nama_barang: string;
  jumlah: number;
  harga: number;
}) {
  const res = await fetch(`${BASE_URL}/barang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBarang(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function deleteBarang(id: number) {
  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api stock
export async function fetchStock() {
  const res = await fetch(`${BASE_URL}/stock`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createStock(data: { id_barang: string; limit: number }) {
  const res = await fetch(`${BASE_URL}/stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStock(id: number, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/stock/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function deleteStock(id: number) {
  const res = await fetch(`${BASE_URL}/stock/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api order
export async function fetchOrder() {
  const res = await fetch(`${BASE_URL}/order`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createOrder(data: {
  customer_id: string; // ✅ HARUS pakai ini, bukan `id_customer`
  order_date: string;
  total: number;
  items: { id: string; jumlah: number }[]; // jika kamu kirim items
}) {
  const res = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

export async function updateOrder(id: number, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function deleteOrder(id: number) {
  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// lib/api.ts
export async function kurangiStokBarang(id_barang: string, jumlah: number) {
  console.log("🔧 kurangiStokBarang dipanggil dengan:", { id_barang, jumlah });

  const res = await fetch(`${BASE_URL}/barang/${id_barang}/kurangi-stok`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ jumlah }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("❌ Gagal kurangi stok:", err);
    throw new Error(err.message || "Gagal kurangi stok");
  }

  return await res.json();
}

export async function saveOrderDetails(orderId: string, items: any[]) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/orderDetail/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }), // ✅ HARUS { items: [...] }
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}

export async function updateOrderTotal(orderId: string, total: number) {
  const res = await fetch(`${BASE_URL}/order/${orderId}/updateTotal`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ total }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

export async function fetchOrderDetails(orderId: string) {
  const res = await fetch(`${BASE_URL}/orderDetail/${orderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Gagal ambil detail order");

  return res.json();
}

export async function fetchDashboardCounts() {
  const res = await fetch(`${BASE_URL}/dashboard-counts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil data dashboard");
  return res.json();
}
export async function registerUser(data: {
  name: string;
  username: string;
  password: string;
  email: string;
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registrasi gagal");
  }

  return res.json();
}

// categori
// Update category - Perbaikan utama
export const updateCategory = async (id: number, formData: FormData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Token tidak ditemukan');

    // ✅ Debug FormData yang diterima
    console.log('=== updateCategory: FormData received ===');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // ✅ Tambahkan _method untuk Laravel method spoofing
    formData.append('_method', 'PUT');

    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'POST', // ✅ Tetap POST karena menggunakan FormData dengan _method
      headers: {
        'Authorization': `Bearer ${token}`,
        // ❌ JANGAN tambahkan Content-Type untuk FormData! Browser akan set otomatis
      },
      body: formData
    });

    // ✅ Debug response
    console.log('Update Response Status:', response.status);
    
    if (!response.ok) {
      // ✅ Coba parse sebagai JSON, jika gagal ambil sebagai text
      let errorMessage;
      try {
        const errorData = await response.json();
        console.log('Update Error Data:', errorData);
        
        // ✅ Handle validation errors
        if (response.status === 422 && errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        }
      } catch {
        const errorText = await response.text();
        console.log('Update Error Text:', errorText);
        errorMessage = errorText || `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Update Success Result:', result);
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to update category');
    }
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Create category - Perbaikan
export const createCategory = async (formData: FormData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Token tidak ditemukan');

    // ✅ Debug FormData yang diterima
    console.log('=== createCategory: FormData received ===');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ❌ JANGAN tambahkan Content-Type untuk FormData!
      },
      body: formData
    });

    // ✅ Debug response
    console.log('Create Response Status:', response.status);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        console.log('Create Error Data:', errorData);
        
        // ✅ Untuk error 422, tampilkan detail validation errors
        if (response.status === 422 && errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        }
      } catch {
        const errorText = await response.text();
        console.log('Create Error Text:', errorText);
        errorMessage = errorText || `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Create Success Result:', result);
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to create category');
    }
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// ✅ Fetch categories dengan better error handling
export const fetchCategories = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Fetch Categories Response Status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token tidak valid atau expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetch Categories Result:', result);
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// ✅ Delete category dengan better error handling
export const deleteCategory = async (id: number, token: string | null) => {
  try {
    if (!token) throw new Error('Token tidak ditemukan');
    
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Delete Category Response Status:', response.status);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        console.log('Delete Error Data:', errorData);
        
        if (response.status === 422 && errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        }
      } catch {
        const errorText = await response.text();
        console.log('Delete Error Text:', errorText);
        errorMessage = errorText || `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Delete Success Result:', result);
    
    if (result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message || 'Failed to delete category');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};