"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  fetchCustomers,
  fetchBarang,
  createOrder,
  saveOrderDetails,
  updateOrderTotal,
} from "@/lib/api";

export default function OrderWithBarangModal({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [customers, setCustomers] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [orderDate, setOrderDate] = useState("");
  const [barangList, setBarangList] = useState<
    { id: string; nama_barang: string; jumlah: number }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(
    undefined
  );
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setOrderDate(today);

    const fetchData = async () => {
      try {
        const [custRes, barangRes] = await Promise.all([
          fetchCustomers(),
          fetchBarang(),
        ]);

        setCustomers(custRes);
        setBarangs(barangRes);

        if (custRes.length > 0) {
          setSelectedCustomer(custRes[0].id);
        }

        const initialBarangList = barangRes.map((b: any) => ({
          id: b.id,
          nama_barang: b.nama_barang,
          jumlah: 0,
        }));
        setBarangList(initialBarangList);
      } catch (err) {
        toast.error("Gagal mengambil data");
      }
    };

    fetchData();
  }, []);

  const handleSaveOrderDetails = async () => {
    if (!orderId) {
      toast.error("Order belum dibuat. Klik 'Buat Order' terlebih dahulu.");
      return;
    }

    const itemsToSave = barangList
      .filter((b) => b.jumlah > 0)
      .map((b) => ({
        id_barang: b.id,
        jumlah: b.jumlah,
      }));

    if (itemsToSave.length === 0) {
      toast.error("Minimal satu barang harus memiliki jumlah > 0");
      return;
    }

    try {
      await saveOrderDetails(orderId, itemsToSave);
      const totalHarga = barangList.reduce((sum, item) => {
        const harga = barangs.find((b: any) => b.id === item.id)?.harga ?? 0;
        return sum + harga * item.jumlah;
      }, 0);

      await updateOrderTotal(orderId, totalHarga);

      toast.success("Order details dan total berhasil disimpan");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Gagal simpan order detail:", err);
      toast.error(err?.message || "Gagal menyimpan order detail");
    }
  };

  const total = barangList.reduce((sum, item) => {
    const harga = barangs.find((b: any) => b.id === item.id)?.harga ?? 0;
    return sum + harga * item.jumlah;
  }, 0);

  const handleJumlahChange = (index: number, jumlah: number) => {
    setBarangList((prev) => {
      const updated = [...prev];
      updated[index].jumlah = jumlah;
      return updated;
    });
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      toast.error("Pilih customer terlebih dahulu");
      return;
    }

    try {
      const payload = {
        customer_id: selectedCustomer,
        order_date: orderDate,
        total: 0,
      };

      const res = await createOrder(payload);
      setOrderId(res.id); // ⬅️ PENTING: simpan orderId
      setOrderCreated(true);
      toast.success("Order berhasil dibuat");
    } catch (error) {
      toast.error("Gagal membuat order");
      console.error("Gagal membuat order:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error("Pilih customer terlebih dahulu");
      return;
    }

    const payload = {
      customer_id: selectedCustomer, // ✅ sesuai validasi backend
      order_date: orderDate,
      total,
      items: barangList
        .filter((b) => b.jumlah > 0)
        .map((b) => ({
          id: b.id,
          jumlah: b.jumlah,
        })),
    };

    try {
      const res = await createOrder(payload); // <== DI SINI
      console.log("Berhasil:", res);
      toast.success("Order berhasil disimpan");
    } catch (err: any) {
      console.error("Gagal simpan:", err);
      toast.error(err.message || "Gagal menyimpan order");
    }
  };

  const handleTambahBarisBarang = () => {
    setBarangList((prev) => [...prev, { id: "", nama_barang: "", jumlah: 0 }]);
  };

  const handlePilihBarang = (index: number, barangId: string) => {
    const barang = barangs.find((b: any) => b.id === barangId);
    if (!barang) return;

    setBarangList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        id: barang.id,
        nama_barang: barang.nama_barang,
      };
      return updated;
    });
  };

  const handleHapusBarisBarang = (index: number) => {
    setBarangList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Form Order</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Customer</Label>
            <div className="flex gap-2 items-end">
              <Select
                value={selectedCustomer}
                onValueChange={(val) => {
                  setSelectedCustomer(val);
                  const selectedData = customers.find((c: any) => c.id === val);
                  setSelectedCustomerData(selectedData || null);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Pilih Customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleCreateOrder}>
                Buat Order
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Tanggal Order</Label>
            <Input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-64"
            />
          </div>

          {orderCreated && (
            <>
              <div className="grid gap-2">
                <div className="flex justify-end mb-2">
                  <Button variant="outline" onClick={handleTambahBarisBarang}>
                    + Tambah Barang
                  </Button>
                </div>

                <div className="overflow-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Nama Barang</th>
                        <th className="p-2 text-left">Stok</th>
                        <th className="p-2 text-left">Harga</th>
                        <th className="p-2 text-left">Jumlah</th>
                        <th className="p-2 text-left">Subtotal</th>
                        <th className="p-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barangList.map((barang, index) => {
                        const selectedBarang = barangs.find(
                          (b: any) => b.id === barang.id
                        );
                        const harga = selectedBarang?.harga ?? 0;
                        const subtotal = harga * barang.jumlah;
                        const stok = selectedBarang?.jumlah ?? 0;

                        return (
                          <tr key={index} className="border-t">
                            <td className="p-2">
                              <Select
                                value={barang.id}
                                onValueChange={(val) =>
                                  handlePilihBarang(index, val)
                                }
                              >
                                <SelectTrigger className="w-64">
                                  <SelectValue placeholder="Pilih Barang" />
                                </SelectTrigger>
                                <SelectContent>
                                  {barangs.map((b: any) => (
                                    <SelectItem key={b.id} value={b.id}>
                                      {b.nama_barang}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">{stok}</td>
                            <td className="p-2">
                              Rp {harga.toLocaleString("id-ID")}
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                min={0}
                                max={stok} // ✅ batasi ke jumlah stok
                                value={barang.jumlah}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  if (val <= stok) {
                                    handleJumlahChange(index, val);
                                  } else {
                                    toast.warning(
                                      `Jumlah melebihi stok (${stok})`
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td className="p-2">
                              Rp {subtotal.toLocaleString("id-ID")}
                            </td>
                            <td className="p-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleHapusBarisBarang(index)}
                              >
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="flex justify-between items-center px-2 mt-2">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveOrderDetails}>
                      Simpan Order Details
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
