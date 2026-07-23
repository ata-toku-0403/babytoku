"use client";

import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<any[]>([]);
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
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3"/> 
          <button
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            onClick={async () => {
              setSearchWord(keyword);

              const res = await fetch(
                `/api/search?keyword=${encodeURIComponent(keyword)}`
              );

              const data = await res.json();

              console.log(data);

              setItems(data.Items ?? []);
             }}
           >
            価格を比較する
          </button>
          <p className="mt-4 text-gray-700">
             検索中：{searchWord}
          </p>
          {searchWord && (
  <div className="mt-6">
    <h2 className="text-lg font-bold">検索結果</h2>
   <ul className="mt-6 w-full max-w-2xl space-y-4">
    {items.map((item: any, index) => (
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
          <h3 className="font-bold text-lg">
            {item.Item.itemName}
          </h3>

          <p className="mt-2 text-2xl font-bold text-red-600">
            ¥{item.Item.itemPrice.toLocaleString()}
          </p>
        </div>

        <a
          href={item.Item.itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-lg bg-red-500 px-4 py-2 text-center text-white hover:bg-red-600"
        >
          楽天で見る
        </a>
      </div>
     </li>
     ))}
   </ul>

    <a
      href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(searchWord)}`}
      target="_blank"
      className="block mt-2 text-blue-600 underline"
    >
      Amazonで検索
    </a>

    <a
      href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(searchWord)}/`}
      target="_blank"
      className="block mt-2 text-blue-600 underline"
    >
      楽天市場で検索
    </a>

    <a
      href={`https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(searchWord)}`}
      target="_blank"
      className="block mt-2 text-blue-600 underline"
    >
      Yahoo!ショッピングで検索
    </a>
  </div>
)}
        </div>
      </main>
    </div>
  );
}
