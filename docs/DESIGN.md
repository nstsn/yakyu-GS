# DESIGN.md

## 1. アーキテクチャ（MVP）
- 入力: `data/yakyuu.db`
- 処理: Python CLI（SQLiteから読み取り→加工→集計→出力）
- 出力: `out/` に CSV / PNG / Markdown

```
data/yakyuu.db
   │
   ├─(Extract)  event / games
   │
   ├─(Transform) 満塁弾イベント抽出・イニング情報整形・指標算出
   │
   ├─(Compare)  4点以上イニング（満塁弾あり/なし）で比較
   │
   └─(Output)   CSV + 図表 + ブログ下書き
```

## 2. データソース（テーブルと主要カラム）

### 2.1 `event` テーブル（プレー/打席イベント）
- game_id: 試合ID
- batter_player_id / pitcher_player_id: 打者/投手
- inning: "7T"（7回表）, "7B"（7回裏）など
- team: 攻撃側チームID（=イベントを起こしたチーム）
- on_base: 塁上状況（例: '123B' など）
- rbi: 打点
- hr: 本塁打フラグ（1/0）
- その他: h, 1b, 2b, 3b, bb, hbp, gdp, roe, k ...

### 2.2 `games` テーブル（試合単位・イニング別得点）
- game_id
- home_team_id / away_team_id
- visitor_inn1..12（ビジターの各回得点）
- home_inn1..12（ホームの各回得点）
- home_runs / visitor_runs（合計得点）
- season, date, ballpark ...

## 3. 主要ロジック

### 3.1 満塁ホームラン（GS）イベント抽出
判定（堅め）:
- hr = 1
- rbi = 4
- on_base が満塁（判定関数: 文字列に '1','2','3' が全て含まれる）
- inning をパースして inning_no（数値）と half（T/B）を取得
- inning_no <= 9 でフィルタ（9回固定）

出力（イベント単位）: `grandslam_events.csv`
- game_id
- team_id（A）
- inning（例: 7T）/ inning_no / half
- team_total_runs_1to9
- post_inning_runs_1to9
- remaining_off_innings_1to9
- post_run_rate = post_inning_runs_1to9 / remaining_off_innings_1to9
- grandslam_share_of_total = 4 / team_total_runs_1to9

### 3.2 Aがホームかビジターか判定
`games` とJOINして:
- team_id == home_team_id → Aはホーム → `home_inn*` を使う
- team_id == away_team_id → Aはビジター → `visitor_inn*` を使う
※どちらにも一致しない場合はデータ不整合としてスキップし、ログに残す。

### 3.3 「以降得点」と「残り攻撃イニング数」
- 以降得点: (inning_no+1)〜9の `*_innX` 合計
- 残り攻撃イニング数: 同区間の `*_innX` のうち NULL ではない回数
  - 9回裏なし等をここで自然に吸収する

### 3.4 比較対象：4点以上イニング（4+ inning）
`games` の `visitor_inn1..9` と `home_inn1..9` をlong化して
- (game_id, team_id, inning_no, runs_in_inning) の行を作る
- runs_in_inning >= 4 を抽出してイベント化
- `is_grandslam_inning` フラグ:
  - (game_id, team_id, inning_no) が満塁弾イベントに存在するかで判定

出力: `fourplus_inning_events.csv`
- game_id
- team_id
- side（home/visitor）
- inning_no
- runs_in_inning
- is_grandslam_inning
- team_total_runs_1to9 / post_inning_runs_1to9 / remaining_off_innings_1to9 / post_run_rate

### 3.5 集計（ブログ向け）
最低限の集計:
- グループ: {ALL, early(1-3), mid(4-6), late(7-9)} × {GSあり/なし}
- 指標:
  - mean/median post_run_rate
  - mean post_inning_runs_1to9
  - share of zero post runs（以降得点=0の割合）
出力: `summary.csv` と `report.md`

## 4. 境界条件・落とし穴
- 同一試合の複数満塁弾: イベント単位のまま保持。必要なら試合単位へ集約（最大/最初/合計など）を別出力。
- on_base の表記揺れ: 当面は “1/2/3の包含” で判定。確定表記が分かれば厳密一致に切り替え。
- NULLイニング: 攻撃回なしとして扱う（分母から除外）。
- コールド/引き分け等: 9回までのNULLが増えるだけなので同じ扱いで良い。

## 5. テスト方針（最小）
- 1試合だけ手で追って、
  - 満塁弾の inning_no / team_id が正しい
  - 以降得点が `*_inn(i+1..9)` の合計と一致
  - 分母がNULLを除外して数えられている
を確認する（検算用ノートを残す）。

## 6. 追加拡張（後回し）
- WPA等の勝利確率指標の導入（状況価値）
- 「得点の作られ方（分散度）」の代理指標:
  - 4点以上イニングでの `rbi` の分散、打者人数、得点イベント回数（eventテーブルから推定）
