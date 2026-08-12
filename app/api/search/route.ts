import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") ?? "";

  // 楽天API
  const rakutenAppId = process.env.RAKUTEN_APP_ID;
  const rakutenAccessKey = process.env.RAKUTEN_ACCESS_KEY;
  const rakutenAffiliateId = process.env.RAKUTEN_AFFILIATE_ID;


  const rakutenUrl =
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701` +
    `?format=json` +
    `&keyword=${encodeURIComponent(keyword)}` +
    `&genreId=0` +
    `&applicationId=${rakutenAppId}` +
    `&accessKey=${rakutenAccessKey}` +
    `&affiliateId=${rakutenAffiliateId}`
;

  const rakutenRes = await fetch(rakutenUrl, {
    headers: {
      Accept: "application/json",
      Origin: "https://babytoku.vercel.app",
    },
  });

  const rakutenData = await rakutenRes.json();


  // Yahoo API
  const yahooClientId = process.env.YAHOO_CLIENT_ID;

  const yahooUrl =
    `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch` +
    `?appid=${yahooClientId}` +
    `&query=${encodeURIComponent(keyword)}`;

  const yahooRes = await fetch(yahooUrl);

  const yahooData = await yahooRes.json();


  return NextResponse.json({
    rakuten: rakutenData,
    yahoo: yahooData,
  });
}