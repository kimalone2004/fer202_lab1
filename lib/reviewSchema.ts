import { z } from "zod";

export const reviewSchema = z.object({
  product_id: z.number().int().positive({
    message: "Product ID phải là số nguyên dương",
  }),
  rating: z.number().int({
    message: "Đánh giá phải là số nguyên",
  }).min(1, {
    message: "Đánh giá tối thiểu là 1 sao",
  }).max(5, {
    message: "Đánh giá tối đa là 5 sao",
  }),
  comment: z.string().trim().min(1, {
    message: "Nội dung nhận xét không được để trống",
  }).max(500, {
    message: "Nội dung nhận xét không được quá 500 ký tự",
  }),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
