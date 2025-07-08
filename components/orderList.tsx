"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { fetchOrder } from "@/lib/api"; // pastikan path benar
import OrderFormModal from "./orderFormModal";

export default function DaftarOrder() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrder();
        setOrders(data);
      } catch (err) {
        console.error("Gagal fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    // Tambahkan logika hapus API kalau sudah ada endpoint
    setOrders((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  const handleAdd = (newData: any) => {
    const fakeId = Math.random().toString(36).substr(2, 9);
    const newOrder = {
      id: fakeId,
      customer: { customer_name: newData.customer_name },
      barang: { nama_barang: newData.nama_barang },
      jumlah_barang: Number(newData.jumlah_barang),
      total: Number(newData.total),
      order_date: newData.order_date,
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Order</h2>
        <OrderFormModal
          onSubmit={handleAdd}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Tanggal Order</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.customer?.customer_name}</TableCell>
              <TableCell>{order.barang?.nama_barang}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{order.jumlah_barang}</TableCell>
              <TableCell>Rp {order.total.toLocaleString("id-ID")}</TableCell>
              <TableCell className="text-right space-x-2">
                <OrderFormModal
                  order={order}
                  onSubmit={() => {}}
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
                        Yakin ingin menghapus order ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(order.id)}
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
