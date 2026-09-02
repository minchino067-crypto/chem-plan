# 二次化学 26週ノート

金沢大学 理系一括 二次試験 化学の6ヶ月計画（2026/8/31 – 2027/2/28、全26週）を回すためのWebアプリ。
内容はPDF版『金沢大_二次化学_6ヶ月計画ノート』と同一。

- ログイン不要。リンクを開けば誰でもそのまま使える
- 記録はブラウザ（localStorage）に保存。オフラインでも動く
- ホーム画面に追加するとアプリとして開く（PWA）
- 同期コードを設定すると、PCとスマホで記録が一致する（任意）

## ファイル

| ファイル | 中身 |
|---|---|
| `index.html` | ページの骨組み |
| `app.css` | 見た目 |
| `app.js` | **26週の計画データ**と画面の全部 |
| `sync.js` | 端末間同期（Firebase）。無くても本体は動く |
| `firebase-config.js` | 同期の接続先。空でよい |
| `sw.js` | オフライン用。中身を更新したら `VERSION` を上げる |
| `manifest.webmanifest` | ホーム画面に追加したときの名前とアイコン |

## 計画の中身を直す

`app.js` の冒頭にある `WEEKS` 配列がすべて。1週ぶんが1オブジェクトで、

```js
{n:1, start:"2026-08-31", ph:"kiso", short:"構成", title:"…",
 note:"…", tasks:[月,火,水,木,金,土,日], conds:[条件1,条件2,条件3]}
```

`tasks` は必ず7件（曜日とずれるとその週だけ表示が狂う）。`ph` は分野キーで
`kiso / riron / muki / yuki / kobun / kyote / ensyu`。

アプリ上の「内容を編集」で書き換えた分はブラウザ側に保存され、`app.js` より優先される。
計画そのものを恒久的に変えるなら `app.js` を直す。

`planner.py`（PDF生成スクリプト）の `weeks` と同じ内容なので、**片方だけ直すとPDFとアプリがずれる。**

## ローカルで開く

```bash
npx serve chem-plan
```

`file://` で直接開くとService Workerが動かないので、確認するときはHTTPで。

## GitHub Pages に公開する

```bash
gh auth login
```

そのあと（リポジトリ作成〜公開）:

```bash
gh repo create chem-plan --public --source=. --remote=origin --push
```

GitHub の Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `(root)` にすると
`https://<ユーザー名>.github.io/chem-plan/` で開く。

更新するときは `git add -A && git commit -m "…" && git push` だけ。1〜2分で反映される。

## 同期のセットアップ（任意）

PCとスマホで記録を一致させたいときだけ。無料枠で足りる。

1. https://console.firebase.google.com でプロジェクトを作る（Googleアカウントが要る。Analyticsは不要）
2. **Firestore Database** を作る。モードは「本番環境」、ロケーションは `asia-northeast1`
3. **Authentication** → Sign-in method → **匿名** を有効にする
   （ログイン画面は出ない。端末に匿名IDを配るだけ）
4. Authentication → Settings → 承認済みドメイン に `<ユーザー名>.github.io` を追加
5. プロジェクトの概要 → **ウェブアプリを追加**（`</>`）。表示される `firebaseConfig` を
   `firebase-config.js` にそのまま貼る
6. Firestore → ルール を下記に置き換えて「公開」
7. `git push` して、アプリの「設定」タブ →「同期コードを作る」
8. 出てきたリンクを自分にLINEなどで送り、スマホで開く。それだけで繋がる

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /plans/{code} {
      allow read: if request.auth != null && code.size() >= 12;
      allow write: if request.auth != null
                   && code.size() >= 12
                   && request.resource.data.state is string
                   && request.resource.data.state.size() < 700000;
    }
  }
}
```

同期コードは実質パスワード。**知っている人は記録を読み書きできる**ので人に見せない。
漏れたら「設定」で新しいコードを作り直す（古い文書はFirebaseコンソールから消す）。

`firebase-config.js` の値はブラウザに配られる前提の公開設定で、秘密鍵ではない。
防御は上のルール（匿名認証を通っていること・コードが12文字以上・1件700KB未満）で行っている。

## 注意

- ブラウザの履歴・サイトデータを消すと記録も消える。「設定」タブから
  ときどきJSONで書き出しておくと安全
- 試験日（共テ 1/16、二次 2/25）は例年からの見込み。募集要項が出たら
  「ルール」タブの日付を直す。カウントダウンが連動する
