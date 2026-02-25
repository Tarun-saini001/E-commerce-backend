import cart from "../models/cart"

import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";
import { AddToCartType } from "../validations/cart";
import product from "@app/modules/products/models/product";
import { getBundleCalculation } from "./common";

export const cartService = {
    addToCart: async (req: Request) => {
        const body: AddToCartType = req.body;
        const userId = req.user?._id;
        console.log('userId: ', userId);
        const guestId = req.headers["guestid"];
        console.log('guestId: ', guestId);
        if (!userId && !guestId) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("USERID_OR_GUESTID_REQUIRED")
            );
        }
        const productData = await product.findById(body.productId)
        if (!productData) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("PRODUCT_NOT_FOUND")
            );
        }
        const quantity = body.quantity ?? 1;

        // // Check stock available or not
        // if (quantity > productData.stock) {
        //     return createErrorResponse(
        //         RESPONSE_STATUS.BAD_REQUEST,
        //         req.t("INSUFFICIENT_STOCK")
        //     );
        // }

        const query = userId ? { userId } : { guestId };
        let cartData = await cart.findOne(query);

        if (!cartData) {
            cartData = await cart.create({
                userId: userId || null,
                guestId: guestId || null,
                items: [],
            });
        }

        let existingItem = cartData.items.find(
            (i: any) => i.productId.toString() === body.productId
        );

        //product out of stock
        if (existingItem && productData.stock === 0) {
            cartData.items = cartData.items.filter(
                (i: any) => i.productId.toString() !== body.productId
            );
            await cartData.save();

            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("PRODUCT_OUT_OF_STOCK")
            );
        }

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > productData.stock) {
                existingItem.quantity = productData.stock;
                const bundle = getBundleCalculation({
                    quantity: existingItem.quantity,
                    unitPrice: existingItem.price,
                    bundle: productData.bundle
                });
                existingItem.total = bundle.total;
                existingItem.bundleDiscount = bundle.discount;
                await cartData.save();

                return createErrorResponse(
                    RESPONSE_STATUS.BAD_REQUEST,
                    req.t("STOCK_UPDATED_ONLY_X_AVAILABLE", { count: productData.stock })
                );
            }
            existingItem.quantity = newQuantity;
            const bundle = getBundleCalculation({
                quantity: existingItem.quantity,
                unitPrice: existingItem.price,
                bundle: productData.bundle
            });

            existingItem.total = bundle.total;
            existingItem.bundleDiscount = bundle.discount;
        } else {
            // NEW product added to cart
            const qtyToAdd = Math.min(quantity, productData.stock);

            const bundle = getBundleCalculation({
                quantity: qtyToAdd,
                unitPrice: productData.price,
                bundle: productData.bundle
            });

            cartData.items.push({
                productId: body.productId,
                quantity: qtyToAdd,
                price: productData.price,
                total: bundle.total,
                bundleDiscount: bundle.discount,
            });

            if (quantity > productData.stock) {
                await cartData.save();
                return createErrorResponse(
                    RESPONSE_STATUS.BAD_REQUEST,
                    req.t("STOCK_UPDATED_ONLY_X_AVAILABLE")
                );
            }
        }

        await cartData.save();

        return createSuccessResponse(cartData, req.t("PRODUCT_ADD_TO_CART_SUCCESSFULLY"))
    },
    getCart: async (req: Request) => {
        const userId = req.user?._id;
        const guestId = req.headers["guestid"];
        console.log('guestId: ', guestId);
        if (!userId && !guestId) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("USERID_OR_GUESTID_REQUIRED")
            );
        }
        const query = userId ? { userId } : { guestId };
        const cartData = await cart.findOne(query).populate({
            path: "items.productId",
            select: "-stock -__v"
        });

        if (!cartData) {
            return createSuccessResponse(
                { items: [], subTotal: 0, grandTotal: 0, discount: 0 },
                req.t("CART_ITEMS_FETCHED_SUCCESSFULLY")
            );
        }
        console.log('cartData: ', cartData);

        return createSuccessResponse(cartData, req.t("CART_ITEMS_FETCHED_SUCCESSFULLY"))
    },
    updateCart: async (req: Request) => {
        const body: AddToCartType = req.body;
        const userId = req.user?._id;
        const guestId = req.headers["guestid"];
        console.log('guestId: ', guestId);
        if (!userId && !guestId) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("USERID_OR_GUESTID_REQUIRED")
            );
        }
        const quantity = body.quantity ?? 1;
        const query = userId ? { userId } : { guestId };
        const cartData = await cart.findOne(query)
        if (!cartData) {
            return createSuccessResponse(
                { items: [], subTotal: 0, grandTotal: 0, discount: 0 },
                req.t("CART_ITEM_NOT_FOUND")
            );
        }
        let itemIndex = cartData.items.findIndex(
            (i: any) => i.productId.toString() === body.productId
        );
        if (itemIndex === -1) {
            return createSuccessResponse(
                { items: [], subTotal: 0, grandTotal: 0, discount: 0 },
                req.t("ITEM_NOT_IN_CART")
            );
        }
        if (quantity <= 0) {
            cartData.items.splice(itemIndex, 1);
        } else {
            cartData.items[itemIndex].quantity = quantity;
            cartData.items[itemIndex].total =
                quantity * cartData.items[itemIndex].price;
        }

        await cartData.save();
        return createSuccessResponse(cartData, req.t("CART_ITEMS_UPDATED_SUCCESSFULLY"))

    },
    mergeGuestCart: async (req: Request) => {
        const userId = req.user._id;
        const guestId = req.body.guestId;
        if (!guestId) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("GUESTID_REQUIRED")
            );
        }
        const guestCart = await cart.findOne({ guestId });
        if (!guestCart) {
            return createSuccessResponse(
                { items: [], subTotal: 0, grandTotal: 0, discount: 0 },
                req.t("NOTHING_TO_MERGE")
            );
        }
        const userCart = await cart.findOne({ userId });
        //convert guest cart to user cart if user cart does not exist
        if (!userCart) {
            guestCart.userId = userId;
            guestCart.guestId = null;
            await guestCart.save();
            return createSuccessResponse(guestCart, req.t("CART_MERGE_SUCCESSFULLY"))
        }

        //merge items if user cart exist
        guestCart.items.forEach((g: any) => {
            const item = userCart.items.find(
                (u: any) => u.productId.toString() === g.productId.toString()
            );
            console.log('item: ', item);
            if (item) {//increase quantity if item already present in cart
                item.quantity += g.quantity;
                item.total = item.quantity * item.price;
            } else {//push item to cart if item not present
                userCart.items.push(g);
            }
        })
        await userCart.save();
        await guestCart.deleteOne();
        return createSuccessResponse(userCart, req.t("CART_MERGE_SUCCESSFULLY"))

    }
}