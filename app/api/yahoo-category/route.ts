import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 例：
    // /api/yahoo-category?keyword=粉ミルク
    const keyword =
      searchParams.get("keyword") || "粉ミルク";

    const appId =
      process.env.YAHOO_APP_ID;

    if (!appId) {
      return NextResponse.json(
        {
          status: 500,
          error:
            "YAHOO_APP_ID が設定されていません",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // Yahoo! 商品検索API
    // =====================================================

    const params = new URLSearchParams();

    params.set("appid", appId);
    params.set("query", keyword);

    // カテゴリ情報を確認したいので少し多めに取得
    params.set("results", "20");

    // 画像は不要なので指定しない
    const url =
      `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: response.status,
          error:
            "Yahoo! APIからエラーが返されました",
          detail: data,
        },
        { status: response.status }
      );
    }

    // =====================================================
    // 確認用に必要な情報だけ取り出す
    // =====================================================

    const items = (data.hits ?? []).map(
      (item: any) => ({
        index: item.index,

        name: item.name,

        price: item.price,

        url: item.url,

        // -----------------------------
        // 現在の商品カテゴリ
        // -----------------------------

        genreCategory: {
          id:
            item.genreCategory?.id ??
            null,

          name:
            item.genreCategory?.name ??
            null,

          depth:
            item.genreCategory?.depth ??
            null,
        },

        // -----------------------------
        // 親カテゴリ
        // -----------------------------

        parentGenreCategories:
          item.parentGenreCategories ??
          [],
      })
    );

    // =====================================================
    // カテゴリごとにまとめる
    // =====================================================

    const categoryMap =
      new Map<
        number,
        {
          id: number;
          name: string;
          depth: number | null;
          count: number;
        }
      >();

    for (const item of items) {
      const category =
        item.genreCategory;

      if (!category.id) continue;

      const existing =
        categoryMap.get(
          category.id
        );

      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(
          category.id,
          {
            id: category.id,
            name:
              category.name || "",
            depth:
              category.depth ??
              null,
            count: 1,
          }
        );
      }
    }

    const categories =
      Array.from(
        categoryMap.values()
      ).sort(
        (a, b) =>
          b.count - a.count
      );

    // =====================================================
    // レスポンス
    // =====================================================

    return NextResponse.json({
      status: 200,

      keyword,

      totalResultsAvailable:
        data.totalResultsAvailable ??
        0,

      totalResultsReturned:
        data.totalResultsReturned ??
        0,

      // 商品ごとのカテゴリ
      items,

      // 検索結果に多く登場したカテゴリ
      categories,
    });
  } catch (error) {
    console.error(
      "Yahoo category check error:",
      error
    );

    return NextResponse.json(
      {
        status: 500,
        error:
          "Yahoo!カテゴリ確認中にエラーが発生しました",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}