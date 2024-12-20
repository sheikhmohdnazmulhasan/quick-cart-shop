import { z } from "zod";

export const updateCouponValidationSchema = z.object({
  parentage: z.number().refine((value) => value > 0 && value < 100, {
    message: "Parentage must be greater than 0 and less than 100.",
  }),
  expiryDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
  }, "Expiry date cannot be in the past."),
});

export const createCouponValidationSchema = z.object({
  code: z.string().nonempty("Code is required."),
  parentage: z.number().refine((value) => value > 0 && value < 100, {
    message: "Parentage must be greater than 0 and less than 100.",
  }),
  productId: z.string().uuid("Product ID must be a valid UUID."),

  expiryDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
  }, "Expiry date cannot be in the past."),
});
