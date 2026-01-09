"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-semibold text-xs tracking-tighter group-hover:bg-orange-600 transition-colors">
            BT
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-900">
            Boys Trip 2026
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/gallery"
            className={`text-xs font-medium transition-colors ${
              isActive("/gallery")
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            The Crew
          </Link>
          <Link
            href="/itinerary"
            className={`text-xs font-medium transition-colors ${
              isActive("/itinerary")
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Itinerary
          </Link>
          <Link
            href="/submit"
            className={`text-xs font-medium transition-colors ${
              isActive("/submit")
                ? "text-orange-700"
                : "text-orange-600 hover:text-orange-700"
            }`}
          >
            Join
          </Link>
          <button
            onClick={onLogout}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
            title="Logout"
          >
            <Icon name="lucide:log-out" size={14} />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Toggle menu"
        >
          <Icon
            name={isMobileMenuOpen ? "lucide:x" : "lucide:menu"}
            size={20}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-2 border-t border-slate-100 pt-4 flex flex-col gap-4">
          <Link
            href="/gallery"
            onClick={closeMobileMenu}
            className={`text-sm font-medium transition-colors py-2 ${
              isActive("/gallery")
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            The Crew
          </Link>
          <Link
            href="/itinerary"
            onClick={closeMobileMenu}
            className={`text-sm font-medium transition-colors py-2 ${
              isActive("/itinerary")
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Itinerary
          </Link>
          <Link
            href="/submit"
            onClick={closeMobileMenu}
            className={`text-sm font-medium transition-colors py-2 ${
              isActive("/submit")
                ? "text-orange-700"
                : "text-orange-600 hover:text-orange-700"
            }`}
          >
            Join
          </Link>
          <button
            onClick={() => {
              onLogout();
              closeMobileMenu();
            }}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 py-2 text-left"
            title="Logout"
          >
            <Icon name="lucide:log-out" size={16} />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}
