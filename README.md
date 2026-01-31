# NPB Grand Slam Analysis Project (勢いは止まるのか検証)

## 概要
「満塁ホームランで大量得点した直後、攻撃の勢いは止まるのか？」という私の仮説を、実際のNPBデータ(2018~2025)を用いて定量的に検証するプロジェクトです。
分析の結果、**「勢いは止まらない（むしろ加速する）」** という傾向が明らかになりました。

本リポジトリには、データ抽出・分析から、結果をインタラクティブに可視化するWebダッシュボードまでのコードが含まれています。

## プロジェクト構成
- **`src/`**: データ分析パイプライン (Python)
  - SQLiteデータベースからイベントデータを抽出
  - 満塁ホームラン後の得点推移を集計
  - ダッシュボード用JSONデータの生成
- **`web/`**: 結果可視化ダッシュボード (Next.js + Tailwind CSS)
  - ストーリーテリング形式のイントロダクション
  - インタラクティブなデータ探索

## 技術スタック
- **Analysis**: Python 3 (pandas, sqlite3)
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Database**: SQLite (`yakyuu.db`)

## セットアップ & 実行手順

### 1. 前提条件
- Python 3.x
- Node.js 18+
- プロジェクトルートにデータソース `yakyuu.db` が配置されていること

### 2. データ分析の実行 (Python)
まず、データベースからデータを抽出し、分析結果のJSONを生成します。

```bash
# 仮想環境の作成と有効化（推奨）
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# 依存ライブラリのインストール
pip install -r requirements.txt

# 分析パイプラインの実行
python -m src.cli --out out
```
実行が完了すると、`out/` ディレクトリに以下のファイルが生成されます：
- `dashboard_data.json`: Webダッシュボード用データ
- `report.md`: 分析レポート（Markdown）
- `comparison_runs_after.png`: 比較チャート画像
- 各種CSVファイル

### 3. ダッシュボードの起動 (Web)
生成されたデータをWebアプリケーションに取り込み、ローカルサーバーを起動します。

```bash
# 1. データをWebアプリのpublicディレクトリにコピー
# Windows Command Prompt:
copy out\dashboard_data.json web\public\data.json
# PowerShell:
cp out/dashboard_data.json web/public/data.json
# Mac/Linux:
cp out/dashboard_data.json web/public/data.json

# 2. Webディレクトリへ移動
cd web

# 3. 依存パッケージのインストール
npm install

# 4. 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

## 著作権・ライセンス
本プロジェクトのソースコードは MIT License です。
分析に使用している元データ（`yakyuu.db`）および生成された集計データの権利は、データの提供元または管理者に帰属します。
