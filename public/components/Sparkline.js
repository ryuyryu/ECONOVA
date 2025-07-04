// Sparkline コンポーネント
// 数値の履歴データを小さな折れ線グラフで表示する
(function () {
  const { useState, useEffect, useRef } = React;

  // height プロパティを渡すとグラフの高さを固定できます
  function Sparkline({ history, height }) {
  // 履歴が無ければ何も描画しない
  if (!history || history.length === 0) return null;

  // 親要素を参照してサイズを決定する
  const containerRef = useRef(null);
  // 描画サイズとマウスホバー位置を状態として保持
  const [size, setSize] = useState({ w: 300, h: height || 150 });
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    // コンポーネント表示後に幅を取得して高さと合わせる
    const update = () => {
      if (containerRef.current) {
        const base = containerRef.current.clientWidth;
        const w = base;
        const h = height || base / 3;
        setSize({ w, h });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [height]);

  // 表示範囲を決定するための最小値・最大値
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  // -----------------------------
  // 各データ点の位置を計算
  // 履歴が1件以下の時は線を引けないので step を0にする
  // -----------------------------
  const step = history.length <= 1 ? 0 : size.w / (history.length - 1);
  const points = history
    .map((v, i) => {
      const x = i * step;
      const y = size.h - ((v - min) / range) * size.h;
      return `${x},${y}`;
    })
    .join(' ');

  // ホバー処理
  const handleMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    // 履歴が1点のみの場合は常にその点を選択
    const step = history.length <= 1 ? 0 : size.w / (history.length - 1);
    const idx = step === 0 ? 0 : Math.round(x / step);
    if (idx >= 0 && idx < history.length) {
      const value = history[idx];
      const y = size.h - ((value - min) / range) * size.h;
      setHoverInfo({ index: idx, x, y });
    } else {
      setHoverInfo(null);
    }
  };
  const handleLeave = () => setHoverInfo(null);

  // 実際の描画要素を返す
  return React.createElement(
    'div',
    { ref: containerRef, className: 'sparkline-container', onPointerMove: handleMove, onPointerLeave: handleLeave },
    React.createElement(
      'svg',
      {
        viewBox: `0 0 ${size.w} ${size.h}`,
        width: size.w,
        height: size.h,
        className: 'sparkline',
      },
      React.createElement('line', { x1: 0, y1: size.h, x2: size.w, y2: size.h, stroke: '#ccc', strokeWidth: 1 }),
      React.createElement('line', { x1: 0, y1: 0, x2: 0, y2: size.h, stroke: '#ccc', strokeWidth: 1 }),
      React.createElement('polyline', { points, fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }),
      React.createElement('text', { x: size.w - 24, y: size.h - 2, fontSize: '10', fill: '#555' }, '時間'),
      hoverInfo && React.createElement('circle', { r: 4, className: 'sparkline-dot', style: { transform: `translate(${hoverInfo.x}px, ${hoverInfo.y}px)` } })
    ),
    React.createElement(
      'div',
      { className: 'sparkline-stats flex justify-between text-xs text-gray-500 mt-1' },
      React.createElement('span', { className: 'max-value' }, `最高: ${max.toFixed(1)}`),
      React.createElement('span', { className: 'min-value' }, `最低: ${min.toFixed(1)}`)
    )
  );
  }

  // Node からもブラウザからも使えるようにエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Sparkline };
  }
  if (typeof window !== 'undefined') {
    window.Sparkline = Sparkline;
  }
})();
