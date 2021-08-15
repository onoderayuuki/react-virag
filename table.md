# viragtable
## リレーショナル
[ M ]
ユーザー
    ユーザーID

デザイン
    デザインID
    ユーザー
    JSON
    SIZE
    ...

モチーフ
    ユーザーID
    モチーフID
    モチーフパス
    タグ

シリーズ
    シリーズID
    シリーズ名
    シリーズの説明
→シリーズにモチーフを足しておくか？
    タグ
        モチーフID
        モチーフパス
    作成ユーザーID

[ T ]
（シリーズーモチーフ
    シリーズID
    モチーフID）

ユーザー利用シリーズ
    ユーザーID
    シリーズID

取得だけを考えたらやった方がいいのか？

## NOSQL
データ構造のイメージ
users: {                // コレクション
  xxx: {                // ドキュメント
    name: {             // データ > map
      first: 'tarou',   // データ > string
      last: 'yamada'    // データ > string
    },
    old: 27,            // データ > number
    posts: {            // サブコレクション
      111: {},          // ドキュメント
      222: {}           // ドキュメント
    }
  },
  yyy: {                // ドキュメント
    name: {             // データ > map
      first: 'satoshi', // データ > string
      last: 'suzuki'    // データ > string
    },
    old: 35,            // データ > number
    posts: {            // サブコレクション
      333: {}           // ドキュメント
    }
  }
}

アプリケーションから１回で読み出せることを１番に考える→冗長化して重複するのはあり
CloudFunctionとかで一括更新を組む

ユーザー
    デザイン
    モチーフ
    シリーズ
        ：作者かどうか
        モチーフ
デザイン
シリーズ
['3eGiqVO7lcuT87qbc1p4',
'NRjoS6it0AVf2kQPCytl',
'pH5DBrn1wil4h8VCBjPJ',
'r27iM9ECe92sv4yytKv2']