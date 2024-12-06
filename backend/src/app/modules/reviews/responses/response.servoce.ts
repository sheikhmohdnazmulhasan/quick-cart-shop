import { UserRole, VendorResponse } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../constants/prisma_constructor";
import { IServiceReturn } from "../../../interfaces/service_return_type";
import { ReviewResponseConstants } from "./response.constant";

async function responseNewReviewIntoDb(user: JwtPayload, id: string, payload: Partial<VendorResponse>): Promise<IServiceReturn> {

    const review = await prisma.review.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: ReviewResponseConstants.findReviewForResponseIncludeObj
    });
    // console.dir(review, { depth: null, colors: true });

    if (!review) {
        return {
            status: 404,
            success: false,
            message: "Review not found with that id",
            data: null
        }
    };

    if (review.product.vendor.isBlackListed) {
        return {
            status: 400,
            success: false,
            message: "Vendor back listed",
            data: null
        }
    }

    if (user.id !== review.product.vendor.user.id && user.role !== UserRole.ADMIN) {
        return {
            status: 401,
            success: false,
            message: "Permission denied. You cannot replay another vendor's review",
            data: null
        }
    }

    const _payload = {
        reviewId: id,
        vendorId: review.product.vendorId,
        ...payload
    } as VendorResponse

    const result = await prisma.vendorResponse.create({
        data: _payload,
        include: {
            vendor: true
        }
    });

    return {
        status: 201,
        success: true,
        message: "Successfully respond",
        data: result
    }

};

export const ReviewResponseServices = {
    responseNewReviewIntoDb
}