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

  // 1ページ目
  params.set(
    "page",
    "1"
  );

  // アフィリエイト
  if (affiliateId) {
    params.set(
      "affiliateId",
      affiliateId
    );
  }

  const url =
    "https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?" +
    params.toString();

  console.log(
    `楽天ランキング取得開始: ${genreName}`
  );

  const res = await fetch(url, {
    method: "GET",

    cache: "no-store",

    headers: {
      "Referer": "https://babytoku.vercel.app/",
      "User-Agent":
        "Mozilla/5.0 (compatible; BabyToku/1.0)",
      "Accept": "application/json",
    },
  });

  const text = await res.text();

  console.log(
    `楽天ランキング結果: ${genreName} ${res.status}`
  );

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
      "楽天ランキングAPIのJSON解析に失敗しました"
    );
  }

  const rawItems =
    data.Items ?? [];

  /*
   * 楽天ランキングAPIは、
   * 現在取得できたランキングの先頭から
   * 3商品を使用する。
   */
  const items = rawItems
    .slice(0, 3)
    .map((item: any) => ({
      rank: Number(item.rank),

      itemName:
        item.itemName ?? "",

      catchcopy:
        item.catchcopy ?? "",

      itemPrice:
        Number(item.itemPrice ?? 0),

      itemUrl:
        item.affiliateUrl ||
        item.itemUrl ||
        "",

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
        item.shopName ?? "",

      pointRate:
        Number(item.pointRate ?? 1),

      postageFlag:
        Number(item.postageFlag ?? 1),

      availability:
        Number(item.availability ?? 0),

      affiliateRate:
        item.affiliateRate ?? null,

      genreId:
        String(item.genreId ?? genreId),

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
    /*
     * 3ジャンルを同時取得すると
     * 楽天APIのレート制限に引っかかることがあるため、
     * 少し間隔を空けて取得する。
     */

    const diapers =
      await getRanking(
        RANKING_GENRES.diapers.genreId,
        RANKING_GENRES.diapers.name
      );

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    const formula =
      await getRanking(
        RANKING_GENRES.formula.genreId,
        RANKING_GENRES.formula.name
      );

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
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