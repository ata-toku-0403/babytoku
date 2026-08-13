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

type RankingGenre = {
  name: string;
  genreId: number;
};

async function sleep(ms: number) {
  await new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function getRanking(
  genre: RankingGenre
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

  // 必須
  params.set(
    "applicationId",
    applicationId
  );

  // ランキングAPI
  params.set(
    "genreId",
    String(genre.genreId)
  );

  // JSON
  params.set(
    "format",
    "json"
  );

  // JSON format version 2
  params.set(
    "formatVersion",
    "2"
  );

  // 1ページ目
  params.set(
    "page",
    "1"
  );

  // リアルタイムランキング
  params.set(
    "period",
    "realtime"
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
    `楽天ランキング取得: ${genre.name}`
  );

  /*
   * accessKeyは公式仕様に従って
   * HTTPヘッダーで送る。
   */
  const res = await fetch(url, {
    method: "GET",

    cache: "no-store",

    headers: {
      accessKey: accessKey,
      Accept: "application/json",
    },
  });

  const text = await res.text();

  console.log(
    `楽天ランキング結果: ${genre.name} / ${res.status}`
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

  /*
   * formatVersion=2 の場合、
   *
   * data.Items
   *
   * の中にランキング商品が入る。
   */
  const rawItems =
    data.Items ?? [];

  /*
   * 上位3商品だけ使用。
   *
   * page=1なので、基本的に
   * ランキング上位から取得される。
   */
  const items =
    rawItems
      .slice(0, 3)
      .map((item: any) => ({
        rank:
          Number(item.rank ?? 0),

        itemName:
          item.itemName ?? "",

        catchcopy:
          item.catchcopy ?? "",

        itemPrice:
          Number(item.itemPrice ?? 0),

        /*
         * affiliateIdを指定しているので
         * affiliateUrlが返ってくる。
         */
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
          Number(
            item.pointRate ?? 1
          ),

        postageFlag:
          Number(
            item.postageFlag ?? 1
          ),

        availability:
          Number(
            item.availability ?? 0
          ),

        affiliateRate:
          item.affiliateRate ??
          null,

        genreId:
          String(
            item.genreId ??
            genre.genreId
          ),

        genreName:
          genre.name,
      }));

  return {
    genreId:
      genre.genreId,

    genreName:
      genre.name,

    items,
  };
}

export async function GET() {
  try {
    /*
     * 楽天APIへのアクセスを
     * 一気に3本飛ばさない。
     *
     * 429対策。
     */

    const diapers =
      await getRanking(
        RANKING_GENRES.diapers
      );

    await sleep(1500);

    const formula =
      await getRanking(
        RANKING_GENRES.formula
      );

    await sleep(1500);

    const wipes =
      await getRanking(
        RANKING_GENRES.wipes
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
            : "楽天ランキングの取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}