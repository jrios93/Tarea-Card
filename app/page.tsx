'use client'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TaskCard from "@/components/ui/TaskCard";
import TaskForm from "@/components/ui/TaskForm";
import { Input } from "@/components/ui/input";

type Task = {
  id: number,
  title: string,
  description: string,
  created_at: string,
  is_completed: boolean,
  tags: string[] | null
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
      setFilteredTasks(data || [])
    }
  }
  
  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    setFilteredTasks(filtered)
  }, [searchTerm, tasks])

  const handleTaskUpdate = async (id: number, isCompleted: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: isCompleted })
      .eq('id', id)
    if (error) {
      console.error('Error updating task:', error)
    } else {
      fetchTasks()
    }
  }

  const handleTaskDelete = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting task:', error)
    } else {
      fetchTasks()
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center  gap-6 p-24 bg-slate-50">
      <div className="absolute inset-0 bg-[url('/assets/images/fondo.svg')] opacity-20 bg-cover bg-center blur-sm"></div>

      <div className="relative flex flex-col gap-4 items-center max-w-screen-sm z-10">
        <h1 className="text-4xl font-bold text-slate-900 drop-shadow-xl">Organizate</h1>
        <p className="text-slate-600 text-center">
          Descubre una nueva forma de gestionar tus tareas con esta herramienta intuitiva y fácil de usar.
        </p>
      </div>

      <section className="z-10 w-full max-w-md  flex items-center justify-between gap-6 mt-4">
        <Input
            type="search"
            placeholder="Buscar tareas..."
            
            value={searchTerm}
            onChange={handleSearch}
            />
       
        
          <TaskForm onTaskCreated={fetchTasks} />
       
      </section>

      <section className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-[1024px] z-10 mt-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            date={new Date(task.created_at)}
            isCompleted={task.is_completed}
            tags={task.tags}
            onTaskUpdated={handleTaskUpdate}
            onTaskDeleted={handleTaskDelete}
            onTaskEdited={fetchTasks}
          />
        ))}
      </section>
    </main>
  )
}

export default Home