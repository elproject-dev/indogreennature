"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/toast"
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table"

interface ProdukItem {
 id: number
 title: string
 price: string
 src: string
 sort_order?: number
 is_active?: boolean
}

interface SortableProps {
 produk: ProdukItem
 onToggleActive: (produk: ProdukItem, checked: boolean) => void
 onEdit: (produk: ProdukItem) => void
 onMoveUp: () => void
 onMoveDown: () => void
 isFirst: boolean
 isLast: boolean
}

function SortableMobileCard({ produk, onToggleActive, onEdit, onMoveUp, onMoveDown, isFirst, isLast }: SortableProps) {
 return (
 <div className="bg-card-alt text-primary border border-primary/20 rounded-none p-4 flex gap-4 relative shadow-sm hover:shadow-md transition-all">
 <div className="flex flex-col items-center gap-1 justify-center shrink-0">
 <button
 onClick={onMoveUp}
 disabled={isFirst}
 className="p-1 text-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
 >
 <ArrowUp className="w-5 h-5" />
 </button>
 <button
 onClick={onMoveDown}
 disabled={isLast}
 className="p-1 text-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
 >
 <ArrowDown className="w-5 h-5" />
 </button>
 </div>
 <div className="w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-none border border-primary/20" onClick={() => onEdit(produk)}>
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 <div className="flex flex-1 flex-col justify-between min-w-0">
 <div onClick={() => onEdit(produk)} className="cursor-pointer space-y-1">
 <div className="font-semibold text-foreground truncate text-sm leading-tight">{produk.title}</div>
 <div className="text-xs text-primary/70 line-clamp-2 leading-snug">{produk.price}</div>
 </div>
 <div className="flex items-center justify-between mt-2 border-t border-primary/10 pt-2">
 <span className="text-xs text-primary/70">Status</span>
 <Switch
 checked={produk.is_active ?? true}
 onCheckedChange={(checked) => onToggleActive(produk, checked)}
 aria-label={`Toggle status ${produk.title}`}
 />
 </div>
 </div>
 </div>
 )
}

function SortableTableRow({ produk, onToggleActive, onEdit, onMoveUp, onMoveDown, isFirst, isLast }: SortableProps) {
 return (
 <TableRow className="border-b border-zinc-100 dark:border-zinc-800/50 transition-colors group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
 <TableCell className="text-center align-middle w-[60px] p-2">
 <div className="flex flex-col items-center gap-1">
 <button
 onClick={onMoveUp}
 disabled={isFirst}
 className="p-0.5 text-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
 >
 <ArrowUp className="w-4 h-4" />
 </button>
 <button
 onClick={onMoveDown}
 disabled={isLast}
 className="p-0.5 text-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
 >
 <ArrowDown className="w-4 h-4" />
 </button>
 </div>
 </TableCell>

 <TableCell className="p-3 align-middle cursor-pointer w-[100px]" onClick={() => onEdit(produk)}>
 <div className="w-14 h-14 overflow-hidden rounded-none mx-auto border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 </TableCell>
 <TableCell className="font-semibold text-foreground align-middle cursor-pointer" onClick={() => onEdit(produk)}>{produk.title}</TableCell>
 <TableCell className="text-primary/70 align-middle cursor-pointer" onClick={() => onEdit(produk)}>{produk.price}</TableCell>
 <TableCell className="text-center w-[120px]">
 <Switch
 checked={produk.is_active ?? true}
 onCheckedChange={(checked) => onToggleActive(produk, checked)}
 aria-label={`Toggle status ${produk.title}`}
 />
 </TableCell>
 </TableRow>
 )
}

interface ProdukSortableListProps {
 produks: ProdukItem[]
 setProduks: (items: ProdukItem[]) => void
 selectedRows: number[]
 onSelect: (id: number, checked: boolean) => void
 onEdit: (produk: ProdukItem) => void
 isSavingOrder: boolean
 setIsSavingOrder: (v: boolean) => void
 onSelectAll: (checked: boolean) => void
 isAllSelected: boolean
}

export function ProdukSortableList({
 produks,
 setProduks,
 selectedRows,
 onSelect,
 onEdit,
 isSavingOrder,
 setIsSavingOrder,
 onSelectAll,
 isAllSelected,
}: ProdukSortableListProps) {
 const handleMove = async (index: number, direction: 'up' | 'down') => {
 if (direction === 'up' && index === 0) return
 if (direction === 'down' && index === produks.length - 1) return

 const newOrder = [...produks]
 const targetIndex = direction === 'up' ? index - 1 : index + 1
 const temp = newOrder[index]
 newOrder[index] = newOrder[targetIndex]
 newOrder[targetIndex] = temp

 setProduks(newOrder)
 setIsSavingOrder(true)
 try {
 const updates = newOrder.map((p, i) =>
 supabase.from('products').update({ sort_order: i + 1 }).eq('id', p.id)
 )
 await Promise.all(updates)
 const updatedProduks = newOrder.map((p, i) => ({ ...p, sort_order: i + 1 }))
 setProduks(updatedProduks)
 toast.add({ title: 'Urutan produk berhasil disimpan', type: 'success' })
 } catch (e: any) {
 toast.add({ title: 'Gagal menyimpan urutan', description: e.message, type: 'error' })
 } finally {
 setIsSavingOrder(false)
 }
 }

 const handleToggleActive = async (produk: ProdukItem, checked: boolean) => {
 const { error } = await supabase.from('products').update({ is_active: checked }).eq('id', produk.id)
 if (!error) {
 setProduks(produks.map(p => p.id === produk.id ? { ...p, is_active: checked } : p))
 toast.add({ title:`Status produk ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: 'success' })
 } else {
 toast.add({ title: 'Gagal memperbarui status', description: error.message, type: 'error' })
 }
 }

 return (
 <div>
 {/* Mobile View */}
 <div className="flex flex-col gap-3 md:hidden mt-2">
 {produks.map((produk, index) => (
 <SortableMobileCard
 key={produk.id}
 produk={produk}
 onToggleActive={handleToggleActive}
 onEdit={onEdit}
 onMoveUp={() => handleMove(index, 'up')}
 onMoveDown={() => handleMove(index, 'down')}
 isFirst={index === 0}
 isLast={index === produks.length - 1}
 />
 ))}
 </div>

 {/* Desktop Table View */}
 <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4">
 <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
 <TableHeader className="bg-primary-soft dark:bg-background">
 <TableRow className="border-b border-primary/20 hover:bg-primary-soft/40 dark:hover:bg-primary/40">
 <TableHead className="w-[60px] text-center">Urutan</TableHead>
 <TableHead className="w-[100px] text-center font-medium">Foto</TableHead>
 <TableHead className="font-medium">Nama Produk</TableHead>
 <TableHead className="font-medium">Harga</TableHead>
 <TableHead className="text-center w-[120px] font-medium">Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {produks.map((produk, index) => (
 <SortableTableRow
 key={produk.id}
 produk={produk}
 onToggleActive={handleToggleActive}
 onEdit={onEdit}
 onMoveUp={() => handleMove(index, 'up')}
 onMoveDown={() => handleMove(index, 'down')}
 isFirst={index === 0}
 isLast={index === produks.length - 1}
 />
 ))}
 </TableBody>
 </Table>
 </div>
 </div>
 )
}
