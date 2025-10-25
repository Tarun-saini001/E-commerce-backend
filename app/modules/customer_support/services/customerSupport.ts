import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { CustomerSupport } from "../models/customerSupport";
import { SUPPORT_STATUS } from "@app/config/constants";

export const CustomerSupportService = {
    createTicket: async (req: Request) => {
        const { subject, description, attachments } = req.body;
        const userId = req.user?.id;

        const refNo = `CV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const ticket = await CustomerSupport.create({
            refNo,
            userId,
            subject,
            description,
            attachments,
            status: SUPPORT_STATUS.OPEN,
        });

        return createSuccessResponse(ticket, req.t("TICKET_CREATED_SUCCESSFULLY"));
    },

    getTicket: async (req: Request) => {
        const ticket = await CustomerSupport.findById(req.params.id).populate("userId");
        if (!ticket) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TICKET_NOT_FOUND"));
        }
        return createSuccessResponse(ticket, req.t("TICKET_FETCHED_SUCCESSFULLY"));
    },

    updateTicket: async (req: Request) => {
        const body = req.body;
        const ticket = await CustomerSupport.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!ticket) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TICKET_NOT_FOUND"));
        }
        return createSuccessResponse(ticket, req.t("TICKET_UPDATED_SUCCESSFULLY"));
    },

    deleteTicket: async (req: Request) => {
        const ticket = await CustomerSupport.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TICKET_NOT_FOUND"));
        }
        return createSuccessResponse(ticket, req.t("TICKET_DELETED_SUCCESSFULLY"));
    },

    listTickets: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.userId) query.userId = req.query.userId;

        const tickets = await CustomerSupport.paginate(query, options);
        return createSuccessResponse(tickets, req.t("TICKET_LIST_FETCHED_SUCCESSFULLY"));
    },

    sendMessage: async (req: Request) => {
        const { message } = req.body;
        const sender = req.user?._id;
        const ticketId = req.params.id;

        const ticket = await CustomerSupport.findById(ticketId);
        if (!ticket) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TICKET_NOT_FOUND"));
        }

        ticket.conversation.push({
            sender,
            message,
            timestamp: new Date(),
        });

        await ticket.save();
        return createSuccessResponse(ticket, req.t("MESSAGE_SENT_SUCCESSFULLY"));
    },

    deleteMessage: async (req: Request) => {
        const { messageId } = req.params;
        const ticketId = req.params.id;

        const ticket = await CustomerSupport.findById(ticketId);
        if (!ticket) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TICKET_NOT_FOUND"));
        }

        const initialLength = ticket.conversation.length;
        ticket.conversation = ticket.conversation.filter(
            (msg: any) => msg._id.toString() !== messageId
        );

        if (ticket.conversation.length === initialLength) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("MESSAGE_NOT_FOUND"));
        }

        await ticket.save();
        return createSuccessResponse(ticket, req.t("MESSAGE_DELETED_SUCCESSFULLY"));
    },
};
