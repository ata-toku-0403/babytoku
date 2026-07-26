"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const search = async () => {
   setSearchWord(keyword);

  const res = await fetch(
    `/api/search?keyword=${encodeURIComponent(keyword)}`
    );

  const data = await res.json();

   console.log(data);

  const sortedItems = [...(data.Items ?? [])].sort(
    (a, b) => a.Item.itemPrice - b.Item.itemPrice
    );

   setItems(sortedItems);
   setTotalCount(data.count ?? 0);
   };

  const cheapest = useMemo(() => {
    if (items.length === 0) return null;

    return items[0];
    }, [items]);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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
       🏆 楽天最安値
      </div>

      <div className="flex gap-4">
       <img
         src={cheapest.Item.mediumImageUrls?.[0]?.imageUrl}
         alt={cheapest.Item.itemName}
         className="h-28 w-28 rounded object-contain"
       />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="font-bold">
            {cheapest.Item.itemName}
          </div>

          <div className="mt-2 text-3xl font-bold text-red-600">
            ¥{cheapest.Item.itemPrice.toLocaleString()}
          </div>
          <p className="mt-1 text-sm text-blue-600">
           ポイント：
            {Math.floor(
             cheapest.Item.itemPrice *
             cheapest.Item.pointRate / 100
             ).toLocaleString()}pt
          </p>

          <p className="mt-1 text-lg font-bold text-green-600">
           実質価格：
            ¥{(
             cheapest.Item.itemPrice -
              Math.floor(
              cheapest.Item.itemPrice *
              cheapest.Item.pointRate / 100
              )
            ).toLocaleString()}
          </p>
        </div>

        <a
          href={cheapest.Item.itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-lg bg-yellow-500 px-4 py-2 text-center font-bold text-white hover:bg-yellow-600"
        >
          楽天で見る
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

     const point =
      Math.floor(
       item.Item.itemPrice *
       item.Item.pointRate / 100
      );

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
        className="h-28 w-28 rounded object-contain"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
         <h3 className="font-bold text-lg line-clamp-2">
          {item.Item.itemName}
         </h3>

         <p className="mt-2 text-2xl font-bold text-red-600">
          ¥{item.Item.itemPrice.toLocaleString()}
         </p>

         <p className="mt-1 text-sm text-blue-600">
           ポイント：{point.toLocaleString()}pt
         </p>

        <p className="mt-1 text-lg font-bold text-green-600">
           実質価格：¥{realPrice.toLocaleString()}
        </p>
        </div>
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
