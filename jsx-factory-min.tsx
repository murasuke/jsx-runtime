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
    for (const prop in props) {
      if (prop === 'style') {
        // styleの追加
        for (const s in props[prop]) {
          elm.style[s] = props[prop][s];
        }
      } else if (/^on\w+/.test(prop)) {
        // イベントハンドラの追加
        elm.addEventListener(prop.substring(2), props[prop], false);
      } else {
        // 上記以外の属性を追加
        elm.setAttribute(prop, props[prop]);
      }
    }
  }

  // 子要素の追加
  if (Array.isArray(children)) {
    // 入れ子の配列を平坦化
    const flatten = children.flat(20);
    for (const child of flatten) {
      if (child == null || typeof child === 'boolean') {
        continue;
      }

      if (child instanceof Node) {
        // Nodeをそのまま追加(先に子側が生成され、それが渡される)
        elm.appendChild(child);
      } else {
        // 文字列や数値の場合、TextNodeを追加
        elm.appendChild(document.createTextNode(String(child)));
      }
    }
  }
  return elm;
}

/**
 * Fragment (`<>...</>`) を受け取り、子要素だけをまとめた `DocumentFragment` を返します。
 *
 * @param props JSX の都合で渡される props です。この最小実装では使用しません。
 * @param children Fragment の子要素です。
 * @returns 子要素を格納した `DocumentFragment` を返します。
 */
export function JsxFragmentFactory(props: any, ...children: any[]) {
  const fragment = document.createDocumentFragment();
  const flatten = children.flat(20);

  for (const child of flatten) {
    if (child == null || typeof child === 'boolean') {
      continue;
    }

    if (child instanceof Node) {
      fragment.appendChild(child);
    } else {
      fragment.appendChild(document.createTextNode(String(child)));
    }
  }

  return fragment;
}
