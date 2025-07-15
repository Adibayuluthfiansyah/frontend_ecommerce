"use client";

import { useEffect, useState } from "react";
import { fetchDashboardCounts } from "@/lib/api";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const [counts, setCounts] = useState({
    users: 0,
    customers: 0,
    barangs: 0,
    orders: 0,
    total_pendapatan: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardCounts();
        setCounts(data);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pengguna</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {counts.users}
          </CardTitle>
          <CardAction>
            <Badge className="bg-green-500 text-white">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Total pengguna terdaftar</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Customer Baru</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {counts.customers}
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconTrendingDown />
              -5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Penurunan bulan ini <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Butuh penambahan prospek</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jumlah Barang</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {counts.barangs}
          </CardTitle>
          <CardAction>
            <Badge className="bg-green-500 text-white">
              <IconTrendingUp />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Stok meningkat <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Manajemen gudang optimal</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Order</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {counts.orders}
          </CardTitle>
          <CardAction>
            <Badge className="bg-green-500 text-white">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Meningkat stabil <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Pertumbuhan pemesanan</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pendapatan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp{" "}
            {Number(counts.total_pendapatan || 0).toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CardTitle>
          <CardAction>
            <Badge className="bg-green-500 text-white">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Meningkat stabil <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Pertumbuhan pendapatan</div>
        </CardFooter>
      </Card>
    </div>
  );
}
