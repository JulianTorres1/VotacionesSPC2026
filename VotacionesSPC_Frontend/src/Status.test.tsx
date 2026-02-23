import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import Status from "./Status";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="responsive">{children}</div>
  ),
  BarChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Bar: () => <div data-testid="bar" />,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Status", () => {
  it("renderiza títulos de gráficas cuando API responde", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [
        { candidato: "A", grupo: "3", total_votos: 5 },
        { candidato: "B", grupo: "Personero", total_votos: 7 },
        { candidato: "C", grupo: "Consejo", total_votos: 4 },
      ],
    } as Response);

    render(<Status />);

    await waitFor(() => {
      expect(
        screen.getByText("Conteo de votos: Representantes"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Conteo de votos: Personería")).toBeInTheDocument();
    expect(screen.getByText("Conteo de votos: Consejo")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/getCandidateVotes"),
      expect.any(Object),
    );
  });

  it("muestra error cuando falla la consulta", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("network fail"),
    );

    render(<Status />);

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo cargar el estado de votaciones."),
      ).toBeInTheDocument();
    });
  });
});
