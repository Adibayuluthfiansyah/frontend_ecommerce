"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchOrderDetails } from "@/lib/api";

export default function OrderDetailsModal({
  orderId,
  trigger,
}: {
  orderId: string;
  trigger: React.ReactNode;
}) {
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetails(orderId);
      setDetails(data);
    } catch (err) {
      console.error("Gagal fetch order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = details.reduce((sum, item) => {
    const harga = item.barang?.harga ?? 0;
    return sum + harga * item.jumlah;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o) loadDetails();
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Barang Dibeli</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : details.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada data.</p>
        ) : (
          <>
            <table className="w-full text-sm mt-4 border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Nama Barang</th>
                  <th className="text-left p-2">Jumlah</th>
                  <th className="text-left p-2">Harga</th>
                  <th className="text-left p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, index) => {
                  const harga = item.barang?.harga ?? 0;
                  const subtotal = harga * item.jumlah;
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.barang?.nama_barang ?? "-"}</td>
                      <td className="p-2">{item.jumlah}</td>
                      <td className="p-2">Rp {harga.toLocaleString("id-ID")}</td>
                      <td className="p-2">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 pr-2 text-lg font-semibold">
              Total: Rp {total.toLocaleString("id-ID")}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
