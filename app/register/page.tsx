"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (errors.name && val.trim()) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

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
      if (val && val.length >= 6) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.password;
          return next;
        });
      }
    }
    // If confirmPassword had mismatch error, check if now matched
    if (errors.confirmPassword && confirmPassword && val === confirmPassword) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.confirmPassword;
        return next;
      });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      if (val && val === password) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // 1. Full name: empty or spaces only
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Full name is required";
    }

    // 2. Email: empty / not valid
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    // 3. Password: empty / fewer than 6 characters
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // 4. Confirm Password: empty / different from password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
    } else {
      setErrors({});
      setSuccessMessage("Registration successful (demo)");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 lg:p-8">
      {/* Header bar with Back to Home button */}
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

          {/* Success Message */}
          {successMessage && (
            <div
              data-testid="form-success"
              className="mb-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center"
            >
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form
            noValidate
            data-testid="register-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Full Name Field */}
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
                <p
                  data-testid="error-name"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
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
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
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
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="register-confirm-password"
                type="password"
                data-testid="register-confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Nhập lại mật khẩu"
                className={
                  errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-red-600 dark:text-red-400 mt-1"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="register-submit"
              className="w-full mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm"
            >
              Đăng ký
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
        FER202 Lab 2 • Next.js
      </div>
    </div>
  );
}
