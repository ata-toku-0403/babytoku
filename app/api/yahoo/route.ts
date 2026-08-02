import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  const appId = process.env.YAHOO_CLIENT_ID;

  const url =
    `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch` +
    `?appid=${appId}` +
    `&query=${encodeURIComponent(keyword ?? "")}`;

  const res = await fetch(url);

  const text = await res.text();

  return NextResponse.json({
    status: res.status,
    body: text,
    url,
  });
}