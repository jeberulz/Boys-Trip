"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { ProfileSelectorModal } from "./ProfileSelectorModal";
import { useManager } from "./ManagerContext";
import { ProfilePhoto } from "./ProfilePhoto";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const { profileId, isManager, isLoading } = useManager();

  // Fetch current user's profile for display
  const currentProfile = useQuery(
    api.profiles.get,
    profileId ? { id: profileId } : "skip"
  );

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
          <svg width="120" height="25" viewBox="0 0 142 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.00320346 11.1156C0.0670174 10.9719 2.17686 8.40952 4.68954 5.42807L9.25622 0L16.6546 0.00798246C20.7228 0.0119737 25.2177 0.187588 26.6415 0.395132C28.0654 0.602675 30.1313 1.03373 31.2281 1.35702C32.3249 1.67632 34.032 2.54241 35.0171 3.28478C36.0062 4.02715 37.5656 5.23831 37.9007 6.40991C38.4694 7.76361 38.149 9.2357 38.4721 11.375C38.9148 14.2886 39.0983 14.7077 40.554 16.1645C41.4355 17.0425 43.5961 18.7468 44.1345 19.9561C44.43 20.6198 44.7243 21.5408 44.9831 22.8503C45.4957 25.4439 44.5786 28.0796 42.8832 30.1082L38.0084 35.941L11.0869 35.9211L20.4595 24.7775L27.9377 24.7616C35.2803 24.7456 35.408 24.7297 34.9174 23.9593C34.6422 23.5243 33.7009 22.766 32.8235 22.2671C31.4036 21.4648 30.5661 21.3491 19.263 21.0777L14.7761 26.7053C12.3073 29.7985 10.1536 32.329 9.99008 32.3329C9.82656 32.3329 8.7497 30.3573 5.50316 23.5482L14.8758 12.3728H22.1546C29.3018 12.3728 29.4254 12.3568 29.0345 11.5746C28.8152 11.1355 27.8739 10.4211 26.9406 9.98206C25.4889 9.30355 24.3921 9.1918 13.2805 9.18781L8.89328 14.7516C6.48031 17.8129 4.41833 20.3313 4.30665 20.3513C4.19897 20.3672 3.158 18.3557 1.99739 15.8771C0.836772 13.4025 -0.0606104 11.2593 0.00320346 11.1156Z" fill="#CA602E"/>
            <path d="M68.4823 13.6305C68.4823 15.7425 67.2343 16.7985 65.8183 17.2785V17.3265C67.6183 17.6385 69.1543 18.8385 69.1543 21.4065C69.1543 25.0545 66.8263 26.4705 63.2743 26.4705H54.7063V9.31046H63.0343C66.6103 9.31046 68.4823 10.7025 68.4823 13.6305ZM59.0263 16.2465H62.0023C63.2023 16.2465 64.1623 15.9585 64.1623 14.5425C64.1623 13.1265 63.2023 12.8385 62.0023 12.8385H59.0263V16.2465ZM59.0263 18.8865V22.9425H62.1223C63.9223 22.9425 64.8343 22.5105 64.8343 20.9025C64.8343 19.2945 63.9223 18.8865 62.1223 18.8865H59.0263ZM75.5918 26.8545C71.4878 26.8545 69.0158 24.1425 69.0158 20.3265C69.0158 16.5105 71.4878 13.7985 75.5918 13.7985C79.6718 13.7985 82.1438 16.5105 82.1438 20.3265C82.1438 24.1425 79.6718 26.8545 75.5918 26.8545ZM75.5918 23.9745C77.2718 23.9745 78.3038 22.7025 78.3038 20.3265C78.3038 17.9505 77.2718 16.6785 75.5918 16.6785C73.8878 16.6785 72.8558 17.9505 72.8558 20.3265C72.8558 22.7025 73.8878 23.9745 75.5918 23.9745ZM93.8295 14.1825L89.6535 26.7105C88.5975 29.8545 87.4455 30.7185 84.8535 30.7185C84.2055 30.7185 83.5095 30.6465 82.7175 30.4785V27.5985H82.7655C83.8215 27.8385 84.6855 27.7185 85.0935 27.0945C85.4535 26.5425 85.3815 25.7745 84.9975 24.6945L80.9895 14.1825H84.8295L87.6135 22.2465H87.6615L89.9895 14.1825H93.8295ZM99.5835 18.7185C102.007 19.2465 104.407 20.0625 104.407 22.8465C104.407 25.4385 102.439 26.8545 99.0315 26.8545C94.6395 26.8545 92.9595 24.8865 92.8395 22.3905H96.4395C96.5595 23.6145 97.3755 24.2145 98.8875 24.2145C99.9675 24.2145 100.567 23.8545 100.567 23.1585C100.567 22.1025 99.4155 21.9585 97.4715 21.5265C95.3835 21.0705 93.0795 20.3025 93.0795 17.7345C93.0795 15.5025 94.9995 13.7985 98.4555 13.7985C102.391 13.7985 103.927 15.7905 104.047 17.9505H100.447C100.327 16.9665 99.7995 16.4385 98.5515 16.4385C97.4715 16.4385 96.9195 16.8225 96.9195 17.4225C96.9195 18.2865 97.6875 18.3105 99.5835 18.7185ZM112.219 26.4705V12.8385H107.227V9.31046H121.507V12.8385H116.539V26.4705H112.219ZM127.167 13.9665C127.503 13.9665 127.791 13.9665 128.223 14.0625V17.4225H128.175C126.207 17.0625 124.119 18.1425 124.119 20.7585V26.4705H120.279V14.1825H124.119V16.1985H124.167C124.767 14.8305 125.823 13.9665 127.167 13.9665ZM130.386 12.7185C129.306 12.7185 128.466 12.1425 128.466 11.0145C128.466 9.91046 129.306 9.31046 130.386 9.31046C131.466 9.31046 132.306 9.91046 132.306 11.0145C132.306 12.1425 131.466 12.7185 130.386 12.7185ZM128.466 14.1825H132.306V26.4705H128.466V14.1825ZM140.625 13.7985C143.889 13.7985 145.977 16.2945 145.977 20.3265C145.977 24.3585 143.889 26.8545 140.625 26.8545C138.849 26.8545 137.553 25.8945 137.073 25.2465H137.025V30.7185H133.185V14.1825H137.025V15.4065H137.073C137.553 14.7585 138.849 13.7985 140.625 13.7985ZM139.617 23.9745C141.177 23.9745 142.137 22.7265 142.137 20.3265C142.137 17.9265 141.177 16.6785 139.617 16.6785C138.057 16.6785 137.097 17.9265 137.097 20.3265C137.097 22.7265 138.057 23.9745 139.617 23.9745Z" fill="#040303"/>
          </svg>
          <span className="text-xl">🇿🇦</span>
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

          {/* Profile Selector Button */}
          <button
            onClick={() => setShowProfileSelector(true)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-all ${
              currentProfile
                ? "bg-slate-100 hover:bg-slate-200"
                : "bg-orange-50 hover:bg-orange-100 border border-orange-200"
            }`}
            title={currentProfile ? `Logged in as ${currentProfile.name}` : "Select your profile"}
          >
            {isLoading ? (
              <Icon name="lucide:loader-2" size={16} className="animate-spin text-slate-400" />
            ) : currentProfile ? (
              <>
                <ProfilePhoto
                  photoStorageId={currentProfile.photoStorageId}
                  photoUrl={currentProfile.photoUrl}
                  name={currentProfile.name}
                  size="xs"
                  className="w-6 h-6 rounded-full object-cover"
                />
                {isManager && (
                  <Icon name="lucide:crown" size={12} className="text-orange-500" />
                )}
              </>
            ) : (
              <>
                <Icon name="lucide:user" size={14} className="text-orange-600" />
                <span className="text-xs font-medium text-orange-600">I am...</span>
              </>
            )}
          </button>

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

          {/* Mobile Profile Selector */}
          <button
            onClick={() => {
              setShowProfileSelector(true);
              closeMobileMenu();
            }}
            className={`flex items-center gap-3 py-2 text-left ${
              currentProfile
                ? "text-slate-700"
                : "text-orange-600"
            }`}
          >
            {currentProfile ? (
              <>
                <ProfilePhoto
                  photoStorageId={currentProfile.photoStorageId}
                  photoUrl={currentProfile.photoUrl}
                  name={currentProfile.name}
                  size="xs"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">
                  {currentProfile.name}
                  {isManager && " (Manager)"}
                </span>
              </>
            ) : (
              <>
                <Icon name="lucide:user-circle" size={20} />
                <span className="text-sm font-medium">Select Your Profile</span>
              </>
            )}
          </button>

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

      {/* Profile Selector Modal */}
      {showProfileSelector && (
        <ProfileSelectorModal onClose={() => setShowProfileSelector(false)} />
      )}
    </header>
  );
}
