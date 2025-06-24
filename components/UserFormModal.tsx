"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  username: string;
}

interface Props {
  user?: User;
  trigger: React.ReactNode;
  onSubmit: (data: User) => void;
}

export default function UserFormModal({ user, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    password: "", // Fix: set empty string instead of email
    username: user?.username || "",
    id: user?.id || "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Validation
    if (!form.name.trim()) {
      alert("Nama harus diisi");
      return;
    }
    if (!form.username.trim()) {
      alert("Username harus diisi");
      return;
    }
    if (!form.email.trim()) {
      alert("Email harus diisi");
      return;
    }
    if (!user && !form.password?.trim()) {
      alert("Password harus diisi untuk user baru");
      return;
    }

    // Remove password from update if empty
    const submitData = { ...form };
    if (user && !submitData.password?.trim()) {
      delete submitData.password;
    }

    onSubmit(submitData);
    setOpen(false);
    
    // Reset form
    setForm({
      name: "",
      email: "",
      password: "",
      username: "",
      id: "",
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form when opening
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        username: user?.username || "",
        id: user?.id || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Tambah User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={user ? "Password (kosongkan jika tidak diubah)" : "Password"}
              value={form.password}
              onChange={handleChange}
              className="pr-10"
              required={!user}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {user ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}