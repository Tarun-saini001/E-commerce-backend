import mongoose from "mongoose";
import { PaginateResult, PaginateOptions } from "mongoose-paginate-v2";

declare module "mongoose" {
    interface Model<T> {
        paginate(
            query?: any,
            options?: PaginateOptions,
            callback?: (err: any, result: PaginateResult<T>) => void
        ): Promise<PaginateResult<T>>;
    }
}
