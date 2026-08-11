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

      const gramPriceA = a.Item.weight
        ? realPriceA / a.Item.weight
        : Number.MAX_SAFE_INTEGER;

      const gramPriceB = b.Item.weight
        ? realPriceB / b.Item.weight
        : Number.MAX_SAFE_INTEGER;

      return gramPriceA - gramPriceB;
    });

    setItems(sortedItems);
    setTotalCount(sortedItems.length);
  };

  const cheapest = useMemo(() => {
    if (items.length === 0) return null;

    return items[0];
  }, [items]);

  // AmazonアソシエイトのトラッキングID
  // .env.local / Vercelの環境変数から取得
  const amazonAssociateId =
    process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID;

  // 検索したキーワードをAmazonで検索するリンク
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

      {/* タイトル */}
      <h1 className="text-3xl font-bold">
        ベビトクー仮ー
      </h1>

      <p className="mt-2 text-gray-600">
        子育て世代のおトクを増やす。
      </p>

      {/* 検索 */}
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
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3"
        />

        <button
          onClick={search}
          className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          価格を比較する
        </button>

      </div>

      {/* 検索結果 */}
      {searchWord && (
        <>

          <p className="mt-6 font-bold">
            検索中：{searchWord}
          </p>

          {/* 最安商品 */}
          {cheapest && (
            <div className="mt-4 rounded-xl border p-4">

              <div className="flex gap-4">

                <img
                  src={
                    cheapest.Item
                      .mediumImageUrls?.[0]
                      ?.imageUrl
                  }
                  alt={cheapest.Item.itemName}
                  className="h-28 w-28 rounded object-contain"
                />

                <div className="flex flex-1 flex-col justify-between">

                  <div>

                    <div className="font-bold">
                      {cheapest.Item.itemName}
                    </div>

                    <div className="mt-2 text-3xl font-bold text-red-600">
                      ¥
                      {cheapest.Item.itemPrice.toLocaleString()}
                    </div>

                    <p className="mt-1 text-orange-600 font-bold">
                      {cheapest.Item.pointRate > 1
                        ? `🔥 ポイント${cheapest.Item.pointRate}倍`
                        : "🟢通常ポイント"}
                    </p>

                    <p className="mt-1 text-blue-600">
                      獲得予定：約
                      {cheapest.Item.pointAmount.toLocaleString()}
                      pt
                    </p>

                    <p className="text-sm font-bold">
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
                      <p className="mt-2 text-purple-600 font-bold">
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
                    href={cheapest.Item.itemUrl}
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

          {/* Amazonへのリンク */}
          {amazonSearchUrl && (
           <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-800 dark:bg-gray-800">

           <p className="text-lg font-bold text-black">
            Amazonでも探す
           </p>

             <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
             「{searchWord}」をAmazonで検索します。
             </p>

             <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(
             searchWord
             )}&tag=${encodeURIComponent(
             amazonAssociateId || ""
             )}`
             }
             target="_blank"
             rel="noopener noreferrer"
             className="mt-4 block rounded-lg bg-orange-500 px-5 py-3 text-center font-bold text-white hover:bg-orange-600"
             >
            Amazonで「{searchWord}」を探す
           </a>

          </div>
          )}

          {/* 商品一覧 */}
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
                    className="rounded-xl border p-4"
                  >

                    <div className="flex gap-4">

                      <img
                        src={
                          item.Item
                            .mediumImageUrls?.[0]
                            ?.imageUrl
                        }
                        alt={item.Item.itemName}
                        className="h-28 w-28 rounded object-contain"
                      />

                      <div className="flex flex-1 flex-col justify-between">

                        <div>

                          <h3 className="text-lg font-bold line-clamp-2">
                            {item.Item.itemName}
                          </h3>

                          <p className="mt-2 text-2xl font-bold text-red-600">
                            ¥
                            {item.Item.itemPrice.toLocaleString()}
                          </p>

                          <p className="mt-1 text-orange-600 font-bold">
                            {item.Item.pointRate > 1
                              ? `🔥 ポイント${item.Item.pointRate}倍`
                              : "🟢通常ポイント"}
                          </p>

                          <p className="mt-1 text-blue-600">
                            獲得予定：約
                            {point.toLocaleString()}
                            pt
                          </p>

                          <p className="text-sm font-bold">
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
                            <p className="mt-1 text-purple-600 font-bold">
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

    </main>
  );
}