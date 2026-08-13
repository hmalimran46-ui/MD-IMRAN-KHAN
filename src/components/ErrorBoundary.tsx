/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleResetState = () => {
    // Try in-memory reset first to prevent infinite window.location.reload loop
    try {
      sessionStorage.clear();
    } catch (e) {
      // Ignore storage restrictions
    }
    this.setState({ hasError: false, error: null });
  };

  private handleHardReset = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      // Ignore storage restrictions
    }
    window.location.href = window.location.origin + window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0a0726] border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-bold text-xl text-white">
                MD: IMRAN KHAN
              </h1>
              <p className="font-sans text-xs text-gray-400">
                Digital Marketing Portfolio Portal
              </p>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-left w-full">
              <span className="block font-mono text-[10px] text-cyan-400 uppercase font-bold mb-1">
                System Active
              </span>
              <p className="font-sans text-xs text-gray-300 leading-relaxed">
                Click below to instantly restore the interface without reload loops.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={this.handleResetState}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-sans font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <RefreshCw className="h-4 w-4" />
                Restore Interface
              </button>

              <button
                onClick={this.handleHardReset}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-sans font-semibold text-xs hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="h-3.5 w-3.5 text-gray-400" />
                Reset & Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={null}>
      {children}
    </ErrorBoundary>
  );
}
