import { NextResponse } from "next/server";

const RANKING_GENRES = {
  diapers: {
    name: "紙おむつ",
    genreId: 205198,
  },

  formula: {
    name: "粉ミルク",
    genreId: 401171,
  },

  wipes: {
    name: "おしりふき",
    genreId: 205194,
  },
};

async function getRanking(
  genreId: number,
  genreName: string
) {
  const applicationId =
    process.env.RAKUTEN_APP_ID;

  const accessKey =
    process.env.RAKUTEN_ACCESS_KEY;

  const affiliateId =
    process.env.RAKUTEN_AFFILIATE_ID;

  if (!applicationId) {
    throw new Error(
      "RAKUTEN_APP_ID が設定されていません"
    );
  }

  if (!accessKey) {
    throw new Error(
      "RAKUTEN_ACCESS_KEY が設定されていません"
    );
  }

  if (!affiliateId) {
    throw new Error(
      "RAKUTEN_AFFILIATE_ID が設定されていません"
    );
  }

  const params = new URLSearchParams();

  params.set(
    "applicationId",
    applicationId
  );

  params.set(
    "accessKey",
    accessKey
  );

  params.set(
    "affiliateId",
    affiliateId
  );

  params.set(
    "genreId",
    String(genreId)
  );

  params.set(
    "format",
    "json"
  );

  params.set(
    "formatVersion",
    "2"
  );

  params.set(
    "page",
    "1"
  );

  const url =
    "https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?" +
    params.toString();

  const res = await fetch(url, {
    cache: "no-store",

    headers: {
      Referer:
        "https://babytoku.vercel.app/",
    },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `楽天ランキングAPIエラー: ${res.status} ${text}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "楽天ランキングAPIのレスポンスをJSONとして解析できませんでした"
    );
  }

  const items = (data.Items ?? [])
    .slice(0, 3)
    .map((item: any) => ({
      rank: item.rank,

      itemName:
        item.itemName,

      catchcopy:
        item.catchcopy,

      itemPrice:
        Number(item.itemPrice),

      itemUrl:
        item.affiliateUrl ||
        item.itemUrl,

      affiliateUrl:
        item.affiliateUrl ||
        null,

      imageUrl:
        item.mediumImageUrls?.[0] ||
        item.smallImageUrls?.[0] ||
        null,

      mediumImageUrls:
        item.mediumImageUrls ?? [],

      shopName:
        item.shopName,

      pointRate:
        Number(item.pointRate ?? 1),

      postageFlag:
        item.postageFlag,

      availability:
        item.availability,

      affiliateRate:
        item.affiliateRate,

      genreId:
        item.genreId,

      genreName:
        genreName,
    }));

  return {
    genreId,
    genreName,
    items,
  };
}

export async function GET() {
  try {
    const diapers =
      await getRanking(
        RANKING_GENRES.diapers.genreId,
        RANKING_GENRES.diapers.name
      );

    const formula =
      await getRanking(
        RANKING_GENRES.formula.genreId,
        RANKING_GENRES.formula.name
      );

    const wipes =
      await getRanking(
        RANKING_GENRES.wipes.genreId,
        RANKING_GENRES.wipes.name
      );

    return NextResponse.json({
      status: 200,

      rankings: {
        diapers,
        formula,
        wipes,
      },
    });
  } catch (error) {
    console.error(
      "楽天ランキングAPIエラー:",
      error
    );

    return NextResponse.json(
      {
        status: 500,

        error:
          error instanceof Error
            ? error.message
            : "楽天ランキング取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}