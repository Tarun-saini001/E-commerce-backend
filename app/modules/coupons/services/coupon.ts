import { addCouponType, updateCouponType } from "../validations/coupon";
import { Request } from "express";
import coupon from "../models/coupon";
import cart from "@app/modules/cart/models/cart";
import { COUPON_TYPE, RESPONSE_STATUS } from "@app/config/constants";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";

export const couponService = {
    addCoupon: async (req: Request) => {
        const body: addCouponType = req.body;

        // check coupon already exists
        const exists = await coupon.findOne({ code: body.code });
        if (exists) {
            return createErrorResponse(
                RESPONSE_STATUS.ALREADY_EXISTS,
                req.t("COUPON_ALREADY_EXISTS")
            );
        }

        // set startDate and endDate if not provided
        const today = new Date();
        body.startDate = body.startDate ? new Date(body.startDate) : today;

        if (body.endDate) {
            body.endDate = new Date(body.endDate);
        } else if (body.validityDays) {
            // optional field, if you want to support validity days (e.g., 30 days)
            const end = new Date(today);
            end.setDate(end.getDate() + body.validityDays);
            body.endDate = end;
        } else {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("END_DATE_OR_VALIDITY_REQUIRED")
            );
        }

        // activate coupon by default
        body.isActive = true;

        const newCoupon = await coupon.create(body);
        return createSuccessResponse(newCoupon, req.t("COUPON_ADDED_SUCCESSFULLY"));

    },
    applyCoupon: async (req: Request) => {
        const { couponCode } = req.body;
        const userId = req.user?._id;
        const guestId = req.headers["guestid"];
        const query = userId ? { userId } : { guestId };
        const cartData: any = await cart.findOne(query);
        //check cart have item or not
        if (!cartData || cartData.items.length === 0) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("CART_IS_EMPTY")
            );
        }

        const couponData = await coupon.findOne({ code: couponCode });
        console.log('couponData: ', couponData);
        if (!couponData) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("INVALID_COUPON")
            );
        }

        if (!couponData.isActive) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("COUPON_NOT_ACTIVE")
            );
        }

        const now = new Date();
        if (now < couponData.startDate || now > couponData.endDate) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("COUPON_EXPIRED")
            );
        }

        console.log('cartData.items: ', cartData.items);
        const subtotal = cartData.items.reduce((acc: any, items: any) => acc + items.total, 0);

        if (subtotal < couponData.minOrderAmount) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("COUPON_MIN_ORDER_NOT_MET")
            );
        }

        // calculate discount
        let discount = 0;
        if (Number(couponData.discountType) === COUPON_TYPE.PERCENTAGE) {
            discount = (subtotal * couponData.discountValue) / 100;
            console.log('discount--: ', discount);
            if (couponData.maxDiscount) {
                discount = Math.min(discount, couponData.maxDiscount);
            }
        } else {
            discount = couponData.discountValue;
        }
        console.log('discount: ', discount);

        cartData.couponCode = couponCode;
        cartData.discount = discount;
        cartData.subTotal = subtotal;
        cartData.grandTotal = subtotal - discount;

        await cartData.save();
        return createSuccessResponse(cartData, req.t("COUPON_APPLIED_SUCCESSFULLY"));
    },
    removeCoupon: async (req: Request) => {
        const userId = req.user?._id;
        const guestId = req.headers["guestid"];

        const query = userId ? { userId } : { guestId };
        const cartData: any = await cart.findOne(query);

        if (!cartData || !cartData.couponCode) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("NO_COUPON_TO_REMOVE")
            );
        }

        // restore totals
        const subtotal = cartData.items.reduce((acc: any, item: any) => acc + item.total, 0);
        cartData.couponCode = null;
        cartData.discount = 0;
        cartData.grandTotal = subtotal;

        await cartData.save();
        return createSuccessResponse(cartData, req.t("COUPON_REMOVED_SUCCESSFULLY"));
    },
    updateCoupon: async (req: Request) => {
        const id = req.params.id;
        console.log('id: ', id);
        const body: updateCouponType = req.body;
        const exist = await coupon.findById(id);
        if (!exist) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("COUPON_NOT_EXIST")
            );
        }
        const updatedCoupon = await coupon.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        return createSuccessResponse(
            updatedCoupon,
            req.t("COUPON_UPDATED_SUCCESSFULLY")
        );
    },
    coupons: async (req: Request) => {
        const id = req.query.id;
        if (id) {
            const singleCoupon = await coupon.findById(id);
            if (!singleCoupon) {
                return createErrorResponse(
                    RESPONSE_STATUS.BAD_REQUEST,
                    req.t("COUPON_NOT_EXIST")
                );
            }
            return createSuccessResponse(
                singleCoupon,
                req.t("COUPON_FETCHED_SUCCESSFULLY")
            );
        }
        const couponList = await coupon.find().sort({ createdAt: -1 });
        if (!couponList) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("COUPONS_NOT_AVAILABLE")
            )
        }
        return createSuccessResponse(
            couponList,
            req.t("COUPONS_LIST_FETCHED_SUCCESSFULLY")
        );
    }
}