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
import { createBarang, createCustomer, createUser, deleteBarang, deleteCustomer, deleteUser, fetchBarang, fetchCustomers, fetchUsers, updateBarang, updateCustomer, updateUser } from "@/lib/api";
import { Button } from "./ui/button";
import UserFormModal from "./UserFormModal";
import { toast } from "sonner";
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
import BarangFormModal from "./BarangFormModal";

interface Barang {
  id: number;
  nama_barang: string;
  jumlah: number;
  harga: number;
}

export default function BarangList() {
  const [barang, setBarang] = useState<Barang[]>([]);

  useEffect(() => {
    fetchBarang().then(setBarang);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteBarang(id, token);
      setBarang((prev) => prev.filter((u) => u.id !== id));
      toast.success("User berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus user");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateBarang(data.id, data, token);
      const updatedBarang = await fetchBarang();
      setBarang(updatedBarang);

      toast.success("User berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate user");
    }
  };

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);


  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createBarang(data, token);
      const updated = await fetchBarang();
      setBarang(updated);
      toast.success("User berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan user");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar User</h2>
        <BarangFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Jumlah Barang</TableHead>
            <TableHead>Harga Barang</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barang.map((barang, index) => (
            <TableRow key={barang.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{barang.nama_barang}</TableCell>
              <TableCell>{barang.jumlah}</TableCell>
               <TableCell>{formatRupiah(barang.harga)}</TableCell>
              <TableCell className="text-right space-x-2">
                <BarangFormModal
                  barang={barang}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin menghapus user ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(barang.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
