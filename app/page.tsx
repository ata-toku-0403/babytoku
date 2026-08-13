"use client";

import { useEffect, useState } from "react";

type RankingItem = {
  rank: number;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string | null;
  imageUrl: string | null;
  shopName: string;
  pointRate: number;
  postageFlag: number;
};

type RankingData = {
  genreId: number;
  genreName: string;
  items: RankingItem[];
};

export default function Home() {
  const [keyword, setKeyword] = useState("");

  const [rankings, setRankings] = useState<{
    diapers: RankingData | null;
    formula: RankingData | null;
    wipes: RankingData | null;
  }>({
    diapers: null,
    formula: null,
    wipes: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getRankings = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ranking", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || data.status !== 200) {
          throw new Error(
            data.error || "ランキングの取得に失敗しました"
          );
        }

        setRankings(data.rankings);
      } catch (error) {
        console.error(error);

        setError(
          "ランキングの取得に失敗しました。時間をおいて再度お試しください。"
        );
      } finally {
        setLoading(false);
      }
    };

    getRankings();
  }, []);

  const search = () => {
    const word = keyword.trim();

    if (!word) return;

    window.location.href = `/search?keyword=${encodeURIComponent(
      word
    )}`;
  };

  const renderRanking = (
    ranking: RankingData | null
  ) => {
    if (!ranking) return null;

    return (
      <div className="mt-4 space-y-3">
        {ranking.items.map((item) => (
          <div
            key={`${ranking.genreId}-${item.rank}-${item.itemUrl}`}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-bold text-gray-900">
                {item.rank}
              </div>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="h-20 w-20 shrink-0 rounded object-contain"
                />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-bold text-gray-900 dark:text-white">
                  {item.itemName}
                </h3>

                <p className="mt-1 text-xl font-bold text-red-600">
                  ¥{item.itemPrice.toLocaleString()}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.shopName}
                </p>

                <p className="mt-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                  {item.postageFlag === 0
                    ? "🟢 送料無料"
                    : "🔴 送料別途"}
                </p>

                <a
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                >
                  楽天で見る
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="button"
          onClick={search}
          className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          価格を比較する
        </button>
      </div>

      {/* =========================
          ランキング
      ========================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          今日の人気ランキング
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          楽天市場のランキングから、ベビー用品の人気商品を紹介します。
        </p>

        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            ランキングを取得中...
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-950">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* 紙おむつ */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                🍼 紙おむつ
              </h3>

              {renderRanking(rankings.diapers)}
            </div>

            {/* 粉ミルク */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                🥛 粉ミルク
              </h3>

              {renderRanking(rankings.formula)}
            </div>

            {/* おしりふき */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                🧻 おしりふき
              </h3>

              {renderRanking(rankings.wipes)}
            </div>
          </div>
        )}
      </section>

      {/* =========================
          APIクレジット
      ========================= */}
      <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4">
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