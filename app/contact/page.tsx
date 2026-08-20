export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =================================================
          サイトタイトル
      ================================================= */}

      <a
        href="/"
        className="text-3xl font-bold text-gray-900 hover:underline dark:text-white hover:opacity-70"
      >
        ベビトク
      </a>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        子育て世代のおトクを増やす。
      </p>


      {/* =================================================
          タイトル
      ================================================= */}

      <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
        お問い合わせ
      </h1>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        ベビトクをご利用いただきありがとうございます。
      </p>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        「こんな商品も比較してほしい」「こんな機能が欲しい」など、
        ベビトクについてのご意見・ご要望がありましたら、
        下記のフォームからお知らせください。
      </p>


      {/* =================================================
          Googleフォーム
      ================================================= */}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          お問い合わせフォーム
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Googleフォームが開きます。
          必要事項をご入力のうえ送信してください。
        </p>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSf6m2l_OCX7ZKv0VCqM6IYSyfKLiUR75E4XIHh-oAN2W0Ib_Q/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-lg bg-blue-600 px-6 py-3 text-center font-bold text-white hover:bg-blue-700"
        >
          お問い合わせフォームを開く
        </a>

      </div>


      {/* =================================================
          注意事項
      ================================================= */}

      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">

        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          ご利用にあたって
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          お問い合わせいただいた内容は、ベビトクの運営・改善のために利用します。
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          すべてのお問い合わせに回答できるとは限りませんので、あらかじめご了承ください。
        </p>

      </div>


      {/* =================================================
          トップへ戻る
      ================================================= */}

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