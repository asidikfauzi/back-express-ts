import { Request, Response } from "express";
import { Users } from "../../model/user.model";
import {PrismaClient} from "@prisma/client";
import {ParamPaginate} from "../../common/helper/paginate.helper";
import {
    ResponseAPI,
    ResponseDataAPI,
    ResponseDataPaginationAPI,
    ResponsePaginate
} from "../../common/helper/response.helper";

const prisma = new PrismaClient();
export const GetUsers = async (req: Request, res: Response) => {
    const startTime: Date = new Date()

    let { page, limit, order_by, direction, search } = req.query as unknown as ParamPaginate;

    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 10
    }
    if (!order_by) {
        order_by = "id"
    }
    if (!direction) {
        direction = "asc"
    }

    const users = await prisma.user.findMany({
        select: {
            name: true,
            email: true,
            createdAt: true
        },
        where: {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        orderBy: {
            [order_by]: direction
        },
        skip: (page - 1) * (limit),
        take: parseInt(limit.toString())
    })

    const totalData = users.length
    const totalPage = Math.ceil(totalData / limit)

    const paginate: ResponsePaginate = {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        total_page: totalPage,
        total_data: totalData
    }

    return ResponseDataPaginationAPI(res, true, 200, "OK", { success: "Successfully Get Data!" }, users, paginate, startTime)
}

export const ShowUsers = async (req: Request, res: Response) => {
    const startTime: Date = new Date()

    const id = req.params.id
    const idInt = parseInt(id.toString())

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            id: idInt
        }
    });

    if (!user) {
        return ResponseAPI(res, false, 404, "Not Found", { error: "ID user '"+id+"' Not Found" }, startTime)
    }

    return ResponseDataAPI(res, true, 200, "OK", { success: "Successfully Get Data !" }, user, startTime)
}