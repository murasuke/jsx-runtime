// import { h } from './jsx-factory.js';
import { h } from './jsx-factory-min.js';
import { Border } from './Border.js';

/**
 * 画面表示時のサンプル UI を初期化して `#app` に追加します。
 */
function initApp() {
  let count = 0;
  let counter = (<div>Count: {count}</div>) as HTMLDivElement;

  /**
   * カウントを 1 増やし、既存の要素のテキストだけを書き換えます。
   */
  const handleInc = () => {
    counter.innerText = `Count: ${++count}`;
  };

  const marginStyle: Partial<CSSStyleDeclaration> = { margin: '5px' };

  const elements = (
    <Border>
      {counter}
      <button style={{ color: 'blue', ...marginStyle }} onclick={handleInc}>
        Increment
      </button>
      <button style={{ color: 'red', ...marginStyle }} onclick={handleDec}>
        Decrement
      </button>
    </Border>
  );

  /**
   * カウントを 1 減らし、新しい要素を作って既存要素と置き換えます。
   */
  function handleDec() {
    const replacement = (<div>Count: {--count}</div>) as HTMLDivElement;
    elements.replaceChild(replacement, counter);
    counter = replacement;
  }

  const app = document.getElementById('app');
  if (!app) {
    throw new Error('#app was not found.');
  }

  app.appendChild(elements);
}

document.addEventListener('DOMContentLoaded', initApp);
