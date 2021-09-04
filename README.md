# Virag 
## 概要
- 刺繍デザインイメージエディタ
![image](https://user-images.githubusercontent.com/38471145/130343108-65c0acec-3ee5-4536-9e25-93a644aa0794.png)

## デプロイ環境
https://react-virag.vercel.app/
- Hosting: Vercel
- DB:FireStore


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Function deploy
- function/srcの内容がfirestore.functionに反映されるはず
    -  DBの連動更新用 
```
firebase deploy --only functions
```

## 20210717
- 以下のエラーが出たためにkonvaのpackage.jsonからtype:moduleの項目を削除した
```
エラーが発生しました。Must use import to load ES Module: /Users/sayoko/Documents/GitHub/GS/react-virag/node_modules/konva/lib/Core.js
ESモジュールのrequire()はサポートされていません。
users/sayoko/Documents/GitHub/GS/react-virag/node_modules/konva/lib/Core.jsのrequire()は、最も近い親のpackage.jsonに "type "が含まれている.jsファイルであるため、ESモジュールファイルです。パッケージスコープ内のすべての.jsファイルをESモジュールとして定義する「module」が含まれているからです。
代わりに Core.js の名前を .cjs に変更するか、import() を使用するように必要なコードを変更するか、または /Users/s/ja から "type": "module" を削除してください。/Users/sayoko/Documents/GitHub/GS/react-virag/node_modules/konva/package.jsonから "module "を削除してください。
```
## 20210822
コンパイル時にkonvaとがreact-image-sizeがエラーとなる 
→　next-transpile-modulesでimage１ーsizeはエラー対応できた。konvaはまだ引っかかる 
→ next/dynamicを用いてkonvaのSSRレンダリングを回避、部品として利用するコンポーネントをComponentsフォルダに移動
→　デプロイ
