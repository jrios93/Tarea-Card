'use client'
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CheckIcon, TrashIcon} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import TaskEditForm from "./taskEditForm"


type Props = {
  id: number,
  title: string,
  description: string,
  date: Date,
  isCompleted: boolean,
  tags: string[] | null,
  onTaskUpdated: (id: number, isCompleted: boolean) => void,
  onTaskDeleted: (id: number) => void,
  onTaskEdited: () => void
}

const TaskCard = ({ id, title, description, date, isCompleted, tags, onTaskUpdated, onTaskDeleted, onTaskEdited }: Props) => {
  const [completed, setCompleted] = useState(isCompleted)
 
  const handleClick = () => {
    const newCompleted = !completed
    setCompleted(newCompleted)
    onTaskUpdated(id, newCompleted)
  }

  const handleDelete = () => {
    onTaskDeleted(id)
  }

  return (
    <Card className="w-full xl:w-[320px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
        <Separator />
      </CardHeader>

      <CardContent>
        <CardDescription>
          <p className="text-sm text-slate-600">{description}</p>
        </CardDescription>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 justify-between">
        <Separator />
        <div className="w-full flex items-center gap-2 justify-between">
          <p className="text-sm text-slate-600">{date.toDateString()}</p>
          <div className="flex items-center gap-2">
            {completed ? (
              <CheckIcon className="text-green-700"/>
            ) : (
              <Button variant="outline" onClick={handleClick}>Completar</Button>
            )}
            <TaskEditForm
              task={{ id, title, description, created_at: date.toISOString(), tags: tags || [] }} 
              onTaskUpdated={onTaskEdited} 
            />
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TaskCard