"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const zod_validation_1 = __importDefault(require("../../middlewares/zod_validation"));
const users_validation_1 = require("./users.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/vendors", users_controller_1.UserControllers.getAllVendors);
router.get("/customers", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controller_1.UserControllers.getAllUsers);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), users_controller_1.UserControllers.getUser);
router.patch("/block-unblock", (0, zod_validation_1.default)(users_validation_1.UserValidations.blockUnblockUserValidationSchema), (0, auth_1.default)(client_1.UserRole.ADMIN), users_controller_1.UserControllers.blockUnblockUser);
router.get("/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), users_controller_1.UserControllers.getMyProfile);
router.post("/", (0, zod_validation_1.default)(users_validation_1.UserValidations.CreateUserValidationSchema), users_controller_1.UserControllers.createUser);
router.put("/", (0, zod_validation_1.default)(users_validation_1.UserValidations.UpdateProfileOrVendorValidationSchema), users_controller_1.UserControllers.updateProfile);
exports.UserRoutes = router;
