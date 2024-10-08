import { Request, Response } from "express";

export default interface Route {
    getHandler(): (request: Request, response: Response) => Promise<void>;
    getPath(): string;
    getMethod(): HttpMethod;
}

export type HttpMethod = "get" | "post";

export const HttpMethod = {
    GET: "get" as HttpMethod,
    POST: "post" as HttpMethod,
    DELETE: "delete" as HttpMethod,
} as const;