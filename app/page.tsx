"use client";

import { useEffect, useState } from "react";

type RankingItem = {
  rank: number;
  itemName: string;
  itemPrice: number | string;
  itemUrl: string;
  affiliateUrl: string | null;
  imageUrl: string | null;
  shopName: string;
  pointRate: number | string;
  postageFlag: number;
};

type RankingData = {
  genreId: number;
  genreName: string;
  items: RankingItem[];
};

type Rankings = {
  diapers: RankingData | null;
  formula: RankingData | null;
  wipes: RankingData | null;
  bodySoap: RankingData | null;
  moisturizer: RankingData | null;
  babyFood: RankingData | null;
  toys: RankingData | null;
};

const initialRankings: Rankings = {
  diapers: null,
  formula: null,
  wipes: null,
  bodySoap: null,
  moisturizer: null,
  babyFood: null,
  toys: null,
};

export default function Home() {
  const [keyword, setKeyword] = useState("");

  const [rankings, setRankings] =
    useState<Rankings>(initialRankings);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

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
            data.error ||
              "ランキングの取得に失敗しました"
          );
        }

        if (!cancelled) {
          setRankings({
            diapers: data.rankings?.diapers ?? null,
            formula: data.rankings?.formula ?? null,
            wipes: data.rankings?.wipes ?? null,
            bodySoap:
              data.rankings?.bodySoap ??
              data.rankings?.bodysoap ??
              null,
            moisturizer:
              data.rankings?.moisturizer ??
              null,
            babyFood:
              data.rankings?.babyFood ??
              data.rankings?.babyfood ??
              null,
            toys:
              data.rankings?.toys ??
              null,
          });
        }
      } catch (error) {
        console.error(
          "ランキング取得エラー:",
          error
        );

        if (!cancelled) {
          setError(
            "ランキングを取得できませんでした。"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getRankings();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // 検索
  // =========================
  const search = () => {
    const word = keyword.trim();

    if (!word) return;

    window.location.href =
      `/search?keyword=${encodeURIComponent(word)}`;
  };

  // =========================
  // ランキング表示
  // =========================
  const renderRanking = (
    ranking: RankingData | null
  ) => {
    if (!ranking || !Array.isArray(ranking.items)) {
      return (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          ランキング情報を取得できませんでした。
        </p>
      );
    }

    if (ranking.items.length === 0) {
      return (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          ランキング商品がありません。
        </p>
      );
    }

    return (
      <div className="mt-4 space-y-3">
        {ranking.items.map(
          (item, index) => {
            const price =
              Number(item.itemPrice) || 0;

            const rank =
              Number(item.rank) || index + 1;

            const imageUrl =
              item.imageUrl || null;

            return (
              <div
                key={`${ranking.genreId}-${rank}-${index}`}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex gap-3">
                  {/* 順位 */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-bold text-gray-900">
                    {rank}
                  </div>

                  {/* 商品画像 */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.itemName || "商品画像"}
                      className="h-20 w-20 shrink-0 rounded object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 dark:bg-gray-700">
                      画像なし
                    </div>
                  )}

                  {/* 商品情報 */}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-bold text-gray-900 dark:text-white">
                      {item.itemName}
                    </h3>

                    <p className="mt-1 text-xl font-bold text-red-600">
                      ¥{price.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.shopName}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                      {Number(item.postageFlag) === 0
                        ? "🟢 送料無料"
                        : "🔴 送料別途"}
                    </p>

                    {item.itemUrl && (
                      <a
                        href={item.itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                      >
                        楽天で見る
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  };

  // =========================
  // ランキングジャンル
  // =========================
  const rankingSections = [
    {
      key: "formula",
      title: "🥛 粉ミルク",
      data: rankings.formula,
    },
    {
      key: "diapers",
      title: "👶 紙おむつ",
      data: rankings.diapers,
    },
    {
      key: "wipes",
      title: "🧻 おしりふき",
      data: rankings.wipes,
    },
    {
      key: "bodySoap",
      title: "🧴 ベビー用ボディソープ",
      data: rankings.bodySoap,
    },
    {
      key: "moisturizer",
      title: "💧 ベビー用保湿剤",
      data: rankings.moisturizer,
    },
    {
      key: "babyFood",
      title: "🍚 離乳食",
      data: rankings.babyFood,
    },
    {
      key: "toys",
      title: "🧸 赤ちゃん用おもちゃ",
      data: rankings.toys,
    },
  ];

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
          今日のランキング
      ========================= */}
      <section className="mt-10">

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          今日の人気ランキング
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          楽天市場のランキングから、ベビー用品の人気商品を紹介します。
        </p>

        {/* =========================
            読み込み中
        ========================= */}
        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            ランキングを取得中...
          </div>
        )}

        {/* =========================
            エラー
        ========================= */}
        {!loading && error && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300">
            {error}
            <p className="mt-2 text-sm">
              検索機能は通常どおり利用できます。
            </p>
          </div>
        )}

        {/* =========================
            ランキング
        ========================= */}
        {!loading && !error && (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {rankingSections.map(
              (section) => (
                <div
                  key={section.key}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>

                  {renderRanking(
                    section.data
                  )}
                </div>
              )
            )}

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