"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth(); // useContext được gọi bên trong useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState(""); // Lỗi từ Supabase
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (errors.email) {
      if (val.trim() && emailRegex.test(val.trim())) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (errors.password) {
      if (val) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.password;
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); // reset Supabase error

    // ── Client-side validation (giữ nguyên từ Lab 2) ────────────────────────
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // ── Gọi Supabase signIn ──────────────────────────────────────────────────
    setIsSubmitting(true);
    const { error } = await signIn(trimmedEmail, password);
    setIsSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }

    // Thành công → redirect về trang chủ
    router.replace("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 lg:p-8">
      {/* Header bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          ← Quay lại trang chủ
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-auto">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl overflow-hidden p-6 sm:p-8">
          <CardHeader className="text-center p-0 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Đăng Nhập
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 mt-1">
              Nhập email và mật khẩu của bạn để tiếp tục
            </CardDescription>
          </CardHeader>

          {/* Supabase error (chỉ xuất hiện khi Supabase reject) */}
          {authError && (
            <div
              data-testid="error-auth"
              className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold text-center"
            >
              {authError}
            </div>
          )}

          {/* Form */}
          <form
            noValidate
            data-testid="login-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                data-testid="login-email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Mật khẩu</Label>
              <Input
                id="login-password"
                type="password"
                data-testid="login-password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-testid="login-submit"
              disabled={isSubmitting}
              className="w-full mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </Button>
          </form>

          <CardFooter className="p-0 pt-6 justify-center text-sm text-zinc-500">
            <span>Chưa có tài khoản? </span>
            <Link
              href="/register"
              className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center text-xs text-zinc-400 py-2">
        FER202 Lab 3 • Next.js + Supabase
      </div>
    </div>
  );
}
