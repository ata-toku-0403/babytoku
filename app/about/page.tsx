export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* =========================
          タイトル
      ========================= */}
     <h2 className="inline-block text-3xl font-bold text-gray-900 hover:underline dark:text-white">
       ベビトクについて
     </h2>

      {/* =========================
          このサイトについて
      ========================= */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ベビトクとは
        </h2>

        <div className="mt-4 space-y-4 leading-7 text-gray-700 dark:text-gray-300">
          <p>
            ベビトクは、子育て世代のお買い物を少しでもおトクにすることを目的として、
            管理者が身内で利用するために作り始めた価格比較サイトです。
          </p>

          <p>
            紙おむつ、粉ミルク、おしりふきなど、
            子育て中に日常的に購入する商品について、
            楽天市場やYahoo!ショッピングなどの情報を比較し、
            「どこで買うとおトクなのか」を分かりやすく確認できるサイトを目指しています。
          </p>

          <p>
            まだまだ小さなサイトですが、
            実際に子育てをしながら「こんな機能があったら便利なのに」
            と思ったものを少しずつ追加しています。
          </p>
        </div>
      </section>

      {/* =========================
          情報について
      ========================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          掲載情報について
        </h2>

        <div className="mt-4 space-y-4 leading-7 text-gray-700 dark:text-gray-300">
          <p>
            ベビトクでは、各ショッピングサイトが提供するAPIなどを利用して、
            商品情報、価格、ポイント、ランキングなどの情報を取得しています。
          </p>

          <p>
            そのため、ベビトクに表示されている価格やポイントなどの情報と、
            実際の販売ページに表示されている情報が異なる場合があります。
          </p>

          <p>
            商品を購入される際には、必ずリンク先の販売ページで
            最新の価格、送料、ポイント、販売条件などをご確認ください。
          </p>
        </div>
      </section>

      {/* =========================
          リンク先について
      ========================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          リンク先でのトラブルについて
        </h2>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-5 leading-7 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <p>
            ベビトクから各ショッピングサイトへ移動した後の、
            商品の購入、配送、返品、キャンセル、販売店とのやり取り、
            その他のトラブルについて、ベビトク管理者は責任を負いません。
          </p>

          <p className="mt-4">
            商品の購入やサービスの利用については、
            各ショッピングサイトおよび販売店の利用規約・販売条件をご確認ください。
          </p>
        </div>
      </section>

      {/* =========================
          アフィリエイトについて
      ========================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          アフィリエイトについて
        </h2>

        <div className="mt-4 space-y-4 leading-7 text-gray-700 dark:text-gray-300">
          <p>
            ベビトクでは、サイトの運営・開発費用などに充てるため、
            一部の商品リンクについてアフィリエイトプログラムを利用しています。
          </p>

          <p>
            ベビトクを経由して商品を購入された場合、
            ベビトク管理者に紹介料が支払われることがあります。
          </p>

          <p>
            なお、アフィリエイトによって商品価格が利用者にとって
            高くなることはありません。
          </p>

          <p>
            ベビトクでは、アフィリエイト報酬の有無だけを理由として
            商品をおすすめするのではなく、
            価格やポイント、内容量などを比較し、
            利用者にとって分かりやすい情報を提供することを目指しています。
          </p>
        </div>
      </section>

      {/* =========================
          楽天
      ========================= */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          楽天市場について
        </h3>

        <p className="mt-2 leading-7 text-gray-700 dark:text-gray-300">
          ベビトクでは、楽天市場の商品情報を楽天が提供するAPIを利用して取得しています。
          商品ページへのリンクには、楽天アフィリエイトの仕組みを利用している場合があります。
        </p>
      </section>

      {/* =========================
          Amazon
      ========================= */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Amazonについて
        </h3>

        <p className="mt-2 leading-7 text-gray-700 dark:text-gray-300">
          ベビトクでは、Amazonの商品検索などについて、
          Amazonアソシエイト・プログラムを利用しています。
          Amazonへのリンクを経由して商品が購入された場合、
          ベビトク管理者が紹介料を受け取る場合があります。
        </p>
      </section>

      {/* =========================
          ご意見・お問い合わせ
      ========================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ご意見・お問い合わせ
        </h2>

        <div className="mt-4 space-y-4 leading-7 text-gray-700 dark:text-gray-300">
          <p>
            ベビトクは、実際に子育てをしながら少しずつ作っているサイトです。
          </p>

          <p>
            「こんな商品も比較してほしい」
            「こんな機能があったら便利」
            「ここが使いにくい」
            など、ご意見があればぜひお知らせください。
          </p>

          <p>
            いただいたご意見を参考にしながら、
            少しずつ便利なサイトにしていきたいと思っています。
          </p>
        </div>

        {/* お問い合わせボタン */}
        <div className="mt-6">
          <a
            href="/contact"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            管理者に連絡する
          </a>
        </div>
      </section>

      {/* =========================
          最後に
      ========================= */}
      <section className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          ベビトクは個人で運営・開発している小さなサイトです。
          至らない点もあるかと思いますが、
          子育て中の方のお買い物が少しでもおトクで便利になるよう、
          少しずつ改善していきます。
        </p>
      </section>

      {/* =========================
          戻る
      ========================= */}
      <div className="mt-10">

        <a
          href="/"
          className="inline-block rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          ← トップページへ戻る
        </a>
      </div>
    </main>
  );
}