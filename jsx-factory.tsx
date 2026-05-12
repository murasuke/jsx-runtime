export type Child =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | Child[];

export type Props = {
  style?: Partial<CSSStyleDeclaration>;
  children?: Child;
  [key: string]: unknown;
};

export type Component = (props: Props & { children?: Child[] }) => Node;

/**
 * JSX の呼び出しを受け取り、DOM ノードまたは関数コンポーネントの結果に変換します。
 *
 * @param tag タグ名、または JSX から呼び出される関数コンポーネントです。
 * @param props 要素に設定する属性です。`null` の場合は属性なしとして扱います。
 * @param children JSX の子要素です。文字列、Node、配列を受け取れます。
 * @returns 生成した DOM ノードを返します。
 */
export function h(
  tag: string | Component,
  props: Props | null,
  ...children: Child[]
): Node {
  if (typeof tag === 'function') {
    return tag({
      ...(props ?? {}),
      children,
    });
  }

  const element = document.createElement(tag);

  if (props) {
    for (const key in props) {
      const value = props[key];

      if (value == null || key === 'children') {
        continue;
      }

      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
        continue;
      }

      if (key in element) {
        (element as any)[key] = value;
        continue;
      }

      element.setAttribute(key, String(value));
    }
  }

  /**
   * 子要素を再帰的に平坦化しながら `element` に追加します。
   *
   * @param child 追加対象の子要素です。
   */
  const append = (child: Child) => {
    if (Array.isArray(child)) {
      for (const nested of child) {
        append(nested);
      }
      return;
    }

    if (child == null || typeof child === 'boolean') {
      return;
    }

    if (child instanceof Node) {
      element.appendChild(child);
      return;
    }

    element.appendChild(document.createTextNode(String(child)));
  };

  for (const child of children) {
    append(child);
  }

  return element;
}

/**
 * Fragment (`<>...</>`) を受け取り、子要素だけをまとめた `DocumentFragment` を返します。
 *
 * @param param0 Fragment に渡された children です。
 * @returns 子要素を格納した `DocumentFragment` を返します。
 */
export function Fragment({ children = [] }: { children?: Child[] } = {}) {
  const fragment = document.createDocumentFragment();

  /**
   * 子要素を再帰的に平坦化しながら `fragment` に追加します。
   *
   * @param child 追加対象の子要素です。
   */
  const append = (child: Child) => {
    if (Array.isArray(child)) {
      for (const nested of child) {
        append(nested);
      }
      return;
    }

    if (child == null || typeof child === 'boolean') {
      return;
    }

    if (child instanceof Node) {
      fragment.appendChild(child);
      return;
    }

    fragment.appendChild(document.createTextNode(String(child)));
  };

  for (const child of children) {
    append(child);
  }

  return fragment;
}
