"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface Category {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  is_active: boolean;
}

interface CategoryFormModalProps {
  category?: Category;
  onSubmit: (data: Category) => void;
  trigger: React.ReactNode;
}

export default function CategoryFormModal({
  category,
  onSubmit,
  trigger,
}: CategoryFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Category>({
    name: "",
    description: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEdit = !!category;

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          id: category.id,
          name: category.name,
          description: category.description || "",
          is_active: category.is_active,
          image: category.image,
        });
        
        // Set image preview if category has image
        if (category.image) {
          const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${category.image}`;
          setImagePreview(imageUrl);
        } else {
          setImagePreview(null);
        }
      } else {
        setFormData({
          name: "",
          description: "",
          is_active: true,
        });
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [category, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Create the final data object
      const submitData: Category = {
        ...formData,
        // If there's a new image file, you might want to handle it differently
        // For now, keeping the existing image reference
      };

      // If you need to handle file upload, you can access imageFile here
      // and create FormData if your API expects multipart/form-data
      
      await onSubmit(submitData);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: undefined }));
    
    // Clear file input
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Tambah Category Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit informasi category yang sudah ada"
              : "Masukkan informasi untuk category baru"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Category *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama category"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi category (opsional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-input">Gambar Category</Label>
            <Input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_active">Status Aktif</Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}