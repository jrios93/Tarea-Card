'use client'
import { useState, useRef, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

type Props = {
  onTaskCreated: () => void
}

const TaskForm = ({ onTaskCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', description: '', tags: '' })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      titleRef.current?.focus();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: formData.title,
          description: formData.description,
          created_at: formData.date || new Date().toISOString(),
          is_completed: false,
          tags: tags.length > 0 ? tags : null
        }
      ])

    if (error) {
      console.error('Error creating task:', error)
    } else {
      setOpen(false)
      setFormData({ title: '', date: '', description: '', tags: '' })
      onTaskCreated()
    }
    setIsSubmitting(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitRef.current?.click();
    }
  }

  return (
    <div className="w-full flex justify-between max-w-md mx-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='default'>Crear tarea</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear tarea</DialogTitle>
          </DialogHeader>
          <form onSubmit={createTask} className="flex flex-col gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Título de la tarea"
                ref={titleRef}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="date"
                ref={dateRef}
                placeholder="Fecha de la tarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Descripción de la tarea"
                ref={descriptionRef}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="trabajo, personal, urgente"
                ref={tagsRef}
              />
            </div>

            <Button 
              type="submit" 
              className="mt-2" 
              disabled={isSubmitting}
              ref={submitRef}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear tarea'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskForm