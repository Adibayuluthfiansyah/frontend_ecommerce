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
import {
  createCustomer,
  createUser,
  deleteCustomer,
  deleteUser,
  fetchCustomers,
  fetchUsers,
  updateCustomer,
  updateUser,
} from "@/lib/api";
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
import CustomerFormModal from "./CustomerFormModal";

interface Customer {
  id: number;
  customer_name: string;
  alamat: string;
  no_hp: string;
}

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteCustomer(id, token);
      setCustomers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus user");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateCustomer(data.id, data, token);
      const updatedCustomers = await fetchCustomers();
      setCustomers(updatedCustomers);
      toast.success("Customer berhasil diupdate");
    } catch (err: any) {
      try {
        const errorData = await err.response.json(); // jika pakai fetch biasa
        const noHpError = errorData?.errors?.no_hp?.[0];

        if (noHpError?.includes("has already been taken")) {
          toast.info("Nomor handphone sudah terdaftar.");
        } else {
          toast.error("Gagal mengupdate user");
        }
      } catch (e) {
        toast.error("Gagal mengupdate user");
      }
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      console.log(data);
      await createCustomer(data, token);
      const updated = await fetchCustomers();
      setCustomers(updated);
      toast.success("User berhasil ditambahkan");
    } catch (err: any) {
           try {
        const errorData = await err.response.json(); // jika pakai fetch biasa
        const noHpError = errorData?.errors?.no_hp?.[0];

        if (noHpError?.includes("has already been taken")) {
          toast.info("Nomor handphone sudah terdaftar.");
        } else {
          toast.error("Gagal mengupdate user");
        }
      } catch (e) {
        toast.error("Gagal mengupdate user");
      }
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Customer</h2>
        <CustomerFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>No Handphone</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{customer.customer_name}</TableCell>
              <TableCell>{customer.alamat}</TableCell>
              <TableCell>{customer.no_hp}</TableCell>
              <TableCell className="text-right space-x-2">
                <CustomerFormModal
                  customer={customer}
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
                        onClick={() => handleDelete(customer.id)}
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
