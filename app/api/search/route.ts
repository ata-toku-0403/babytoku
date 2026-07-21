import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  const url =
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701` +
    `?format=json` +
    `&keyword=${encodeURIComponent(keyword ?? "")}` +
    `&genreId=0` +
    `&applicationId=${appId}` +
    `&accessKey=${accessKey}`;

  console.log(url);

 const res = await fetch(url, {
  headers: {
    Accept: "application/json",
    Origin: "https://babytoku.vercel.app",
  },
});

  const data = await res.json();

  console.log(data);

  return NextResponse.json(data);
}