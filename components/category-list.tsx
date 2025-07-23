"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "@/lib/api";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import CategoryFormModal from "./CategoryFormModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      setError(error.message || "Gagal memuat data kategori");
      toast.error(error.message || "Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteCategory(id, token);
      await loadCategories(); 
      toast.success("Category berhasil dihapus");
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err.message || "Gagal menghapus data category");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      const id = Number(formData.get('id'));
      if (!id) throw new Error('ID kategori tidak ditemukan');
      
      console.log('Update FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await updateCategory(id, formData);
      await loadCategories(); 
      toast.success("Category berhasil diupdate");
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || "Gagal mengupdate category");
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {

      console.log('Create FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await createCategory(formData);
      await loadCategories(); 
      toast.success("Category berhasil ditambahkan");
    } catch (err: any) {
      console.error('Create error:', err);
      toast.error(err.message || "Gagal menambahkan category");
    }
  };


  if (loading && categories.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <div className="flex flex-col justify-center items-center py-8 space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadCategories} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Category</h2>
        <CategoryFormModal
          onSubmit={handleCreate}
          trigger={<Button className="cursor-pointer">+ Tambah</Button>}
        />
      </div>
      
      {loading && categories.length > 0 && (
        <div className="flex justify-center py-2">
          <p className="text-sm text-muted-foreground">Memuat ulang...</p>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada data category
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {category.image ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${category.image}`} 
                      alt={category.name}
                      className="w-10 h-10 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                        if (fallback) {
                          fallback.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 bg-muted rounded-md flex items-center justify-center ${category.image ? 'hidden fallback-icon' : ''}`}>
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={category.description}>
                    {category.description || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <CategoryFormModal
                    category={category}
                    onSubmit={handleUpdate}
                    trigger={
                      <Button size="sm" variant="outline" className="cursor-pointer">
                        Edit
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="cursor-pointer hover:bg-destructive/70">
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Yakin ingin menghapus category "{category.name}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak bisa dibatalkan. Data akan hilang
                          permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}