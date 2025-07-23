"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image as ImageIcon, Package, TrendingUp } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      // Ambil hanya 6 kategori pertama untuk dashboard
      setCategories(data.slice(0, 6));
    } catch (error: any) {
      console.error('Error loading categories:', error);
      setError(error.message || "Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const activeCategories = categories.filter(cat => cat.is_active);
  const inactiveCategories = categories.filter(cat => !cat.is_active);

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadCategories}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Coba Lagi
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription>Total Kategori</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {categories.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Kategori produk</span>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription>Kategori Aktif</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
              {activeCategories.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Sedang digunakan</span>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription>Kategori Nonaktif</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {inactiveCategories.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-orange-600" />
              <span className="text-muted-foreground">Tidak aktif</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Categories</CardTitle>
            <CardDescription>
              Kategori terbaru yang telah ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {category.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${category.image}`}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                          if (fallback) {
                            fallback.classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 bg-muted rounded-md flex items-center justify-center ${category.image ? 'hidden fallback-icon' : ''}`}>
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{category.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {category.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              ))}
            </div>
            {categories.length === 6 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Menampilkan 6 kategori terbaru.{" "}
                  <a href="/dashboard-full/kategori" className="text-primary hover:underline">
                    Lihat semua kategori
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada kategori</h3>
            <p className="text-muted-foreground text-center mb-4">
              Mulai dengan menambahkan kategori pertama untuk produk Anda
            </p>
            <a
              href="/dashboard/kategori"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Tambah Kategori
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}