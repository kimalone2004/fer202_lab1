"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";

/**
 * /account — Protected page
 * Component thứ hai dùng useAuth() (useContext bên trong)
 * - loading=true  → chờ (spinner nhỏ)
 * - no user       → redirect về /login
 * - has user      → hiện account-page với account-email
 */
export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Đang load session → chưa biết trạng thái, không render gì
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600" />
      </div>
    );
  }

  // Nếu chưa đăng nhập → useEffect sẽ redirect, render null để tránh flash
  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          data-testid="account-page"
          className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Avatar area */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
              {user.email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Tài Khoản Của Tôi
            </h1>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Email
              </p>
              <p
                data-testid="account-email"
                className="text-base font-semibold text-zinc-900 dark:text-zinc-100 break-all"
              >
                {user.email}
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                User ID
              </p>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all">
                {user.id}
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-zinc-400">
            FER202 Lab 3 • Supabase Auth
          </p>
        </div>
      </main>
    </div>
  );
}
