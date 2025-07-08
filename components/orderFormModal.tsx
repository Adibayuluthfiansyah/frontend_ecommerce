"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchBarang, fetchCustomers, kurangiStokBarang } from "@/lib/api";
import { useEffect, useState } from "react";

interface OrderFormModalProps {
  onSubmit: (data: any) => void;
  order?: any;
  trigger: React.ReactNode;
}

export default function OrderFormModal({
  onSubmit,
  order = null,
  trigger,
}: OrderFormModalProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [barangs, setBarangs] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    customer_id: order?.customer?.id || "",
    id_barang: order?.barang?.id || "",
    jumlah_barang: order?.jumlah_barang || 1,
    total: order?.total || 0,
    order_date:
      order?.order_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  });
  const [hargaBarang, setHargaBarang] = useState(0); // harga per barang

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [customerData, barangData] = await Promise.all([
        fetchCustomers(),
        fetchBarang(),
      ]);
      setCustomers(customerData);
      setBarangs(barangData);
    };
    loadData();
  }, []);

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "id_barang") {
      const selected = barangs.find((b) => b.id === value);
      const harga = selected?.harga || 0;
      setHargaBarang(harga);

      setFormData((prev) => ({
        ...prev,
        total: harga * Number(prev.jumlah_barang || 1),
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "jumlah_barang") {
      const jumlah = Number(value);
      setFormData((prev) => ({
        ...prev,
        jumlah_barang: jumlah,
        total: hargaBarang * jumlah,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit ke kurangiStokBarang dengan:", {
      id_barang: formData.id_barang,
      jumlah_barang: formData.jumlah_barang,
    });
    try {
      await kurangiStokBarang(formData.id_barang, formData.jumlah_barang);
      onSubmit(formData);
      setOpen(false);
    } catch (error: any) {
      alert("Gagal: " + error.message);
      console.error("Gagal kurangi stok:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {order ? "Edit Order" : "Tambah Order"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm">Customer</label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) =>
                handleSelectChange("customer_id", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((cust) => (
                  <SelectItem key={cust.id} value={cust.id}>
                    {cust.customer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm">Barang</label>
            <Select
              value={formData.id_barang}
              onValueChange={(value) => handleSelectChange("id_barang", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Barang" />
              </SelectTrigger>
              <SelectContent>
                {barangs.map((barang) => (
                  <SelectItem key={barang.id} value={barang.id}>
                    {barang.nama_barang} - Rp {barang.harga}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm">Jumlah Barang</label>
            <input
              name="jumlah_barang"
              type="number"
              placeholder="Jumlah Barang"
              value={formData.jumlah_barang}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Total Harga
              </label>
              <div className="w-full border rounded px-3 py-2 bg-gray-100">
                Rp {formData.total.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
          <div>
            {" "}
            <label className="text-sm">Order Date</label>
            <input
              name="order_date"
              type="date"
              value={formData.order_date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button type="submit">{order ? "Simpan" : "Tambah"}</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
