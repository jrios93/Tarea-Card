'use client'
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
import { useState } from "react"
import {  CheckIcon } from "lucide-react"


type Props ={
  title:string,
  description:string,
  date:Date,
  isCompleted:boolean
}


const TaskCard = ({title,description,date,isCompleted}:Props) => {
  const [completed, setCompleted] = useState(isCompleted)
 
  const handleClick = ()=>{
    setCompleted((prevState)=>!prevState)
   
  }
  return (
    <Card className="w-full xl:w-[320px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
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
        {completed ? (
          <CheckIcon className="text-green-700"/>
        ):(<Button variant="outline" onClick={handleClick}>Completar</Button>)}
        </div>

      </CardFooter>

</Card>

  )
}

export default TaskCard