"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("機能について");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 現時点では送信処理はまだ行わない
    // 後からメール送信機能を追加します
    setSubmitted(true);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =================================================
          タイトル
      ================================================= */}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        お問い合わせ
      </h1>

      <p className="mt-3 text-gray-600 dark:text-gray-300">
        ベビトクについてのご意見・ご要望・不具合などがありましたら、
        こちらからお問い合わせください。
      </p>

      {/* =================================================
          お問い合わせフォーム
      ================================================= */}

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* お名前 */}

          <div>
            <label
              htmlFor="name"
              className="block font-bold text-gray-900 dark:text-white"
            >
              お名前
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="お名前"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* メールアドレス */}

          <div>
            <label
              htmlFor="email"
              className="block font-bold text-gray-900 dark:text-white"
            >
              メールアドレス
              <span className="ml-2 text-sm font-normal text-gray-500">
                必須
              </span>
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="example@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* お問い合わせ内容 */}

          <div>
            <label
              htmlFor="category"
              className="block font-bold text-gray-900 dark:text-white"
            >
              お問い合わせの種類
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="機能について">
                こんな機能が欲しい
              </option>

              <option value="商品について">
                この商品を追加してほしい
              </option>

              <option value="不具合について">
                表示・動作がおかしい
              </option>

              <option value="価格・ランキングについて">
                価格・ランキングについて
              </option>

              <option value="その他">
                その他
              </option>
            </select>
          </div>

          {/* メッセージ */}

          <div>
            <label
              htmlFor="message"
              className="block font-bold text-gray-900 dark:text-white"
            >
              お問い合わせ内容
              <span className="ml-2 text-sm font-normal text-gray-500">
                必須
              </span>
            </label>

            <textarea
              id="message"
              required
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="お問い合わせ内容をご入力ください"
              rows={8}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 注意書き */}

          <div className="rounded-lg bg-gray-100 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <p>
              ※お問い合わせいただいた内容は、ベビトクの改善や不具合の確認などの目的で利用します。
            </p>

            <p className="mt-2">
              ※現在、このフォームからの送信機能は準備中です。
            </p>
          </div>

          {/* 送信 */}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            送信する
          </button>

        </form>
      ) : (

        /* =================================================
           送信完了画面
        ================================================= */

        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">

          <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
            お問い合わせありがとうございます
          </h2>

          <p className="mt-3 text-green-700 dark:text-green-300">
            お問い合わせを受け付けました。
          </p>

          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ※現在はフォームの動作確認用です。
            実際のメール送信機能は後から追加します。
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            ベビトクに戻る
          </a>

        </div>
      )}

      {/* =================================================
          戻る
      ================================================= */}

      {!submitted && (
        <div className="mt-8 text-center">

          <a
            href="/"
            className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← ベビトクのトップページに戻る
          </a>

        </div>
      )}

    </main>
  );
}