"use client";

import { useState, useEffect, ReactNode } from "react";
import { Header } from "./Header";
import { Icon } from "./Icon";

interface PasswordGateProps {
  children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("boys-trip-auth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || "boysTrip2026";

    if (password === correctPassword) {
      localStorage.setItem("boys-trip-auth", "authenticated");
      setIsAuthenticated(true);
    } else {
      setError("Incorrect password. Try again!");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("boys-trip-auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon name="lucide:loader-2" size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-10 max-w-sm w-full animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-semibold text-lg tracking-tighter">
              BT
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
              Boys Trip 2026
            </h1>
            <p className="text-sm text-slate-500">
              Private access for trip participants
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors text-sm"
                placeholder="Enter the trip password"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Enter
              <Icon name="lucide:arrow-right" size={16} />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Don&apos;t have the password? Contact the trip organizer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onLogout={handleLogout} />
      <main className="max-w-5xl mx-auto bg-white min-h-screen shadow-sm border-x border-slate-100">
        {children}
      </main>
    </div>
  );
}
