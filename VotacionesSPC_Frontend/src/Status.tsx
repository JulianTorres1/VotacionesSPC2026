import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeUrl = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const fallbackProtocol =
    typeof window !== "undefined" ? window.location.protocol : "https:";
  if (trimmed.startsWith("//")) return `${fallbackProtocol}${trimmed}`;
  if (trimmed.startsWith("/")) {
    if (typeof window === "undefined") return trimmed;
    return `${window.location.origin}${trimmed}`;
  }
  return `${fallbackProtocol}//${trimmed}`;
};

const apiBaseUrl = normalizeUrl(API_URL).replace(/\/+$/, "");

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

function Status() {
  const [representantes, setRepresentantes] = useState([]);
  const [personeros, setPersoneros] = useState([]);
  const [consejo, setConsejo] = useState([]);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatus = () => {
    if (!apiBaseUrl) {
      setRequestError("VITE_API_URL no está configurada correctamente.");
      return;
    }

    setIsLoading(true);
    setRequestError(null);

    fetchWithTimeout(`${apiBaseUrl}/getCandidateVotes`, 10000)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Respuesta inválida");
        }
        // Filtrar datos por grupo
        const reps = data.filter(
          (c) =>
            c.grupo !== "Personero" &&
            c.grupo !== "Consejo" &&
            !isNaN(Number(c.grupo)), // Verifica si el grupo es un número
        );
        const pers = data.filter((c) => c.grupo === "Personero");
        const cons = data.filter((c) => c.grupo === "Consejo");

        setRepresentantes(reps);
        setPersoneros(pers);
        setConsejo(cons);
        setRequestError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setRequestError("No se pudo cargar el estado de votaciones.");
        setRepresentantes([]);
        setPersoneros([]);
        setConsejo([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Función para renderizar una gráfica
  const renderChart = (title, data) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="candidato" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_votos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-rose-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/70 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-primary">
              Estado de Votaciones
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-full mx-auto px-6 md:px-8 py-8">
        {requestError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            <p>{requestError}</p>
            <button
              type="button"
              onClick={loadStatus}
              className="mt-3 rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              Reintentar carga de estado
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-6 py-3 shadow-lg">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary-orange" />
            <div className="text-xl font-display font-semibold text-primary-dark">
              Cargando estado de votaciones...
            </div>
          </div>
        ) : (
          <>
            {renderChart("Conteo de votos: Representantes", representantes)}
            {renderChart("Conteo de votos: Personería", personeros)}
            {renderChart("Conteo de votos: Consejo", consejo)}
          </>
        )}
      </main>

      <footer className="bg-white/85 backdrop-blur-md mt-auto border-t border-white/70">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-sm text-primary-dark/60">
            © {new Date().getFullYear()} Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Status;
