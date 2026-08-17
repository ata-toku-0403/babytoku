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
  reviewRate?: number | null;
  reviewCount?: number;
};

type RankingData = {
  key: string;
  genreId: number;
  genreName: string;
  emoji: string;
  items: RankingItem[];
};

export default function Home() {
  const [keyword, setKeyword] = useState("");

  const [ranking, setRanking] = useState<{
    rakuten: RankingData | null;
    yahoo: RankingData | null;
  }>({
    rakuten: null,
    yahoo: null,
  });

  const [theme, setTheme] = useState<{
    name: string;
    emoji: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // ランキング取得
  // ====================================================

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

        setRanking(data.rankings);
        setTheme(data.theme);
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

  // =====================================================
  // 検索
  // =====================================================

  const search = () => {
    const word = keyword.trim();

    if (!word) return;

    window.location.href = `/search?keyword=${encodeURIComponent(
      word
    )}`;
  };

  // =====================================================
  // ランキング表示
  // =====================================================

  const renderRanking = (
    ranking: RankingData | null,
    type: "rakuten" | "yahoo"
  ) => {
    if (!ranking) {
      return (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          ランキング情報を取得できませんでした。
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        {ranking.items.map((item) => (
          <a
            key={`${type}-${ranking.genreId}-${item.rank}-${item.itemUrl}`}
            href={item.itemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex gap-3">

              {/* 順位 */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-bold text-gray-900">
                {item.rank}
              </div>

              {/* 商品画像 */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="h-20 w-20 shrink-0 rounded object-contain"
                />
              )}

              {/* 商品情報 */}
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

                {/* Yahooレビュー */}
                {type === "yahoo" &&
                  item.reviewRate != null && (
                    <p className="mt-1 text-sm text-yellow-600">
                      ⭐ {item.reviewRate} (
                      {item.reviewCount?.toLocaleString()}件)
                    </p>
                  )}

                {/* 楽天送料 */}
                {type === "rakuten" && (
                  <p className="mt-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                    {item.postageFlag === 0
                      ? "🟢 送料無料"
                      : "🔴 送料別途"}
                  </p>
                )}

                {/* 今までボタンに見えていた部分 */}
                <span
                  className={`mt-2 inline-block rounded-lg px-4 py-2 text-sm font-bold text-white ${
                    type === "rakuten"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                >
                  {type === "rakuten"
                    ? "楽天で見る"
                    : "Yahoo!で見る"}
                </span>

              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

      {/* =================================================
          タイトル
      ================================================= */}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        ベビトク
      </h1>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        子育て世代のおトクを増やす。
      </p>


      {/* =================================================
          検索
      ================================================= */}

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


      {/* =================================================
          今日のランキング
      ================================================= */}

      <section className="mt-10">

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {theme
            ? `${theme.emoji} 今日の${theme.name}ランキング`
            : "今日の人気ランキング"}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          楽天市場とYahoo!ショッピングのランキングから、人気商品を紹介します。
        </p>


        {/* ローディング */}

        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            ランキングを取得中...
          </div>
        )}


        {/* エラー */}

        {error && !loading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-950">
            {error}
          </div>
        )}


        {/* ランキング */}

        {!loading && !error && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            {/* =========================================
                楽天
            ========================================= */}

            <div>

              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🟥 楽天市場
                </h3>
              </div>

              {renderRanking(
                ranking.rakuten,
                "rakuten"
              )}

            </div>


            {/* =========================================
                Yahoo!
            ========================================= */}

            <div>

              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🟧 Yahoo!ショッピング
                </h3>
              </div>

              {renderRanking(
                ranking.yahoo,
                "yahoo"
              )}

            </div>

          </div>
        )}

      </section>


      {/* =================================================
          APIクレジット
      ================================================= */}

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


          {/* =================================================
              サイト情報
          ================================================= */}

          <div className="mt-4 flex flex-wrap justify-center gap-5 text-sm">

            <a
              href="/about"
              className="text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              ベビトクについて
            </a>

            <a
              href="/contact"
              className="text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              お問い合わせ
            </a>

          </div>


          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            © ベビトク
          </p>

        </div>

      </footer>
    </main>
  );
}