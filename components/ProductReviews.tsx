"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import type { Review } from "@/lib/reviews";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, loading: authLoading } = useAuth();
  const {
    reviews,
    myReview,
    submitReview,
    updateReview,
    deleteReview,
    average,
    count,
  } = useReviews();

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit review state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // React Hook Form for submitting review
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      rating: 5,
      comment: "",
    },
  });

  // Keep form productId in sync if productId changes
  useEffect(() => {
    reset({
      product_id: productId,
      rating: 5,
      comment: "",
    });
  }, [productId, reset]);

  // Handle submit new review
  const onSubmit = async (data: ReviewInput) => {
    setGeneralError(null);
    setSuccessMessage(null);

    const res = await submitReview(data.rating, data.comment);
    if (res.error) {
      setGeneralError(res.error);
    } else {
      setSuccessMessage("Cảm ơn bạn! Đánh giá đã được gửi thành công.");
      reset({
        product_id: productId,
        rating: 5,
        comment: "",
      });
    }
  };

  // Start editing own review
  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditError(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditError(null);
  };

  // Save updated review
  const handleSaveEdit = async () => {
    if (editRating < 1 || editRating > 5) {
      setEditError("Đánh giá phải từ 1 đến 5 sao");
      return;
    }
    const trimmed = editComment.trim();
    if (!trimmed) {
      setEditError("Nội dung nhận xét không được để trống");
      return;
    }
    if (trimmed.length > 500) {
      setEditError("Nội dung nhận xét không được quá 500 ký tự");
      return;
    }

    setIsUpdating(true);
    setEditError(null);
    setGeneralError(null);

    const res = await updateReview(editRating, trimmed);
    setIsUpdating(false);

    if (res.error) {
      setEditError(res.error);
    } else {
      setEditingId(null);
      setSuccessMessage("Đã cập nhật đánh giá thành công!");
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;

    setIsDeleting(true);
    setGeneralError(null);

    const res = await deleteReview();
    setIsDeleting(false);

    if (res.error) {
      setGeneralError(res.error);
    } else {
      setSuccessMessage("Đã xóa đánh giá thành công.");
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Section Header & Summary ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Đánh giá từ khách hàng
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Xem những gì người mua khác nói về sản phẩm này
          </p>
        </div>

        {/* Rating Average & Count */}
        <div className="flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-baseline gap-1.5">
            <span
              data-testid="rating-average"
              className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white"
            >
              {average}
            </span>
            <span className="text-yellow-400 text-lg">★</span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 border-l border-zinc-300 dark:border-zinc-700 pl-3">
            <div>Tổng số</div>
            <div>
              <span
                data-testid="review-count"
                className="font-bold text-zinc-900 dark:text-zinc-200"
              >
                {count}
              </span>{" "}
              đánh giá
            </div>
          </div>
        </div>
      </div>

      {/* ── Global Alerts (Error & Success) ─────────────────────────────────── */}
      {generalError && (
        <div
          data-testid="error-review"
          className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300 flex items-start gap-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">{generalError}</div>
          <button
            onClick={() => setGeneralError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div
          data-testid="review-success"
          className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Auth / Form Area ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        {!user ? (
          /* Not Logged In -> Show login link */
          <div className="py-4 text-center space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Bạn cần đăng nhập để gửi đánh giá và nhận xét về sản phẩm.
            </p>
            <div>
              <Link
                href="/login"
                data-testid="link-login-to-review"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Đăng nhập để đánh giá
              </Link>
            </div>
          </div>
        ) : myReview ? (
          /* Already Reviewed -> Hide creation form, notify user */
          <div className="py-2 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Bạn đã đánh giá sản phẩm này ({myReview.rating} sao). Bạn có thể
              chỉnh sửa hoặc xóa đánh giá của mình bên dưới.
            </span>
          </div>
        ) : (
          /* Logged in & Not Reviewed -> Show review-form */
          <form
            data-testid="review-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Viết đánh giá của bạn
            </h3>

            <input type="hidden" {...register("product_id", { valueAsNumber: true })} />

            {/* Rating select */}
            <div>
              <label
                htmlFor="input-rating"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Đánh giá số sao
              </label>
              <select
                id="input-rating"
                data-testid="input-rating"
                {...register("rating", { valueAsNumber: true })}
                className="w-full sm:w-60 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value={5}>5 ★★★★★ (Rất tốt)</option>
                <option value={4}>4 ★★★★☆ (Tốt)</option>
                <option value={3}>3 ★★★☆☆ (Bình thường)</option>
                <option value={2}>2 ★★☆☆☆ (Tệ)</option>
                <option value={1}>1 ★☆☆☆☆ (Rất tệ)</option>
              </select>
              {errors.rating && (
                <p
                  data-testid="error-rating"
                  className="mt-1 text-xs font-medium text-red-500"
                >
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Comment textarea */}
            <div>
              <label
                htmlFor="input-comment"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Nhận xét chi tiết (1 - 500 ký tự)
              </label>
              <textarea
                id="input-comment"
                data-testid="input-comment"
                rows={3}
                placeholder="Chia sẻ cảm nhận về chất lượng, đóng gói, trải nghiệm thực tế..."
                {...register("comment")}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
              />
              {errors.comment && (
                <p
                  data-testid="error-comment"
                  className="mt-1 text-xs font-medium text-red-500"
                >
                  {errors.comment.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-1">
              <button
                type="submit"
                data-testid="btn-submit-review"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Reviews List ────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div
            data-testid="reviews-empty"
            className="text-center py-12 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50"
          >
            <div className="text-3xl mb-2 text-zinc-300 dark:text-zinc-600">
              💬
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => {
              const isMine = user?.id === rev.user_id;
              const isCurrentlyEditing = editingId === rev.id;

              return (
                <div
                  key={rev.id}
                  data-testid="review-item"
                  className={`p-5 rounded-2xl border transition-all ${
                    isMine
                      ? "border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
                  }`}
                >
                  {isCurrentlyEditing ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                          Chỉnh sửa đánh giá của bạn
                        </span>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="text-xs text-zinc-400 hover:text-zinc-600"
                        >
                          ✕ Hủy
                        </button>
                      </div>

                      {editError && (
                        <p className="text-xs text-red-500 font-medium">
                          {editError}
                        </p>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          Số sao:
                        </label>
                        <select
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100"
                        >
                          <option value={5}>5 ★★★★★</option>
                          <option value={4}>4 ★★★★☆</option>
                          <option value={3}>3 ★★★☆☆</option>
                          <option value={2}>2 ★★☆☆☆</option>
                          <option value={1}>1 ★☆☆☆☆</option>
                        </select>
                      </div>

                      <div>
                        <textarea
                          rows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={isUpdating}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                          {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                            {rev.author?.[0]?.toUpperCase() ?? "U"}
                          </div>
                          <span
                            data-testid="review-author"
                            className="font-semibold text-sm text-zinc-900 dark:text-zinc-100"
                          >
                            {rev.author}
                          </span>
                          {isMine && (
                            <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                              Của bạn
                            </span>
                          )}
                        </div>

                        {/* Star rating badge */}
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/40 px-2 py-0.5 rounded-md text-xs font-bold text-yellow-700 dark:text-yellow-400">
                          <span data-testid="review-rating">{rev.rating}</span>
                          <span>★</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <p
                        data-testid="review-comment"
                        className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed"
                      >
                        {rev.comment}
                      </p>

                      {/* Created date & Actions */}
                      <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80">
                        <span>
                          {new Date(rev.created_at).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        {isMine && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              data-testid="btn-edit-review"
                              onClick={() => startEditing(rev)}
                              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              Sửa
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              data-testid="btn-delete-review"
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? "Đang xóa..." : "Xóa"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
