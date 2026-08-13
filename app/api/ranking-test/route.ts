import { NextResponse } from "next/server";

export async function GET() {
  const applicationId =
    process.env.RAKUTEN_APP_ID;

  const accessKey =
    process.env.RAKUTEN_ACCESS_KEY;

  const affiliateId =
    process.env.RAKUTEN_AFFILIATE_ID;

  return NextResponse.json({
    status: 200,

    environment: {
      hasApplicationId:
        !!applicationId,

      hasAccessKey:
        !!accessKey,

      hasAffiliateId:
        !!affiliateId,
    },

    request: {
      referer:
        "https://babytoku.vercel.app/",
    },
  });
}