import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { SyntheticEvent } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  School,
  Vote,
  MapPin,
  Phone,
  Mail,
  Globe,
  Heart,
  Book,
} from "lucide-react";
import LogoSalesianos from "./media/img/logoSPC.png";
import LogoPacto from "./media/img/LOGO 2026.png";
import axios from "axios";
import Status from "./Status.tsx";
import sena from "./media/img/logoSena.png";
import bgImage from "./media/img/VOTACIONES2.png";

type Course = {
  id: string;
  name: string;
};

type VotingStage = "course" | "personero" | "consejo";

interface Candidate {
  id_candidato: string;
  nombre: string;
  grupo: string;
  biografia: string;
  foto_url: string;
}

type SubmittedVote = {
  candidateId: string;
  idempotencyKey: string;
};

type SubmittedVotes = Partial<Record<VotingStage, SubmittedVote>>;

type PendingVote = {
  stage: VotingStage;
  candidateId: string;
  idempotencyKey: string;
};

type PersistedVotingState = {
  selectedCourse: string | null;
  votingStage: VotingStage;
  votingComplete: boolean;
  sessionId: string;
  submittedVotes: SubmittedVotes;
  pendingVote: PendingVote | null;
};

const courses: Course[] = [
  { id: "3", name: "3°" },
  { id: "4", name: "4°" },
  { id: "5", name: "5°" },
  { id: "6", name: "6°" },
  { id: "7", name: "7°" },
  { id: "8", name: "8°" },
  { id: "9", name: "9°" },
  { id: "10", name: "10°" },
  { id: "11", name: "11°" },
];

const API_URL = import.meta.env.VITE_API_URL;
const VOTING_STATE_STORAGE_KEY = "votaciones_spc_voting_state_v1";
const validStages: VotingStage[] = ["course", "personero", "consejo"];

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
const apiOrigin = (() => {
  if (!apiBaseUrl) return "";
  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "";
  }
})();

const normalizeImageUrl = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) {
    const fallbackProtocol =
      typeof window !== "undefined" ? window.location.protocol : "https:";
    return `${fallbackProtocol}${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    if (apiOrigin) return `${apiOrigin}${trimmed}`;
    return trimmed;
  }
  if (apiBaseUrl) return `${apiBaseUrl}/${trimmed.replace(/^\/+/, "")}`;
  return trimmed;
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#374151">Imagen no disponible</text></svg>`,
    );
};

const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isVotingStage = (value: unknown): value is VotingStage =>
  typeof value === "string" && validStages.includes(value as VotingStage);

const loadPersistedVotingState = (): PersistedVotingState => {
  const defaultState: PersistedVotingState = {
    selectedCourse: null,
    votingStage: "course",
    votingComplete: false,
    sessionId: createSessionId(),
    submittedVotes: {},
    pendingVote: null,
  };

  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(VOTING_STATE_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);

    const parsedSubmittedVotes: SubmittedVotes = {};
    if (parsed?.submittedVotes && typeof parsed.submittedVotes === "object") {
      for (const stage of validStages) {
        const entry = parsed.submittedVotes[stage];
        if (
          entry &&
          typeof entry.candidateId === "string" &&
          typeof entry.idempotencyKey === "string"
        ) {
          parsedSubmittedVotes[stage] = {
            candidateId: entry.candidateId,
            idempotencyKey: entry.idempotencyKey,
          };
        }
      }
    }

    return {
      selectedCourse:
        typeof parsed?.selectedCourse === "string" ? parsed.selectedCourse : null,
      votingStage: isVotingStage(parsed?.votingStage)
        ? parsed.votingStage
        : "course",
      votingComplete: Boolean(parsed?.votingComplete),
      sessionId:
        typeof parsed?.sessionId === "string" && parsed.sessionId
          ? parsed.sessionId
          : defaultState.sessionId,
      submittedVotes: parsedSubmittedVotes,
      pendingVote:
        parsed?.pendingVote &&
        isVotingStage(parsed.pendingVote.stage) &&
        typeof parsed.pendingVote.candidateId === "string" &&
        typeof parsed.pendingVote.idempotencyKey === "string"
          ? parsed.pendingVote
          : null,
    };
  } catch {
    return defaultState;
  }
};

const persistVotingState = (state: PersistedVotingState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOTING_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures to keep voting flow operational.
  }
};

function App() {
  const initialPersistedState = useRef(loadPersistedVotingState()).current;

  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    initialPersistedState.selectedCourse,
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votingStage, setVotingStage] = useState<VotingStage>(
    initialPersistedState.votingStage,
  );
  const [votingComplete, setVotingComplete] = useState(
    initialPersistedState.votingComplete,
  );
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(initialPersistedState.sessionId);
  const [submittedVotes, setSubmittedVotes] = useState<SubmittedVotes>(
    initialPersistedState.submittedVotes,
  );
  const [pendingVote, setPendingVote] = useState<PendingVote | null>(
    initialPersistedState.pendingVote,
  );

  useEffect(() => {
    persistVotingState({
      selectedCourse,
      votingStage,
      votingComplete,
      sessionId,
      submittedVotes,
      pendingVote,
    });
  }, [
    selectedCourse,
    votingStage,
    votingComplete,
    sessionId,
    submittedVotes,
    pendingVote,
  ]);

  const fetchCandidates = useCallback(
    (signal?: AbortSignal) => {
      if (signal?.aborted) return;
      setLoadingCandidates(true);
      setRequestError(null);
      if (!apiBaseUrl) {
        setRequestError("VITE_API_URL no está configurada correctamente.");
        setLoadingCandidates(false);
        return;
      }

      axios
        .get(`${apiBaseUrl}/getCandidatos`, {
          signal,
          timeout: 10000,
        })
        .then((response) => {
          const normalizedCandidates = Array.isArray(response.data)
            ? response.data.map((candidate) => ({
                ...candidate,
                foto_url: normalizeImageUrl(candidate.foto_url),
              }))
            : [];

          setCandidates(normalizedCandidates);
        })
        .catch((error) => {
          if (axios.isCancel(error)) return;
          setRequestError(
            "No se pudieron cargar los candidatos. Verifica conexión con el backend y reintenta.",
          );
        })
        .finally(() => {
          setLoadingCandidates(false);
        });
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCandidates(controller.signal);
    return () => controller.abort();
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) => {
        if (votingStage === "personero") return candidate.grupo === "Personero";
        if (votingStage === "consejo") return candidate.grupo === "Consejo";
        return candidate.grupo === selectedCourse;
      }),
    [candidates, selectedCourse, votingStage],
  );

  const advanceVotingStage = useCallback(() => {
    if (votingStage === "course") {
      setVotingStage("personero");
      return;
    }
    if (votingStage === "personero") {
      setVotingStage("consejo");
      return;
    }
    setVotingComplete(true);
  }, [votingStage]);

  const isCandidateAvailableForCurrentStage = useCallback(
    (candidateId: string) =>
      filteredCandidates.some((candidate) => candidate.id_candidato === candidateId),
    [filteredCandidates],
  );

  const getCardBackgroundColor = (nombre: string) => {
    const numero = nombre.substring(0, 2);
    switch (numero) {
      case "01":
        return "bg-yellow-400";
      case "02":
        return "bg-blue-500";
      case "03":
        return "bg-red-600";
      case "04":
        return "bg-green-600";
      default:
        return "bg-white";
    }
  };

  const handleVote = (candidateId: string, persistedKey?: string) => {
    if (isSubmittingVote) return;
    if (!apiBaseUrl) {
      setVoteError("La URL del backend no está configurada.");
      return;
    }
    if (!isCandidateAvailableForCurrentStage(candidateId)) {
      setVoteError(
        "El candidato seleccionado no corresponde a la etapa actual. Recarga y vuelve a intentar.",
      );
      return;
    }

    const idempotencyKey = persistedKey ?? createSessionId();
    const alreadySubmitted = submittedVotes[votingStage];
    if (alreadySubmitted?.candidateId === candidateId) {
      advanceVotingStage();
      return;
    }

    setIsSubmittingVote(true);
    setVoteError(null);

    axios
      .post(
        `${apiBaseUrl}/create`,
        {
          id_candidato: candidateId,
          etapa: votingStage,
          curso: selectedCourse,
          session_id: sessionId,
        },
        {
          timeout: 10000,
          headers: {
            "Idempotency-Key": idempotencyKey,
            "X-Session-Id": sessionId,
          },
        },
      )
      .then(() => {
        setSubmittedVotes((prev) => ({
          ...prev,
          [votingStage]: { candidateId, idempotencyKey },
        }));
        setPendingVote(null);
        advanceVotingStage();
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setSubmittedVotes((prev) => ({
            ...prev,
            [votingStage]: { candidateId, idempotencyKey },
          }));
          setPendingVote(null);
          advanceVotingStage();
          return;
        }

        setPendingVote({
          stage: votingStage,
          candidateId,
          idempotencyKey,
        });

        if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
          setVoteError(
            "La solicitud tardó demasiado. Puedes reintentar de forma segura.",
          );
          return;
        }
        if (axios.isAxiosError(error) && !error.response) {
          setVoteError(
            "No hay conexión con el servidor. Revisa red y reintenta de forma segura.",
          );
          return;
        }
        setVoteError("No se pudo registrar el voto. Reintenta de forma segura.");
      })
      .finally(() => {
        setIsSubmittingVote(false);
      });
  };

  const resetVotingSession = () => {
    setVotingComplete(false);
    setSelectedCourse(null);
    setVotingStage("course");
    setVoteError(null);
    setPendingVote(null);
    setSubmittedVotes({});
    setSessionId(createSessionId());
  };

  return (
    <Router>
      <Routes>
        <Route path="/status" element={<Status />} />
        <Route
          path="/"
          element={
          <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative isolate"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <header className="relative z-10 bg-white/85 border-b border-white/70 shadow-lg">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                  <div className="flex items-center gap-6">
                    <img
                      src={LogoSalesianos}
                      alt="Logo Salesianos"
                      className="w-auto h-16"
                    />
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary-dark/70">
                        Democracia escolar
                      </p>
                      <h1 className="text-2xl md:text-3xl font-display font-extrabold text-primary">
                        Sistema de Votación Estudiantil 2026
                      </h1>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.35em] text-primary-dark/70">
                      Somos
                    </p>
                    <p className="text-2xl font-display font-extrabold text-primary">
                      CON
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 py-10">
              {requestError && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                  <p>{requestError}</p>
                    <button
                      type="button"
                      onClick={() => fetchCandidates()}
                      className="mt-3 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Reintentar carga de candidatos
                    </button>
                  </div>
                )}

                {voteError && (
                  <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <p>{voteError}</p>
                    {pendingVote?.stage === votingStage && (
                      <button
                        type="button"
                        disabled={isSubmittingVote}
                        onClick={() =>
                          handleVote(pendingVote.candidateId, pendingVote.idempotencyKey)
                        }
                        className="mt-3 rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reintentar envío seguro
                      </button>
                    )}
                  </div>
                )}

                {votingComplete ? (
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-2 border-secondary-yellow max-w-md">
                      <h2 className="text-2xl font-display font-bold text-primary-dark mb-4">
                        ¡Votación Completada!
                      </h2>
                      <p className="text-primary-dark/80 mb-6">
                        Has completado exitosamente tu proceso de votación.
                        Gracias por participar en la democracia estudiantil.
                      </p>
                      <button
                        onClick={resetVotingSession}
                        className="bg-gradient-to-r from-primary to-secondary-orange text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                        id="aceptar"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {loadingCandidates ? (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-6 py-3 shadow-lg">
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary-orange" />
                          <h2 className="text-2xl font-display font-bold text-primary-dark">
                            Cargando candidatos...
                          </h2>
                        </div>
                      </div>
                    ) : votingStage === "course" && !selectedCourse ? (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 p-6 shadow-xl">
                          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary-dark">
                            Selecciona tu curso
                          </h2>
                          <p className="mt-2 text-primary-dark/70">
                            Elige tu grado para continuar con la votación.
                          </p>
                          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {courses.map((course) => (
                              <button
                                key={course.id}
                                onClick={() => setSelectedCourse(course.id)}
                                className="group relative overflow-hidden rounded-2xl border-2 border-white/70 bg-white/90 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-secondary-orange focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-orange/40"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-orange/15 text-secondary-orange">
                                    <Book className="w-6 h-6" />
                                  </span>
                                  <span className="text-lg font-display font-bold text-primary-dark">
                                    {course.name}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-primary-dark/60">
                              Etapa de votación
                            </p>
                            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary-dark">
                            {votingStage === "personero"
                              ? "Selecciona tu personero"
                              : votingStage === "consejo"
                                ? "Selecciona tu representante al Consejo"
                                : "Selecciona tu Representante de Curso"}
                            </h2>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCourse(null);
                              setVotingStage("course");
                              setVoteError(null);
                            }}
                            className="bg-white/90 text-primary-dark hover:text-secondary-orange font-semibold px-4 py-2 rounded-full border-2 border-primary/60 shadow-md transition-colors duration-200"
                            id="volver"
                          >
                            Volver a cursos
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredCandidates.map((candidate) => (
                              <div
                                key={candidate.id_candidato}
                                className={`${getCardBackgroundColor(candidate.nombre)} rounded-3xl shadow-lg overflow-hidden border-2 border-white/70 transition-transform duration-200 hover:-translate-y-1`}
                              >
                                <div className="w-full h-48 flex justify-center items-center bg-white/70">
                                  <img
                                    src={candidate.foto_url}
                                    alt={candidate.nombre}
                                    loading="lazy"
                                    className="w-full h-full object-contain"
                                    style={{ aspectRatio: "4/3" }}
                                    onError={handleImageError}
                                  />
                                </div>
                                <div className="p-4">
                                  <h3 className="text-base font-display font-semibold text-black">
                                    {candidate.nombre}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {candidate.biografia}
                                  </p>
                                  <button
                                    className="mt-4 w-full bg-gradient-to-r from-primary to-secondary-orange text-white py-2.5 px-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:shadow-none"
                                    disabled={isSubmittingVote}
                                    onClick={() =>
                                      handleVote(candidate.id_candidato)
                                    }
                                  >
                                    <Vote id="votar" className="w-4 h-4" />
                                    {isSubmittingVote
                                      ? "Enviando voto..."
                                      : "Votar"}
                                  </button>
                                </div>
                              </div>
                            ))}
                          {!filteredCandidates.length && (
                            <div className="col-span-full rounded-2xl border border-white/60 bg-white/90 p-4 text-primary-dark shadow-md">
                              No hay candidatos disponibles para esta etapa. Verifica
                              la configuración del backend.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </main>

              <footer className="relative z-10 bg-white/85 mt-auto border-t border-white/70">
                <div className="max-w-7xl mx-auto px-4 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <School className="w-6 h-6 text-primary" />
                        <h3 className="text-lg font-display font-bold text-primary-dark">
                          Colegio Salesiano San Pedro Claver
                        </h3>
                      </div>
                      <div className="space-y-2 text-primary-dark/80">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Cartagena de Indias, Colombia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>+57 (605) 6600094</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>sistemas.spc@salesianos.edu.co</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <a
                            href="https://www.salesianoscartagena.edu.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark"
                          >
                            www.salesianoscartagena.edu.co
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center md:items-end space-y-3">
                      <div className="rounded-3xl bg-white shadow-lg p-3">
                        <img
                          src={LogoPacto}
                          alt="Logo Pacto"
                          className="h-16 w-auto md:h-20"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-primary-dark">
                        <span>Desarrollado con</span>
                        <Heart className="w-4 h-4 text-primary fill-current" />
                        <span>por</span>
                      </div>
                      <div
                        className="text-lg font-display font-semibold text-primary

                        "
                      >
                        Nicolas Torres
                        <img
                          src={sena}
                          alt="Logo Sena"
                          className="inline-block w-6 h-6 ml-2"
                        />
                      </div>
                      <div className="text-sm text-primary-dark/60">
                        © {new Date().getFullYear()} Todos los derechos
                        reservados
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
