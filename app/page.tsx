"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RankingItem = {
  rank: number;
  itemName: string;
  catchcopy?: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string | null;
  imageUrl?: string | null;
  mediumImageUrls?: string[];
  shopName?: string;
  pointRate?: number;
  postageFlag?: number;
};

type RankingCategory = {
  genreId: number;
  genreName: string;
  items: RankingItem[];
};

type RankingData = {
  diapers: RankingCategory;
  formula: RankingCategory;
  wipes: RankingCategory;
};

export default function Home() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  const [rankings, setRankings] =
    useState<RankingData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // ランキング取得
  // =========================
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "/api/ranking",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok || data.status !== 200) {
          throw new Error(
            data.error ||
              "ランキングの取得に失敗しました"
          );
        }

        setRankings(data.rankings);
      } catch (error) {
        console.error(
          "ランキング取得エラー:",
          error
        );

        setError(
          "ランキングの取得に失敗しました。時間をおいて再度お試しください。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // =========================
  // 検索
  // =========================
  const search = () => {
    const word = keyword.trim();

    if (!word) return;

    router.push(
      `/search?keyword=${encodeURIComponent(
        word
      )}`
    );
  };

  // =========================
  // ランキングカード
  // =========================
  const RankingSection = ({
    category,
  }: {
    category: RankingCategory;
  }) => {
    return (
      <section className="mt-8">

        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          🏆 {category.genreName}ランキング
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          {category.items.map(
            (item, index) => {

              const image =
                item.imageUrl ||
                item.mediumImageUrls?.[0] ||
                "";

              return (
                <a
                  key={`${category.genreId}-${index}`}
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >

                  {/* ランク */}
                  <div className="mb-3 flex items-center gap-2">

                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900">
                      {item.rank}位
                    </span>

                    {item.rank <= 3 && (
                      <span className="text-lg">
                        ⭐
                      </span>
                    )}

                  </div>

                  {/* 画像 */}
                  <div className="flex h-40 items-center justify-center">

                    {image ? (
                      <img
                        src={image}
                        alt={item.itemName}
                        className="h-36 w-36 object-contain"
                      />
                    ) : (
                      <div className="text-sm text-gray-400">
                        画像なし
                      </div>
                    )}

                  </div>

                  {/* 商品名 */}
                  <h3 className="mt-3 line-clamp-3 font-bold text-gray-900 dark:text-white">
                    {item.itemName}
                  </h3>

                  {/* 価格 */}
                  <p className="mt-3 text-2xl font-bold text-red-600">
                    ¥
                    {Number(
                      item.itemPrice
                    ).toLocaleString()}
                  </p>

                  {/* ポイント */}
                  <p className="mt-1 text-sm font-bold text-orange-600">
                    {item.pointRate &&
                    item.pointRate > 1
                      ? `🔥 ポイント${item.pointRate}倍`
                      : "🟢 通常ポイント"}
                  </p>

                  {/* 送料 */}
                  <p className="mt-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                    {item.postageFlag === 0
                      ? "🟢 送料無料"
                      : "🔴 送料別途"}
                  </p>

                  {/* 店舗 */}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.shopName}
                  </p>

                  {/* ボタン */}
                  <div className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-center font-bold text-white">
                    楽天市場で見る
                  </div>

                </a>
              );
            }
          )}

        </div>

      </section>
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
          ランキング
      ========================= */}

      <div className="mt-10">

        <div className="mb-2">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            今日の売れ筋
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            楽天市場のランキングから、ベビー用品の売れ筋を紹介します。
          </p>

        </div>

        {/* ローディング */}
        {loading && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">

            <p className="font-bold text-gray-700 dark:text-gray-200">
              ランキングを取得しています…
            </p>

          </div>
        )}

        {/* エラー */}
        {!loading && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">

            <p className="font-bold text-red-700 dark:text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* ランキング */}
        {!loading &&
          !error &&
          rankings && (
            <>
              <RankingSection
                category={rankings.diapers}
              />

              <RankingSection
                category={rankings.formula}
              />

              <RankingSection
                category={rankings.wipes}
              />
            </>
          )}

      </div>

      {/* =========================
          フッター
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