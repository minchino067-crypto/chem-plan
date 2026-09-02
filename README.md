# 二次化学 26週ノート

金沢大学 理系一括 二次試験 化学の6ヶ月計画（2026/8/31 – 2027/2/28、全26週）を回すためのWebアプリ。
内容はPDF版『金沢大_二次化学_6ヶ月計画ノート』と同一。

- 記録は **Firestore（クラウド）に保存**。端末には残らない
- 開けるのは **minchino067@gmail.com のGoogleアカウントだけ**。他のアカウントでは中身が見えない
- PCでもスマホでも、ログインすれば同じ内容が出る
- ホーム画面に追加するとアプリとして開く（PWA）
- 圏外でも動く。書いた内容は一時的に端末に貯まり、つながった時点で送られる

**注意：** GitHub Pages 無料プランではページのソースが公開になるため、
26週の計画表の文面自体はURLを知る人には読める。守られているのは記録
（チェック・時間・誤答・メモ）のほうで、これは上のアカウント以外からは読めない。

## ファイル

| ファイル | 中身 |
|---|---|
| `index.html` | ページの骨組み |
| `app.css` | 見た目 |
| `app.js` | **26週の計画データ**と画面の全部 |
| `sync.js` | ログインとクラウド保存（Firebase） |
| `firebase-config.js` | **保存先と、開けるメールアドレス**。ここが空だとアプリは開かない |
| `firestore.rules` | 誰が読み書きできるかの本体。ここが実際の防御 |
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

アプリ上の「内容を編集」で書き換えた分はクラウド側の記録に入り、`app.js` より優先される。
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

## 保存とログインのセットアップ（設定済み）

プロジェクト `chem-plan-260902-13737`（ロケーション asia-northeast1）で設定済み。
以下は作り直すときの手順。

### 1. CLIでログイン（自分のターミナルで）

```bash
npx -y firebase-tools login
```

### 2. プロジェクトと設定（CLIでできる分）

```bash
npx -y firebase-tools projects:create --display-name "chem-plan"
npx -y firebase-tools firestore:databases:create "(default)" --location asia-northeast1 --project chem-plan-260902-13737
npx -y firebase-tools apps:create web "chem-plan" --project chem-plan-260902-13737
npx -y firebase-tools apps:sdkconfig web --project chem-plan-260902-13737
```

最後のコマンドが出す `firebaseConfig` を `firebase-config.js` に貼る。

### 3. コンソールでの作業（CLIでできない分）

https://console.firebase.google.com で、作ったプロジェクトを開き:

1. **Authentication** → 始める → Sign-in method → **Google** を有効にする
2. Authentication → Settings → 承認済みドメイン に `minchino067-crypto.github.io` を追加

### 4. ルールを反映して公開

```bash
npx -y firebase-tools deploy --only firestore:rules --project chem-plan-260902-13737
git add -A && git commit -m "接続先を設定" && git push
```

### ルール（firestore.rules）

読み書きできるのは「Googleでログイン済み」かつ「メール確認済み」かつ
「アドレスが minchino067@gmail.com と一致」かつ「自分の文書」のときだけ。
画面側にも同じ判定があるが、守っているのはこのルール。
許可するアドレスを変えるときは `firestore.rules` と `firebase-config.js` の
`ALLOWED_EMAIL` の両方を直して、ルールを再デプロイする。

## 注意

- 記録はクラウドにあるので、ブラウザのデータを消しても消えない。
  ただし操作ミスに備えて「設定」タブからときどきJSONで書き出しておくと安全
- 試験日（共テ 1/16、二次 2/25）は例年からの見込み。募集要項が出たら
  「ルール」タブの日付を直す。カウントダウンが連動する
