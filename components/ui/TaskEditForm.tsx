'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { PencilIcon } from "lucide-react";

type Props = {
  task: {
    id: number,
    title: string,
    description: string,
    created_at: string,
    tags: string[] | null
  },
  onTaskUpdated: () => void
}

const TaskEditForm = ({ task, onTaskUpdated }: Props) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    date: new Date(task.created_at).toISOString().split('T')[0],
    tags: task.tags ? task.tags.join(', ') : ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    const { error } = await supabase
      .from('tasks')
      .update({
        title: formData.title,
        description: formData.description,
        created_at: formData.date,
        tags: tags.length > 0 ? tags : null
      })
      .eq('id', task.id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      setOpen(false)
      onTaskUpdated()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        <form onSubmit={updateTask} className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título de la tarea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la tarea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="trabajo, personal, urgente"
            />
          </div>

          <Button type="submit" className="mt-2">
            Actualizar tarea
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskEditForm