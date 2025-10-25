import type { RequestHandler } from "express"

export const asyncHandler = (fn: any): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
