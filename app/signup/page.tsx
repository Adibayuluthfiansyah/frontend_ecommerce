"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupForm } from "@/components/signup-form";
import { useState } from "react";

export default function SignupPage() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl">
        <DialogTitle className="text-xl">Buat Akun</DialogTitle>
        <SignupForm />
      </DialogContent>
    </Dialog>
  );
}
