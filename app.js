"use strict";

/* ============================================================
   1. 計画データ（planner.py の weeks と同一。ここを直せば計画が変わる）
   ============================================================ */
const CHK = "週末チェック：今週の基礎問を白紙で解き直す（8割未満なら進まない）";
const MAINT = "Anki 15分 ＋ 基礎問からランダム3〜5問を白紙で 15分";
const M7 = [MAINT,MAINT,MAINT,MAINT,MAINT,MAINT,MAINT];

const PHASE = {
  kiso : {name:"化学基礎",  v:"--ph-kiso",  anki:"新規 5〜10枚/日"},
  riron: {name:"理論化学",  v:"--ph-riron", anki:"新規 0〜10枚/日"},
  muki : {name:"無機化学",  v:"--ph-muki",  anki:"新規 30〜40枚/日（この2週だけAnkiに25〜30分）"},
  yuki : {name:"有機化学",  v:"--ph-yuki",  anki:"新規 20枚/日"},
  kobun: {name:"高分子",    v:"--ph-kobun", anki:"新規 25〜30枚/日"},
  kyote: {name:"数英集中・化学は維持", v:"--ph-kyote", anki:"新規 0枚。レビューのみ"},
  ensyu: {name:"演習・過去問", v:"--ph-ensyu", anki:"新規 0〜5枚（誤答から抽出した分だけ）"},
};

const WEEKS = [
 {n:1,start:"2026-08-31",ph:"kiso",short:"構成",title:"化学基礎・物質の構成",
  note:"原子の姿と周期表。48ページで量は多いが、内容は平易な助走週。ここで習慣の型を作る。",
  tasks:["第1章 物質と元素 ＋ 確認テスト1　p.12–24","第2章 熱運動と物質の三態 ＋ 確認テスト2　p.25–32","第3章1〜3 原子の構造・電子配置・イオン　p.34–48","第3章4 元素の周期表 ＋ 確認テスト3　p.49–59","基礎問題精講 該当範囲","基礎問の間違えた問題を解き直す ＋ Ankiカード作成",CHK],
  conds:["周期表の1〜20番を書ける","分離操作の名称と原理を説明できる","基礎問の該当範囲が白紙で8割"]},
 {n:2,start:"2026-09-07",ph:"kiso",short:"結合",title:"物質と化学結合",
  note:"結合の型が以降すべての土台になる。ここを曖昧にすると無機で崩れる。",
  tasks:["イオン結合・金属結合・共有結合　p.60–72","電子式／配位結合と錯イオン　p.73–81","分子間の結合　p.82–91","金属の結晶構造 ＋ 確認テスト4 ＋ センター対策　p.92–102","基礎問題精講 該当範囲","基礎問の間違えた問題を解き直す ＋ Anki",CHK],
  conds:["主要な分子の電子式を書ける","結晶4種を性質で区別できる","単位格子の計算ができる"]},
 {n:3,start:"2026-09-14",ph:"kiso",short:"物質量",title:"物質量と化学反応式",
  note:"ページは薄いが化学最大の山。ここの計算速度が最後まで効く。",
  tasks:["原子量・分子量と物質量　p.105–112","化学反応式と量的関係　p.113–117","溶液の濃度と固体の溶解度／原子説・分子説　p.118–123","基礎問題精講 mol計算に集中","基礎問題精講 続き","重要問題集A 該当範囲","週末チェック：mol計算だけは10割を目標にする"],
  conds:["mol⇄質量⇄体積⇄個数を迷わず往復できる","濃度換算(質量%⇄mol/L)ができる","量的関係の立式が10割"]},
 {n:4,start:"2026-09-21",ph:"kiso",short:"酸塩基",title:"酸・塩基・塩",
  note:"中和滴定は二次でも頻出。計算の型をここで固定する。",
  tasks:["酸と塩基／水素イオン濃度とpH　p.127–139","中和反応と塩／中和の量的関係　p.140–155","酸性酸化物・塩基性酸化物 ＋ 確認テスト2　p.156–159","基礎問題精講 該当範囲","基礎問題精講 滴定計算","重要問題集A 該当範囲",CHK],
  conds:["pH計算が3秒で立式できる","塩の液性を判定できる","滴定曲線と指示薬を対応させられる"]},
 {n:5,start:"2026-09-28",ph:"kiso",short:"酸化還元",title:"酸化還元 ＋ 化学基礎の総復習",
  note:"化学基礎はここで一度完成させる。以降は戻らない前提で作る。",
  tasks:["酸化・還元／酸化数　p.161–167","酸化剤・還元剤／金属のイオン化傾向　p.168–177","電池と電気分解（基礎）＋ 確認テスト3　p.178–186","基礎問題精講 該当範囲","化学基礎 全範囲の確認テストを再走","センター試験対策問題　p.100 / p.186","化学基礎 総点検：全範囲を白紙で"],
  conds:["半反応式を自力で組める","イオン化傾向を書ける","化学基礎の確認テストが全部8割以上"]},
 {n:6,start:"2026-10-05",ph:"riron",short:"結晶",title:"結晶と物質の状態変化",
  note:"ここから化学。結晶格子の計算と状態図を押さえる。",
  tasks:["化学結合／結晶の種類／金属の結晶構造　p.191–200","非晶質 ＋ 確認テスト1　p.201–205","物質の三態と状態変化　p.207–214","物質の構造と融点・沸点 ＋ 確認テスト2　p.215–218","基礎問題精講 該当範囲","重要問題集A 該当範囲",CHK],
  conds:["面心・体心・六方の充填率を出せる","状態図を読める","沸点の大小を理由付きで並べられる"]},
 {n:7,start:"2026-10-12",ph:"riron",short:"気体",title:"気体の性質",
  note:"状態方程式と混合気体。計算量が多いので手順を固定する。",
  tasks:["ボイル・シャルルの法則／気体の状態方程式　p.220–226","混合気体　p.227–231","理想気体と実在気体 ＋ 確認テスト3　p.232–239","基礎問題精講 気体","基礎問題精講 続き","重要問題集A 気体",CHK],
  conds:["分圧・モル分率を使い分けられる","蒸気圧が絡む問題を処理できる","理想からのずれを説明できる"]},
 {n:8,start:"2026-10-19",ph:"riron",short:"溶液",title:"溶液",
  note:"溶解度と束一的性質。単位換算のミスが出やすい範囲。",
  tasks:["溶解／溶解度と溶液の濃度　p.242–252","希薄溶液の性質　p.253–260","コロイド溶液 ＋ 確認テスト4　p.261–271","センター試験対策問題　p.272–274","基礎問題精講 溶液","重要問題集A 溶液",CHK],
  conds:["溶解度曲線から析出量を出せる","凝固点降下・浸透圧の計算ができる","コロイドの用語を区別できる"]},
 {n:9,start:"2026-10-26",ph:"riron",short:"熱・速度",title:"熱化学 ＋ 反応の速さ",
  note:"2分野をまとめて。どちらも独立性が高く短期で回せる。",
  tasks:["化学反応と熱エネルギー／ヘスの法則　p.277–286","結合エネルギー／光エネルギー ＋ 確認テスト1　p.287–293","反応の速さ　p.317–324","反応のしくみ ＋ 確認テスト3　p.325–330","基礎問題精講 熱化学・反応速度","重要問題集A 該当範囲",CHK],
  conds:["ヘスの法則で未知の反応熱を出せる","結合エネルギーから計算できる","活性化エネルギーと触媒を説明できる"]},
 {n:10,start:"2026-11-02",ph:"riron",short:"電気分解",title:"電池と電気分解",
  note:"量的関係が二次で頻出。ファラデー計算の型を作る。",
  tasks:["電池　p.295–301","電気分解の反応　p.302–304","電気分解の量的関係　p.305–309","電気分解の応用 ＋ 確認テスト2　p.310–315","基礎問題精講 該当範囲","重要問題集A（量的関係を厚めに）",CHK],
  conds:["各電池の両極の反応を書ける","電気量→物質量の換算が正確","電解精錬・溶融塩電解を説明できる"]},
 {n:11,start:"2026-11-09",ph:"riron",short:"平衡①",title:"化学平衡 ①",
  note:"平衡定数と平衡移動。理論の山場の前半。",
  tasks:["化学平衡とその法則　p.332–338","化学平衡の移動　p.339–347","基礎問題精講 平衡","基礎問題精講 続き","重要問題集A 平衡","重要問題集A 続き",CHK],
  conds:["平衡定数の式を立てられる","ルシャトリエで移動方向を判断できる","平衡量の連立を解ける"]},
 {n:12,start:"2026-11-16",ph:"riron",short:"平衡②",title:"化学平衡 ② ＋ 理論の総点検",
  note:"電離平衡・緩衝液・溶解度積。理論で最も差がつく範囲。",
  tasks:["電解質水溶液の化学平衡（電離平衡）　p.348–357","緩衝液・塩の加水分解　p.358–369","溶解度積と2価の弱酸の電離 ＋ 確認テスト4　p.370–377","センター試験対策問題　p.380–382","基礎問題精講 電離平衡","重要問題集A/B 平衡","理論化学の総点検：全範囲を白紙で"],
  conds:["弱酸のpHを近似で出せる","緩衝液のpH計算ができる","溶解度積から沈殿の有無を判定できる"]},
 {n:13,start:"2026-11-23",ph:"muki",short:"非金属",title:"無機・非金属元素",
  note:"暗記量が最大。読んで覚えるのではなくAnkiで回す。",
  tasks:["周期表／水素・希ガス／ハロゲン　p.385–398","ハロゲン化水素／酸素・硫黄とその化合物　p.399–408","窒素・リン／化学肥料／炭素・ケイ素　p.409–419","セラミックス／気体の製法と性質まとめ ＋ 確認テスト1　p.420–428","Anki集中投入 ＋ 基礎問題精講 無機","重要問題集A 無機","週末チェック：反応式を白紙で書けるか"],
  conds:["主要な気体の製法・捕集法を書ける","工業的製法を3つ以上説明できる","Ankiの無機カードが8割正答"]},
 {n:14,start:"2026-11-30",ph:"muki",short:"金属",title:"無機・金属元素",
  note:"金属イオンの分離が二次頻出。系統分離を図で書けるまで。",
  tasks:["アルカリ金属／炎色反応／2族元素　p.431–442","両性元素・水銀／鉄／錯イオンとその構造　p.443–458","銅銀金／クロム・マンガン／金属イオンの反応と分離　p.459–471","金属と人間生活 ＋ 確認テスト2 ＋ センター対策　p.472–479","Anki集中投入 ＋ 基礎問題精講 無機","重要問題集A 金属イオンの分離",CHK],
  conds:["系統分離の流れを白紙で書ける","沈殿の色と溶解条件を答えられる","錯イオンの名称と形を書ける"]},
 {n:15,start:"2026-12-07",ph:"yuki",short:"有機基礎",title:"有機の基礎と脂肪族炭化水素",
  note:"構造決定が有機の得点源。元素分析の手順をここで固める。",
  tasks:["有機化合物の特徴・分類・命名法　p.483–490","元素分析／組成式・分子式・構造式の決定 ＋ 確認テスト1　p.489–498","飽和炭化水素　p.500–506","不飽和炭化水素 ＋ 確認テスト2　p.507–520","基礎問題精講 構造決定","重要問題集A 有機",CHK],
  conds:["元素分析から分子式を出せる","異性体を数え上げられる","付加・置換の反応を書き分けられる"]},
 {n:16,start:"2026-12-14",ph:"yuki",short:"脂肪族",title:"酸素を含む脂肪族化合物",
  note:"官能基の性質と検出反応。反応系統図で覚える。",
  tasks:["アルコールとエーテル　p.522–532","アルデヒドとケトン　p.533–538","カルボン酸とエステル　p.539–547","油脂／セッケンと合成洗剤 ＋ 確認テスト3　p.548–556","基礎問題精講 該当範囲","重要問題集A/B 構造決定",CHK],
  conds:["官能基の検出反応を全部言える","エステルの加水分解を扱える","油脂のけん化価・ヨウ素価を計算できる"]},
 {n:17,start:"2026-12-21",ph:"yuki",short:"芳香族",title:"芳香族化合物",
  note:"分離操作は二次で頻出。フローチャートで押さえる。",
  tasks:["芳香族炭化水素／フェノール類　p.558–567","芳香族カルボン酸／ニトロ化合物とアミン　p.568–579","芳香族化合物の分離／人間生活　p.580–590","基礎問題精講 芳香族","重要問題集A 分離","有機の総点検：反応系統図を白紙で書く",CHK],
  conds:["分離のフローを白紙で書ける","フェノールの製法を3つ書ける","アゾ染料の合成経路を書ける"]},
 {n:18,start:"2026-12-28",ph:"kobun",short:"高分子",title:"高分子化合物",
  note:"暗記中心。年末年始と重なるので前倒しできるなら1週早める。",
  tasks:["高分子化合物／糖類　p.593–616","アミノ酸／酵素　p.617–634","核酸／食品と人間生活 ＋ 確認テスト1　p.635–645","合成高分子／合成繊維　p.647–658","合成樹脂／イオン交換樹脂　p.659–676","合成ゴム ＋ 確認テスト2 ＋ センター対策　p.677–689","週末チェック：ここでインプット完了。全分野が白紙で解けるか"],
  conds:["糖類の構造と反応を区別できる","等電点の計算ができる","重合度・平均分子量を計算できる"]},
 {n:19,start:"2027-01-04",ph:"kyote",short:"維持",title:"数英集中 ①（化学は維持のみ）",
  note:"化学は新規学習ゼロ。思い出せる状態を保つだけの週。",
  tasks:M7.slice(),
  conds:["化学は毎日30分を1日も欠かさない","数学・英語の演習量を落とさない","新しい化学の教材に手を出さない"]},
 {n:20,start:"2027-01-11",ph:"kyote",short:"共テ",title:"数英集中 ②（1/16–17 共通テスト）",
  note:"試験前後も化学30分は維持。ここで空けると2月に響く。",
  tasks:[MAINT,MAINT,MAINT,MAINT,MAINT,"共通テスト 1日目（見込み）／化学は休み","共通テスト 2日目（見込み）／化学は休み"],
  conds:["共通テストを想定どおりに終える","化学のAnkiを溜めない","翌週から化学に全投入する準備"]},
 {n:21,start:"2027-01-18",ph:"ensyu",short:"重問B理",title:"重要問題集B・理論",
  note:"ここから化学に全投入。応用問題の処理速度を作る。",
  tasks:["重問B 理論（状態・気体・溶液）","重問B 理論（熱化学・反応速度）","重問B 理論（電池・電気分解）","重問B 理論（化学平衡）","重問B 理論（電離平衡・溶解度積）","誤答の解き直し","週末チェック ＋ 誤答分類の集計"],
  conds:["重問B理論を一周する","誤答をすべて3分類で記録する","解き直しで8割"]},
 {n:22,start:"2027-01-25",ph:"ensyu",short:"重問B無有",title:"重要問題集B・無機／有機／高分子",
  note:"分野横断の設問に慣れる。ここまでで演習の土台が揃う。",
  tasks:["重問B 無機（非金属）","重問B 無機（金属・イオン分離）","重問B 有機（構造決定）","重問B 有機（芳香族・分離）","重問B 高分子","誤答の解き直し","週末チェック ＋ 誤答分類の集計"],
  conds:["重問Bを一周し終える","誤答分類の偏りを把握する","解き直しで8割"]},
 {n:23,start:"2027-02-01",ph:"ensyu",short:"過去問①",title:"過去問 3年分（1周目）",
  note:"時間を計る。大問1〜5と大問6を分けて分析する。",
  tasks:["過去問① 本番と同じ時間で","過去問① 復習・誤答分類","過去問② 本番と同じ時間で","過去問② 復習・誤答分類","過去問③ 本番と同じ時間で","過去問③ 復習・誤答分類","3年分の失点パターンを集計する"],
  conds:["3年分を時間内に解ききる","大問6の傾向を言語化する","素点で6割以上"]},
 {n:24,start:"2027-02-08",ph:"ensyu",short:"過去問②",title:"過去問 3年分（1周目・続き）",
  note:"失点の型が見えてくる時期。分類の記録を欠かさない。",
  tasks:["過去問④ 本番と同じ時間で","過去問④ 復習・誤答分類","過去問⑤ 本番と同じ時間で","過去問⑤ 復習・誤答分類","過去問⑥ 本番と同じ時間で","過去問⑥ 復習・誤答分類","6年分の失点パターンを集計する"],
  conds:["6年分を解き終える","失点の最多分類を特定する","素点で7割以上"]},
 {n:25,start:"2027-02-15",ph:"ensyu",short:"弱点",title:"弱点の潰し込み ＋ 過去問2周目",
  note:"記録した誤答分類の多い順に対処を変える週。",
  tasks:["分類「知識不足」の潰し込み（Anki＋教科書に戻る）","分類「計算ミス」：手順の型を作り直す","分類「読解・設定ミス」：問題文の情報整理を練習","過去問①〜③ 2周目","過去問④〜⑥ 2周目","大問6（理系一括固有）の集中対策","総点検：全分野を白紙で"],
  conds:["2周目で全問正解に近づける","計算ミスの発生率を半減させる","素点で8割"]},
 {n:26,start:"2027-02-22",ph:"ensyu",short:"仕上げ",title:"総仕上げ（2/25–26 二次試験）",
  note:"新しい問題には手を出さない。既知の再確認だけ。",
  tasks:["反応式・無機の色を総ざらい（Ankiのみ）","有機の反応系統図・高分子を総ざらい","前日：誤答記録の最終確認。新規教材は開かない。早く寝る","二次試験 1日目（2/25・見込み）","二次試験 2日目（2/26・見込み）","ー","ー"],
  conds:["新しい問題に手を出さない","睡眠を削らない","やってきたことを出し切る"]},
];

/* --- 数学・英語（第1〜20週）。3科目PDF p.4–23 から取り込み --- */
const SUBJ = {
  math: {
    1:{title:"数学1a2bの攻略 ①",conds:["第1講を1周する", "手が止まった単元をメモに残す", "解き直しで8割"],amount:"1a2b攻略 約7時間（全20時間を3週で）",days:["数学1a2bの攻略 第1講 講義を視聴（前半）","数学1a2bの攻略 第1講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第1講 講義を視聴（後半）","数学1a2bの攻略 第1講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第1講 今週の範囲を通しで演習","数学1a2bの攻略 第1講 解けなかった問題だけ再演習","今週の解き直し＋誤答の3分類"]},
    2:{title:"数学1a2bの攻略 ②",conds:["第2講を1周する", "抜けていた公式を書き出す", "解き直しで8割"],amount:"1a2b攻略 約7時間（全20時間を3週で）",days:["数学1a2bの攻略 第2講 講義を視聴（前半）","数学1a2bの攻略 第2講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第2講 講義を視聴（後半）","数学1a2bの攻略 第2講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第2講 今週の範囲を通しで演習","数学1a2bの攻略 第2講 解けなかった問題だけ再演習","今週の解き直し＋誤答の3分類"]},
    3:{title:"数学1a2bの攻略 ③（完了）",conds:["第3・4講を終え1周を完了", "苦手分野を3つ特定する", "解き直しで8割"],amount:"1a2b攻略 約7時間（これで全20時間が完了）",days:["数学1a2bの攻略 第3・4講 講義を視聴（前半）","数学1a2bの攻略 第3・4講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第3・4講 講義を視聴（後半）","数学1a2bの攻略 第3・4講 視聴した範囲を自力で解き直す","数学1a2bの攻略 第3・4講 今週の範囲を通しで演習","数学1a2bの攻略 第3・4講 解けなかった問題だけ再演習","今週の解き直し＋誤答の3分類"]},
    4:{title:"場合の数・確率の攻略 ①",conds:["前半を1周する", "数え上げの方針を言語化できる", "マーク演習で時間内に解ききる"],amount:"場合の数・確率 5時間（全10時間）＋ マーク演習1回",days:["場合の数、確率の攻略（前半） 講義を視聴（前半）","場合の数、確率の攻略（前半） 視聴した範囲を自力で解き直す","場合の数、確率の攻略（前半） 講義を視聴（後半）","場合の数、確率の攻略（前半） 視聴した範囲を自力で解き直す","場合の数、確率の攻略（前半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    5:{title:"場合の数・確率の攻略 ②（完了）",conds:["1周を完了する", "確率漸化式の型を作る", "マーク演習で時間内に解ききる"],amount:"場合の数・確率 5時間（完了）＋ マーク演習1回",days:["場合の数、確率の攻略（後半） 講義を視聴（前半）","場合の数、確率の攻略（後半） 視聴した範囲を自力で解き直す","場合の数、確率の攻略（後半） 講義を視聴（後半）","場合の数、確率の攻略（後半） 視聴した範囲を自力で解き直す","場合の数、確率の攻略（後半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    6:{title:"図形と方程式・軌跡の攻略 ①",conds:["前半を1周する", "直線・円の処理を速くする", "マーク演習で時間内に解ききる"],amount:"図形と方程式・軌跡 5時間（全10時間）＋ マーク演習",days:["図形と方程式、軌跡の攻略（前半） 講義を視聴（前半）","図形と方程式、軌跡の攻略（前半） 視聴した範囲を自力で解き直す","図形と方程式、軌跡の攻略（前半） 講義を視聴（後半）","図形と方程式、軌跡の攻略（前半） 視聴した範囲を自力で解き直す","図形と方程式、軌跡の攻略（前半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    7:{title:"図形と方程式・軌跡の攻略 ②（完了）",conds:["1周を完了する", "軌跡の立式パターンを3つ持つ", "マーク演習で時間内に解ききる"],amount:"図形と方程式・軌跡 5時間（完了）＋ マーク演習1回",days:["図形と方程式、軌跡の攻略（後半） 講義を視聴（前半）","図形と方程式、軌跡の攻略（後半） 視聴した範囲を自力で解き直す","図形と方程式、軌跡の攻略（後半） 講義を視聴（後半）","図形と方程式、軌跡の攻略（後半） 視聴した範囲を自力で解き直す","図形と方程式、軌跡の攻略（後半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    8:{title:"数列の攻略 ①",conds:["前半を1周する", "漸化式の型を分類できる", "マーク演習で時間内に解ききる"],amount:"数列 5時間（全10時間）＋ マーク演習1回",days:["数列の攻略（前半） 講義を視聴（前半）","数列の攻略（前半） 視聴した範囲を自力で解き直す","数列の攻略（前半） 講義を視聴（後半）","数列の攻略（前半） 視聴した範囲を自力で解き直す","数列の攻略（前半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    9:{title:"数列の攻略 ②（完了）",conds:["1周を完了する", "群数列・和の処理を速くする", "マーク演習で時間内に解ききる"],amount:"数列 5時間（完了）＋ マーク演習1回",days:["数列の攻略（後半） 講義を視聴（前半）","数列の攻略（後半） 視聴した範囲を自力で解き直す","数列の攻略（後半） 講義を視聴（後半）","数列の攻略（後半） 視聴した範囲を自力で解き直す","数列の攻略（後半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    10:{title:"ベクトルの攻略 ① ★新課程・手つかず",conds:["前半を1周する", "内積と成分計算を確実にする", "マーク演習で時間内に解ききる"],amount:"ベクトル 約3.5時間（全10時間を3週で）＋ マーク演",days:["ベクトルの攻略（前半） 講義を視聴（前半）","ベクトルの攻略（前半） 視聴した範囲を自力で解き直す","ベクトルの攻略（前半） 講義を視聴（後半）","ベクトルの攻略（前半） 視聴した範囲を自力で解き直す","ベクトルの攻略（前半） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    11:{title:"ベクトルの攻略 ②",conds:["中盤を1周する", "位置ベクトルの使い分けができる", "マーク演習で時間内に解ききる"],amount:"ベクトル 約3.5時間 ＋ マーク演習1回",days:["ベクトルの攻略（中盤） 講義を視聴（前半）","ベクトルの攻略（中盤） 視聴した範囲を自力で解き直す","ベクトルの攻略（中盤） 講義を視聴（後半）","ベクトルの攻略（中盤） 視聴した範囲を自力で解き直す","ベクトルの攻略（中盤） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    12:{title:"ベクトルの攻略 ③（完了）",conds:["1周を完了する", "空間ベクトルを処理できる", "マーク演習で時間内に解ききる"],amount:"ベクトル 約3.5時間（これで完了）＋ マーク演習1回",days:["ベクトルの攻略（後半・空間） 講義を視聴（前半）","ベクトルの攻略（後半・空間） 視聴した範囲を自力で解き直す","ベクトルの攻略（後半・空間） 講義を視聴（後半）","ベクトルの攻略（後半・空間） 視聴した範囲を自力で解き直す","ベクトルの攻略（後半・空間） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    13:{title:"統計的な推測 ① ★新課程・手つかず",conds:["確率変数と期待値・分散を扱える", "正規分布表を正しく引ける", "マーク演習で時間内に解ききる"],amount:"統計的な推測 5時間（2週で完了）＋ マーク演習1回",days:["統計的な推測（黄チャート／基礎問） 例題を進める","統計的な推測（黄チャート／基礎問） 例題を進める","統計的な推測（黄チャート／基礎問） 演習問題を解く","統計的な推測（黄チャート／基礎問） 演習問題を解く","統計的な推測（黄チャート／基礎問） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    14:{title:"統計的な推測 ②（完了）",conds:["区間推定・仮説検定を処理できる", "選択3分野を本番形式で解ける", "マーク演習で時間内に解ききる"],amount:"統計的な推測 5時間（完了。選択3枠が揃う）＋ マー",days:["統計的な推測（区間推定・仮説検定） 例題を進める","統計的な推測（区間推定・仮説検定） 例題を進める","統計的な推測（区間推定・仮説検定） 演習問題を解く","統計的な推測（区間推定・仮説検定） 演習問題を解く","統計的な推測（区間推定・仮説検定） 今週の範囲を通しで演習","マーク形式演習 1回（IA・IIBCを週替わり／70分 計測）※土曜は長めに確保","今週の解き直し＋誤答の3分類"]},
    15:{title:"マーク形式演習 ①",conds:["共テ形式を3回分解く", "大問ごとの時間配分を決める", "誤答を3分類で記録する"],amount:"共テ形式 3回分（IA・IIBC 各70分 計測）",days:["共テ過去問／予想問題 IA 1回（70分 計測）","上の復習・誤答の3分類","共テ過去問／予想問題 IIBC 1回（70分 計測）","上の復習・誤答の3分類","誤答の多い大問だけを集中演習","IA または IIBC 1回（70分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    16:{title:"マーク形式演習 ②",conds:["共テ形式を3回分解く", "時間配分を守れた回を増やす", "誤答を3分類で記録する"],amount:"共テ形式 3回分（IA・IIBC 各70分 計測）",days:["共テ過去問／予想問題 IA 1回（70分 計測）","上の復習・誤答の3分類","共テ過去問／予想問題 IIBC 1回（70分 計測）","上の復習・誤答の3分類","誤答の多い大問だけを集中演習","IA または IIBC 1回（70分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    17:{title:"マーク形式演習 ③",conds:["共テ形式を3回分解く", "選択問題を本番と同じ組で解く", "誤答を3分類で記録する"],amount:"共テ形式 3回分（IA・IIBC 各70分 計測）",days:["共テ過去問／予想問題 IA 1回（70分 計測）","上の復習・誤答の3分類","共テ過去問／予想問題 IIBC 1回（70分 計測）","上の復習・誤答の3分類","誤答の多い大問だけを集中演習","IA または IIBC 1回（70分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    18:{title:"総仕上げ ①（必勝マニュアル 投入）",conds:["必勝マニュアルの使える技を選別する", "共テ形式を3回分解く", "誤答を3分類で記録する"],amount:"必勝マニュアル ＋ 共テ形式 3回分",days:["共通テスト必勝マニュアル（IA）＋ 該当問題で試す","共テ過去問／予想問題 IA 1回（70分 計測）","共通テスト必勝マニュアル（IIBC）＋ 該当問題で試す","共テ過去問／予想問題 IIBC 1回（70分 計測）","誤答の多い大問だけを集中演習","IA または IIBC 1回（70分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    19:{title:"総仕上げ ②・弱点潰し",conds:["誤答分類の最多を特定して対処を変える", "IA・IIBCを各2回分解く", "本番の時間配分を確定する"],amount:"共テ形式 4回分（IA・IIBC 各2回）",days:["誤答記録の集計 → 最多分類への対処を決める","共テ過去問／予想問題 IA 1回（70分 計測）","共テ過去問／予想問題 IIBC 1回（70分 計測）","弱点大問の集中演習","共テ過去問／予想問題 IA 1回（70分 計測）","共テ過去問／予想問題 IIBC 1回（70分 計測）","今週の誤答をまとめて解き直す"]},
    20:{title:"最終調整（1/16–17 本番）",conds:["新しい問題集を開かない", "誤答記録の最終確認を終える", "睡眠を削らない"],amount:"新規なし。既知の確認のみ",days:["弱点大問だけを軽く回す","選択3分野（数列・ベクトル・統計）を確認","誤答記録の最終確認","前日：公式と時間配分だけ見直す。早く寝る","前日：新規教材は開かない","共通テスト 1日目（見込み）","共通テスト 2日目（見込み）"]},
  },
  eng: {
    1:{title:"英文熟考 上 ①／シス単 始動",conds:["シス単 第1章に着手", "英文熟考 上の今週範囲を完了", "ラジオ英会話を7日とも聴く"],amount:"シス単 約200語 ／ 英文熟考上 ＿＿題",days:["英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    2:{title:"英文熟考 上 ②",conds:["英文熟考 上の今週範囲を完了", "シス単の週範囲を1周", "音読を7日とも実施"],amount:"シス単 約200語 ／ 英文熟考上 ＿＿題",days:["英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    3:{title:"英文熟考 上 ③",conds:["英文熟考 上の今週範囲を完了", "シス単の週範囲を1周", "印をつけた文を週末に再読"],amount:"シス単 約200語 ／ 英文熟考上 ＿＿題",days:["英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    4:{title:"英文熟考 上 ④",conds:["英文熟考 上の今週範囲を完了", "シス単の週範囲を1周", "ラジオ英会話を7日とも聴く"],amount:"シス単 約200語 ／ 英文熟考上 ＿＿題",days:["英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    5:{title:"英文熟考 上 ⑤",conds:["英文熟考 上の今週範囲を完了", "シス単を1周し終える目処を立てる", "音読を7日とも実施"],amount:"シス単 約200語 ／ 英文熟考上 ＿＿題",days:["英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","英文熟考 上 範囲：____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    6:{title:"英文熟考 上 ⑥（完了）",conds:["英文熟考 上を1周し終える", "印をつけた文を全部潰す", "シス単1周目を完了"],amount:"シス単 1周完了 ／ 英文熟考上 1周完了",days:["英文熟考 上 範囲：____〜____（1周完了）","英文熟考 上 範囲：____〜____（1周完了）","英文熟考 上 範囲：____〜____（1周完了）","英文熟考 上 範囲：____〜____（1周完了）","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    7:{title:"ポラリス1 ①",conds:["ポラリス1の今週範囲を完了", "各長文を3回以上音読する", "シス単2周目に入る"],amount:"シス単 約250語 ／ ポラリス1 ＿＿題",days:["英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    8:{title:"ポラリス1 ②",conds:["ポラリス1の今週範囲を完了", "各長文を3回以上音読する", "設問の根拠を必ず本文から示す"],amount:"シス単 約250語 ／ ポラリス1 ＿＿題",days:["英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    9:{title:"ポラリス1 ③",conds:["ポラリス1の今週範囲を完了", "各長文を3回以上音読する", "読む速度を計って記録する"],amount:"シス単 約250語 ／ ポラリス1 ＿＿題",days:["英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    10:{title:"ポラリス1 ④",conds:["ポラリス1の今週範囲を完了", "各長文を3回以上音読する", "シス単2周目を完了"],amount:"シス単 約250語 ／ ポラリス1 ＿＿題",days:["英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","英語長文ポラリス1 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    11:{title:"ポラリス1 ⑤（完了）",conds:["ポラリス1を1周し終える", "落とした設問の型を分類する", "各長文を3回以上音読する"],amount:"シス単 2周完了 ／ ポラリス1 1周完了",days:["英語長文ポラリス1 問____〜____（1周完了）","英語長文ポラリス1 問____〜____（1周完了）","英語長文ポラリス1 問____〜____（1周完了）","英語長文ポラリス1 問____〜____（1周完了）","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    12:{title:"ポラリス2 ①",conds:["ポラリス2の今週範囲を完了", "各長文を3回以上音読する", "誤答の根拠を本文で特定する"],amount:"シス単 約300語 ／ ポラリス2 ＿＿題",days:["英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    13:{title:"ポラリス2 ②",conds:["ポラリス2の今週範囲を完了", "各長文を3回以上音読する", "シス単3周目に入る"],amount:"シス単 約300語 ／ ポラリス2 ＿＿題",days:["英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","英語長文ポラリス2 問____〜____","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    14:{title:"ポラリス2 ③（完了）",conds:["ポラリス2を1周し終える", "各長文を3回以上音読する", "共テ過去問・予想問題を用意する"],amount:"シス単 約300語 ／ ポラリス2 1周完了",days:["英語長文ポラリス2 問____〜____（1周完了）","英語長文ポラリス2 問____〜____（1周完了）","英語長文ポラリス2 問____〜____（1周完了）","英語長文ポラリス2 問____〜____（1周完了）","今週の範囲を通しで解き直す（設問の根拠を本文で特定する）","今週の英文を通しで音読・シャドーイング","週の総復習：シス単の週範囲を再テスト"]},
    15:{title:"共テ形式演習 ① ★切替",conds:["R・Lを各2回分、時間を計って解く", "Lの失点パターンを特定する", "音読・シャドーイングは継続する"],amount:"R 2回（1回は80分通し）／ L 2回 ／ ラジオ継続",days:["前週の演習の復習 ＋ 全文音読","共テ リスニング 1回（30分・本番形式）＋ 復習","リーディング 第1〜4問（40分 計測）","リーディング 第5〜6問（40分 計測）＋ 通しで見直し","共テ リスニング 1回（30分）＋ シャドーイング","共テ リーディング 1回 通しで（80分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    16:{title:"共テ形式演習 ②",conds:["R・Lを各2回分、時間を計って解く", "Rの読み終わり時刻を記録する", "音読・シャドーイングは継続する"],amount:"R 2回（1回は80分通し）／ L 2回 ／ ラジオ継続",days:["前週の演習の復習 ＋ 全文音読","共テ リスニング 1回（30分・本番形式）＋ 復習","リーディング 第1〜4問（40分 計測）","リーディング 第5〜6問（40分 計測）＋ 通しで見直し","共テ リスニング 1回（30分）＋ シャドーイング","共テ リーディング 1回 通しで（80分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    17:{title:"共テ形式演習 ③",conds:["R・Lを各2回分、時間を計って解く", "Lが6割を超える", "音読・シャドーイングは継続する"],amount:"R 2回（1回は80分通し）／ L 2回 ／ ラジオ継続",days:["前週の演習の復習 ＋ 全文音読","共テ リスニング 1回（30分・本番形式）＋ 復習","リーディング 第1〜4問（40分 計測）","リーディング 第5〜6問（40分 計測）＋ 通しで見直し","共テ リスニング 1回（30分）＋ シャドーイング","共テ リーディング 1回 通しで（80分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    18:{title:"共テ形式演習 ④",conds:["R・Lを各2回分、時間を計って解く", "失点の型を3つに絞る", "音読・シャドーイングは継続する"],amount:"R 2回（1回は80分通し）／ L 2回 ／ ラジオ継続",days:["前週の演習の復習 ＋ 全文音読","共テ リスニング 1回（30分・本番形式）＋ 復習","リーディング 第1〜4問（40分 計測）","リーディング 第5〜6問（40分 計測）＋ 通しで見直し","共テ リスニング 1回（30分）＋ シャドーイング","共テ リーディング 1回 通しで（80分 計測）※土曜は長めに確保","今週の誤答をまとめて解き直す"]},
    19:{title:"共テ形式演習 ⑤",conds:["R・Lを各2回分、時間を計って解く", "Lが7割を超える", "本番の時間配分を確定する"],amount:"R 2回（80分通し）／ L 2回 ／ 弱点大問の再演習",days:["共テ リーディング 1回 通しで（80分 計測）","上の復習 ＋ 全文音読","共テ リスニング 1回（30分）＋ 復習","共テ リーディング 1回 通しで（80分 計測）","上の復習 ＋ 全文音読","共テ リスニング 1回（30分）＋ 復習","今週の誤答をまとめて解き直す"]},
    20:{title:"最終調整（1/16–17 本番）",conds:["新しい問題集を開かない", "シス単の苦手語だけ確認する", "睡眠を削らない"],amount:"新規なし。既知の確認のみ",days:["Lを1回だけ聴いて耳を起こす","シス単の苦手語だけ確認","誤答記録の最終確認","前日：音読を軽く。新規教材は開かない","前日：早く寝る","共通テスト 1日目（見込み）","共通テスト 2日目（見込み）"]},
  },
  chemAmount: {
    1:"よくわかる p.12–59（48ページ）／ 基礎問 ＿＿問",
    2:"よくわかる p.60–102（43ページ）／ 基礎問 ＿＿",
    3:"よくわかる p.104–125（22ページ）／ 基礎問 ＿＿",
    4:"よくわかる p.126–159（34ページ）／ 基礎問 ＿＿",
    5:"よくわかる p.160–188（29ページ）／ 基礎問 ＿＿",
    6:"よくわかる p.190–218（29ページ）／ 基礎問 ＿＿",
    7:"よくわかる p.219–240（22ページ）／ 基礎問 ＿＿",
    8:"よくわかる p.241–274（34ページ）／ 基礎問 ＿＿",
    9:"よくわかる p.277–293・317–330（31ページ）／",
    10:"よくわかる p.294–315（22ページ）／ 基礎問 ＿＿",
    11:"よくわかる p.332–347（16ページ）／ 基礎問 ＿＿",
    12:"よくわかる p.348–382（35ページ）／ 基礎問 ＿＿",
    13:"よくわかる p.385–428（44ページ）／ 基礎問 ＿＿",
    14:"よくわかる p.431–479（49ページ）／ 基礎問 ＿＿",
    15:"よくわかる p.483–520（38ページ）／ 基礎問 ＿＿",
    16:"よくわかる p.522–556（35ページ）／ 基礎問 ＿＿",
    17:"よくわかる p.558–590（33ページ）／ 基礎問 ＿＿",
    18:"よくわかる p.593–689（97ページ）★全26週で最",
    19:"新規ページなし。維持30分のみ",
    20:"新規ページなし。維持30分のみ",
  },
};

/* 英語は毎日これを回す（3科目PDF 週ページの注記） */
const ENG_DAILY = ["シス単 10分","ラジオ英会話 15分","音読・シャドーイング 15分"];

/* 科目。化学の色は分野で変わるので、ここでは持たない。 */
const SUBJECTS = [
  {k:"chem", label:"化学", min:120, v:null},
  {k:"math", label:"数学", min:60,  v:"--ph-ensyu"},
  {k:"eng",  label:"英語", min:60,  v:"--ph-yuki"},
];


const CAUSES = [
  {k:"知識",  label:"知識不足",     v:"--ph-muki",
   fix:"Ankiと該当節に戻す", ng:"問題数を増やす"},
  {k:"計算",  label:"計算ミス",     v:"--ph-riron",
   fix:"検算と有効数字の手順を作り直す", ng:"知識を足す／気合の問題にする"},
  {k:"読解",  label:"読解・設定ミス", v:"--ph-ensyu",
   fix:"条件を図か表に書き出す練習", ng:"解答を先に見る"},
];

const DOW = ["月","火","水","木","金","土","日"];      /* 位置での呼び方（既定の月曜始まり用） */
const DOW_JP = ["日","月","火","水","木","金","土"];   /* 実際の曜日 */

/* ============================================================
   2. 状態と保存
   ============================================================ */
const LS_KEY = "kanadai-chem-26w-v1";

const state = {
  weeks: {},          // "1".."26" -> 下の blankWeek() を参照
  //   d  : [bool x7]            その日を終えたか（小項目が全部終われば自動で立つ）
  //   sub: {"0":[bool,...], …}  日ごとの小項目の完了。キーは曜日index
  //   sk : {"0":[bool,...], …}  小項目を「やらない」と決めた分（やり残しに出さない）
  //   c  : [bool x3]            合格条件
  //   score:{ok,total}|null     週末チェック（正解数／問題数）
  //   extra:[{id,text,day,done}] 自分で足したタスク
  errors: [],         // {id, ref, date, cause, r:[null|"YYYY-MM-DD" x3], cleared:false, wk:n}
  meta: {pledge:"", recovery:["","",""], examK:"2027-01-16", examN:"2027-02-25",
         weekLayout:"day", allLayout:"list", lastRef:"",
         anchor:"2026-08-31",     /* 第1週の月曜。週は必ず月〜日 */
         startDate:"2026-09-02"},  /* ここから数える。これより前はやり残しにしない */
};

function blankWeek(){
  return {d:[false,false,false,false,false,false,false], sub:{}, sk:{},
          c:[false,false,false], score:null, anki:null, memo:"", tasks:null, conds:null, extra:[]};
}
function wk(n){
  const k = String(n);
  if(!state.weeks[k]) state.weeks[k] = blankWeek();
  return state.weeks[k];
}

/* --- 保存とオンライン同期 -------------------------------------
   1. どの端末でも localStorage に即保存する（ログイン不要・オフライン可）
   2. 同期コードを設定すると sync.js が Firestore に繋ぎ、同じコードの
      端末どうしで内容が一致する。sync.js が動かなくてもアプリは完全に動く。
   ------------------------------------------------------------- */
const Store = {
  remotePush: null,     // sync.js が差し込む (state)=>void
  applyingRemote: false,
  account: "",
  signOut: null,
};

function setSync(kind, text){
  const dot = document.getElementById("syncDot");
  const txt = document.getElementById("syncTxt");
  if(dot) dot.className = "dot " + kind;
  if(txt) txt.textContent = text;
}

let toastTimer = null;
function toast(msg){
  const t = document.getElementById("toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 3200);
}

/* localStorage は「前回見た内容」のキャッシュにすぎない。
   記録の正本はクラウド側にあり、開くたびにそちらで上書きされる。 */
function cacheKey(){ return LS_KEY + (Store.account ? ":" + Store.account : ""); }
function loadCache(){
  try{
    const raw = localStorage.getItem(cacheKey()) || localStorage.getItem(LS_KEY);
    if(raw) Object.assign(state, JSON.parse(raw));
  }catch(e){ /* プライベートウィンドウ等。既定値のまま進む */ }
}
function saveCache(){
  try{ localStorage.setItem(cacheKey(), JSON.stringify(exportState())); }catch(e){}
}

function persist(){
  state.meta.updatedAt = Date.now();
  saveCache();
  if(Store.remotePush && !Store.applyingRemote) Store.remotePush(exportState());
}

/* クラウドから届いた内容を取り込む。自分が今書いた分より古ければ捨てる。 */
function applyRemote(data){
  if(!data || typeof data !== "object") return false;
  const mine = state.meta.updatedAt || 0;
  const theirs = (data.meta && data.meta.updatedAt) || 0;
  if(theirs <= mine) return false;
  Store.applyingRemote = true;
  state.weeks  = data.weeks  || {};
  state.errors = Array.isArray(data.errors) ? data.errors : [];
  state.meta   = Object.assign({}, state.meta, data.meta || {});
  Store.applyingRemote = false;
  saveCache();
  render();
  return true;
}

function exportState(){
  return {weeks: state.weeks, errors: state.errors, meta: state.meta};
}
function importState(data, {silent} = {}){
  if(!data || typeof data !== "object" || !data.weeks) throw new Error("形式が違います");
  try{ localStorage.setItem(cacheKey() + ":backup", JSON.stringify(exportState())); }catch(e){}
  state.weeks  = data.weeks || {};
  state.errors = Array.isArray(data.errors) ? data.errors : [];
  state.meta   = Object.assign({}, state.meta, data.meta || {});
  persist();
  render();
  if(!silent) toast("読み込みました。直前の内容はバックアップしてあります。");
}

/* sync.js から呼ばれる窓口 */
window.PlanStore = {
  get: exportState,
  apply: applyRemote,
  setStatus: setSync,
  toast,
  onReady(push){ Store.remotePush = push; },
  setAccount(email, signOut){
    Store.account = email || "";
    Store.signOut = signOut || null;
    loadCache();            // このアカウントの前回内容をひとまず出す
    render();
  },
};

/* ============================================================
   3. 日付ユーティリティ
   ============================================================ */
function ymd(dt){
  return dt.getFullYear() + "-" + String(dt.getMonth()+1).padStart(2,"0") + "-" + String(dt.getDate()).padStart(2,"0");
}
function parse(s){ const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); }
function addDays(dt, n){ const x = new Date(dt); x.setDate(x.getDate()+n); return x; }
function diffDays(a, b){ return Math.round((parse(b) - parse(a)) / 86400000); }
function todayStr(){ return ymd(new Date()); }
function md(s){ const d = parse(s); return (d.getMonth()+1) + "/" + d.getDate(); }

/* 週の枠は月曜はじまり・日曜おわりで固定する。ここは動かさない。 */
function anchor(){ return state.meta.anchor || WEEKS[0].start; }
/* 数え始める日。これより前の日はやり残しに出さないし、消化率にも入れない。 */
function planStart(){ return state.meta.startDate || anchor(); }
function planEnd(){ return ymd(addDays(parse(anchor()), 26*7 - 1)); }
function beforeStart(ds){ return diffDays(planStart(), ds) < 0; }

function currentWeekNo(){
  const idx = Math.floor(diffDays(anchor(), todayStr()) / 7);
  return Math.min(26, Math.max(1, idx + 1));
}
function weekDates(w){
  const base = addDays(parse(anchor()), (w.n - 1) * 7);
  return Array.from({length:7}, (_,i)=> ymd(addDays(base, i)));
}
/* 曜日は位置ではなく実際の日付から出す（起点をずらしても正しく出る） */
function dow(ds){ return DOW_JP[parse(ds).getDay()]; }
function isSun(ds){ return parse(ds).getDay() === 0; }
/* 次の月曜 */
function nextMonday(){
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return ymd(d);
}

/* ------------------------------------------------------------------
   科目ごとのタスクと進捗。
   化学は26週すべて。数学・英語は第1〜20週のみ（共テで終わるため）。
   ------------------------------------------------------------------ */
function subjOf(w, sk){
  if(sk === "chem") return {title:w.title, conds:w.conds, days:w.tasks,
                            amount:(SUBJ.chemAmount[w.n]||"")};
  const d = SUBJ[sk] && SUBJ[sk][w.n];
  return d ? {title:d.title, conds:d.conds, days:d.days, amount:d.amount} : null;
}
function hasSubj(w, sk){ return !!subjOf(w, sk); }
function activeSubjects(w){ return SUBJECTS.filter(x=>hasSubj(w, x.k)); }
function subjColor(w, sk){ return sk === "chem" ? PHASE[w.ph].v : SUBJECTS.find(x=>x.k===sk).v; }

/* 上書き（「編集」で書き換えた分）は科目ごとに持つ */
function ovOf(n){ const s = wk(n); if(!s.ov) s.ov = {}; return s.ov; }
function tasksOf(w, sk){
  sk = sk || "chem";
  const ov = ovOf(w.n)[sk];
  if(ov && ov.tasks) return ov.tasks;
  if(sk === "chem" && wk(w.n).tasks) return wk(w.n).tasks;   // 旧データ
  const d = subjOf(w, sk); return d ? d.days : [];
}
function condsOf(w, sk){
  sk = sk || "chem";
  const ov = ovOf(w.n)[sk];
  if(ov && ov.conds) return ov.conds;
  if(sk === "chem" && wk(w.n).conds) return wk(w.n).conds;   // 旧データ
  const d = subjOf(w, sk); return d ? d.conds : [];
}
function extrasOf(w){ const s = wk(w.n); if(!Array.isArray(s.extra)) s.extra = []; return s.extra; }

/* ------------------------------------------------------------------
   小項目（サブタスク）
   1日のタスクは「A ＋ B ＋ C」の形で複数の作業を含むことがある。
   ＋ でだけ割る。／ や ・ は「酸・塩基・塩」のように語の一部なので割らない。
   ------------------------------------------------------------------ */
function splitTask(t){
  return String(t).split(/\s*[＋+]\s*/).map(x=>x.trim()).filter(Boolean);
}
function subsOf(w, sk, i){
  const arr = tasksOf(w, sk);
  return arr[i] ? splitTask(arr[i]) : [];
}
function key(sk, i){ return sk + ":" + i; }

function subState(n, sk, i, len){
  const s = wk(n); if(!s.sub) s.sub = {};
  const k = key(sk, i);
  if(!Array.isArray(s.sub[k]) || s.sub[k].length !== len){
    const prev = Array.isArray(s.sub[k]) ? s.sub[k]
               : (sk==="chem" && Array.isArray(s.sub[String(i)]) ? s.sub[String(i)] : []);
    const dayDone = sk==="chem" && Array.isArray(s.d) ? !!s.d[i] : false;
    s.sub[k] = Array.from({length:len}, (_,j)=> prev[j] != null ? !!prev[j] : dayDone);
  }
  return s.sub[k];
}
function skipState(n, sk, i, len){
  const s = wk(n); if(!s.sk) s.sk = {};
  const k = key(sk, i);
  if(!Array.isArray(s.sk[k]) || s.sk[k].length !== len) s.sk[k] = Array.from({length:len}, ()=>false);
  return s.sk[k];
}
function dayDoneFlag(n, sk, i){
  const s = wk(n); if(!s.dd) s.dd = {};
  return s.dd;
}
function recomputeDay(n, sk, i){
  const w = WEEKS[n-1];
  const len = subsOf(w, sk, i).length;
  const st = subState(n, sk, i, len), skp = skipState(n, sk, i, len);
  const done = len > 0 && st.every((v,k)=> v || skp[k]);
  dayDoneFlag(n, sk, i)[key(sk,i)] = done;
  if(sk === "chem") wk(n).d[i] = done;     // 旧フィールドも合わせておく
  return done;
}
function isDayDone(n, sk, i){
  const dd = dayDoneFlag(n, sk, i);
  const v = dd[key(sk,i)];
  if(v != null) return v;
  return recomputeDay(n, sk, i);
}
function toggleSub(n, sk, i, j){
  const w = WEEKS[n-1];
  const st = subState(n, sk, i, subsOf(w, sk, i).length);
  st[j] = !st[j];
  recomputeDay(n, sk, i); persist(); render();
}
function toggleDay(n, sk, i){
  const w = WEEKS[n-1];
  const len = subsOf(w, sk, i).length;
  const st = subState(n, sk, i, len);
  const next = !isDayDone(n, sk, i);
  for(let j=0;j<len;j++) st[j] = next;
  recomputeDay(n, sk, i); persist(); render();
}
function toggleSkip(n, sk, i, j){
  const w = WEEKS[n-1];
  const len = subsOf(w, sk, i).length;
  skipState(n, sk, i, len)[j] = !skipState(n, sk, i, len)[j];
  recomputeDay(n, sk, i); persist(); render();
}
function dayProgress(n, sk, i){
  const w = WEEKS[n-1];
  const subs = subsOf(w, sk, i);
  const st = subState(n, sk, i, subs.length);
  const skp = skipState(n, sk, i, subs.length);
  return {done: st.filter(Boolean).length, total: subs.length, subs, st, sk:skp};
}
/* その週の全科目合計 */
function weekProgress(n){
  const w = WEEKS[n-1];
  let done=0, total=0;
  activeSubjects(w).forEach(x=>{
    for(let i=0;i<7;i++){ const p=dayProgress(n,x.k,i); done+=p.done; total+=p.total; }
  });
  return {done, total};
}
/* 英語の毎日の型 */
function engDaily(n, i){
  const s = wk(n); if(!s.ed) s.ed = {};
  const k = String(i);
  if(!Array.isArray(s.ed[k]) || s.ed[k].length !== ENG_DAILY.length)
    s.ed[k] = ENG_DAILY.map(()=>false);
  return s.ed[k];
}

/* ------------------------------------------------------------------
   やり残し：今日より前の日で、終えてもいないし「やらない」とも決めていない小項目。
   ------------------------------------------------------------------ */
function leftovers(limit){
  const today = todayStr();
  const out = [];
  for(const w of WEEKS){
    const dates = weekDates(w);
    if(diffDays(dates[0], today) < 0) break;
    for(const sub of activeSubjects(w)){
      for(let i=0;i<7;i++){
        if(diffDays(dates[i], today) <= 0) continue;
        if(beforeStart(dates[i])) continue;
        const p = dayProgress(w.n, sub.k, i);
        p.subs.forEach((text, j)=>{
          if(p.st[j] || p.sk[j]) return;
          out.push({wn:w.n, sk:sub.k, label:sub.label, i, j, text,
                    date:dates[i], dow:dow(dates[i]), week:w});
        });
      }
    }
  }
  out.sort((a,b)=> a.date < b.date ? 1 : -1);
  return limit ? out.slice(0, limit) : out;
}

/* 今日が計画のどこか */
function todayIndex(){
  const t = todayStr();
  for(const w of WEEKS){
    const dates = weekDates(w);
    for(let i=0;i<7;i++) if(dates[i] === t) return {w, i, date:t};
  }
  const first = WEEKS[0], last = WEEKS[25];
  if(diffDays(anchor(), t) < 0) return {w:first, i:0, date:weekDates(first)[0], before:true};
  return {w:last, i:6, date:weekDates(last)[6], after:true};
}

/* ============================================================
   4. 描画

   方針：既定では今日必要なものだけを出す。
   数えられるものを全部出さない。棒グラフより点、枠より余白。
   ============================================================ */
let view = "today";
let shownWeek = 1;
let editMode = false;
let openWeek = null;
let allLayout = "list";

const el = (tag, attrs, ...kids)=>{
  const n = document.createElement(tag);
  if(attrs) for(const [k,v] of Object.entries(attrs)){
    if(v === false || v == null) continue;
    if(k === "class") n.className = v;
    else if(k === "text") n.textContent = v;
    else if(k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if(k === "style") n.setAttribute("style", v);
    else n.setAttribute(k, v);
  }
  for(const kid of kids.flat()) if(kid != null) n.append(kid.nodeType ? kid : document.createTextNode(kid));
  return n;
};
function chk(checked, onChange, label, small){
  const c = el("input",{type:"checkbox",class:"chk" + (small?" chk-sm":""),"aria-label":label||""});
  c.checked = !!checked;
  c.addEventListener("change", onChange);
  return c;
}
function sec(title, ...kids){
  const s = el("section",{class:"sec"});
  if(title) s.append(el("p",{class:"hd"}, title));
  kids.flat().forEach(k=>k && s.append(k));
  return s;
}
function phVar(w){ return `--c:var(${PHASE[w.ph].v})`; }

/* ---------------- 今日 ---------------- */
function renderToday(){
  const root = document.getElementById("viewToday");
  root.textContent = "";
  const T = todayIndex();
  const w = T.w, i = T.i;
  const P = PHASE[w.ph];
  const due = dueToday();
  const left = leftovers();
  const d = parse(T.date);
  const subs = activeSubjects(w);

  const main = el("div",{class:"col-main"});
  const side = el("div",{class:"col-side"});
  root.append(el("div",{class:"cols"}, main, side));

  const head = el("section",{class:"sec",style:"--c:var(" + P.v + ")"});
  head.append(
    el("div",{class:"t-date"},
      el("span",{class:"t-md",text:(d.getMonth()+1)+"月"+d.getDate()+"日"}),
      el("span",{class:"t-dow",text:dow(T.date)+"曜"}),
      el("span",{class:"t-seal",text:"今日"})),
    el("p",{class:"t-where"}, "第"+w.n+"週　",
      el("span",{class:"ph",style:"--c:var(" + P.v + ")",text:P.name})));
  if(T.before) head.append(el("p",{class:"verdict",text:"計画の開始前です。"+md(planStart())+"から始まります。"}));
  if(T.after)  head.append(el("p",{class:"verdict",text:"計画の最終日を過ぎています。"}));
  main.append(head);

  subs.forEach(function(sub){
    const p = dayProgress(w.n, sub.k, i);
    const cvar = "--c:var(" + subjColor(w, sub.k) + ")";
    const list = el("div",{class:"todo"});
    let cnt = p.done, tot = p.total;

    if(sub.k === "eng"){
      const ed = engDaily(w.n, i);
      ENG_DAILY.forEach(function(t, j){
        tot++; if(ed[j]) cnt++;
        list.append(el("div",{class:"todo-row routine" + (ed[j]?" done":"")},
          chk(ed[j], function(){ ed[j]=!ed[j]; persist(); render(); }, t),
          el("span",{class:"todo-text",text:t,onclick:function(){ ed[j]=!ed[j]; persist(); render(); }}),
          el("span",{class:"tag",text:"毎日"})));
      });
    }

    p.subs.forEach(function(text, j){
      if(p.sk[j] && !p.st[j]){
        list.append(el("div",{class:"todo-row skipped"},
          el("span",{class:"skip-mark",text:"—"}),
          el("span",{class:"todo-text",text:text}),
          el("button",{class:"linkbtn",onclick:function(){ toggleSkip(w.n,sub.k,i,j); }},"戻す")));
        return;
      }
      list.append(el("div",{class:"todo-row" + (p.st[j]?" done":"")},
        chk(p.st[j], function(){ toggleSub(w.n,sub.k,i,j); }, text),
        el("span",{class:"todo-text",text:text,onclick:function(){ toggleSub(w.n,sub.k,i,j); }}),
        p.st[j] ? el("span",{}) : el("button",{class:"linkbtn",onclick:function(){ toggleSkip(w.n,sub.k,i,j); }},"やらない")));
    });

    extrasOf(w).filter(function(e){
      return (e.sk||"chem")===sub.k && (e.day===i || (e.day==null && !e.done));
    }).forEach(function(e){
      tot++; if(e.done) cnt++;
      list.append(el("div",{class:"todo-row extra" + (e.done?" done":"")},
        chk(e.done, function(){ e.done=!e.done; persist(); render(); }, e.text),
        el("span",{class:"todo-text",text:e.text,onclick:function(){ e.done=!e.done; persist(); render(); }}),
        el("span",{class:"tag",text: e.day==null ? "今週中" : "追加"})));
    });

    const sd = subjOf(w, sub.k);
    main.append(el("section",{class:"sec subj",style:cvar},
      el("p",{class:"hd subj-hd"},
        el("span",{class:"subj-name",text:sub.label}),
        el("span",{class:"subj-min",text:sub.min+"分"}),
        el("span",{class:"subj-title",text: sd ? sd.title : ""}),
        el("span",{class:"subj-count"}, el("b",{class:"num",text:String(cnt)}), " / "+tot)),
      list));
  });

  if(due.length){
    const box = el("div",{class:"call warn"});
    box.append(el("p",{class:"muted",style:"margin:0 0 6px"},"翌日 → 1週間後 → 章末。3回続けて正解で記録から外れる。"));
    due.forEach(function(e){
      const c = CAUSES.find(function(x){ return x.k===e.cause; }) || CAUSES[0];
      box.append(el("div",{class:"call-row"},
        el("span",{class:"ref",text:e.ref}),
        el("span",{class:"cause",style:"--c:var(" + c.v + ")",text:c.label}),
        el("span",{class:"muted",text:"誤答 "+md(e.date)}),
        el("span",{class:"grow"}),
        el("span",{class:"acts"},
          el("button",{class:"btn",onclick:function(){ markStep(e.id, nextStep(e)); }},"正解"),
          el("button",{class:"linkbtn",onclick:function(){ resetEntry(e.id); }},"また間違えた"))));
    });
    main.append(sec(el("span",{},"今日の解き直し　", el("b",{class:"num",text:String(due.length)})), box));
  }

  if(left.length){
    const box = el("div",{class:"call bad"});
    box.append(el("p",{class:"muted",style:"margin:0 0 6px"},
      "計画が壊れるのは飛ばした日ではなく、飛ばした翌日の判断で決まる。やるか、やらないと決めるか。"));
    left.slice(0,10).forEach(function(o){
      box.append(el("div",{class:"call-row"},
        el("span",{class:"lo-day",text:"第"+o.wn+"週 "+o.dow+" "+md(o.date)+"　"+o.label}),
        el("span",{class:"lo-text",text:o.text}),
        el("span",{class:"acts"},
          el("button",{class:"btn",onclick:function(){ toggleSub(o.wn,o.sk,o.i,o.j); }},"やった"),
          el("button",{class:"linkbtn",onclick:function(){ toggleSkip(o.wn,o.sk,o.i,o.j); }},"やらない"))));
    });
    if(left.length > 10) box.append(el("p",{class:"muted",style:"margin:8px 0 0",text:"ほか "+(left.length-10)+"件"}));
    box.append(el("button",{class:"linkbtn",style:"margin-top:8px",onclick:function(){
      if(!confirm(left.length+"件すべてを「やらない」にします。よろしいですか。")) return;
      left.forEach(function(o){
        const len = subsOf(WEEKS[o.wn-1], o.sk, o.i).length;
        skipState(o.wn,o.sk,o.i,len)[o.j] = true;
        recomputeDay(o.wn,o.sk,o.i);
      });
      persist(); render();
    }},"すべて「やらない」にする"));
    main.append(sec(el("span",{},"やり残し　", el("b",{class:"num",text:String(left.length)})), box));
  }

  main.append(el("details",{class:"fold"},
    el("summary",{text:"今日に足す"}),
    el("div",{class:"body"}, addTaskRow(w, i))));

  const wp = weekProgress(w.n);
  const beads = el("div",{class:"beads",style:"--c:var(" + P.v + ")"});
  for(let k=0;k<7;k++){
    const all = activeSubjects(w).every(function(x){ return isDayDone(w.n,x.k,k); });
    beads.append(el("i",{class:(all?"on":"")+(k===i?" cur":"")}));
  }
  side.append(sec("今週の進み",
    el("div",{style:"display:flex;align-items:center;gap:14px;margin-bottom:10px"},
      el("span",{class:"count"}, el("b",{class:"num",text:String(wp.done)}), " / "+wp.total),
      beads,
      el("button",{class:"btn",style:"margin-left:auto",onclick:function(){ shownWeek=w.n; setView("week"); }},"週を開く")),
    el("p",{class:"note",style:"margin:0",text:w.note})));

  const conds = el("div",{});
  subs.forEach(function(sub){
    const cs = condsOf(w, sub.k);
    if(!cs.length) return;
    conds.append(el("p",{class:"cond-sub",style:"--c:var(" + subjColor(w,sub.k) + ")",text:sub.label}));
    const st = condState(w.n, sub.k);
    cs.forEach(function(c, k){
      const lab = el("label",{class:"todo-row" + (st[k]?" done":""),style:"cursor:pointer"});
      lab.append(chk(st[k], function(){ st[k]=!st[k]; persist(); render(); }, c, true),
        el("span",{class:"todo-text",style:"font-size:14.5px",text:c}), el("span",{}));
      conds.append(lab);
    });
  });
  side.append(sec("今週の合格条件", conds));

  const t = todayStr();
  side.append(sec("残り", el("div",{class:"stats"},
    el("div",{}, el("b",{class:"num",text:Math.max(0,diffDays(t,state.meta.examK))+"日"}), el("span",{text:"共通テストまで"})),
    el("div",{}, el("b",{class:"num",text:Math.max(0,diffDays(t,state.meta.examN))+"日"}), el("span",{text:"二次試験まで"})))));
}

/* 合格条件は科目ごとに持つ */
function condState(n, sk){
  const s = wk(n); if(!s.cs) s.cs = {};
  const len = (condsOf(WEEKS[n-1], sk)||[]).length;
  if(!Array.isArray(s.cs[sk]) || s.cs[sk].length !== len){
    const prev = Array.isArray(s.cs[sk]) ? s.cs[sk]
               : (sk==="chem" && Array.isArray(s.c) ? s.c : []);
    s.cs[sk] = Array.from({length:len}, function(_, j){ return !!prev[j]; });
  }
  return s.cs[sk];
}

/* 追加タスクの入力（今日・週の両方から使う） */
function addTaskRow(w, defaultDay){
  const dates = weekDates(w);
  const inp = el("input",{type:"text",placeholder:"自分で足すこと"});
  const sj = el("select",{});
  activeSubjects(w).forEach(function(x){ sj.append(el("option",{value:x.k,text:x.label})); });
  const sl = el("select",{});
  sl.append(el("option",{value:"",text:"今週中"}));
  dates.forEach(function(ds, k){
    const o = el("option",{value:String(k),text:dow(ds)+" "+md(ds)});
    if(defaultDay===k) o.selected = true;
    sl.append(o);
  });
  const add = function(){
    const t = inp.value.trim(); if(!t){ inp.focus(); return; }
    extrasOf(w).push({id:"x"+Date.now()+Math.random().toString(36).slice(2,5),
                      text:t, sk:sj.value||"chem",
                      day: sl.value==="" ? null : Number(sl.value), done:false});
    persist(); render();
  };
  inp.addEventListener("keydown", function(ev){ if(ev.key==="Enter") add(); });
  return el("div",{class:"row"},
    el("div",{class:"addrow-in"}, inp),
    el("div",{class:"shrink",style:"min-width:86px"}, sj),
    el("div",{class:"shrink",style:"min-width:112px"}, sl),
    el("div",{class:"shrink"}, el("button",{class:"btn",onclick:add},"足す")));
}

/* ---------------- 今週 ---------------- */
function renderWeek(){
  const root = document.getElementById("viewWeek");
  root.textContent = "";
  const w = WEEKS[shownWeek-1];
  const st = wk(w.n);
  const P = PHASE[w.ph];
  const dates = weekDates(w);
  const today = todayStr();
  const layout = ["day","sum","spread"].indexOf(state.meta.weekLayout) >= 0 ? state.meta.weekLayout : "day";
  const extras = extrasOf(w);
  const subs = activeSubjects(w);

  const wide = layout === "spread";
  const main = el("div",{class:"col-main"});
  const side = el("div",{class:"col-side"});
  root.append(wide ? el("div",{}, main, side) : el("div",{class:"cols"}, main, side));

  const sel = el("select",{class:"wk-sel","aria-label":"週を選ぶ"});
  WEEKS.forEach(function(x){
    const o = el("option",{value:String(x.n),text:"第"+x.n+"週　"+x.short});
    if(x.n===w.n) o.selected = true;
    sel.append(o);
  });
  sel.addEventListener("change", function(){ shownWeek=Number(sel.value); editMode=false; render(); });

  const head = el("section",{class:"sec",style:"--c:var(" + P.v + ")"});
  head.append(
    el("div",{class:"wk-head"},
      el("span",{class:"wk-no",text:"第 "+w.n+" 週"}),
      el("span",{class:"wk-dates",text:md(dates[0])+" – "+md(dates[6])}),
      w.n===currentWeekNo() ? el("span",{class:"wnow",text:"今週"}) : null,
      el("div",{class:"wk-nav"},
        el("button",{class:"btn",onclick:function(){ shownWeek=Math.max(1,shownWeek-1); editMode=false; render(); },"aria-label":"前の週"},"‹"),
        sel,
        el("button",{class:"btn",onclick:function(){ shownWeek=Math.min(26,shownWeek+1); editMode=false; render(); },"aria-label":"次の週"},"›"))),
    el("h2",{text:w.title}),
    el("p",{class:"t-where",style:"margin-top:6px"},
      el("span",{class:"ph",style:"--c:var(" + P.v + ")",text:P.name}),
      el("span",{class:"muted",style:"margin-left:10px",
        text: subs.map(function(x){ return x.label+x.min+"分"; }).join("　")})),
    el("details",{class:"fold"}, el("summary",{text:"この週の狙い"}),
      el("div",{class:"body"},
        el("p",{class:"note",style:"margin:0 0 6px",text:w.note}),
        el("p",{class:"muted",style:"margin:0",text:"化学Anki　"+P.anki}))));

  /* 今週の範囲 — 折りたたまずに常に出す */
  const scope = el("div",{class:"scope"});
  subs.forEach(function(x){
    const sd = subjOf(w, x.k);
    if(!sd) return;
    const p7 = (function(){ let d=0,t=0; for(let i=0;i<7;i++){ const q=dayProgress(w.n,x.k,i); d+=q.done; t+=q.total; } return {d:d,t:t}; })();
    scope.append(el("div",{class:"scope-row",style:"--c:var(" + subjColor(w,x.k) + ")"},
      el("span",{class:"scope-sub",text:x.label}),
      el("div",{class:"scope-body"},
        el("div",{class:"scope-title",text:sd.title}),
        sd.amount ? el("div",{class:"scope-amount",text:sd.amount}) : null),
      el("span",{class:"scope-count"}, el("b",{class:"num",text:String(p7.d)}), " / "+p7.t)));
  });
  head.append(el("p",{class:"hd",style:"margin:22px 0 10px",text:"今週の範囲"}), scope);

  main.append(head);

  const wp = weekProgress(w.n);
  const body = el("section",{class:"sec"});
  body.append(el("div",{class:"bar"},
    el("div",{class:"seg"},
      el("button",{"aria-pressed":String(layout==="day"),onclick:function(){ state.meta.weekLayout="day"; persist(); render(); }},"日ごと"),
      el("button",{"aria-pressed":String(layout==="sum"),onclick:function(){ state.meta.weekLayout="sum"; persist(); render(); }},"まとめ"),
      el("button",{"aria-pressed":String(layout==="spread"),onclick:function(){ state.meta.weekLayout="spread"; persist(); render(); }},"見開き")),
    el("span",{class:"count"},"今週やること　", el("b",{class:"num",text:String(wp.done)}), " / "+wp.total),
    el("button",{class:"linkbtn",style:"margin-left:auto",onclick:function(){ editMode=!editMode; render(); }},
      editMode ? "編集を終える" : "編集")));

  function extraLine(e, showDay){
    return el("div",{class:"xrow" + (e.done?" done":"")},
      chk(e.done, function(){ e.done=!e.done; persist(); render(); }, e.text, true),
      el("span",{class:"xtext",text:e.text,onclick:function(){ e.done=!e.done; persist(); render(); }}),
      showDay ? el("span",{class:"gi-day",text: e.day==null ? "—" : dow(dates[e.day])}) : el("span",{}),
      el("button",{class:"xdel","aria-label":"削除",onclick:function(){
        wk(w.n).extra = extrasOf(w).filter(function(x){ return x.id!==e.id; }); persist(); render();
      }},"×"));
  }
  function subRows(sk, i, box, small){
    const p = dayProgress(w.n, sk, i);
    p.subs.forEach(function(text, j){
      if(p.sk[j] && !p.st[j]){
        box.append(el("div",{class:"todo-row skipped"},
          el("span",{class:"skip-mark",text:"—"}),
          el("span",{class:"todo-text",text:text}),
          el("button",{class:"linkbtn",onclick:function(){ toggleSkip(w.n,sk,i,j); }},"戻す")));
        return;
      }
      box.append(el("div",{class:"todo-row" + (p.st[j]?" done":"")},
        chk(p.st[j], function(){ toggleSub(w.n,sk,i,j); }, text, true),
        el("span",{class:"todo-text",text:text,onclick:function(){ toggleSub(w.n,sk,i,j); }})));
    });
    extras.filter(function(e){ return (e.sk||"chem")===sk && e.day===i; })
      .forEach(function(e){ box.append(extraLine(e,false)); });
    return p;
  }

  if(layout==="day"){
    dates.forEach(function(ds, i){
      const box = el("div",{class:"d2" + (ds===today?" today":"") + (isSun(ds)?" sun":"")});
      box.append(el("div",{class:"d2-head"},
        el("span",{class:"d2-dow"}, el("b",{text:dow(ds)}), md(ds))));
      subs.forEach(function(x){
        const p = dayProgress(w.n, x.k, i);
        const blk = el("div",{class:"d2-sub",style:"--c:var(" + subjColor(w,x.k) + ")"});
        blk.append(el("div",{class:"d2-sub-head"},
          el("span",{class:"subj-name",text:x.label}),
          el("span",{class:"d2-count",text:p.done+"/"+p.total}),
          chk(isDayDone(w.n,x.k,i), function(){ toggleDay(w.n,x.k,i); }, x.label+"を完了", true)));
        if(editMode){
          const ta = el("textarea",{rows:"2",style:"font-size:13.5px;margin-top:6px"});
          ta.value = tasksOf(w, x.k)[i] || "";
          ta.addEventListener("change", function(){
            const arr = tasksOf(w, x.k).slice(); arr[i] = ta.value;
            ovOf(w.n)[x.k] = Object.assign({}, ovOf(w.n)[x.k], {tasks:arr});
            delete wk(w.n).sub[key(x.k,i)]; delete wk(w.n).sk[key(x.k,i)];
            persist(); render();
          });
          blk.append(ta);
        }else{
          subRows(x.k, i, blk, true);
        }
        box.append(blk);
      });
      body.append(box);
    });
  }

  if(layout==="sum"){
    subs.forEach(function(x){
      const groups = new Map();
      for(let i=0;i<7;i++){
        const p = dayProgress(w.n, x.k, i);
        p.subs.forEach(function(text, j){
          const g = classify(text);
          if(!groups.has(g.k)) groups.set(g.k, {g:g, items:[]});
          groups.get(g.k).items.push({text:text,i:i,j:j,done:p.st[j],skip:p.sk[j]});
        });
      }
      body.append(el("p",{class:"hd",style:"margin:26px 0 4px;--c:var(" + subjColor(w,x.k) + ")"},
        el("span",{class:"subj-name",text:x.label})));
      ["yoku","kiso","jyu","kako","anki","check"].map(function(k){
        return k==="yoku" ? SRC_READ : SRC.find(function(y){ return y.k===k; });
      }).forEach(function(gdef){
        const grp = groups.get(gdef.k); if(!grp) return;
        const done = grp.items.filter(function(t){ return t.done; }).length;
        const gb = el("div",{class:"grp",style:"--c:var(" + subjColor(w,x.k) + ")"});
        gb.append(el("div",{class:"grp-head"},
          el("span",{class:"grp-name",text:gdef.label}),
          el("span",{class:"grp-count",text:done+"/"+grp.items.length})));
        grp.items.forEach(function(it){
          gb.append(el("div",{class:"grp-item" + (it.done?" done":"") + (it.skip&&!it.done?" skipped":"")},
            chk(it.done, function(){ toggleSub(w.n,x.k,it.i,it.j); }, it.text, true),
            el("span",{class:"gi-text",text:it.text,onclick:function(){ toggleSub(w.n,x.k,it.i,it.j); }}),
            el("span",{class:"gi-day",text:dow(dates[it.i])})));
        });
        body.append(gb);
      });
    });
    if(extras.length){
      const gb = el("div",{class:"grp",style:"--c:var(--ph-kobun)"});
      gb.append(el("div",{class:"grp-head"},
        el("span",{class:"grp-name",text:"自分で足したこと"}),
        el("span",{class:"grp-count",text:extras.filter(function(e){ return e.done; }).length+"/"+extras.length})));
      extras.forEach(function(e){ gb.append(extraLine(e,true)); });
      body.append(gb);
    }
  }

  if(layout==="spread"){
    const grid = el("div",{class:"spread"});
    dates.forEach(function(ds, i){
      const col = el("div",{class:"sp-col" + (ds===today?" today":"") + (isSun(ds)?" sun":"")});
      col.append(el("div",{class:"sp-head"},
        el("span",{class:"sp-dow",text:dow(ds)}),
        el("span",{class:"sp-md",text:md(ds)})));
      subs.forEach(function(x){
        const p = dayProgress(w.n, x.k, i);
        col.append(el("div",{class:"sp-sub",style:"--c:var(" + subjColor(w,x.k) + ")"},
          el("span",{class:"subj-name",text:x.label}),
          el("span",{class:"sp-count",text:p.done+"/"+p.total})));
        p.subs.forEach(function(text, j){
          col.append(el("div",{class:"sp-item" + (p.st[j]?" done":"") + (p.sk[j]&&!p.st[j]?" skipped":"")},
            chk(p.st[j], function(){ toggleSub(w.n,x.k,i,j); }, text, true),
            el("span",{class:"sp-text",text:text,onclick:function(){ toggleSub(w.n,x.k,i,j); }})));
        });
        extras.filter(function(e){ return (e.sk||"chem")===x.k && e.day===i; }).forEach(function(e){
          col.append(el("div",{class:"sp-item" + (e.done?" done":"")},
            chk(e.done, function(){ e.done=!e.done; persist(); render(); }, e.text, true),
            el("span",{class:"sp-text",text:e.text,onclick:function(){ e.done=!e.done; persist(); render(); }})));
        });
      });
      grid.append(col);
    });
    body.append(el("div",{class:"spread-wrap"}, grid));
  }

  const loose = extras.filter(function(e){ return e.day==null; });
  if(loose.length && layout!=="sum"){
    body.append(el("p",{class:"hd",style:"margin:22px 0 6px",text:"日を決めていないもの"}));
    loose.forEach(function(e){ body.append(extraLine(e,false)); });
  }
  body.append(el("details",{class:"fold"},
    el("summary",{text:"足す"}), el("div",{class:"body"}, addTaskRow(w, null))));
  if(editMode && Object.keys(ovOf(w.n)).length){
    body.append(el("button",{class:"btn",style:"margin-top:10px",onclick:function(){
      wk(w.n).ov = {}; wk(w.n).tasks = null; wk(w.n).sub = {}; wk(w.n).sk = {}; wk(w.n).dd = {};
      persist(); render();
    }},"元の計画に戻す"));
  }
  main.append(body);

  const conds = el("div",{});
  subs.forEach(function(x){
    const cs = condsOf(w, x.k);
    if(!cs.length) return;
    conds.append(el("p",{class:"cond-sub",style:"--c:var(" + subjColor(w,x.k) + ")",text:x.label}));
    const cst = condState(w.n, x.k);
    cs.forEach(function(c, k){
      const lab = el("label",{class:"todo-row" + (cst[k]?" done":""),style:"cursor:pointer"});
      lab.append(chk(cst[k], function(){ cst[k]=!cst[k]; persist(); render(); }, c, true),
        el("span",{class:"todo-text",style:"font-size:14.5px",text:c}), el("span",{}));
      conds.append(lab);
    });
  });
  side.append(sec("今週の合格条件", conds));

  const scv = st.score && typeof st.score === "object" ? st.score : null;
  const okIn = el("input",{type:"number",min:"0",placeholder:"正解"});
  const tlIn = el("input",{type:"number",min:"1",placeholder:"問題数"});
  if(scv){ okIn.value = scv.ok; tlIn.value = scv.total; }
  const save = function(){
    const o = okIn.value===""?null:Number(okIn.value);
    const t = tlIn.value===""?null:Number(tlIn.value);
    wk(w.n).score = (o==null || !t) ? null : {ok:o,total:t};
    persist(); render();
  };
  okIn.addEventListener("change",save); tlIn.addEventListener("change",save);
  const pct = scv && scv.total ? Math.round(scv.ok/scv.total*100) : null;
  const ak = el("input",{type:"number",min:"0",placeholder:"化学"});
  if(st.anki != null) ak.value = st.anki;
  ak.addEventListener("change",function(){ wk(w.n).anki = ak.value===""?null:Number(ak.value); persist(); });
  const ae = el("input",{type:"number",min:"0",placeholder:"英語"});
  if(st.ankiE != null) ae.value = st.ankiE;
  ae.addEventListener("change",function(){ wk(w.n).ankiE = ae.value===""?null:Number(ae.value); persist(); });

  side.append(sec("週末チェック（日曜）",
    el("p",{class:"note",style:"margin-bottom:12px"},"今週の基礎問を白紙で解き直す。この判定は動かさない。"),
    el("div",{class:"scorerow"}, okIn, el("span",{class:"muted",text:"問 ／"}), tlIn, el("span",{class:"muted",text:"問"})),
    pct==null
      ? el("p",{class:"verdict"},"未記入。8割以上なら次へ、8割未満なら1週かけて補修する。補修は入門問題精講から入る。")
      : el("p",{class:"verdict " + (pct>=80?"pass":"fail")},
          el("b",{class:"num",text:pct+"%"}), "　",
          pct>=80 ? "8割以上。次の章へ進む。" : "8割未満。次の章へ進まず、1週かけて補修する。入門問題精講から入ること。"),
    el("details",{class:"fold"}, el("summary",{text:"今週の新規Ankiカード"}),
      el("div",{class:"body"}, el("div",{class:"row"},
        el("div",{}, el("label",{class:"fld",text:"化学（枚）"}), ak),
        el("div",{}, el("label",{class:"fld",text:"英語（枚）"}), ae))))));

  const ta = el("textarea",{rows:"5",placeholder:"詰まった箇所、来週に回したこと"});
  ta.value = st.memo || "";
  ta.addEventListener("input",function(){ wk(w.n).memo = ta.value; persist(); });
  side.append(sec("今週のメモ", ta));
}

/* ---------------- 全体 ---------------- */
function renderAll(){
  const root = document.getElementById("viewAll");
  root.textContent = "";
  const today = todayStr();
  const now = currentWeekNo();

  /* 現在地：数えて意味のあるものだけ */
  const inputWeeks = WEEKS.filter(w=>w.n <= 18);
  let inputDone=0, inputTot=0;
  inputWeeks.forEach(function(w){ const q=weekProgress(w.n); inputDone+=q.done; inputTot+=q.total; });
  const scored = WEEKS.filter(w=>wk(w.n).score);
  const passed = scored.filter(w=>{ const s=wk(w.n).score; return s.total && s.ok/s.total >= .8; }).length;

  root.append(sec(null, el("div",{class:"stats"},
    el("div",{}, el("b",{class:"num",text:Math.max(0,diffDays(today,state.meta.examN))+"日"}),
      el("span",{text:"二次試験まで"})),
    el("div",{}, el("b",{class:"num",text:Math.max(0,diffDays(today,state.meta.examK))+"日"}),
      el("span",{text:"共通テストまで"})),
    el("div",{}, el("b",{class:"num",text:(inputTot?Math.round(inputDone/inputTot*100):0)+"%"}),
      el("span",{text:"インプット期の消化"})),
    scored.length ? el("div",{}, el("b",{class:"num",text:passed+"/"+scored.length}),
      el("span",{text:"週末チェック通過"})) : null,
  )));

  /* 切替 */
  const swap = el("div",{class:"bar",style:"margin-top:30px"},
    el("div",{class:"seg"},
      el("button",{"aria-pressed":String(allLayout==="list"),onclick:()=>{ allLayout="list"; render(); }},"一覧"),
      el("button",{"aria-pressed":String(allLayout==="gantt"),onclick:()=>{ allLayout="gantt"; render(); }},"工程表"),
      el("button",{"aria-pressed":String(allLayout==="road"),onclick:()=>{ allLayout="road"; render(); }},"道のり"),
    ),
    allLayout==="list" ? el("button",{class:"linkbtn",style:"margin-left:auto",onclick:()=>{
      openWeek = openWeek==="all" ? null : "all"; render();
    }}, openWeek==="all" ? "すべて閉じる" : "すべて開く") : null,
  );
  root.append(swap);

  if(allLayout === "gantt") root.append(gantt(today));
  else if(allLayout === "road") root.append(roadmap(today, now));
  else root.append(weekList(today, now));

  /* 12月の判断 */
  root.append(sec("十二月上旬に決めること",
    el("p",{class:"note",style:"margin-bottom:6px"},"第18週（12/28–1/3）の高分子が年末年始と重なる。"),
    el("p",{class:"muted",style:"margin:0"},
      "第15〜17週（有機）が順調なら1週前倒しし、12/21–12/27に高分子、12/28–1/3を化学基礎〜理論の総点検に充てるほうが安全。各週の「編集」でタスクを差し替えられる。")));
}

function weekList(today, now){
  const box = el("div",{});
  WEEKS.forEach(w=>{
    const ws = wk(w.n);
    const dates = weekDates(w);
    const q = weekProgress(w.n);
    const done = q.total ? Math.round(q.done/q.total*7) : 0;
    const past = diffDays(dates[6], today) > 0;
    const open = openWeek==="all" || openWeek===w.n;
    const cvar = phVar(w);
    const sc = ws.score;
    const pct = sc && sc.total ? Math.round(sc.ok/sc.total*100) : null;

    const beads = el("div",{class:"beads"});
    for(let bi=0;bi<7;bi++){
      const all = activeSubjects(w).every(function(x){ return isDayDone(w.n,x.k,bi); });
      beads.append(el("i",{class:all?"on":""}));
    }

    box.append(el("button",{
      class:"wrow" + (w.n===now?" now":"") + (past && done<5 ? " behind":""),
      style:cvar, "aria-expanded":String(open),
      onclick:()=>{ openWeek = openWeek===w.n ? null : w.n; render(); },
    },
      el("span",{class:"wnum",text:String(w.n)}),
      el("span",{class:"wmain"},
        el("span",{class:"wtitle",text:w.title}),
        el("span",{class:"wsub"},
          el("span",{class:"ph",style:cvar,text:PHASE[w.ph].name}),
          el("span",{text:md(dates[0])+"–"+md(dates[6])}),
          w.n===now ? el("span",{class:"wnow",text:"今週"}) : null)),
      beads,
      el("span",{class:"wscore" + (pct==null?"":(pct>=80?" pass":" fail")),
                 text: pct==null ? "—" : pct+"%"}),
    ));

    if(open){
      const det = el("div",{class:"wdetail",style:cvar});
      det.append(el("p",{class:"note",style:"margin:8px 0 12px",text:w.note}));
      activeSubjects(w).forEach(function(x){
        det.append(el("p",{class:"hd",style:"margin:14px 0 4px;--c:var(" + subjColor(w,x.k) + ")"},
          el("span",{class:"subj-name",text:x.label}),
          el("span",{class:"muted",style:"margin-left:10px",text:(subjOf(w,x.k)||{}).title||""})));
        const ol = el("ol",{class:"dlist"});
        tasksOf(w, x.k).forEach(function(t,i){
          ol.append(el("li",{class: isDayDone(w.n,x.k,i) ? "done" : ""},
            el("span",{class:"dl-day",text:dow(dates[i])+" "+md(dates[i])}),
            el("span",{class:"dl-task",text:t})));
        });
        det.append(ol);
        const cs = condsOf(w, x.k);
        if(cs.length){
          const cst = condState(w.n, x.k);
          const ul = el("ul",{class:"clist"});
          cs.forEach(function(c,i){ ul.append(el("li",{class: cst[i]?"done":"", text:c})); });
          det.append(ul);
        }
      });
      det.append(el("div",{style:"display:flex;gap:12px;margin-top:14px;align-items:center;flex-wrap:wrap"},
        el("span",{class:"muted",style:"flex:1;min-width:140px",text:"Anki　"+PHASE[w.ph].anki}),
        el("button",{class:"btn",onclick:ev=>{
          ev.stopPropagation(); shownWeek=w.n; editMode=false; setView("week"); window.scrollTo({top:0});
        }},"この週を開く")));
      box.append(det);
    }
  });
  return sec(null, box, el("p",{class:"muted",style:"margin-top:14px"},
    "行をひらくと7日分が出る。左の細い線が分野、点が消化した日、右端が週末チェック。終わったのに5日未満の週は番号が朱くなる。"));
}

/* 工程表（案D） */
function gantt(today){
  const start = parse(anchor());
  const end = parse(planEnd());
  const span = Math.round((end - start)/86400000) + 1;
  const pos = ds => ((parse(ds) - start)/86400000) / span * 100;

  const wrap = el("div",{class:"gantt"});
  const inner = el("div",{class:"gantt-in"});

  /* 月の目盛 */
  const months = el("div",{class:"g-months"});
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while(cur <= end){
    if(cur >= start) months.append(el("span",{class:"g-mon",
      style:`left:${((cur-start)/86400000)/span*100}%`, text:(cur.getMonth()+1)+"月"}));
    cur = new Date(cur.getFullYear(), cur.getMonth()+1, 1);
  }
  inner.append(el("div",{class:"g-scale"}, el("span",{}), months));

  /* 分野ごとに1行 */
  const rows = [];
  WEEKS.forEach(w=>{
    const last = rows[rows.length-1];
    if(last && last.ph === w.ph && last.to === w.n-1){ last.to = w.n; }
    else rows.push({ph:w.ph, from:w.n, to:w.n});
  });

  rows.forEach(r=>{
    const s0 = weekDates(WEEKS[r.from-1])[0], s1 = weekDates(WEEKS[r.to-1])[6];
    const left = pos(s0), right = pos(s1);
    let dTot = 0, dDone = 0;
    for(let n=r.from;n<=r.to;n++){ const q=weekProgress(n); dTot+=q.total; dDone+=q.done; }
    const track = el("div",{class:"g-track"});
    const bar = el("div",{class:"g-bar",style:`left:${left}%;width:${Math.max(right-left,1.2)}%`});
    bar.append(el("div",{class:"g-fill",style:`width:${dTot?dDone/dTot*100:0}%`}));
    track.append(bar);
    inner.append(el("div",{class:"g-row",style:`--c:var(${PHASE[r.ph].v})`},
      el("span",{class:"g-name",text:PHASE[r.ph].name + "　" + r.from + (r.to!==r.from ? "–"+r.to : "")}),
      track));
  });

  /* 今日の線 */
  const todayPos = pos(today);
  if(todayPos >= 0 && todayPos <= 100){
    const overlay = el("div",{class:"g-row",style:"position:relative;height:0;padding:0"});
    overlay.append(el("span",{}), el("div",{style:"position:relative;height:0"}));
    inner.style.position = "relative";
    const line = el("div",{class:"g-now",style:`left:calc(104px + 12px + (100% - 116px) * ${todayPos/100})`});
    inner.append(line);
  }
  wrap.append(inner);
  return sec(null, wrap, el("p",{class:"muted",style:"margin-top:12px"},
    "分野ごとの帯。濃い部分が消化した割合。朱い線が今日の位置。"));
}


/* 道のり：どこを通ってきて、次に何が来るか。
   区切りは分野の変わり目と、日付が決まっている出来事。 */
function roadmap(today, now){
  const box = el("div",{class:"road"});

  /* 分野のまとまりに直す */
  const legs = [];
  WEEKS.forEach(w=>{
    const last = legs[legs.length-1];
    if(last && last.ph === w.ph && last.to === w.n-1) last.to = w.n;
    else legs.push({ph:w.ph, from:w.n, to:w.n});
  });

  const PHASES = [
    {name:"インプット期", note:"よくわかるを通し、基礎問で固める。12月末までに新規学習を終える。", upto:18},
    {name:"数英集中",     note:"化学は1日30分の維持だけ。新規学習はしない。", upto:20},
    {name:"化学スプリント", note:"共テ明けから化学に全投入。重問B → 過去問 → 弱点。", upto:26},
  ];

  const marks = [
    {at:18, kind:"end",  label:"インプット完了", sub:"全分野が白紙で解ける状態にする"},
    {at:20, kind:"exam", label:"共通テスト",     sub:state.meta.examK},
    {at:26, kind:"exam", label:"二次試験",       sub:state.meta.examN},
  ];

  let pi = 0;
  legs.forEach(leg=>{
    /* 相の見出しをまたぐ位置で差し込む */
    while(pi < PHASES.length && leg.from > (PHASES[pi].upto)){ pi++; }
    if(pi < PHASES.length && (pi === 0 ? leg.from === 1 : leg.from === PHASES[pi-1].upto + 1)){
      box.append(el("div",{class:"rd-phase"},
        el("span",{class:"rd-phase-name",text:PHASES[pi].name}),
        el("span",{class:"rd-phase-note",text:PHASES[pi].note})));
    }

    const d0 = weekDates(WEEKS[leg.from-1])[0];
    const d1 = weekDates(WEEKS[leg.to-1])[6];
    let tot=0, done=0;
    for(let n=leg.from;n<=leg.to;n++){ const q=weekProgress(n); tot+=q.total; done+=q.done; }
    const pct = tot ? Math.round(done/tot*100) : 0;
    const state_ = now > leg.to ? "past" : (now >= leg.from ? "now" : "future");
    const nWeeks = leg.to - leg.from + 1;

    const ticks = el("div",{class:"rd-ticks"});
    for(let n=leg.from;n<=leg.to;n++){
      const q = weekProgress(n);
      const f = q.total ? q.done/q.total*100 : 0;
      ticks.append(el("span",{class:"rd-tick" + (n===now?" now":""),
        title:"第"+n+"週 "+q.done+"/"+q.total,
        style:"--f:"+f+"%"}));
    }

    box.append(el("div",{class:"rd-leg "+state_,style:`--c:var(${PHASE[leg.ph].v})`},
      el("span",{class:"rd-dot"}),
      el("div",{class:"rd-body"},
        el("div",{class:"rd-line1"},
          el("span",{class:"rd-name",text:PHASE[leg.ph].name}),
          el("span",{class:"rd-weeks",text:"第"+leg.from+(nWeeks>1?"–"+leg.to:"")+"週"}),
          state_==="now" ? el("span",{class:"wnow",text:"いまここ"}) : null,
          el("span",{class:"rd-pct",text:pct+"%"}),
        ),
        el("div",{class:"rd-line2"},
          el("span",{class:"rd-dates",text:md(d0)+"–"+md(d1)}),
          el("span",{class:"rd-topics",text:
            WEEKS.slice(leg.from-1, leg.to).map(x=>x.short).join("・")}),
        ),
        ticks,
      )));

    marks.filter(m=>m.at===leg.to).forEach(m=>{
      const passed = m.kind==="exam" ? diffDays(today, m.sub) < 0 : now > m.at;
      box.append(el("div",{class:"rd-mark "+m.kind+(passed?" past":"")},
        el("span",{class:"rd-mark-dot"}),
        el("div",{},
          el("div",{class:"rd-mark-label",text:m.label}),
          el("div",{class:"rd-mark-sub",text:
            m.kind==="exam" ? md(m.sub)+"　あと"+Math.max(0,diffDays(today,m.sub))+"日" : m.sub}))));
    });

    if(leg.to === 17){
      box.append(el("div",{class:"rd-mark note"},
        el("span",{class:"rd-mark-dot"}),
        el("div",{},
          el("div",{class:"rd-mark-label",text:"ここで判断：高分子を1週前倒しするか"}),
          el("div",{class:"rd-mark-sub",text:"有機が順調なら前倒し、第18週は総点検に充てる"}))));
    }
  });

  return sec(null, box, el("p",{class:"muted",style:"margin-top:16px"},
    "上から順に通る道。目盛りが1週で、埋まった高さがその週の消化。朱い印がいまいる場所。"));
}

/* ---------------- 誤答 ---------------- */
function nextStep(e){ for(let i=0;i<3;i++) if(!e.r[i]) return i; return 2; }
function stepDue(e,i){
  if(i===0) return addDays(parse(e.date),1);
  if(i===1) return e.r[0] ? addDays(parse(e.r[0]),7) : null;
  return null;
}
function dueToday(){
  const t = parse(todayStr());
  return state.errors.filter(e=>{
    if(e.cleared) return false;
    const i = nextStep(e); if(i>2) return false;
    const d = stepDue(e,i); return d && d <= t;
  });
}
function markStep(id,i){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.r[i] = todayStr();
  if(e.r[0]&&e.r[1]&&e.r[2]) e.cleared = true;
  persist(); render();
}
function unmarkStep(id,i){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.r[i]=null; e.cleared=false; persist(); render();
}
function resetEntry(id){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.date = todayStr(); e.r=[null,null,null]; e.cleared=false; persist(); render();
}
function addError(ref, cause, date){
  state.errors.unshift({id:"e"+Date.now()+Math.random().toString(36).slice(2,6),
    ref, date: date||todayStr(), cause, r:[null,null,null], cleared:false, wk:currentWeekNo()});
  state.meta.lastRef = ref.replace(/[0-9０-９]+\s*$/,"");
  persist();
}

/* どこからでも開ける記録シート */
function openErrorSheet(){
  const sh = document.getElementById("sheet");
  sh.textContent = ""; sh.hidden = false;
  let cause = CAUSES[0].k;
  const inp = el("input",{type:"text",placeholder:"基礎問12 / 重問A45"});
  inp.value = state.meta.lastRef || "";
  const seg = el("div",{class:"seg",style:"display:flex;width:100%"});
  const paint = ()=>[...seg.children].forEach((b,i)=>b.setAttribute("aria-pressed", String(CAUSES[i].k===cause)));
  CAUSES.forEach(c=>seg.append(el("button",{type:"button",onclick:()=>{ cause=c.k; paint(); }},c.label)));
  paint();
  const close = ()=>{ sh.hidden = true; sh.textContent=""; };
  const save = ()=>{
    const ref = inp.value.trim(); if(!ref){ inp.focus(); return; }
    addError(ref, cause); close(); render(); toast("記録しました");
  };
  inp.addEventListener("keydown",ev=>{ if(ev.key==="Enter") save(); });
  const card = el("div",{class:"sheet-in"},
    el("p",{class:"hd",style:"margin-bottom:14px",text:"誤答を記録する"}),
    el("label",{class:"fld",text:"問題番号"}), inp,
    el("p",{class:"fld",style:"margin:16px 0 5px",text:"原因"}), seg,
    el("p",{class:"muted",style:"margin:14px 0 0"},"「知識不足」のものだけ、あとでAnkiカードにする。"),
    el("div",{style:"display:flex;gap:9px;margin-top:20px"},
      el("button",{class:"btn primary",style:"flex:1",onclick:save},"記録する"),
      el("button",{class:"btn",onclick:close},"やめる")),
  );
  sh.append(card);
  sh.addEventListener("click", ev=>{ if(ev.target===sh) close(); });
  setTimeout(()=>inp.focus(), 30);
}

function renderErr(){
  const root = document.getElementById("viewErr");
  root.textContent = "";
  const counts = CAUSES.map(c=>({c, n:state.errors.filter(e=>e.cause===c.k).length}));
  const total = counts.reduce((a,b)=>a+b.n,0);
  const top = counts.slice().sort((a,b)=>b.n-a.n)[0];
  const live = state.errors.filter(e=>!e.cleared);

  const bars = el("div",{class:"bars"});
  counts.forEach(({c,n})=>{
    bars.append(el("div",{class:"bar2",style:`--c:var(${c.v})`},
      el("span",{text:c.label}),
      el("div",{class:"tr2"}, el("div",{class:"t2",style:`width:${total?n/total*100:0}%`})),
      el("span",{class:"v2",text:String(n)})));
  });
  const agg = sec("分類の偏り", bars,
    total>=3 && top.n>0
      ? el("p",{class:"verdict",style:"margin-top:16px"},
          el("b",{text:"最も多いのは「"+top.c.label+"」。"}),
          " やること：" + top.c.fix + "　／　やってはいけない：" + top.c.ng)
      : el("p",{class:"muted",style:"margin-top:14px"},"3件たまると、多い分類に応じた対処を出す。"),
    el("p",{class:"muted",style:"margin-top:12px",
      text:"記録 "+state.errors.length+"件（未クリア "+live.length+"件）。3回続けて正解で外れる。"}));
  root.append(agg);

  const list = el("div",{});
  const t = parse(todayStr());
  if(!state.errors.length) list.append(el("p",{class:"muted",style:"margin:0"},"まだ記録がありません。右下の「＋誤答」から。"));
  state.errors.forEach(e=>{
    const c = CAUSES.find(x=>x.k===e.cause) || CAUSES[0];
    const steps = el("div",{class:"steps"});
    ["翌日","1週","章末"].forEach((lab,i)=>{
      const dd = stepDue(e,i);
      const isDue = !e.cleared && !e.r[i] && nextStep(e)===i && dd && dd<=t;
      steps.append(el("button",{class:"step"+(e.r[i]?" ok":"")+(isDue?" due":""),
        title: e.r[i] ? lab+"：正解 "+md(e.r[i]) : lab,
        onclick:()=> e.r[i] ? unmarkStep(e.id,i) : markStep(e.id,i)}, e.r[i] ? "✓" : lab));
    });
    list.append(el("div",{class:"err"+(e.cleared?" cleared":"")},
      el("div",{},
        el("div",{class:"err-ref",text:e.ref}),
        el("div",{class:"err-sub"}, md(e.date)+"　第"+(e.wk||"?")+"週　",
          el("span",{class:"cause",style:`--c:var(${c.v})`,text:c.label}))),
      el("div",{style:"display:flex;gap:10px;align-items:center"}, steps,
        el("button",{class:"xdel",title:"削除",onclick:()=>{
          if(!confirm("この記録を削除しますか。")) return;
          state.errors = state.errors.filter(x=>x.id!==e.id); persist(); render();
        }},"×"))));
  });
  root.append(sec("記録", list));
}

/* ---------------- ルール ---------------- */
function fold(title, ...body){
  return el("details",{class:"fold"}, el("summary",{text:title}),
    el("div",{class:"body"}, body.flat()));
}
function renderRule(){
  const root = document.getElementById("viewRule");
  root.textContent = "";

  root.append(sec("目標",
    el("h2",{text:"八割死守、あわよくば九割"}),
    el("p",{class:"note",style:"margin-top:12px"},
      "独学・初学・半年・1日90分では満点は届かない。だから網羅ではなく、落としてはいけない問題を落とさない設計にしてある。"),
    el("p",{class:"note",style:"margin-bottom:0"},"優先順位　理論 ＞ 有機 ＞ 無機 ＞ 高分子")));

  const r = el("div",{});
  r.append(
    fold("週の型（1日90分）",
      el("ul",{class:"tight"},
        el("li",{},el("b",{text:"月〜木　"}),"よくわかるを読む（30分）＋ 基礎問題精講（60分）"),
        el("li",{},el("b",{text:"金・土　"}),"問題演習（基礎問／重要問題集）"),
        el("li",{},el("b",{text:"日　　　"}),"週末チェック — その週の基礎問を白紙で解き直す"))),
    fold("週末チェックの判定（動かさない）",
      el("ul",{class:"tight"},
        el("li",{text:"8割以上 → 次の章へ進む"}),
        el("li",{},el("b",{text:"8割未満 → 次の章へ進まず、1週かけて補修する"}))),
      el("p",{class:"muted",style:"margin:0"},"この判定を守るかどうかが6ヶ月後の差になる。")),
    fold("補修の週は入門問題精講から入る",
      el("p",{class:"note"},
        "入門問題精講は普段は開かない。週末チェックで8割を切ったときだけ、その範囲を入門で解き直してから基礎問に戻る。これが入門を開く唯一の条件。"),
      el("p",{class:"muted",style:"margin:0"},
        "基礎問と役割が重複するため、あらかじめ日程には入れない。「補修する」としか決まっていなかった週の中身が、これで定まる。")),
    fold("八割を守る三原則",
      el("ul",{class:"tight"},
        el("li",{text:"基礎問題精講のレベルを100%にする（ここだけで6〜7割）"}),
        el("li",{text:"重要問題集B問題で応用に慣れる（8割の上積みはここ）"}),
        el("li",{text:"計算ミスを技術として潰す（9割を阻む最大要因は知識不足ではなく計算ミス）"}))),
    fold("Anki に入れるもの・入れないもの",
      el("p",{style:"margin-bottom:6px"},el("b",{text:"入れる"}),"（5秒以内に一つの答えが出るか）"),
      el("ul",{class:"tight"},
        el("li",{text:"化学反応式（「銅と濃硝酸 → ?」で式全体を書く）"}),
        el("li",{text:"沈殿・溶液の色（「Cu²⁺ に過剰のアンモニア水 → ?」）"}),
        el("li",{text:"気体の製法と捕集法"}),
        el("li",{text:"有機の反応系統・検出反応"}),
        el("li",{text:"定数・法則の定義文（自分の言葉で）"})),
      el("p",{style:"margin-bottom:6px"},el("b",{text:"入れない"})),
      el("ul",{class:"tight"},
        el("li",{text:"計算問題 — 手続き的知識。問題集の周回で処理する"}),
        el("li",{text:"長い説明・図の理解、「〜について説明せよ」型"}),
        el("li",{text:"ページ番号・問題番号 — 手がかりと想起対象がずれる"}))),
    fold("新規カードの目安", ankiTable(),
      el("p",{class:"muted",style:"margin-top:10px"},
        "上限の目安は600〜900枚。超えたらカードを増やさず問題集を回す。12月上旬に無機期のレビュー爆発が来る。苦しければ保持率を90%→85%に下げると負荷が2〜3割減る。")),
    fold("誤答分類 → 対処", causeTable()),
    fold("この計画表の仕掛けについて",
      el("p",{style:"margin-bottom:6px"},el("b",{text:"根拠が強いもの"})),
      el("ul",{class:"tight"},
        el("li",{text:"検索練習 — 日曜の白紙解き直し"}),
        el("li",{text:"実行意図 — 「◯◯が終わったら◯◯をやる」。メタ分析で効果量 d ≈ 0.6 前後"}),
        el("li",{text:"分散学習"})),
      el("p",{style:"margin-bottom:6px"},el("b",{text:"根拠が弱いもの"})),
      el("p",{class:"muted",style:"margin-bottom:12px"},
        "チェックや進捗の塗りつぶしで達成感が出るという説明は俗流の脳科学。だから消化状況は達成感のためではなく、翌週の時間配分を決める記録として使う。"),
      el("p",{style:"margin-bottom:6px"},el("b",{text:"意図的に入れなかったもの"})),
      el("p",{class:"muted",style:"margin:0"},
        "連続記録（ストリーク）。1日途切れた時点で全部やめる引き金になる。代わりに下の復帰ルールを置いてある。")),
    fold("まだ片付いていないこと",
      el("ul",{class:"tight"},
        el("li",{text:"金沢大の赤本が未所有。直近6年分以上が要る"}),
        el("li",{text:"大問構成の確認が未了。大問1〜5＋大問6（理系一括固有）という前提"}),
        el("li",{text:"試験日程は例年からの見込み。募集要項で確定させる"}),
        el("li",{text:"第18週の高分子を1週前倒しするかの判断（12月上旬）"}))),
  );
  root.append(sec("運用", r));

  /* 自分で決めること */
  const pl = el("textarea",{rows:"2",placeholder:"一つだけ書く。増やさない。"});
  pl.value = state.meta.pledge || "";
  pl.addEventListener("input",()=>{ state.meta.pledge = pl.value; persist(); });
  const rec = el("div",{});
  [0,1,2].forEach(i=>{
    const inp = el("input",{type:"text",placeholder: i===0 ? "例：飛ばした翌日はAnkiだけやる" : ""});
    inp.value = (state.meta.recovery||[])[i] || "";
    inp.addEventListener("input",()=>{ state.meta.recovery[i]=inp.value; persist(); });
    rec.append(el("div",{style:"margin-bottom:8px"}, inp));
  });
  root.append(sec("この六ヶ月で自分が守ること", pl));
  root.append(sec("崩れた日の復帰ルール",
    el("p",{class:"note"},"計画が壊れるのは飛ばした日ではなく、飛ばした翌日の判断で決まる。"), rec));

  const kIn = el("input",{type:"date"}); kIn.value = state.meta.examK;
  kIn.addEventListener("change",()=>{ state.meta.examK=kIn.value; persist(); render(); });
  const nIn = el("input",{type:"date"}); nIn.value = state.meta.examN;
  nIn.addEventListener("change",()=>{ state.meta.examN=nIn.value; persist(); render(); });
  root.append(sec("試験日（見込み。募集要項が出たら直す）",
    el("div",{class:"row"},
      el("div",{}, el("label",{class:"fld",text:"共通テスト 初日"}), kIn),
      el("div",{}, el("label",{class:"fld",text:"二次試験 初日"}), nIn))));
}
function ankiTable(){
  const wrap = el("div",{class:"tbl-wrap"});
  const tb = el("table");
  tb.append(el("thead",{},el("tr",{},el("th",{text:"時期"}),el("th",{text:"新規"}),el("th",{text:"備考"}))));
  const b = el("tbody");
  [["化学基礎（1–5週）","5〜10枚/日",""],
   ["理論化学（6–12週）","0〜10枚/日","法則の定義文のみ。ここで溜め込まない"],
   ["無機化学（13–14週）","30〜40枚/日","最大の山。この2週だけAnkiに25〜30分"],
   ["有機化学（15–17週）","20枚/日",""],
   ["高分子（18週）","25〜30枚/日",""],
   ["1月の維持期","0枚","レビューのみ。1日15分"],
   ["2月の演習期","0〜5枚/日","誤答の「知識不足」から抽出した分だけ"]]
   .forEach(r=>b.append(el("tr",{},el("td",{text:r[0]}),el("td",{text:r[1]}),el("td",{class:"muted",text:r[2]}))));
  tb.append(b); wrap.append(tb); return wrap;
}
function causeTable(){
  const wrap = el("div",{class:"tbl-wrap"});
  const tb = el("table");
  tb.append(el("thead",{},el("tr",{},el("th",{text:"最多の分類"}),el("th",{text:"やること"}),el("th",{text:"やってはいけないこと"}))));
  const b = el("tbody");
  CAUSES.forEach(x=>b.append(el("tr",{},
    el("td",{}, el("span",{class:"cause",style:`--c:var(${x.v})`,text:x.label})),
    el("td",{text:x.fix}), el("td",{class:"muted",text:x.ng}))));
  tb.append(b); wrap.append(tb); return wrap;
}

/* ---------------- 設定 ---------------- */
function renderSet(){
  const root = document.getElementById("viewSet");
  root.textContent = "";

  if(Store.account){
    root.append(sec("記録の保存先",
      el("p",{class:"note"},"記録はクラウドにある。この端末には残らない。同じアカウントで開けば、どの端末でも同じ内容になる。圏外のときは一時的に端末へ貯め、つながった時点で送る。"),
      el("div",{class:"acct"},
        el("div",{class:"acct-label",text:"ログイン中"}),
        el("div",{class:"acct-mail",text:Store.account})),
      el("button",{class:"btn danger",style:"margin-top:14px",onclick:()=>{ if(Store.signOut) Store.signOut(); }},"ログアウト")));
  }else{
    root.append(sec("記録の保存先", el("p",{class:"verdict"},"まだログインしていません。")));
  }

  root.append(sec("書き出しと読み込み",
    el("p",{class:"note"},"操作ミスに備えて、ときどき書き出しておくと安全。"),
    el("div",{style:"display:flex;gap:9px;flex-wrap:wrap"},
      el("button",{class:"btn",onclick:()=>{
        const blob = new Blob([JSON.stringify(exportState(),null,1)],{type:"application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "chem-plan-"+todayStr()+".json"; a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href),2000);
      }},"JSONで書き出す"),
      (()=>{
        const f = el("input",{type:"file",accept:"application/json,.json",style:"display:none"});
        f.addEventListener("change",()=>{
          const file = f.files && f.files[0]; if(!file) return;
          const rd = new FileReader();
          rd.onload = ()=>{ try{ importState(JSON.parse(String(rd.result))); }
                            catch(e){ toast("読み込めませんでした："+e.message); } };
          rd.readAsText(file); f.value = "";
        });
        return el("span",{}, el("button",{class:"btn",onclick:()=>f.click()},"JSONを読み込む"), f);
      })())));

  const cur = (()=>{ try{ return localStorage.getItem("chem:theme") || "auto"; }catch(e){ return "auto"; } })();
  const seg = el("div",{class:"seg"});
  [["auto","端末に合わせる"],["light","明るい"],["dark","暗い"]].forEach(([k,label])=>{
    seg.append(el("button",{"aria-pressed":String(k===cur),onclick:()=>{
      try{ localStorage.setItem("chem:theme",k); }catch(e){}
      applyTheme(); render();
    }}, label));
  });
  root.append(sec("表示", seg,
    el("p",{class:"muted",style:"margin-top:14px"},
      "ホーム画面に追加すると、アドレスバーなしで開く。iPhoneは共有ボタン →「ホーム画面に追加」、Androidはメニュー →「アプリをインストール」。")));

  root.append(sec("この計画表について",
    el("p",{class:"muted",style:"margin:0"},
      "金沢大学 理系一括 二次試験 化学の6ヶ月計画（2026/8/31 – 2027/2/28、全26週）。内容はPDF版と同一で、各週の「編集」から書き換えられる。")));
}
function applyTheme(){
  let t = "auto";
  try{ t = localStorage.getItem("chem:theme") || "auto"; }catch(e){}
  if(t==="auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t);
}

/* ---------------- ルーティング ---------------- */
const VIEWS = {today:"viewToday", week:"viewWeek", all:"viewAll",
               err:"viewErr", rule:"viewRule", set:"viewSet"};

function setView(v){
  view = v;
  document.querySelectorAll("nav.nav button").forEach(b=>
    b.setAttribute("aria-selected", String(b.dataset.view===v)));
  document.getElementById("menu").hidden = true;
  document.getElementById("menuBtn").setAttribute("aria-expanded","false");
  render();
}
function render(){
  for(const [k,id] of Object.entries(VIEWS)) document.getElementById(id).hidden = (k!==view);
  document.getElementById("fab").hidden = !["today","week","all","err"].includes(view);
  if(view==="today") renderToday();
  else if(view==="week") renderWeek();
  else if(view==="all") renderAll();
  else if(view==="err") renderErr();
  else if(view==="rule") renderRule();
  else renderSet();
}

document.querySelectorAll("nav.nav button").forEach(b=>
  b.addEventListener("click", ()=>setView(b.dataset.view)));

const menuBtn = document.getElementById("menuBtn");
const menuEl = document.getElementById("menu");
menuBtn.addEventListener("click", ()=>{
  const open = menuEl.hidden;
  menuEl.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", ev=>{
  if(!menuEl.hidden && !menuEl.contains(ev.target) && ev.target!==menuBtn){
    menuEl.hidden = true; menuBtn.setAttribute("aria-expanded","false");
  }
});
menuEl.querySelectorAll("button[data-go]").forEach(b=>
  b.addEventListener("click", ()=>setView(b.dataset.go)));
document.getElementById("printBtn").addEventListener("click", ()=>{
  menuEl.hidden = true;
  if(view!=="week"){ shownWeek = currentWeekNo(); setView("week"); }
  setTimeout(()=>window.print(), 120);
});
document.getElementById("fab").addEventListener("click", openErrorSheet);
document.addEventListener("keydown", ev=>{
  if(ev.key==="Escape"){
    const sh = document.getElementById("sheet");
    if(!sh.hidden){ sh.hidden = true; sh.textContent=""; }
  }
});

applyTheme();
try{ localStorage.removeItem("chem:syncCode"); }catch(e){}
shownWeek = currentWeekNo();
render();
