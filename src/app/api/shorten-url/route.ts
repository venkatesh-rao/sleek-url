import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function base62Encode(input: string) {
    const base62Chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const base62Length = base62Chars.length;

    let result = "";

    let number = 0;
    for (let i = 0; i < input.length; i++) {
        number = number * 256 + input.charCodeAt(i);
    }

    while (number > 0) {
        const remainder = number % base62Length;
        result = base62Chars[remainder] + result;
        number = Math.floor(number / base62Length);
    }

    result = result || "0";

    const ts = String(Math.floor(new Date().getTime() / 1000))
        .slice(-4)
        .split("");
    const ecd = result.slice(0, 4).split("");

    return ts
        .flatMap((el, i) => [el, ecd[i]])
        .concat(ts.slice(ecd.length))
        .join("");
}

export async function POST(request: NextRequest) {
    const { input: { original_url } } = await request.json();
    return NextResponse.json({ slug: base62Encode(original_url) })
}
