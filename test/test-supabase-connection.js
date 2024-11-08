import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Faltan las variables de entorno de Supabase.");
  console.log("Contenido de process.env:", process.env);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log("Intentando conectar a Supabase...");

    // Intenta hacer una consulta para obtener todas las tareas
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      throw error;
    }

    console.log("¡Conexión exitosa a Supabase!");
    console.log("Número de tareas:", data.length);
    console.log("Tareas:");
    data.forEach((task, index) => {
      console.log(
        `${index + 1}. ${task.title} - ${
          task.is_completed ? "Completada" : "Pendiente"
        }`
      );
    });
  } catch (error) {
    console.error("Error al conectar con Supabase:", error.message);
    console.log("Detalles del error:", error);
  }
}

testConnection();
