import { NextResponse } from "next/server";

// =====================================================
// 今日のランキングテーマ
// 7ジャンルを日替わりで切り替える
// =====================================================

const RANKING_THEMES = [
  {
    key: "formula",
    name: "粉ミルク",
    genreId: 401171,
    emoji: "🍼",
  },
  {
    key: "diapers",
    name: "ベビー用紙おむつ",
    genreId: 205198,
    emoji: "👶",
  },
  {
    key: "wipes",
    name: "おしりふき",
    genreId: 205194,
    emoji: "🧻",
  },
  {
    key: "bodysoap",
    name: "ベビー用ボディソープ",
    genreId: 505410,
    emoji: "🛁",
  },
  {
    key: "moisturizer",
    name: "ベビー用保湿剤",
    genreId: 401164,
    emoji: "🧴",
  },
  {
    key: "babyfood",
    name: "離乳食",
    genreId: 213980,
    emoji: "🥣",
  },
  {
    key: "babytoys",
    name: "赤ちゃん用おもちゃ",
    genreId: 201591,
    emoji: "🧸",
  },
];


// =====================================================
// 日本時間で今日のランキングテーマを決める
// =====================================================

function getTodayTheme() {
  const now = new Date();

  const japanDateString =
    new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

  const numbers =
    japanDateString.match(/\d+/g);

  if (!numbers || numbers.length < 3) {
    return RANKING_THEMES[0];
  }

  const year = Number(numbers[0]);
  const month = Number(numbers[1]);
  const day = Number(numbers[2]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  const startOfYear = new Date(
    Date.UTC(
      year,
      0,
      1
    )
  );

  const diff =
    date.getTime() -
    startOfYear.getTime();

  const dayOfYear =
    Math.floor(
      diff /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const index =
    (dayOfYear - 1) %
    RANKING_THEMES.length;

  return RANKING_THEMES[index];
}


// =====================================================
// 楽天ランキング取得
// =====================================================

async function getRanking(
  theme: {
    key: string;
    name: string;
    genreId: number;
    emoji: string;
  }
) {
  const applicationId =
    process.env.RAKUTEN_APP_ID;

  const accessKey =
    process.env.RAKUTEN_ACCESS_KEY;

  const affiliateId =
    process.env.RAKUTEN_AFFILIATE_ID;

  // ---------------------------------------------------
  // 環境変数チェック
  // ---------------------------------------------------

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


  // ---------------------------------------------------
  // APIパラメータ
  // ---------------------------------------------------

  const params =
    new URLSearchParams();

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
    String(theme.genreId)
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

  params.set(
    "affiliateId",
    affiliateId
  );


  // ---------------------------------------------------
  // 楽天ランキングAPI
  // ---------------------------------------------------

  const url =
    "https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?" +
    params.toString();


  const res = await fetch(
    url,
    {
      cache: "no-store",

      headers: {
        Referer:
          "https://babytoku.vercel.app/",

        Origin:
          "https://babytoku.vercel.app",

        "User-Agent":
          "Mozilla/5.0",
      },
    }
  );


  const text =
    await res.text();


  // ---------------------------------------------------
  // APIエラー
  // ---------------------------------------------------

  if (!res.ok) {
    throw new Error(
      `楽天ランキングAPIエラー: ${res.status} ${text}`
    );
  }


  // ---------------------------------------------------
  // JSON解析
  // ---------------------------------------------------

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "楽天ランキングAPIのJSON解析に失敗しました"
    );
  }


  // ---------------------------------------------------
  // 商品データ
  // ---------------------------------------------------

  const rawItems =
    data.Items ?? [];


  // ---------------------------------------------------
  // 1位～3位だけ取得
  // ---------------------------------------------------

  const items =
    rawItems
      .filter(
        (item: any) => {
          const rank =
            Number(item.rank);

          return (
            rank >= 1 &&
            rank <= 3
          );
        }
      )
      .sort(
        (a: any, b: any) =>
          Number(a.rank) -
          Number(b.rank)
      )
      .slice(0, 3)
      .map(
        (item: any) => ({
          rank:
            Number(item.rank),

          itemName:
            item.itemName,

          catchcopy:
            item.catchcopy,

          itemPrice:
            Number(
              item.itemPrice ?? 0
            ),

          // アフィリエイトURLを優先
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
            item.mediumImageUrls ??
            [],

          shopName:
            item.shopName,

          pointRate:
            Number(
              item.pointRate ?? 1
            ),

          postageFlag:
            item.postageFlag,

          availability:
            item.availability,

          affiliateRate:
            item.affiliateRate,

          genreId:
            item.genreId,

          genreName:
            theme.name,
        })
      );


  // ---------------------------------------------------
  // 結果
  // ---------------------------------------------------

  return {
    key:
      theme.key,

    genreId:
      theme.genreId,

    genreName:
      theme.name,

    emoji:
      theme.emoji,

    items,
  };
}


// =====================================================
// GET
// =====================================================

export async function GET() {
  try {

    // -------------------------------------------------
    // 今日のテーマ
    // -------------------------------------------------

    const theme =
      getTodayTheme();


    // -------------------------------------------------
    // 今日のテーマだけ取得
    //
    // 7ジャンル全部を同時に取得しないことで
    // 楽天APIの429対策にもなる
    // -------------------------------------------------

    const ranking =
      await getRanking(theme);


    // -------------------------------------------------
    // JSONを返す
    // -------------------------------------------------

    return NextResponse.json(
      {
        status: 200,

        theme: {
          key:
            theme.key,

          name:
            theme.name,

          emoji:
            theme.emoji,
        },

        ranking,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );

  } catch (error) {

    console.error(
      "楽天ランキング取得エラー:",
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