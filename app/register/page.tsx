"use client";

import React, { useState } from "react";
import Link from "next/link";
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

export default function RegisterPage() {
  const { signUp } = useAuth(); // useContext gọi bên trong useAuth()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [authError, setAuthError] = useState(""); // Lỗi từ Supabase
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (errors.name && val.trim()) {
      setErrors((prev) => { const next = { ...prev }; delete next.name; return next; });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (errors.email && val.trim() && emailRegex.test(val.trim())) {
      setErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (errors.password && val && val.length >= 6) {
      setErrors((prev) => { const next = { ...prev }; delete next.password; return next; });
    }
    if (errors.confirmPassword && confirmPassword && val === confirmPassword) {
      setErrors((prev) => { const next = { ...prev }; delete next.confirmPassword; return next; });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (errors.confirmPassword && val && val === password) {
      setErrors((prev) => { const next = { ...prev }; delete next.confirmPassword; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); // reset Supabase error
    setSuccessMessage("");

    // ── Client-side validation (giữ nguyên từ Lab 2) ────────────────────────
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedName = name.trim();
    if (!trimmedName) newErrors.name = "Full name is required";

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // ── Gọi Supabase signUp ──────────────────────────────────────────────────
    setIsSubmitting(true);
    const { error } = await signUp(trimmedEmail, password);
    setIsSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }

    // Thành công (Confirm email đã tắt → account active ngay)
    setSuccessMessage("Registration successful");
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
              Tạo Tài Khoản Mới
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 mt-1">
              Điền các thông tin bên dưới để đăng ký tài khoản
            </CardDescription>
          </CardHeader>

          {/* Success (sau khi Supabase signUp thành công) */}
          {successMessage && (
            <div
              data-testid="form-success"
              className="mb-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center"
            >
              {successMessage}
            </div>
          )}

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
            data-testid="register-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="register-name">Họ và tên</Label>
              <Input
                id="register-name"
                type="text"
                data-testid="register-name"
                value={name}
                onChange={handleNameChange}
                placeholder="Nguyễn Văn A"
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && (
                <p data-testid="error-name" className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                data-testid="register-email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && (
                <p data-testid="error-email" className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="register-password">Mật khẩu</Label>
              <Input
                id="register-password"
                type="password"
                data-testid="register-password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Ít nhất 6 ký tự"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && (
                <p data-testid="error-password" className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="register-confirm-password"
                type="password"
                data-testid="register-confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Nhập lại mật khẩu"
                className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p data-testid="error-confirm-password" className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-testid="register-submit"
              disabled={isSubmitting}
              className="w-full mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? "Đang đăng ký…" : "Đăng ký"}
            </Button>
          </form>

          <CardFooter className="p-0 pt-6 justify-center text-sm text-zinc-500">
            <span>Đã có tài khoản? </span>
            <Link
              href="/login"
              className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Đăng nhập ngay
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
