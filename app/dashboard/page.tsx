"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    // Ambil token dari localStorage (atau bisa juga pakai cookies/session)
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Anda belum login!");
      router.push("/login");
      return;
    }

    // Simulasikan data user (bisa fetch dari API)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ name: "Asrul Abdullah", email: "asrul@example.com" }); // fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast("Berhasil logout");
    router.push("/login");
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 space-y-4">
      <h1 className="text-3xl font-bold">Selamat Datang di Dashboard</h1>

      {user && (
        <div className="border rounded p-4 bg-gray-50 space-y-2">
          <p>
            <strong>Nama:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
