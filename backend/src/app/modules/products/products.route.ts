import { Router } from "express";
import { ProductControllers } from "./products.controller";
import Auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProductValidations } from "./products.validation";
import ValidationRequest from "../../middlewares/zod_validation";

const router: Router = Router();

router.post('/',
    Auth(UserRole.VENDOR),
    ValidationRequest(ProductValidations.createProductValidationSchema),
    ProductControllers.createProduct)

router.patch('/:id',
    Auth(UserRole.VENDOR),
    ValidationRequest(ProductValidations.updateProductValidationSchema),
    ProductControllers.updateProduct)

export const ProductRoutes = router;