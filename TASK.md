# Task List

- [x] **プロジェクト初期化** <!-- id: 0 -->
  - [x] `src` ディレクトリ作成
  - [x] `.gitignore` 確認（`out/` の扱いなど）
  - [x] `requirements.txt` 作成（pandas, matplotlib）

- [x] **データアクセス層の実装** (`src/data.py`) <!-- id: 1 -->
  - [x] `get_db_connection()` 実装
  - [x] `load_events()`: 満塁弾候補のrawデータ取得
  - [x] `load_games()`: 試合スコア情報の取得

- [x] **ロジック層の実装** (`src/logic.py`) <!-- id: 2 -->
  - [x] `process_grandslams(events_df, games_df)`:
    - 満塁判定、イニングパース
    - A/Bチーム判定、以降得点計算
  - [x] `extract_high_scoring_innings(games_df)`:
    - 4点以上イニングの抽出
  - [x] データマージと指標算出（`post_run_rate`）

- [x] **集計・可視化の実装** (`src/viz.py`) <!-- id: 3 -->
  - [x] `generate_summary(df)`: グループ別集計
  - [x] `export_json(df, output_path)`: ダッシュボード用JSON出力（ `dashboard_data.json`）
  - [x] `plot_comparison(df, output_path)`: グラフ描画

- [x] **レポート生成・CLI実装** (`src/report.py`, `src/cli.py`) <!-- id: 4 -->
  - [x] `generate_markdown_report(summary_df, output_path)`
  - [x] CLIエントリーポイント実装（引数解析、メインフロー制御）

- [x] **Webダッシュボード実装** (`web/`) <!-- id: 6 -->
  - [x] Next.js プロジェクト初期化 (Tilewind CSS setup含む)
  - [x] `layout.tsx`: Noto Sans JP フォント設定、全体レイアウト
  - [x] `components/`: EventCard, Timeline, StatsChart コンポーネント作成
  - [x] `app/page.tsx`: ダッシュボードメイン画面実装（JSONデータ読み込み）
  - [x] **イントロダクション演出 (Hero Section)**: ストーリーテリング型のアニメーション実装 <!-- id: 6-1 -->

- [x] **全体動作確認** <!-- id: 7 -->
  - [x] `python -m src.cli` 実行で `out/dashboard_data.json` 生成
  - [x] `cd web && npm run dev` でダッシュボード動作確認

## プロジェクト完了 (2026-01-31)
- 分析パイプライン構築完了
- Webダッシュボード（Hero Animation含む）実装完了
- ブログ用ドラフト (`out/report.md`) 生成完了
