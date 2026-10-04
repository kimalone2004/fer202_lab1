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
            <>
              <span
                data-testid="user-email"
                className="hidden sm:inline text-sm font-medium text-zinc-600 dark:text-zinc-300 truncate max-w-[200px]"
              >
                {user.email}
              </span>
              <Button
                data-testid="btn-logout"
                onClick={signOut}
                variant="outline"
                className="cursor-pointer border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Đăng xuất
              </Button>
            </>
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
