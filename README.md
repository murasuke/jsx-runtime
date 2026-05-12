# jquery-jsx

TypeScript で JSX を自前の関数に変換し、最終的に DOM ノードを生成する最小サンプルです。

このプロジェクトは「JSX が何に変換され、どこで DOM が作られるか」を追いやすくするために、2 段構成にしています。

1. [jsx-factory-min.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory-min.tsx)
   `any` ベースの最小実装です。まずはこちらを読むと、`h()` が `tag` / `props` / `children` を受け取り、DOM を組み立てる流れが分かります。
2. [jsx-factory.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory.tsx)
   最小構成を保ちつつ、TypeScript の型を付けた版です。`Child`、`Props`、`Component` を定義して、少し自然な TypeScript コードに寄せています。

## 何をしているか

TypeScript の JSX 変換設定で `h` を factory 関数として指定し、`<div>text</div>` のような記述を `h("div", null, "text")` に変換しています。

`h()` の役割は大きく 2 つだけです。

- タグ名を受けたら `document.createElement()` で要素を作る
- `props` と `children` を順番に処理して DOM に反映する

関数コンポーネントも同じ入口で扱っています。`<Border>...</Border>` のような記述は、最終的に `Border(props)` の呼び出しになります。

Fragment も最低限実装しており、型付き版では `DocumentFragment` を返します。

## JSX の仕組み

このサンプルで重要なのは、JSX はそのままブラウザで解釈される特別な構文ではなく、コンパイル時に単なる関数呼び出しへ変換されるという点です。

たとえば、次のような JSX があるとします。

```tsx
<div id="sample">hello</div>
<Border>hello</Border>
```

これは概ね次のような呼び出しに変換されます。

```tsx
h('div', { id: 'sample' }, 'hello')
h(Border, null, 'hello')
```

ここで違いになるのは、先頭が小文字か大文字かです。

- `<div>` のように小文字で始まる場合は、HTML タグ名の文字列として `h('div', ...)` に変換されます。
- `<Border>` のように大文字で始まる場合は、変数や関数として `h(Border, ...)` に変換されます。

このプロジェクトの `jsx-factory` では、その違いを `h()` の最初の分岐で処理しています。

- `tag` が文字列なら `document.createElement(tag)` で実際の DOM 要素を作る
- `tag` が関数なら、その関数をコンポーネントとして呼び出す

つまり、`Border.tsx` のようなコンポーネントは自分で最終的な DOM を返します。`Border` の中ではさらに `<div>` を使っているため、その JSX が再び `h('div', ...)` に変換され、そこで本物の DOM 要素が作られます。

流れを簡単に書くとこうなります。

```text
<Border>
  <button>Click</button>
</Border>

↓ JSX 変換

h(Border, null, h('button', null, 'Click'))

↓ h() の分岐

1. Border は関数なので Border(...) を呼ぶ
2. Border の戻り値に含まれる <div> は h('div', ...) に変換される
3. 'div' や 'button' は文字列なので document.createElement() で DOM 化される
```

React などのライブラリでは、この変換結果の先に仮想 DOM や差分更新があるため、JSX から実 DOM までの流れが見えにくくなりがちです。このサンプルではその途中段階を隠さず、JSX が最終的に `h()` に集約され、そこから DOM に変換される全体像を見える形にしています。

## 主なファイル

- [index.tsx](/E:/Users/tkykn/git/jquery-jsx/index.tsx)
  サンプル画面のエントリポイントです。カウンター UI を `#app` に追加します。
- [Border.tsx](/E:/Users/tkykn/git/jquery-jsx/Border.tsx)
  子要素を枠線付き `div` で囲む簡単な関数コンポーネントです。
- [jsx-factory-min.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory-min.tsx)
  学習用の最小版 factory です。型はほぼ `any` です。
- [jsx-factory.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory.tsx)
  型付きの factory です。
- [jsx-global.d.ts](/E:/Users/tkykn/git/jquery-jsx/jsx-global.d.ts)
  JSX のグローバル型定義です。
- [tsconfig.json](/E:/Users/tkykn/git/jquery-jsx/tsconfig.json)
  JSX 変換先として `h` と `Fragment` を指定しています。

## 実行方法

依存をインストールします。

```powershell
npm install
```

TypeScript をコンパイルします。

```powershell
.\node_modules\.bin\tsc.cmd -p .
```

出力先は [public](/E:/Users/tkykn/git/jquery-jsx/public) です。ブラウザでは [public/index.html](/E:/Users/tkykn/git/jquery-jsx/public/index.html) を開きます。

`type="module"` を使っているため、必要に応じて静的ファイルサーバーで `public` ディレクトリを配信してください。

## 読み方のおすすめ

最初に [jsx-factory-min.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory-min.tsx) を読み、次に [index.tsx](/E:/Users/tkykn/git/jquery-jsx/index.tsx) の JSX がどう `h()` に流れていくかを見ると理解しやすいです。

そのあとで [jsx-factory.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory.tsx) を読むと、最小実装に対してどこに型を付けると扱いやすくなるかが分かります。

## 補足

[index.tsx](/E:/Users/tkykn/git/jquery-jsx/index.tsx) では現在、学習用の [jsx-factory-min.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory-min.tsx) を import しています。型付き版を試したい場合は、`h` の import 先を [jsx-factory.tsx](/E:/Users/tkykn/git/jquery-jsx/jsx-factory.tsx) に切り替えてください。
