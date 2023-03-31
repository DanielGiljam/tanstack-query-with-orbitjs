import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export const middleware = async (request: NextRequest) =>
    NextResponse.rewrite(new URL("/test-data.json", request.url));

export const config = {
    matcher: "/test-data.json",
};
