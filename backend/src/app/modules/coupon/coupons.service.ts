import { Coupon, UserRole } from "@prisma/client";
import prisma from "../../constants/prisma_constructor";
import { IServiceReturn } from "../../interfaces/service_return_type";
import { ProductsConstants } from "../products/products.constant";
import { JwtPayload } from "jsonwebtoken";

async function getAllCouponsFromDb(user: JwtPayload): Promise<IServiceReturn> {
  let whereCondition = undefined;

  if (user.role === "VENDOR") {
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: user.email,
      },
      select: { id: true },
    });

    if (!vendor) {
      return {
        status: 404,
        success: false,
        message: "Vendor not found",
        data: null,
      };
    }

    whereCondition = { product: { vendorId: vendor.id } };
  }

  const result = await prisma.coupon.findMany({
    where: {
      expiryDate: {
        gt: new Date(),
      },
      isDeleted: false,
      ...whereCondition,
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  return {
    status: 200,
    success: true,
    message: `Coupons retrieved successfully for ${
      user.role === UserRole.ADMIN ? "Admin" : "Vendor"
    }`,
    data: result,
  };
}

async function getSingleCouponFromDb(
  payload: Partial<Coupon>
): Promise<IServiceReturn> {
  const result = await prisma.coupon.findFirst({
    where: {
      code: payload.code as string,
      productId: payload.productId as string,
      isDeleted: false,
      expiryDate: {
        gt: new Date(),
      },
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  if (!result) {
    return {
      status: 404,
      success: false,
      message: "Invalid coupon code or expired",
      data: null,
    };
  }

  return {
    status: 200,
    success: false,
    message: "Coupon retrieve successfully",
    data: result,
  };
}

async function createNewCouponIntoDb(payload: Coupon): Promise<IServiceReturn> {
  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  if (!product) {
    return {
      status: 404,
      success: false,
      message: "Product not found or deleted",
      data: null,
    };
  }

  const isExist = await prisma.coupon.findUnique({
    where: {
      code_productId: {
        code: payload.code,
        productId: payload.productId,
      },
      isDeleted: false,
      expiryDate: {
        gt: new Date(),
      },
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  if (isExist) {
    return {
      status: 400,
      success: false,
      message: `${payload.code} is already exist`,
      data: isExist,
    };
  }

  const result = await prisma.coupon.create({
    data: payload,
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  return {
    status: 201,
    success: true,
    message: "New coupon created successfully",
    data: result,
  };
}

async function updateCouponIntoDb(
  user: JwtPayload,
  payload: Partial<Coupon>
): Promise<IServiceReturn> {
  if (payload.isDeleted) {
    return {
      status: 400,
      success: false,
      message: "Operation Not Allowed",
      data: null,
    };
  }

  const isExist = await prisma.coupon.findUnique({
    where: {
      code_productId: {
        code: payload.code as string,
        productId: payload.productId as string,
      },
      isDeleted: false,
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  if (!isExist) {
    return {
      status: 404,
      success: false,
      message: "Coupon not found with that productId and code",
      data: null,
    };
  }

  if (user.role === UserRole.VENDOR) {
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: user.email,
        isBlackListed: false,
      },
    });

    if (!vendor) {
      return {
        status: 400,
        success: false,
        message: "Coupon owner not exist or black listed",
        data: null,
      };
    }

    if (isExist.product.vendor.id !== vendor.id) {
      return {
        status: 401,
        success: false,
        message: "You cannot update another vendor's coupon",
        data: null,
      };
    }
  }

  const result = await prisma.coupon.update({
    where: {
      code_productId: {
        code: payload.code as string,
        productId: payload.productId as string,
      },
    },
    data: payload,
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  return {
    status: 200,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  };
}

async function deleteCouponFromDb(
  user: JwtPayload,
  payload: Partial<Coupon>
): Promise<IServiceReturn> {
  const isExist = await prisma.coupon.findUnique({
    where: {
      code_productId: {
        code: payload.code as string,
        productId: payload.productId as string,
      },
      isDeleted: false,
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  if (!isExist) {
    return {
      status: 404,
      success: false,
      message:
        "Coupon not found with that productId and code or already deleted",
      data: null,
    };
  }

  if (user.role === UserRole.VENDOR) {
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: user.email,
        isBlackListed: false,
      },
    });

    if (!vendor) {
      return {
        status: 400,
        success: false,
        message: "Coupon owner not exist or black listed",
        data: null,
      };
    }

    if (isExist.product.vendor.id !== vendor.id) {
      return {
        status: 401,
        success: false,
        message: "You cannot update another vendor's coupon",
        data: null,
      };
    }
  }

  const result = await prisma.coupon.update({
    where: {
      code_productId: {
        code: payload.code as string,
        productId: payload.productId as string,
      },
    },
    data: {
      isDeleted: true,
    },
    include: ProductsConstants.productCategoryIncludeObjForCoupon,
  });

  return {
    status: 200,
    success: true,
    message: "Coupon deleted successfully",
    data: result,
  };
}

export const CouponServices = {
  createNewCouponIntoDb,
  updateCouponIntoDb,
  deleteCouponFromDb,
  getAllCouponsFromDb,
  getSingleCouponFromDb,
};
