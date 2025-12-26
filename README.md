# 護己 -Shuki-

日常に溶け込む、あなただけの防災。

## デプロイ方法

このプロジェクトをVercelにデプロイする手順は以下の通りです。

### 1. GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/shuki-app.git
git push -u origin main
```

### 2. Vercelでデプロイ

1. https://vercel.com にアクセス
2. GitHubでログイン
3. 「Add New」→「Project」
4. `shuki-app` を選択
5. 「Deploy」をクリック

## ローカルで動作確認

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 にアクセス
