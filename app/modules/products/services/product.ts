import product from "../models/product";
import { addProduct, updateProduct } from "../validation/product";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";
import mongoose from "mongoose";
import { buildDynamicFieldFilters } from "./common";
import wishList from "../models/whishList";


export const productService = {
    addProduct: async (req: Request) => {
        const body: addProduct = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if (!body.name) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("PRODUCT_NAME_REQUIRED")
            );
        }

        await product.create(body);
        return createSuccessResponse(req.t("PRODUCT_ADDED_SUCCESSFULLY"));
    },
    // -----------------------------------------------------------------
    productList: async (req: Request) => {
        let sortQuery: any = {};
        let filterQuery: any = {};

        const sortParams = Array.isArray(req.query.sort)
            ? req.query.sort
            : req.query.sort
                ? [req.query.sort]
                : [];

        sortParams.forEach((param) => {
            if (typeof param === "string") {
                const [field, order] = param.split("_");
                sortQuery[field] = order === "desc" ? -1 : 1;
            }
        });

        if (Object.keys(sortQuery).length === 0) {
            sortQuery.name = 1;
        }

        //filter                            
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

        if (minPrice !== undefined || maxPrice !== undefined) {
            filterQuery.price = {};
            if (minPrice !== undefined) filterQuery.price.$gte = minPrice;
            if (maxPrice !== undefined) filterQuery.price.$lte = maxPrice;
        }

        //search
        if (req.query.search && typeof req.query.search === "string") {
            let searchValue = req.query.search;

            if (searchValue.includes("_")) {
                searchValue = searchValue.split("_")[1];
            }

            const searchRegex = new RegExp(searchValue.trim(), "i");

            filterQuery.$or = [
                { name: searchRegex },
                { description: searchRegex }
            ];
        }

        if (req.query.categoryId && typeof req.query.categoryId === "string") {
            filterQuery.categoryId = new mongoose.Types.ObjectId(req.query.categoryId);
        }
        if (req.query.brandId && typeof req.query.brandId === "string") {
            filterQuery.brandId = new mongoose.Types.ObjectId(req.query.brandId);
        }
        if (req.query.color && typeof req.query.color === "string") {
            filterQuery.color = req.query.color;
        }

        // -----------------------------------------------------
        // ⭐ CLEAN DYNAMIC FILTER BUILDER
        // -----------------------------------------------------
        const fixedKeys = [
            "minPrice", "maxPrice", "search",
            "categoryId", "brandId", "sort", "color", "page", "limit"
        ];

        const dynamicFilters = buildDynamicFieldFilters(req.query, fixedKeys);
        if (dynamicFilters) {
            filterQuery.$and = dynamicFilters;
        }

        // fetch data
        const data = await product.find(filterQuery)
            .collation({ locale: "en", strength: 2 })
            .sort(sortQuery);
        if (!data) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("LIST_NOT_FOUND")
            );
        }
        return createSuccessResponse(data, req.t("LIST_FETCHED_SUCCESSFULLY"))
    },
    // -----------------------------------------------------------------
    getProductById: async (req: Request) => {
        const id = req.params.id;
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        const data = await product.findById(id);
        if (!data) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("PRODUCT_NOT_FOUND")
            );
        }
        return createSuccessResponse(data, req.t("CATEGOGY_FETCHED_SUCCESSFULLY"))
    },
    // -----------------------------------------------------------------
    updateProduct: async (req: Request) => {
        const id = req.params.id
        const body: updateProduct = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await product.findByIdAndUpdate(id, body, { new: true });
        return createSuccessResponse(req.t("PRODUCT_UPDATED_SUCCESSFULLY"))
    },
    //-------------------------------------------------------------------
    updateBundleOffer: async (req: Request) => {
        const { productId, isBundle, requiredQty, price, offerTitle } = req.body;

        const productData = await product.findById(productId);
        if (!productData) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("PRODUCT_NOT_FOUND"));
        }
        productData.bundle = {
            isBundle,
            requiredQty: requiredQty || 0,
            price: price || 0,
            offerTitle: offerTitle || "",
        };
        await productData.save();
        return createSuccessResponse(productData, req.t("BUNDLE_UPDATED_SUCCESSFULLY"));
    },
    // -----------------------------------------------------------------
    deleteProduct: async (req: Request) => {
        const id = req.params.id
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await product.findOneAndDelete({ _id: id });
        return createSuccessResponse(req.t("PRODUCT_DELETED_SUCCESSFULLY"))
    },

    addToWishList: async (req: Request) => {
        const userId = req.user.id
        const { productId } = req.body;
        if (!productId) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("PRODUCT_ID_REQUIRED")
            );
        }
        const productData = await product.findById(productId);
        if (!productData) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("PRODUCT_NOT_FOUND")
            );
        }
        const likedProduct = await wishList.findOneAndUpdate(
            { productId },
            { $set: { userId: userId, productId: productId } },
            { upsert: true, new: true }
        );
        await likedProduct.save();
        return createSuccessResponse(likedProduct, req.t("PRODUCT_ADDED_TO_WISHLIST_SUCCESSFULLY"));
    },

    getWishlist: async (req: Request) => {
        const userId = req.user?.id;
        const wishListData = await wishList.find({ userId: userId }).lean();
        if (!wishListData || wishListData.length === 0) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("WISHLIST_IS_EMPTY")
            );
        }
        return createSuccessResponse(wishListData, req.t("WISHLIST_FETCHED_SUCCESSFULLY"));
    }
} 