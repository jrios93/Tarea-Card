import TaskCard from "@/components/ui/TaskCard";
import { tareas } from "@/constants";

const Home = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center gap-6 p-24 bg-slate-50">
      {/* Fondo con opacidad y blur */}
      <div className="absolute inset-0 bg-[url('/assets/images/fondo.svg')] opacity-20 bg-cover bg-center blur-sm"></div>

      {/* Contenido sobre el fondo */}
      <div className="relative flex flex-col gap-4 items-center max-w-screen-sm z-10">
        <h1 className="text-4xl font-bold text-slate-900 drop-shadow-xl">Organizate</h1>
        <p className="text-slate-600 text-center">
          Descubre una nueva forma de gestionar tus tareas con esta herramienta intuitiva y fácil de usar.
        </p>
      </div>

      <section className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-[1024px] z-10">
        {tareas.map((tarea, index) => (
          <TaskCard
            key={index}
            title={tarea.title}
            description={tarea.description}
            date={tarea.date}
            isCompleted={tarea.isCompleted}
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
