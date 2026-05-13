/**
 * JSX の呼び出しを受け取り、DOM ノードまたは関数コンポーネントの結果に変換します。
 *
 * @param tag タグ名、または JSX から呼び出される関数コンポーネントです。
 * @param props 要素に設定する属性です。`null` の場合は属性なしとして扱います。
 * @param children JSX の子要素です。文字列、Node、配列をそのまま受け取ります。
 * @returns 生成した DOM ノードを返します。
 */
export function h(tag: any, props: any, ...children: any[]) {
  if (typeof tag === 'function') {
    // 先頭が大文字のタグは関数に変換されるためそのまま呼び出す
    return tag({
      ...(props || {}),
      children,
    });
  }

  // elementを作成
  const elm = document.createElement(tag);
  // 属性を追加
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith('on') && typeof value === 'function') {
        // イベントハンドラの追加
        const eventName = key.slice(2).toLowerCase();
        elm.addEventListener(eventName, value);
      } else if (key === 'style' && typeof value === 'object') {
        // styleの追加
        Object.assign(elm.style, value);
      } else if (key === 'className') {
        elm.setAttribute('class', value);
      } else if (value != null && value !== false) {
        // 上記以外の属性を追加
        elm.setAttribute(key, String(value));
      }
    }
  }

  // 子要素の追加
  appendChildren(elm, children);
  return elm;
}

/**
 * 子要素を親要素に追加します。子要素が配列の場合は再帰的に処理します。
 * @param parent 子要素を追加する親要素です。
 * @param children 追加する子要素です。
 */
function appendChildren(parent: Node, children: any) {
  if (Array.isArray(children)) {
    children.forEach((child) => appendChildren(parent, child));
    return;
  }

  if (children == null || children === false || children === true) {
    return;
  }

  if (children instanceof Node) {
    parent.appendChild(children);
    return;
  }

  parent.appendChild(document.createTextNode(String(children)));
}
