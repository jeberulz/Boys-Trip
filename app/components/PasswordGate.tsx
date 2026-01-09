"use client";

import { useState, useEffect, ReactNode } from "react";

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
      <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏔️</div>
            <h1 className="text-4xl font-bold text-navy-600 mb-2">
              Boys Trip 2026
            </h1>
            <div className="h-1 w-24 bg-orange-500 mx-auto mb-4"></div>
            <p className="text-navy-500">
              This is a private page for trip participants only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-navy-600 font-semibold mb-2"
              >
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Enter the trip password"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Enter
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-navy-100">
            <p className="text-sm text-navy-400 text-center">
              Don't have the password? Contact the trip organizer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Add logout button that's always accessible
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-navy-600 hover:bg-navy-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition-colors"
          title="Logout"
        >
          Logout
        </button>
      </div>
      {children}
    </>
  );
}
