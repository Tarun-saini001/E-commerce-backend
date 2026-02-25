import brand from "../models/brand";
import { addBrand, updateBrand } from "../validation/brand";
import { createErrorResponse ,createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";

export const brandService = {
    addBrand: async (req: Request) => {
        const body: addBrand = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if(!body.name){
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("BRAND_NAME_REQUIRED")
            );
        }
        await brand.create(body);
        let data = createSuccessResponse(req.t("BRAND_ADDED_SUCCESSFULLY"));
        return data;
    },

    brandList : async(req: Request)=>{
         const id = req.params.id
        //  const data;
        //  if(id){
        //      data = await brand.findById(id);
        //  }else{
        //       data = await brand.find();
        //  }
       const data = await brand.find();
      if(!data){
        return createErrorResponse(
            RESPONSE_STATUS.RECORD_NOT_FOUND,
            req.t("LIST_NOT_FOUND")
        );
      }
      return createSuccessResponse(data ,req.t("LIST_FETCHED_SUCCESSFULLY"))
    },

    getBrandById : async(req:Request)=>{
        const id = req.params.id ;
        if(!id){
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        const data = await brand.findById(id);
        if(!data){
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("BRAND_NOT_FOUND")
            );
        }
        return createSuccessResponse(data , req.t("CATEGOGY_FETCHED_SUCCESSFULLY"))
    },

    updateBrand : async(req:Request)=>{
        const id = req.params.id
        const body : updateBrand=req.body;
         if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if(!id){
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await brand.findByIdAndUpdate(id , body , {new:true});
        return createSuccessResponse(req.t("BRAND_UPDATED_SUCCESSFULLY"))
    },

    deleteBrand : async(req:Request)=>{
         const id = req.params.id
         if(!id){
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await brand.findOneAndDelete({_id:id});
        return createSuccessResponse(req.t("BRAND_DELETED_SUCCESSFULLY"))
    }
} 