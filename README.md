# Portfolio

Next.js App Router / TypeScript / Tailwind CSSで構築したポートフォリオ。

## 開発

WSL2 Ubuntuの既存nvm環境を使う。Node.js 22以上、pnpm 11が必要。

```sh
cd ~/Projects/portfolio
pnpm install
pnpm dev
```

- サイト: http://localhost:3000/portfolio/
- 記事編集: http://localhost:3002/

`pnpm dev`はサイトと編集用Next.jsを起動する。Ctrl+Cで両方終了する。
サイトだけ起動する場合は`pnpm dev:site`、編集画面だけなら`pnpm dev:editor`を使う。

## 記事・スキルの編集

開発サイトの「記事を書く」からBlockNote編集画面を開く。
記事名、紹介、担当、タグ、制作体制・期間、外部リンク、本文を編集して保存する。
新しい記事は下書きで作成され、「公開する」を選んだ記事だけがサイトに出る。
下書きの記事に属するメディアフォルダも公開用出力から除外する。
本文は「/」から見出し・リスト・画像・動画などを挿入できる。

新規記事は「概要」「制作の目的」「担当したこと」「工夫した点」の見出しから始まる。
共通の入口の後は、作品ごとの技術解説や画像・動画を自由に追加する。
目次は本文の見出しから自動生成する。編集画面で構成を確認でき、公開記事では
クリックによる移動、PCでの追従表示、スマートフォンでの折りたたみに対応する。
動画は操作ボタン付きで再生し、自動再生はしない。

| 保存先                         | 内容                             |
| ------------------------------ | -------------------------------- |
| `content/projects/<slug>.json` | 作品情報とBlockNote本文          |
| `content/skills.json`          | 得意分野、技術名と習熟度         |
| `public/media/<slug>/`         | アップロードした画像・動画・音声 |

保存はローカルファイルの更新で、コミットや公開は行わない。
ブラウザーはファイルを直接編集せず、編集画面と同じlocalhost:3002のAPIへ送信する。
WSL2上のNode.jsが内容を検証し、JSONやメディアファイルとして保存する。
編集画面とAPIは同一オリジンなので、この保存処理にCORSの許可設定は不要。
制作人数・期間は空欄でもよい。習熟度は本人の自己評価を設定する。
アップロードは1ファイル100MBまで。PNG、JPEG、GIF、WebP、AVIF、MP4、WebM、MP3、WAVに対応する。
100MBを超える動画は`public/media/<slug>/`へ直接置き、記事の動画ブロックから参照できる。
本文から削除したメディアは自動削除しない。不要になったファイルは使用箇所を確認して削除する。

制作実績・制作中の一覧は`content/collections.json`で編集する。
技術タグ・紹介文・任意の画像と外部リンクを持ち、個別記事は作らない。
作品記事のカバーは記事編集画面から変更できる。

## 構成

- `src/app/`: 公開ページ。トップ、スキル、`works/[slug]`の実績記事
- `src/components/`: 表示部品と絞り込み操作
- `src/lib/`: コンテンツの型・検証・ファイル読み込み
- `studio/`: 開発専用のNext.js編集アプリ。公開用ビルドから分離

ページ本体はServer Component。タグや並び替えはClient Componentで状態を扱う。
記事は`generateStaticParams`でページを列挙し、ビルド時にBlockNoteのJSONからHTMLを生成する。
編集APIはローカル開発時のみ動作し、公開サイトにファイル保存APIは含めない。

## Git LFSと公開

画像・動画・音声は`.gitattributes`の指定に従いGit LFSで管理する。

```sh
git lfs install --local
pnpm test
pnpm build
pnpm typecheck
pnpm typecheck:editor
```

GitHub Pagesの公開元をGitHub Actionsに設定する。
mainへのpush時にLFSの実ファイルを取得し、静的出力した`out/`をPagesへ配信する。
GitHub PagesからLFSポインターを直接配信する構成にはしない。
公開先は https://cotore-game.github.io/portfolio/ 。

公開用ビルドでは開発専用リンクを出力しない。`scripts/verify-public-output.mjs`で、
編集リンクや編集用URL、編集画面・APIの出力が残っていないことを検査する。
