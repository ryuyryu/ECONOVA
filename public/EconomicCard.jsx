import React from 'react';
// ビルド後は .js 拡張子になるため、拡張子なしでインポート
import SparkChart from './SparkChart';

/**
 * 経済指標カードのサンプルコンポーネント
 * SparkChart を使ってグラフを表示します
 */
const EconomicCard = () => {
  // サンプルデータ（月ごとのCPI）
  const values = [100, 103, 101, 104, 107, 110, 108];
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];

  // 使い方メモに表示するHTML
  // 箇条書きではなく文章として表示します
  const usageHTML = `
    <p>
      指数の動きを簡潔に確認できます。<br />
      グラフ上を指でなぞると値が表示されます。<br />
      上昇すると購買力が低下し景気を冷やします。
    </p>`;

  return (
    // ECOBOX と同じダーク系のデザインに変更
    // アクセントとして境界線に cyan 系の色を追加
    <div className="p-4 font-sans bg-gradient-to-b from-slate-800 to-slate-700 text-white rounded-xl shadow-md border-2 border-cyan-400 w-full max-w-md">
      {/* タイトル */}
      <p className="text-sm font-bold mb-2">CPI（消費者物価指数）</p>
      {/* スパークラインと使い方メモ */}
      <div className="flex items-start">
        <div className="w-1/3 pr-2 border-r border-slate-500">
          <SparkChart data={values} labels={labels} />
        </div>
        <div
          className="usage-note ml-2 flex-1 text-sm text-slate-200 p-2 rounded-lg shadow-inner border border-slate-500 bg-slate-900/40"
          dangerouslySetInnerHTML={{ __html: usageHTML }}
        />
      </div>
      {/* 補足説明 */}
      <p className="text-xs text-slate-300 mt-2">前月比 +2.3%</p>
    </div>
  );
};

export default EconomicCard;
