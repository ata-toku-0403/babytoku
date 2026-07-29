import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  const appId = process.env.YAHOO_CLIENT_ID;

  const url =
    `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch` +
    `?appid=${appId}` +
    `&query=${encodeURIComponent(keyword ?? "")}` +
    `&results=20` +
    `&sort=+price`;

  console.log(url);

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json();

  console.log(data);

  return NextResponse.json(data);
}