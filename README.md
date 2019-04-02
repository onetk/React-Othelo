## オセロ!
  - Refer to React tutorial
  - 参考
    - [Tutorial: Intro To React](https://reactjs.org/tutorial/tutorial.html)
    - [Reactチュートリアル: Intro To React【日本語翻訳】](https://mae.chab.in/archives/2943)
    - [React チュートリアル 日本語翻訳](http://better-than-i-was-yesterday.com/react-tutorial-japanese/)

### 引っかかりポイント
  - renderのjsx部分でmapを使ってループで定義した部分がunique key 警告
    - 繰り返し内で描画されるオブジェクトの区別がつかなくなり，差分レンダリングができなくなる
    - Unique key をmap等に明示的に指定することで回避
      - [Generating components in React](https://www.freecodecamp.org/forum/t/generating-components-in-react/224700)
      - [ReactComponentにおけるkeyは結構大事](https://h3poteto.hatenablog.com/entry/2016/01/03/013921)

  - スクロール隠し
    - 一部コンテンツでスクロールバーをwebkitを使わずに非表示にする
      - [スクロールさせる領域だけどスクロールバーは非表示にしたい。](https://qiita.com/naru0504/items/ff0c77775223dc5a9148)