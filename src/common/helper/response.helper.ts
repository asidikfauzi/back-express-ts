import { Response } from 'express';

interface Header {
    process_time: number,
    status: boolean,
    status_code: number,
    reason: string
    message: { [key : string]: any }
}

interface APIResponse {
    header: Header;
    data?: any;
    paginate?: ResponsePaginate;
}

export interface ResponsePaginate {
    page: number,
    limit: number,
    total_page: number,
    total_data: number,
}

export function NewResponse(
    status: boolean,
    code: number,
    reason: string,
    message: Record<string, any>,
    data: any,
    paginate: ResponsePaginate | null,
    startTime: Date
): APIResponse {
    const currentTime = new Date().getTime();
    const processTime = (currentTime - startTime.getTime()) / 1000;

    const header: Header = {
        process_time: processTime,
        status: status,
        status_code: code,
        reason: reason,
        message: message
    };

    const response: APIResponse = {
        header: header,
    };

    if (data !== null) {
        response.data = data
    }

    if (paginate !== null) {
        response.paginate = paginate;
    }

    return response;
}

export function ResponseAPI(
    res: Response,
    status: boolean,
    code: number,
    reason: string,
    message: Record<string, any>,
    startTime: Date
): void {
    const response = NewResponse(status, code, reason, message, null, null, startTime);
    res.status(code).json(response);
}

export function ResponseDataAPI(
    res: Response,
    status: boolean,
    code: number,
    reason: string,
    message: Record<string, any>,
    data: any,
    startTime: Date
): void {
    const response = NewResponse(status, code, reason, message, data, null, startTime);
    res.status(code).json(response);
}

export function ResponseDataPaginationAPI(
    res: Response,
    status: boolean,
    code: number,
    reason: string,
    message: Record<string, any>,
    data: any,
    paginate: ResponsePaginate,
    startTime: Date
): void {
    const response = NewResponse(status, code, reason, message, data, paginate, startTime);
    res.status(code).json(response);
}
