"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // 商品名から内容量・枚数を取得
  function getWeight(name: string) {
    // 「68枚入り×4個」「68枚×4個」など
    const packMatch = name.match(
      /(\d+)\s*枚(?:入り)?\s*[×x＊*]\s*(\d+)\s*(?:個|パック|袋|ケース)?/i
    );

    if (packMatch) {
      return Number(packMatch[1]) * Number(packMatch[2]);
    }

    // 「132枚」「68枚入り」など
    const diaperMatch = name.match(/(\d+)\s*枚/);

    if (diaperMatch) {
      return Number(diaperMatch[1]);
    }

    // 「800g」「1.2kg」など
    const weightMatch = name.match(
      /(\d+(?:\.\d+)?)\s*(g|kg)/i
    );

    if (!weightMatch) return null;

    const value = Number(weightMatch[1]);
    const unit = weightMatch[2].toLowerCase();

    if (unit === "kg") {
      return value * 1000;
    }

    return value;
  }

  const search = async () => {
    if (!keyword.trim()) return;

    setSearchWord(keyword);

    const res = await fetch(
      `/api/search?keyword=${encodeURIComponent(keyword)}`
    );

    const data = await res.json();

    // 楽天
    const rakutenItems = (data.rakuten?.Items ?? []).map(
      (item: any) => ({
        Item: {
          itemName: item.Item.itemName,
          itemPrice: item.Item.itemPrice,
          itemUrl: item.Item.itemUrl,
          mediumImageUrls: item.Item.mediumImageUrls,

          pointRate: item.Item.pointRate ?? 1,

          pointAmount: Math.floor(
            item.Item.itemPrice *
              (item.Item.pointRate ?? 1) /
              100
          ),

          weight: getWeight(item.Item.itemName),

          shop: "楽天",

          shipping:
            item.Item.postageFlag === 0
              ? "送料無料"
              : "送料別途",
        },
      })
    );

    // Yahoo
    const yahooItems = (data.yahoo?.hits ?? []).map(
      (item: any) => ({
        Item: {
          itemName: item.name,
          itemPrice: item.price,
          itemUrl: item.url,

          mediumImageUrls: [
            {
              imageUrl: item.image?.medium,
            },
          ],

          pointRate: 0,

          pointAmount:
            item.point?.lyLimitedBonusAmount ?? 0,

          weight: getWeight(item.name),

          shop: "Yahoo",

          shipping:
            item.shipping?.name === "送料無料"
              ? "送料無料"
              : "送料別途",
        },
      })
    );

    // 楽天＋Yahooをまとめて
    // 単価の安い順に並べる
    const sortedItems = [
      ...rakutenItems,
      ...yahooItems,
    ].sort((a: any, b: any) => {
      const realPriceA =
        a.Item.itemPrice - a.Item.pointAmount;

      const realPriceB =
        b.Item.itemPrice - b.Item.pointAmount;

      const unitPriceA = a.Item.weight
        ? realPriceA / a.Item.weight
        : Number.MAX_SAFE_INTEGER;

      const unitPriceB = b.Item.weight
        ? realPriceB / b.Item.weight
        : Number.MAX_SAFE_INTEGER;

      return unitPriceA - unitPriceB;
    });

    setItems(sortedItems);
    setTotalCount(sortedItems.length);
  };

  // 単価ベースで最安の商品
  const cheapest = useMemo(() => {
    if (items.length === 0) return null;

    return items[0];
  }, [items]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            ベビトクー仮ー
          </h1>

          <p className="mt-2 text-gray-700 dark:text-gray-300">
            子育て世代のおトクを増やす。
          </p>
        </header>

        {/* 検索 */}
        <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="text"
            placeholder="商品名を入力（例：はぐくみ）"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
            className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400"
          />

          <button
            onClick={search}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 sm:w-auto"
          >
            価格を比較する
          </button>
        </div>

        {/* 検索結果 */}
        {searchWord && (
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              「{searchWord}」の検索結果
            </h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {totalCount}件の商品が見つかりました
            </p>
          </div>
        )}

        {/* 単価最安値 */}
        {searchWord && cheapest && (
          <section className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="mb-4 text-lg font-bold">
              🏆 単価最安値
            </h2>

            <div className="flex flex-col gap-4 sm:flex-row">
              <img
                src={
                  cheapest.Item.mediumImageUrls?.[0]
                    ?.imageUrl
                }
                alt={cheapest.Item.itemName}
                className="h-32 w-full rounded object-contain sm:h-32 sm:w-32"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="font-bold">
                    {cheapest.Item.itemName}
                  </div>

                  <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400 sm:text-3xl">
                    ¥
                    {cheapest.Item.itemPrice.toLocaleString()}
                  </div>

                  {cheapest.Item.pointRate > 1 && (
                    <p className="mt-1 font-bold text-orange-600 dark:text-orange-400">
                      🔥 ポイント
                      {cheapest.Item.pointRate}倍
                    </p>
                  )}

                  {cheapest.Item.pointAmount > 0 && (
                    <p className="mt-1 text-blue-600 dark:text-blue-400">
                      獲得予定：約
                      {cheapest.Item.pointAmount.toLocaleString()}
                      pt
                    </p>
                  )}

                  <p className="mt-1 font-bold">
                    {cheapest.Item.shipping ===
                    "送料無料"
                      ? "🟢 送料無料"
                      : "🔴 送料別途"}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    実質価格：
                    ¥
                    {(
                      cheapest.Item.itemPrice -
                      cheapest.Item.pointAmount
                    ).toLocaleString()}
                  </p>

                  {cheapest.Item.weight && (
                    <p className="mt-2 font-bold text-purple-600 dark:text-purple-400">
                      単価：
                      ¥
                      {(
                        (cheapest.Item.itemPrice -
                          cheapest.Item.pointAmount) /
                        cheapest.Item.weight
                      ).toFixed(2)}
                    </p>
                  )}
                </div>

                <a
                  href={cheapest.Item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-lg bg-yellow-500 px-4 py-3 text-center font-bold text-white hover:bg-yellow-600"
                >
                  {cheapest.Item.shop}へ移動
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 商品一覧 */}
        {items.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              商品一覧
            </h2>

            <ul className="space-y-4">
              {items.map((item: any, index: number) => {
                const point =
                  item.Item.pointAmount;

                const realPrice =
                  item.Item.itemPrice - point;

                return (
                  <li
                    key={`${item.Item.shop}-${item.Item.itemUrl}-${index}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {/* 商品画像 */}
                      <img
                        src={
                          item.Item.mediumImageUrls?.[0]
                            ?.imageUrl
                        }
                        alt={item.Item.itemName}
                        className="h-32 w-full rounded object-contain sm:h-32 sm:w-32"
                      />

                      {/* 商品情報 */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="line-clamp-2 text-lg font-bold">
                            {item.Item.itemName}
                          </h3>

                          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                            ¥
                            {item.Item.itemPrice.toLocaleString()}
                          </p>

                          {item.Item.pointRate > 1 && (
                            <p className="mt-1 font-bold text-orange-600 dark:text-orange-400">
                              🔥 ポイント
                              {item.Item.pointRate}倍
                            </p>
                          )}

                          {point > 0 && (
                            <p className="mt-1 text-blue-600 dark:text-blue-400">
                              獲得予定：約
                              {point.toLocaleString()}
                              pt
                            </p>
                          )}

                          <p className="mt-1 font-bold">
                            {item.Item.shipping ===
                            "送料無料"
                              ? "🟢 送料無料"
                              : "🔴 送料別途"}
                          </p>

                          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                            実質価格：
                            ¥
                            {realPrice.toLocaleString()}
                          </p>

                          {item.Item.weight && (
                            <p className="mt-1 font-bold text-purple-600 dark:text-purple-400">
                              単価：
                              ¥
                              {(
                                realPrice /
                                item.Item.weight
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>

                        <a
                          href={item.Item.itemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block rounded-lg bg-red-500 px-4 py-3 text-center font-bold text-white hover:bg-red-600"
                        >
                          {item.Item.shop}へ移動
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* 検索結果なし */}
        {searchWord && items.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300">
              商品が見つかりませんでした。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}