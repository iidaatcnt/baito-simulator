# バイト収入シミュレーター 仕様書

## 📋 プロジェクト概要

### 目的
「時給が高い＝稼げる」という受給思考の罠を可視化し、実質的な収入を正確に計算できるWebアプリケーション

### コンセプト
- ユーザーが自分で「時給の罠」を発見することを重視
- 警告メッセージではなく、データの可視化で気づきを促進
- 交通費も含めた現実的な収入計算

### ターゲットユーザー
- アルバイトを検討している学生・フリーター
- バイト選びで迷っている人
- 収入を最大化したい人

---

## 🎯 機能仕様

### 基本機能

#### 1. バイト情報入力
- **バイト名**: 文字列（例：居酒屋、家庭教師）
- **時給**: 数値（円）
- **週の労働時間**: 数値（時間）
- **週の勤務日数**: 数値（日）
- **1日の交通費**: 数値（円、往復分、支給の場合は0）

#### 2. 収入計算機能
- **総月収**: 時給 × 週労働時間 × 4週間
- **月間交通費**: 1日交通費 × 週勤務日数 × 4週間
- **実質月収**: 総月収 - 月間交通費

#### 3. データ管理機能
- バイト追加（初期値設定あり）
- バイト削除
- リアルタイム計算・表示更新

#### 4. 表示機能
- 入力フォーム（7列グリッド）
- 実質月収ランキング（降順）
- 最高時給バッジ表示
- 交通費詳細表示

---

## 🛠 技術仕様

### フロントエンド
- **フレームワーク**: Next.js 15.3.4+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **状態管理**: React useState

### バックエンド
- **現在**: フロントエンドのみ（静的）
- **将来拡張**: NestJS（API + データベース）

### デプロイ・インフラ
- **ホスティング**: Vercel
- **リポジトリ**: GitHub
- **ドメイン**: Vercelの自動ドメイン

### 依存関係
```json
{
  "dependencies": {
    "next": "15.3.4",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3.4.1",
    "eslint": "^8"
  }
}
```

---

## 🎨 UI/UX 設計

### デザイン原則
- **直感的操作**: 数値入力だけで即座に結果表示
- **視覚的対比**: 時給の高さと実収入の差を強調
- **発見重視**: 警告ではなくデータで気づかせる
- **モバイル対応**: レスポンシブデザイン

### カラーパレット
- **背景**: グラデーション（blue-50 to indigo-100）
- **メイン**: 白背景 + グレー枠線
- **強調**: 黄色（1位）、緑（収入）、紫（時給バッジ）
- **注意**: 赤（交通費表示）

### レイアウト構成
1. **ヘッダー**: タイトル + 説明
2. **入力エリア**: バイト情報入力フォーム
3. **追加ボタン**: 中央配置
4. **ランキング**: 実質月収順
5. **フッター**: 学習ポイント

---

## 💻 実装詳細

### ファイル構成
```
baito-simulator/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # メインコンポーネント（統合版）
│   │   └── globals.css
│   └── components/           # 将来のコンポーネント分割用
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md                 # この仕様書
```

### 主要インターフェース
```typescript
interface Job {
  id: number;
  name: string;
  hourlyWage: number;
  weeklyHours: number;
  workDaysPerWeek: number;
  transportCostPerDay: number;
}

interface IncomeData {
  gross: number;      // 総月収
  transport: number;  // 月間交通費
  net: number;        // 実質月収
}
```

### 重要な計算ロジック
```typescript
const calculateMonthlyIncome = (
  hourlyWage: number, 
  weeklyHours: number, 
  workDaysPerWeek: number, 
  transportCostPerDay: number
): IncomeData => {
  const grossIncome = hourlyWage * weeklyHours * 4;
  const transportCost = transportCostPerDay * workDaysPerWeek * 4;
  return {
    gross: grossIncome,
    transport: transportCost,
    net: grossIncome - transportCost
  };
};
```

### デフォルトデータ
```typescript
[
  { 
    id: 1, 
    name: '居酒屋', 
    hourlyWage: 1500, 
    weeklyHours: 30, 
    workDaysPerWeek: 5, 
    transportCostPerDay: 0 
  },
  { 
    id: 2, 
    name: '家庭教師', 
    hourlyWage: 2800, 
    weeklyHours: 2, 
    workDaysPerWeek: 1, 
    transportCostPerDay: 800 
  }
]
```

---

## 🚀 デプロイ手順

### 初回セットアップ
```bash
# 1. プロジェクト作成
npx create-next-app@latest baito-simulator --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd baito-simulator

# 2. 依存関係インストール
npm install lucide-react

# 3. page.tsxを統合版に置き換え
# （上記の実装コードを使用）

# 4. GitHubリポジトリ作成
git init
git add .
git commit -m "Initial commit: Baito Simulator"
git remote add origin https://github.com/ユーザー名/baito-simulator.git
git push -u origin main
```

### Vercelデプロイ
1. https://vercel.com でGitHubログイン
2. New Project → baito-simulatorリポジトリ選択
3. Deploy実行（設定変更不要）

### 更新デプロイ
```bash
git add .
git commit -m "Update: 変更内容"
git push origin main
# Vercelが自動でビルド・デプロイ
```

---

## 📈 今後の拡張計画

### Phase 1: 機能拡張
- [ ] データ永続化（ローカルストレージ）
- [ ] CSVエクスポート機能
- [ ] 時間単位の詳細計算
- [ ] 年収・税金計算

### Phase 2: バックエンド実装
- [ ] NestJS API開発
- [ ] データベース（PostgreSQL）
- [ ] ユーザー認証
- [ ] データ保存・共有機能

### Phase 3: 高度な機能
- [ ] バイト求人情報API連携
- [ ] 地域別最低賃金データ
- [ ] グラフ・チャート表示
- [ ] レコメンド機能

### Phase 4: プラットフォーム拡張
- [ ] モバイルアプリ（React Native）
- [ ] 企業向けダッシュボード
- [ ] 多言語対応

---

## 🔍 トラブルシューティング

### よくある問題

#### 1. Module not found エラー
```
Module not found: Can't resolve '@/components/BaitoSimulator'
```
**解決**: page.tsxでコンポーネントを統合実装する

#### 2. Turbopack選択
```
? Would you like to use Turbopack for `next dev`?
```
**推奨**: No（安定性重視）

#### 3. ビルドエラー
- TypeScript型エラー → インターフェース定義確認
- Import/Export エラー → パス設定確認
- CSS エラー → Tailwindクラス名確認

### デバッグ手順
1. `npm run dev` でローカル動作確認
2. TypeScriptエラーチェック
3. Git status で変更確認
4. Vercelログ確認

---

## 📞 開発再開時のチェックリスト

### 新しいチャットで開発を始める際
- [ ] この仕様書を参照
- [ ] GitHubリポジトリURL確認
- [ ] Vercelデプロイ状況確認
- [ ] 現在の機能範囲確認
- [ ] 次の実装目標設定

### リポジトリ情報
- **GitHub**: https://github.com/iidaatcnt/baito-simulator
- **Vercel**: （デプロイ後のURL）
- **ローカル開発**: `npm run dev` → http://localhost:3000

---

## 📝 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|------------|----------|---------|
| 2025-07-01 | v1.0.0 | 初期実装・仕様書作成 | Claude |

---

## 📄 ライセンス

MIT License

---

*この仕様書により、新しいチャットでも継続的な開発が可能です。質問や不明点があれば、この仕様書を参照してください。*