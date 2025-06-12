// Reactを利用したゲーム画面のスクリプト
// 既存の game_screen.js と同等の機能を React コンポーネントで実装します

// React から必要なフックを取り出しておく
// React から useRef も取り出しておく
const { useState, useEffect, useRef } = React;

// 履歴の長さを一定に保つための定数
// カード内で30ターン分の推移を確認できるよう拡張
const MAX_HISTORY = 30;

// ----------------------
// スパークライン描画用コンポーネント
// ----------------------
// props.history : 数値の履歴配列
function Sparkline({ history }) {
  // 履歴がなければ描画しない
  if (!history || history.length === 0) return null;

  // 親要素のサイズを取得するための参照
  const containerRef = useRef(null);
  // SVG の幅と高さを状態として管理
  const [size, setSize] = useState({ w: 300, h: 150 });

  useEffect(() => {
    // 描画後に親要素の幅を取得してサイズを更新
    const update = () => {
      if (containerRef.current) {
        // 親要素（カード内のスパークライン用エリア）の幅をそのまま横幅とする
        // 横:縦 = 3:1 にしたいので高さは横幅の1/3とする
        const base = containerRef.current.clientWidth;
        const w = base;
        const h = base / 3;
        setSize({ w, h });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 最小値と最大値を求めてY座標を正規化
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  // データ数からX軸の間隔を求める
  const step = size.w / (history.length - 1);
  // 各点を"x,y"形式で並べる
  const points = history
    .map((v, i) => {
      const x = i * step;
      const y = size.h - ((v - min) / range) * size.h;
      return `${x},${y}`;
    })
    .join(' ');

  // 折れ線グラフと目盛り軸を描画
  return React.createElement(
    'div',
    { ref: containerRef, className: 'sparkline-container' },
    React.createElement(
      'svg',
      {
        viewBox: `0 0 ${size.w} ${size.h}`,
        width: size.w,
        height: size.h,
        className: 'sparkline',
      },
    // 横軸
    React.createElement('line', {
      x1: 0,
      y1: size.h,
      x2: size.w,
      y2: size.h,
      stroke: '#ccc',
      strokeWidth: 1,
    }),
    // 縦軸
    React.createElement('line', {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: size.h,
      stroke: '#ccc',
      strokeWidth: 1,
    }),
    // 折れ線
    React.createElement('polyline', {
      points,
      fill: 'none',
      stroke: '#3b82f6',
      strokeWidth: 2,
    }),
    // 最大値ラベル
    React.createElement('text', {
      x: 2,
      y: 10,
      fontSize: '10',
      fill: '#555'
    }, max.toFixed(1)),
    // 最小値ラベル
    React.createElement('text', {
      x: 2,
      y: size.h - 2,
      fontSize: '10',
      fill: '#555'
    }, min.toFixed(1)),
    // 横軸ラベル（時間）
    React.createElement('text', {
      x: size.w - 24,
      y: size.h - 2,
      fontSize: '10',
      fill: '#555'
    }, '時間')
    )
  );
}

// ----------------------
// 汎用的な指標カードコンポーネント
// ----------------------
// props.title  : カードのタイトル
// props.value  : 指標の数値
// props.unit   : 単位（%や円など）
// props.desc   : 指標の説明文
// props.onClose: 閉じる処理
// props.history: スパークライン用の履歴データ
function IndicatorCard(props) {
  return React.createElement(
    'div',
    { className: 'fixed inset-0 flex items-center justify-center z-40' },
    // カード背後の半透明背景
    React.createElement('div', {
      className: 'absolute inset-0 bg-black/40',
      onClick: props.onClose,
    }),
    // 実際のカード本体
    React.createElement(
      'div',
      {
        className:
          // 画面いっぱいより少し小さめに表示する
          'relative bg-white rounded-xl shadow-lg w-11/12 h-5/6 max-w-none p-4 space-y-3 z-10 flex flex-col',
      },
      // 右上に閉じるボタン
      // 閉じるためのバツボタン
      React.createElement(
        'button',
        {
          onClick: props.onClose,
          className: 'close-btn',
        },
        '✕'
      ),
      React.createElement(
        'h2',
        { className: 'text-lg font-bold' },
        props.title
      ),
      React.createElement(
        'p',
        { className: 'text-3xl font-mono text-center' },
        `${props.value.toFixed(1)}${props.unit}`
      ),
      React.createElement(
        'div',
        { className: 'flex items-center mt-2' },
        React.createElement(
          'div',
        // グラフ部分はカード幅の1/3だけ使用する
        { className: 'flex-shrink-0 w-1/3 pr-2' },
          React.createElement(Sparkline, { history: props.history })
        ),
        React.createElement(
          'p',
          { className: 'usage-note flex-1 text-sm text-gray-600 ml-2' },
          props.desc
        )
      ),
    ) // inner div の終了
  ); // IndicatorCard の戻り値を閉じる
} // IndicatorCard 関数の終了

function GameScreen() {
  // 経済指標を状態として管理
  // 10種類の経済指数をまとめて stats というオブジェクトで保持
  const [stats, setStats] = useState({
    money: 0,       // 所持金（ゲーム用）
    cpi: 100,       // 消費者物価指数
    unemp: 4.2,     // 失業率
    gdp: 1.8,       // GDP成長率
    rate: 0.0,      // 政策金利
    fx: 150.0,      // 為替レート USD/JPY
    yield: 0.9,     // 国債10年利回り
    cci: 100,       // 消費者信頼感指数
    pmi: 50,        // 製造業PMI
    debtGDP: -3.0,  // 財政赤字対GDP比
    trade: 1200     // 貿易収支
  });
  // 各指標ごとの履歴を保持するオブジェクト
  const [historyMap, setHistoryMap] = useState({
    cpi: [100],
    unemp: [4.2],
    gdp: [1.8],
    rate: [0.0],
    fx: [150.0],
    yield: [0.9],
    cci: [100],
    pmi: [50],
    debtGDP: [-3.0],
    trade: [1200],
  });
  // ドロワー表示のON/OFF
  const [drawerOpen, setDrawerOpen] = useState(false);
  // インジケーター一覧表示用の状態
  const [showIndicators, setShowIndicators] = useState(false);
  // 現在表示している指標カード
  const [activeIndicator, setActiveIndicator] = useState(null);
  // 画面右上のトースト用メッセージ
  const [toast, setToast] = useState(null);
  // 指数の前回値を保持するための参照
  const prevStatsRef = useRef(stats);
  // 各指数の変化量を状態として保持
  const [diffStats, setDiffStats] = useState({
    cpi: 0,
    unemp: 0,
    gdp: 0,
    rate: 0
  });

  // 各指標の情報をまとめたオブジェクト
  const indicatorInfo = {
    cpi: { label: '消費者物価指数', unit: '', desc: '物価の動きを示す指標です。' },
    unemp: { label: '失業率', unit: '%', desc: '働きたい人のうち職に就けない割合。' },
    gdp: { label: 'GDP成長率', unit: '%', desc: '国内総生産の伸び率。' },
    rate: { label: '政策金利', unit: '%', desc: '中央銀行が誘導する短期金利。' },
    fx: { label: '為替レート', unit: '円', desc: '1ドルあたりの円相場。' },
    yield: { label: '10年国債利回り', unit: '%', desc: '長期金利の代表的指標。' },
    cci: { label: '消費者信頼感指数', unit: '', desc: '消費者の景況感を表します。' },
    pmi: { label: '製造業PMI', unit: '', desc: '製造業の景気判断指標。' },
    debtGDP: { label: '財政赤字/GDP比', unit: '%', desc: '財政健全性を示す値。' },
    trade: { label: '貿易収支', unit: '', desc: '輸出から輸入を引いた額。' }
  };

  // statsが更新されるたびに変化量を計算
  useEffect(() => {
    const prev = prevStatsRef.current;
    setDiffStats({
      cpi: stats.cpi - prev.cpi,
      unemp: stats.unemp - prev.unemp,
      gdp: stats.gdp - prev.gdp,
      rate: stats.rate - prev.rate,
    });
    // 現在値を次回の比較用に保存
    prevStatsRef.current = stats;
  }, [stats]);

  // 経済指標を定期的に更新
  useEffect(() => {
    // タイマーIDを保持する変数
    let timer;

    // 経済指標を更新する関数
    const updateStats = () => {
      // 経済指標をランダムに変化させる
      setStats(prev => {
        const demand = Math.random() * 10;
        const supply = Math.random() * 10;
        const next = { ...prev };
        // シンプルな経済モデルでランダムに指標を変化させる
        next.cpi += (demand - supply) * 0.2;
        next.unemp += (supply - demand) * 0.05;
        next.rate += (demand - supply) * 0.01;
        next.gdp += (demand - supply) * 0.05;
        next.fx += (supply - demand) * 0.1;
        next.yield += (demand - supply) * 0.01;
        next.cci += (demand - supply) * 0.1;
        next.pmi += (demand - supply) * 0.1;
        next.debtGDP += (Math.random() - 0.5) * 0.05;
        next.trade += (Math.random() - 0.5) * 100;
        next.money += Math.floor(Math.random() * 500);

        // 各指標の履歴を更新
        setHistoryMap(hist => {
          const updated = { ...hist };
          Object.keys(indicatorInfo).forEach(key => {
            const arr = updated[key] ? [...updated[key]] : [];
            if (arr.length >= MAX_HISTORY) arr.shift();
            arr.push(next[key]);
            updated[key] = arr;
          });
          return updated;
        });

        return next;
      });
      // 次回の更新を5〜7秒後に設定
      timer = setTimeout(updateStats, 5000 + Math.random() * 2000);
    };

    // 初回の更新スケジュール
    timer = setTimeout(updateStats, 5000);

    // コンポーネントが消えるときタイマーを解除
    return () => clearTimeout(timer);
  }, []);

  // ドロワーの開閉
  const toggleDrawer = () => setDrawerOpen(o => !o);
  const closeDrawer = () => {
    setDrawerOpen(false);
    // ドロワーを閉じる際は一覧も閉じておく
    setShowIndicators(false);
  };

  // ドロワーのclassを状態に応じて生成
  const drawerClasses = [
    'fixed top-0 right-0 h-full w-2/3 sm:w-64',
    'bg-white shadow-lg z-30 overflow-y-auto',
    'transform transition-transform duration-300',
    'translate-x-full',
    drawerOpen ? 'drawer-open' : ''
  ].join(' ');

  const overlayClasses = [
    'fixed inset-0 bg-black/30',
    'transition-opacity duration-300',
    drawerOpen ? 'overlay-show' : ''
  ].join(' ');

  // 変化量を表示するためのヘルパー
  const diffElement = diff => {
    const sign = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const color = diff > 0 ? 'text-lime-400' : diff < 0 ? 'text-red-400' : 'text-gray-400';
    return React.createElement(
      'span',
      { className: `ml-1 ${color} animate-pulse diff-change` },
      sign
    );
  };

  return React.createElement(
    'div',
    { className: 'bg-gray-100 select-none' },
    // ヘッダー（タイトルとメニュー）
    React.createElement(
      'header',
      {
        className:
          'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 text-white px-4 py-1',
      },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center' },
        React.createElement('h1', { className: 'text-2xl font-bold three-d-text' }, 'ECON'),
        React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
      ),
      // 主要4指数を大きめに表示
      React.createElement(
        'div',
        {
          className:
            'mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm sm:text-lg font-mono text-center',
        },
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold',
          },
          `CPI: ${stats.cpi.toFixed(1)}`,
          diffElement(diffStats.cpi)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold',
          },
          `失業率: ${stats.unemp.toFixed(1)}%`,
          diffElement(diffStats.unemp)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold',
          },
          `金利: ${stats.rate.toFixed(1)}%`,
          diffElement(diffStats.rate)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold',
          },
          `GDP: ${stats.gdp.toFixed(1)}%`,
          diffElement(diffStats.gdp)
        )
      )
    ),
    // 表示すべき指標カード
    activeIndicator
      ? React.createElement(IndicatorCard, {
          title: indicatorInfo[activeIndicator].label,
          value: stats[activeIndicator],
          unit: indicatorInfo[activeIndicator].unit,
          desc: indicatorInfo[activeIndicator].desc,
          history: historyMap[activeIndicator],
          onClose: () => setActiveIndicator(null),
        })
      : null,
    // ドロワーオーバーレイ
    React.createElement('div', {
      id: 'drawerOverlay',
      className: overlayClasses,
      onClick: closeDrawer
    }),
    // ドロワー本体
    React.createElement(
      'div',
      {
        id: 'drawer',
        className: `${drawerClasses} flex flex-col`,
      },
      // インジケーターボタン
      React.createElement(
        'button',
        {
          id: 'statsBtn',
          className: 'text-left p-3 bg-gray-100 border-b',
          onClick: () => setShowIndicators(o => !o),
        },
        '📊 経済指標'
      ),
      showIndicators &&
        React.createElement(
          'ul',
          { className: 'p-4 space-y-2 text-sm list-none flex-1 overflow-y-auto' },
          Object.keys(indicatorInfo).map(key =>
            React.createElement(
              'li',
              {
                key,
                className: 'flex justify-between p-2 bg-gray-50 rounded cursor-pointer',
                onClick: () => {
                  setActiveIndicator(key);
                  closeDrawer();
                }
              },
              indicatorInfo[key].label,
              React.createElement(
                'span',
                null,
                indicatorInfo[key].unit === '%'
                  ? `${stats[key].toFixed(1)}%`
                  : `${stats[key].toFixed(1)}${indicatorInfo[key].unit}`
              )
            )
          )
        )
    ),
    // 上部トースト
    // トースト
    toast
      ? React.createElement(
          'div',
          { id: 'toast', className: 'fixed top-16 right-4 bg-red-600 text-white px-4 py-2 rounded shadow' },
          toast
        )
      : null
  );
}

// ReactDOM で画面に描画
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(GameScreen));

// Jest から関数を参照できるようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IndicatorCard, Sparkline };
}

