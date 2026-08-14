import { NextResponse } from "next/server";

// =====================================================
// 今日のランキングテーマ
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

  // -------------------------------------------------
  // 以下3つのgenreIdは、楽天の正確なジャンルIDを
  // 確定してから入れます。
  // -------------------------------------------------

  {
    key: "bodysoap",
    name: "ベビー用ボディソープ",
    genreId: 0,
    emoji: "🛁",
  },
  {
    key: "moisturizer",
    name: "ベビー用保湿剤",
    genreId: 0,
    emoji: "🧴",
  },
  {
    key: "babyfood",
    name: "離乳食",
    genreId: 0,
    emoji: "🥣",
  },
];


// =====================================================
// 今日のテーマを決定
// =====================================================

function getTodayTheme() {
  const today = new Date();

  // 日本時間で日付を取得
  const japanDate = new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(today);

  // YYYY/MM/DD → 数字に変換
  const numbers = japanDate.match(/\d+/g);

  if (!numbers || numbers.length < 3) {
    return RANKING_THEMES[0];
  }

  const year = Number(numbers[0]);
  const month = Number(numbers[1]);
  const day = Number(numbers[2]);

  // その日の通算日数
  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const start = new Date(
    Date.UTC(year, 0, 0)
  );

  const diff =
    date.getTime() -
    start.getTime();

  const dayOfYear = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  const index =
    dayOfYear % RANKING_THEMES.length;

  return RANKING_THEMES[index];
}


// =====================================================
// 楽天ランキング取得
// =====================================================

async function getRanking(
  genreId: number,
  genreName: string,
  emoji: string
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

  if (!genreId) {
    throw new Error(
      `${genreName} のジャンルIDがまだ設定されていません`
    );
  }

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

  const res = await fetch(
    url,
    {
      cache: "no-store",

      headers: {
        Referer:
          "https://babytoku.vercel.app/",

        Origin:
          "https://babytoku.vercel.app/",

        "User-Agent":
          "Mozilla/5.0",
      },
    }
  );

  const text =
    await res.text();

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

  // ===================================================
  // Items取得
  // ===================================================

  const rawItems =
    data.Items ?? [];

  // ===================================================
  // 1～3位だけ取得
  //
  // API側の返却順に依存せず rank を確認する
  // ===================================================

  const items = rawItems
    .filter(
      (item: any) =>
        Number(item.rank) >= 1 &&
        Number(item.rank) <= 3
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
          Number(item.itemPrice ?? 0),

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

        genreName,
      })
    );

  return {
    key:
      RANKING_THEMES.find(
        (theme) =>
          theme.genreId === genreId
      )?.key ?? "",

    genreId,

    genreName,

    emoji,

    items,
  };
}


// =====================================================
// GET
// =====================================================

export async function GET() {
  try {
    // -----------------------------------------------
    // 今日のテーマ
    // -----------------------------------------------

    const theme =
      getTodayTheme();

    // -----------------------------------------------
    // そのテーマだけ取得
    // -----------------------------------------------

    const ranking =
      await getRanking(
        theme.genreId,
        theme.name,
        theme.emoji
      );

    return NextResponse.json(
      {
        status: 200,

        theme: {
          key: theme.key,
          name: theme.name,
          emoji: theme.emoji,
        },

        ranking,
      },
      {
        status: 200,
        headers: {
          // ブラウザやCDNに長時間キャッシュさせない
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