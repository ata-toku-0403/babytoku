import { NextResponse } from "next/server";

// =====================================================
// Yahoo!カテゴリ確認用API
//
// 使い方:
//
// /api/yahoo-categories
// → 2497 の子カテゴリを表示
//
// /api/yahoo-categories?categoryId=41607
// → 41607 の子カテゴリを表示
//
// /api/yahoo-categories?categoryId=2497
// → 2497 の子カテゴリを表示
//
// 使用する環境変数
// YAHOO_APP_ID
// =====================================================


// =====================================================
// Yahoo!カテゴリ取得
// =====================================================

async function getYahooCategory(
  categoryId: number
) {
  // ---------------------------------------------------
  // アプリケーションID
  // ---------------------------------------------------

  const appId =
    process.env.YAHOO_APP_ID;

  if (!appId) {
    throw new Error(
      "YAHOO_APP_ID が設定されていません"
    );
  }


  // ---------------------------------------------------
  // パラメータ
  // ---------------------------------------------------

  const params =
    new URLSearchParams();

  params.set(
    "appid",
    appId
  );

  params.set(
    "category_id",
    String(categoryId)
  );

  params.set(
    "output",
    "json"
  );


  // ---------------------------------------------------
  // Yahoo!カテゴリAPI
  // ---------------------------------------------------

  const url =
    "https://shopping.yahooapis.jp/ShoppingWebService/V1/categorySearch?" +
    params.toString();


  const res =
    await fetch(
      url,
      {
        cache: "no-store",
      }
    );


  const text =
    await res.text();


  // ---------------------------------------------------
  // HTTPエラー
  // ---------------------------------------------------

  if (!res.ok) {
    throw new Error(
      `Yahoo!カテゴリAPIエラー: ${res.status} ${text}`
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
      "Yahoo!カテゴリAPIのJSON解析に失敗しました"
    );
  }


  // ---------------------------------------------------
  // レスポンス確認
  //
  // Yahoo!カテゴリAPIは
  //
  // ResultSet
  //   └─ "0"
  //       └─ Result
  //
  // という構造で返ってくる
  // ---------------------------------------------------

  const result =
    data?.ResultSet?.["0"]?.Result;

  if (!result) {
    throw new Error(
      `Yahoo!カテゴリAPIのレスポンスが不正です: ${text}`
    );
  }


  const categories =
    result.Categories;

  if (!categories) {
    throw new Error(
      `カテゴリ情報が見つかりません: ${categoryId}`
    );
  }


  // ---------------------------------------------------
  // 現在のカテゴリ
  // ---------------------------------------------------

  const current =
    categories.Current;


  const currentId =
    Number(
      current?.Id ??
      categoryId
    );


  const currentName =
    current?.Title?.Short ??
    current?.Title?.Medium ??
    current?.Title?.Long ??
    "";


  const parentId =
    Number(
      current?.ParentId ??
      0
    );


  // ---------------------------------------------------
  // 子カテゴリ
  //
  // Yahoo!は
  //
  // Children
  //   ├─ "0"
  //   ├─ "1"
  //   ├─ "2"
  //   └─ ...
  //
  // というオブジェクト形式で返す
  // ---------------------------------------------------

  const childrenRaw =
    categories.Children;


  let childrenArray: any[] = [];


  if (childrenRaw) {

    if (
      Array.isArray(
        childrenRaw
      )
    ) {

      childrenArray =
        childrenRaw;

    } else {

      childrenArray =
        Object.values(
          childrenRaw
        );
    }
  }


  const children =
  childrenArray
    .filter(
      (child: any) =>
        child &&
        child.Id
    )
    .map(
      (child: any) => ({
          id:
            Number(
              child.Id
            ),

          name:
            child.Title?.Short ??
            child.Title?.Medium ??
            child.Title?.Long ??
            "",

          parentId:
            currentId,

          url:
            child.Url ??
            "",
        })
      );


  // ===================================================
  // 結果
  // ===================================================

  return {
    current: {
      id:
        currentId,

      name:
        currentName,

      parentId:
        parentId,
    },

    children,
  };
}


// =====================================================
// GET
// =====================================================

export async function GET(
  request: Request
) {

  try {

    // -------------------------------------------------
    // URLパラメータ
    //
    // 例:
    // ?categoryId=2497
    // -------------------------------------------------

    const { searchParams } =
      new URL(request.url);


    const categoryIdParam =
      searchParams.get(
        "categoryId"
      );


    // -------------------------------------------------
    // 指定がなければ2497
    // -------------------------------------------------

    const categoryId =
      categoryIdParam
        ? Number(
            categoryIdParam
          )
        : 2497;


    // -------------------------------------------------
    // 数値チェック
    // -------------------------------------------------

    if (
      !Number.isInteger(
        categoryId
      ) ||
      categoryId <= 0
    ) {

      return NextResponse.json(
        {
          status: 400,

          error:
            "categoryId は正の整数で指定してください",
        },
        {
          status: 400,
        }
      );
    }


    // -------------------------------------------------
    // Yahoo!から取得
    // -------------------------------------------------

    const result =
      await getYahooCategory(
        categoryId
      );


    // -------------------------------------------------
    // JSONで返す
    // -------------------------------------------------

    return NextResponse.json(
      {
        status: 200,

        categoryId:
          categoryId,

        current:
          result.current,

        children:
          result.children,

        childrenCount:
          result.children.length,
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
      "Yahoo!カテゴリ取得エラー:",
      error
    );


    return NextResponse.json(
      {
        status: 500,

        error:
          error instanceof Error
            ? error.message
            : "Yahoo!カテゴリ取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}