"use client";

import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
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
          <button className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                  onClick={() => setSearchWord(keyword)}>
                  価格を比較する
          </button>
          <p className="mt-4 text-gray-700">
             検索中：{searchWord}
          </p>
          {searchWord && (
  <div className="mt-6">
    <h2 className="text-lg font-bold">検索結果</h2>

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
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
