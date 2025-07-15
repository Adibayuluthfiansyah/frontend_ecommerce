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
import { fetchOrder } from "@/lib/api";
import OrderWithBarangModal from "./OrderWithBarangModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { noSSR } from "next/dynamic";

export default function DaftarOrder() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = (newData: any) => {
    const fakeId = Math.random().toString(36).substr(2, 9);

    const customerName =
      newData.customer_name ??
      newData.customer?.customer_name ??
      "Customer Tidak Diketahui";

    const newOrder = {
      id: fakeId,
      customer: { customer_name: customerName },
      barang: { nama_barang: newData.nama_barang ?? "-" },
      jumlah_barang: newData.jumlah_barang ?? 0,
      total: newData.total ?? 0,
      order_date: newData.order_date,
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Order</h2>
        <OrderWithBarangModal
          onSubmit={handleAdd}
          onSuccess={loadData}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>No HP</TableHead>
            <TableHead>Tanggal Order</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            const customerName = order.customer?.customer_name ?? "-";
            const no_hp = order.customer?.no_hp ?? "-";
            const tanggalOrder = order.order_date
              ? new Date(order.order_date).toLocaleDateString("id-ID")
              : "-";
            const total = typeof order.total === "number" ? order.total : 0;

            return (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customerName}</TableCell>
                 <TableCell>{no_hp}</TableCell>
                <TableCell>{tanggalOrder}</TableCell>
                <TableCell>
                  Rp {Number(total).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <OrderDetailsModal
                    orderId={order.id}
                    trigger={<Button variant="secondary">Lihat Barang</Button>}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
