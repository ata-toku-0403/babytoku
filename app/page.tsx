"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

function getWeight(name: string) {
  // 「132枚」のような合計枚数が書かれている場合
  const totalDiaperMatch = name.match(/\((\d+)\s*枚\)/);

  if (totalDiaperMatch) {
    return Number(totalDiaperMatch[1]);
  }

  // 「68枚入り×4個」「68枚×4個」など
  const packMatch = name.match(
    /(\d+)\s*枚(?:入り)?\s*[×x＊*]\s*(\d+)\s*(?:個|パック|袋|ケース)?/i
  );

  if (packMatch) {
    return Number(packMatch[1]) * Number(packMatch[2]);
  }

  // 「68枚入り」など単品
  const diaperMatch = name.match(/(\d+)\s*枚/);

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
  setSearchWord(keyword);

  const res = await fetch(
    `/api/search?keyword=${encodeURIComponent(keyword)}`
  );

  const data = await res.json();

  const rakutenItems = (data.rakuten?.Items ?? []).map((item:any) => ({
    Item: {
      itemName: item.Item.itemName,
      itemPrice: item.Item.itemPrice,
      itemUrl: item.Item.itemUrl,
      mediumImageUrls: item.Item.mediumImageUrls,
      pointRate: item.Item.pointRate ?? 1,

      pointAmount:
      Math.floor(
       item.Item.itemPrice *
       (item.Item.pointRate ?? 1) / 100
       ),

      weight:
      getWeight(item.Item.itemName),
      
      shop: "楽天",
       shipping: item.Item.postageFlag === 0
       ? "送料無料"
       : "送料別途",
    }
  }));


  const yahooItems = (data.yahoo?.hits ?? []).map((item:any) => ({
    Item: {
      itemName: item.name,
      itemPrice: item.price,
      itemUrl: item.url,
      mediumImageUrls: [
        {
          imageUrl: item.image.medium
        }
      ],
      pointRate: 0,

      pointAmount:
       item.point?.lyLimitedBonusAmount ?? 0,

       weight:
       getWeight(item.name),

      shop: "Yahoo",
       shipping: item.shipping?.name === "送料無料"
       ? "送料無料"
       : "送料別途",
    }
  }));


  const sortedItems = [
    ...rakutenItems,
    ...yahooItems
   ].sort((a:any,b:any)=>{

  const realPriceA =
    a.Item.itemPrice -
    a.Item.pointAmount;

  const realPriceB =
    b.Item.itemPrice -
    b.Item.pointAmount;

  const gramPriceA =
    a.Item.weight
      ? realPriceA / a.Item.weight
      : Number.MAX_SAFE_INTEGER;

  const gramPriceB =
    b.Item.weight
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
  return (
    <div className="min-h-screen bg-white text-gray-900">
  <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <main className="flex w-full flex-col items-center justify-between bg-white py-8 sm:py-16 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            ベビトクー仮ー
          </h1>
          <p>子育て世代のおトクを増やす。</p>
         <input
            type="text"
            placeholder="商品名を入力（例：はぐくみ）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
            search();
            }
            }}
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3"
            />
           <button
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white
            hover:bg-blue-700
            active:scale-95
            active:bg-blue-800
            transition
            duration-150"
            onClick={search}
           >
            価格を比較する
          </button>
          <p className="mt-4 text-gray-700">
             検索中：{searchWord}
          </p>
          {searchWord && (
  <div className="mt-6">
    {cheapest && (
     <div className="mb-8 rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-5 shadow">
      <div className="mb-3 text-lg font-bold text-yellow-700">
       🏆 実質最安値
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
       <img
         src={cheapest.Item.mediumImageUrls?.[0]?.imageUrl}
         alt={cheapest.Item.itemName}
         className="h-28 w-28 rounded object-contain"
       />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="text-lg font-bold leading-relaxed text-gray-900 sm:text-xl">
            {cheapest.Item.itemName}
          </div>

          <div className="mt-2 text-3xl font-bold text-red-600">
            ¥{cheapest.Item.itemPrice.toLocaleString()}
          </div>
        {cheapest.Item.pointRate > 1 && (
         <p className="mt-1 text-orange-600 font-bold">
          🔥 ポイント{cheapest.Item.pointRate}倍
         </p>
        )}

        <p className="mt-1 text-blue-600">
         獲得予定：約
         {cheapest.Item.pointAmount.toLocaleString()}pt
        </p>
 
       <p className="text-sm font-bold">
        {cheapest.Item.shipping === "送料無料"
        ? "🟢 送料無料"
        : "🔴 送料別途"}
       </p>

         <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-2xl font-bold text-green-700 sm:text-3xl">
         実質価格：
          ¥{(
           cheapest.Item.itemPrice -
           cheapest.Item.pointAmount
           ).toLocaleString()}
         </p>
         {cheapest.Item.weight && (
          <p className="mt-2 text-base font-bold text-purple-700">
          単価：
          ¥{(
           (
            cheapest.Item.itemPrice -
            cheapest.Item.pointAmount
           ) / cheapest.Item.weight
           ).toFixed(2)}
          </p>
         )}
        </div>

        <a
          href={cheapest.Item.itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block w-full rounded-lg bg-yellow-500 px-5 py-3 text-center text-base font-bold text-white hover:bg-yellow-600 sm:w-auto"
        >
          {cheapest.Item.shop}へ移動
        </a>
      </div>
    </div>
  </div>
)}
    <h2 className="text-lg font-bold">
     検索結果（{totalCount}件）
    </h2>
   <ul className="mt-6 w-full max-w-2xl space-y-4">
    {items.map((item: any, index) => {

     const point = item.Item.pointAmount;

     const realPrice =
      item.Item.itemPrice - point;

  return (
     <li
       key={index}
       className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow"
    >
      <img
        src={item.Item.mediumImageUrls?.[0]?.imageUrl}
        alt={item.Item.itemName}
        className="mx-auto h-40 w-40 rounded-lg object-contain sm:mx-0 sm:h-32 sm:w-32"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
         <h3 className="font-bold text-lg line-clamp-2">
          {item.Item.itemName}
         </h3>

         <p className="mt-3 text-2xl font-bold text-red-600 sm:text-3xl">
          ¥{item.Item.itemPrice.toLocaleString()}
         </p>

         {item.Item.pointRate > 1 && (
          <p className="mt-2 text-base font-bold text-orange-700">
           🔥 ポイント{item.Item.pointRate}倍
          </p>
         )}

         <p className="mt-2 text-base font-semibold text-blue-700">
          獲得予定：約{point.toLocaleString()}pt
         </p>

         <p className="mt-2 text-base font-bold text-gray-800">
          {item.Item.shipping === "送料無料"
          ? "🟢 送料無料"
          : "🔴 送料別途"}
         </p>

         <p className="mt-1 text-2xl font-bold text-green-600">
           実質価格：¥{realPrice.toLocaleString()}
         </p>

          {item.Item.weight && (
          <p className="mt-1 text-purple-600 font-bold">
           単価：
           ¥{(
           realPrice / item.Item.weight
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
     </li>
     );
    })}
   </ul>
  </div>
)}
        </div>
      </main>
    </div>
  );
}
