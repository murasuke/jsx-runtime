import { h } from './jsx-factory.js';
import type { Props } from './jsx-factory.js';

/**
 * 子要素を囲む枠線付きのコンテナを返します。
 *
 * @param param0 `div` に渡す属性と子要素です。`style` は既定の枠線スタイルにマージされます。
 * @returns 枠線付きの `div` 要素を返します。
 */
export function Border({ children, style, ...props }: Props & { children?: Props['children'][] }) {
  return (
    <div
      {...props}
      style={{
        border: '1px solid black',
        padding: '5px',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
