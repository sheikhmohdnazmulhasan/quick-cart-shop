"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const products_controller_1 = require("./products.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const products_validation_1 = require("./products.validation");
const zod_validation_1 = __importDefault(require("../../middlewares/zod_validation"));
const router = (0, express_1.Router)();
router.get("/", products_controller_1.ProductControllers.getAllProducts);
router.get("/compare", products_controller_1.ProductControllers.getProductsForCompare);
router.get("/:id", products_controller_1.ProductControllers.getSingleProduct);
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), (0, zod_validation_1.default)(products_validation_1.ProductValidations.createProductValidationSchema), products_controller_1.ProductControllers.createProduct);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), (0, zod_validation_1.default)(products_validation_1.ProductValidations.updateProductValidationSchema), products_controller_1.ProductControllers.updateProduct);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), products_controller_1.ProductControllers.deleteProduct);
exports.ProductRoutes = router;
