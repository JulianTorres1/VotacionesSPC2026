import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-md">
            <h1 className="text-2xl font-semibold text-gray-900">
              Ocurrió un error inesperado
            </h1>
            <p className="mt-3 text-gray-600">
              Recarga la página para continuar con la votación.
            </p>
            <button
              type="button"
              className="mt-5 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
              onClick={() => window.location.reload()}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
