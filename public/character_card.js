// キャラクター強化カードの簡単なスクリプト
// 閉じるボタンで前のページに戻ります
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // 履歴があれば戻る、なければindexへ
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }
});
