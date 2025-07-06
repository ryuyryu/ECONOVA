const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

// React 版ゲーム画面で指標カードが表示されるか確認する

describe('index detail card', () => {
  test('リストクリックで説明が表示される', () => {
    // React 用のマウント要素だけを設置
    document.body.innerHTML = '<div id="root"></div>';

    // React をグローバルに登録してコンポーネントを描画
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { GameScreen } = require('../public/components/GameScreen.js');

    act(() => {
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(GameScreen)
      );
    });

    const statsBtn = document.getElementById('statsBtn');

    // サイドドロワーを開く
    act(() => {
      statsBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const list = document.querySelector('#drawer ul');
    expect(list.children.length).toBeGreaterThan(0);

    // 1つ目の指標をクリック
    act(() => {
      list.children[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // 詳細モーダルが表示されているか確認
    const modal = Array.from(document.querySelectorAll('div')).find((div) =>
      div.className.includes('max-w-3xl')
    );
    expect(modal).toBeTruthy();
  });
});
