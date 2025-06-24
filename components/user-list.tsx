"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { createUser, deleteUser, fetchUsers, updateUser } from "@/lib/api"
import { Button } from "./ui/button"
import UserFormModal from "./UserFormModal"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  username: string

}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")
    try {
    await deleteUser(id, token)
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success("User berhasil dihapus")
  } catch (err) {
    toast.error("Gagal menghapus user")
  }
  }

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token")
    const updated = await updateUser(data.id, data, token)
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
  }

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token")
    const newUser = await createUser(data, token)
    setUsers(prev => [...prev, newUser])
  }

  return (
       <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar User</h2>
        <UserFormModal onSubmit={handleCreate} trigger={
          <Button>+ Tambah</Button>
        } />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
               <TableCell className="text-right space-x-2">
               <UserFormModal
                  user={user}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">Edit</Button>
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
