import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ form: string }> }) {
    const { form } = await params;
}
