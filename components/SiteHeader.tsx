"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * SiteHeader — component thứ nhất dùng useContext (qua useAuth)
 * - Logged out : hiện btn-login và btn-register
 * - Logged in  : hiện user-email và btn-logout
 */
export default function SiteHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ShopVibe
          </span>
        </Link>

        {/* Nav area */}
        <div className="flex items-center space-x-3">
          {/* While loading: show nothing to avoid flash */}
          {loading ? null : user ? (
            // ── Logged-in state ──────────────────────────────────────────
            <div className="flex items-center gap-2.5">
              <Link
                href="/account"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-zinc-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-xs"
                title="Tài khoản của tôi"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span
                  data-testid="user-email"
                  className="hidden sm:inline text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[190px] transition-colors"
                >
                  {user.email}
                </span>
              </Link>

              <Button
                data-testid="btn-logout"
                onClick={signOut}
                variant="outline"
                className="cursor-pointer gap-1.5 px-3 py-1.5 h-auto rounded-full text-xs sm:text-sm font-medium border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/80 dark:hover:bg-red-950/30 transition-all shadow-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70 group-hover:opacity-100"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                <span>Đăng xuất</span>
              </Button>
            </div>
          ) : (
            // ── Logged-out state ─────────────────────────────────────────
            <>
              <Link
                href="/login"
                data-testid="btn-login"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                data-testid="btn-register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
