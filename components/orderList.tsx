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
          {orders.map((order, index) => {
            if (!order) return null;

            const customerName = order.customer?.customer_name ?? "-";
            const barangName = order.barang?.nama_barang ?? "-";
            const tanggalOrder = order.order_date
              ? new Date(order.order_date).toLocaleDateString("id-ID")
              : "-";
            const jumlah = Number(order.jumlah_barang ?? 0);
            const total = typeof order.total === "number" ? order.total : 0;

            return (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customerName}</TableCell>
                <TableCell>{barangName}</TableCell>
                <TableCell>{tanggalOrder}</TableCell>
                <TableCell>{jumlah}</TableCell>
                <TableCell>
                  Rp {Number(total).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(order.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
