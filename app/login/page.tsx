"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { toast, Toaster } from "sonner"; // Tambahkan Toaster

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!", { username, password }); // Debug log

    if (!username || !password) {
      toast.error("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Trying to login..."); // Debug log
      const res = await login(username, password);
      console.log("Login response:", res); // Debug log

      // Simpan token ke localStorage
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        toast.success("Login berhasil!");
        
        // Redirect ke dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error("Login gagal: token tidak diterima");
      }
    } catch (error: any) {
      console.error("Login error:", error); // Debug log
      
      let errorMessage = "Terjadi kesalahan saat login";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response?.data?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = "Tidak dapat terhubung ke server. Pastikan backend Laravel sudah running.";
      } else {
        // Other error
        errorMessage = error.message || "Terjadi kesalahan tidak diketahui";
      }

      toast.error("Login gagal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Masuk ke akun Anda
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                id="username"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Masukkan username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Masukkan password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* PENTING: Tambahkan Toaster component */}
      <Toaster position="top-right" />
    </>
  );
}