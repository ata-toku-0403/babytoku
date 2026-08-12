"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  function getWeight(name: string) {
    // 「68枚入り×4個」「68枚×4個」など
    const packMatch = name.match(
      /(\d+)\s*枚(?:入り)?\s*[×x＊*]\s*(\d+)\s*(?:個|パック|袋|ケース)?/i
    );

    if (packMatch) {
      return Number(packMatch[1]) * Number(packMatch[2]);
    }

    // 「132枚」「68枚入り」など
    const diaperMatch = name.match(/(\d+)\s*枚/i);

    if (diaperMatch) {
      return Number(diaperMatch[1]);
    }

    // 粉ミルクなどの重量
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

    // =========================
    // 楽天
    // =========================
    const rakutenItems = (data.rakuten?.Items ?? []).map(
      (item: any) => ({
        Item: {
          itemName: item.Item.itemName,
          itemPrice: item.Item.itemPrice,

          // 楽天アフィリエイトリンク
          itemUrl:
            item.Item.affiliateUrl ||
            item.Item.itemUrl,

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

    // =========================
    // Yahoo!
    // =========================
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

          shop: "Yahoo!ショッピング",

          shipping:
            item.shipping?.name === "送料無料"
              ? "送料無料"
              : "送料別途",
        },
      })
    );

    // =========================
    // 楽天 + Yahoo!を単価順に並べる
    // =========================
    const sortedItems = [
      ...rakutenItems,
      ...yahooItems,
    ].sort((a: any, b: any) => {
      const realPriceA =
        a.Item.itemPrice -
        a.Item.pointAmount;

      const realPriceB =
        b.Item.itemPrice -
        b.Item.pointAmount;

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

  // =========================
  // 最安商品
  // =========================
  const cheapest = useMemo(() => {
    if (items.length === 0) return null;

    return items[0];
  }, [items]);

  // =========================
  // Amazonアソシエイト
  // =========================
  const amazonAssociateId =
    process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID;

  // 検索キーワードをAmazonで検索するリンク
  const amazonSearchUrl =
    searchWord && amazonAssociateId
      ? `https://www.amazon.co.jp/s?k=${encodeURIComponent(
          searchWord
        )}&tag=${encodeURIComponent(
          amazonAssociateId
        )}`
      : "";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

      {/* =========================
          タイトル
      ========================= */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        ベビトク
      </h1>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        子育て世代のおトクを増やす。
      </p>

      {/* =========================
          検索
      ========================= */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

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
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <button
          onClick={search}
          className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          価格を比較する
        </button>

      </div>

      {/* =========================
          検索結果
      ========================= */}
      {searchWord && (
        <>
          <p className="mt-6 font-bold text-gray-900 dark:text-white">
            「{searchWord}」の検索結果

            {totalCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                {totalCount}件
              </span>
            )}
          </p>

          {/* =========================
              最安商品
          ========================= */}
          {cheapest && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">

              <div className="flex gap-4">

                <img
                  src={
                    cheapest.Item
                      .mediumImageUrls?.[0]
                      ?.imageUrl
                  }
                  alt={
                    cheapest.Item.itemName
                  }
                  className="h-28 w-28 rounded object-contain"
                />

                <div className="flex flex-1 flex-col justify-between">

                  <div>

                    <div className="font-bold text-gray-900 dark:text-white">
                      {cheapest.Item.itemName}
                    </div>

                    <div className="mt-2 text-3xl font-bold text-red-600">
                      ¥
                      {cheapest.Item.itemPrice.toLocaleString()}
                    </div>

                    <p className="mt-1 font-bold text-orange-600">
                      {cheapest.Item.pointRate > 1
                        ? `🔥 ポイント${cheapest.Item.pointRate}倍`
                        : "🟢 通常ポイント"}
                    </p>

                    <p className="mt-1 text-blue-600">
                      獲得予定：約
                      {cheapest.Item.pointAmount.toLocaleString()}
                      pt
                    </p>

                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {cheapest.Item.shipping ===
                      "送料無料"
                        ? "🟢 送料無料"
                        : "🔴 送料別途"}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                      実質価格：
                      ¥
                      {(
                        cheapest.Item.itemPrice -
                        cheapest.Item.pointAmount
                      ).toLocaleString()}
                    </p>

                    {cheapest.Item.weight && (
                      <p className="mt-2 font-bold text-purple-600">
                        単価：
                        ¥
                        {(
                          (
                            cheapest.Item.itemPrice -
                            cheapest.Item.pointAmount
                          ) /
                          cheapest.Item.weight
                        ).toFixed(2)}
                      </p>
                    )}

                  </div>

                  <a
                    href={
                      cheapest.Item.itemUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 rounded-lg bg-yellow-500 px-4 py-2 text-center font-bold text-white hover:bg-yellow-600"
                  >
                    {cheapest.Item.shop}へ移動
                  </a>

                </div>

              </div>

            </div>
          )}

          {/* =========================
              Amazonへのリンク
          ========================= */}
          {amazonSearchUrl && (
            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950">

              <p className="text-lg font-bold text-black dark:text-black">
                Amazonでも探す
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-700">
                「{searchWord}」をAmazonで検索します。
              </p>

              <a
                href={amazonSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-lg bg-orange-500 px-5 py-3 text-center font-bold text-black hover:bg-orange-600"
              >
                Amazonで「{searchWord}」を探す
              </a>

            </div>
          )}

          {/* =========================
              商品一覧
          ========================= */}
          <ul className="mt-6 space-y-4">

            {items.map(
              (item: any, index: number) => {

                const point =
                  item.Item.pointAmount;

                const realPrice =
                  item.Item.itemPrice -
                  point;

                return (
                  <li
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >

                    <div className="flex gap-4">

                      <img
                        src={
                          item.Item
                            .mediumImageUrls?.[0]
                            ?.imageUrl
                        }
                        alt={
                          item.Item.itemName
                        }
                        className="h-28 w-28 rounded object-contain"
                      />

                      <div className="flex flex-1 flex-col justify-between">

                        <div>

                          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                            {item.Item.itemName}
                          </h3>

                          <p className="mt-2 text-2xl font-bold text-red-600">
                            ¥
                            {item.Item.itemPrice.toLocaleString()}
                          </p>

                          <p className="mt-1 font-bold text-orange-600">
                            {item.Item.pointRate > 1
                              ? `🔥 ポイント${item.Item.pointRate}倍`
                              : "🟢 通常ポイント"}
                          </p>

                          <p className="mt-1 text-blue-600">
                            獲得予定：約
                            {point.toLocaleString()}
                            pt
                          </p>

                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                            {item.Item.shipping ===
                            "送料無料"
                              ? "🟢 送料無料"
                              : "🔴 送料別途"}
                          </p>

                          <p className="mt-1 text-2xl font-bold text-green-600">
                            実質価格：
                            ¥
                            {realPrice.toLocaleString()}
                          </p>

                          {item.Item.weight && (
                            <p className="mt-1 font-bold text-purple-600">
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
                          href={
                            item.Item.itemUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block rounded-lg bg-red-500 px-4 py-2 text-center text-white hover:bg-red-600"
                        >
                          {item.Item.shop}へ移動
                        </a>

                      </div>

                    </div>

                  </li>
                );
              }
            )}

          </ul>

        </>
      )}

      {/* =========================
          APIクレジット
      ========================= */}
      <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">

        <div className="flex flex-col items-center gap-4">

          {/* 楽天 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <a
              href="https://developers.rakuten.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 dark:hover:text-white"
            >
              Supported by Rakuten Developers
            </a>
          </div>

          {/* Yahoo! JAPAN */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <a
              href="https://developer.yahoo.co.jp/sitemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 dark:hover:text-white"
            >
              Webサービス by Yahoo! JAPAN
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            © ベビトク
          </p>

        </div>

      </footer>

    </main>
  );
}