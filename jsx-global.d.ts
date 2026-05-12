import type { Props } from './jsx-factory.js';

// jsxの型定義
declare global {
  namespace JSX {
    type Element = Node;
    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements {
      [elemName: string]: Props;
    }
  }
}

export {};
