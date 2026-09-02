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
  note:"原子の姿と周期表。読む量は少ない助走週。ここで習慣の型を作る。",
  tasks:["第1章 物質と元素 ＋ 確認テスト1　p.12–24","第2章 熱運動と物質の三態 ＋ 確認テスト2　p.25–32","第3章1〜3 原子の構造・電子配置・イオン　p.34–48","第3章4 元素の周期表 ＋ 確認テスト3　p.49–59","入門問題精講 該当範囲","基礎問題精講 該当範囲 ＋ Ankiカード作成",CHK],
  conds:["周期表の1〜20番を書ける","分離操作の名称と原理を説明できる","基礎問の該当範囲が白紙で8割"]},
 {n:2,start:"2026-09-07",ph:"kiso",short:"結合",title:"物質と化学結合",
  note:"結合の型が以降すべての土台になる。ここを曖昧にすると無機で崩れる。",
  tasks:["イオン結合・金属結合・共有結合　p.60–72","電子式／配位結合と錯イオン　p.73–81","分子間の結合　p.82–91","金属の結晶構造 ＋ 確認テスト4 ＋ センター対策　p.92–102","入門問題精講 該当範囲","基礎問題精講 該当範囲 ＋ Anki",CHK],
  conds:["主要な分子の電子式を書ける","結晶4種を性質で区別できる","単位格子の計算ができる"]},
 {n:3,start:"2026-09-14",ph:"kiso",short:"物質量",title:"物質量と化学反応式",
  note:"ページは薄いが化学最大の山。ここの計算速度が最後まで効く。",
  tasks:["原子量・分子量と物質量　p.105–112","化学反応式と量的関係　p.113–117","溶液の濃度と固体の溶解度／原子説・分子説　p.118–123","基礎問題精講 mol計算に集中","基礎問題精講 続き","重要問題集A 該当範囲","週末チェック：mol計算だけは10割を目標にする"],
  conds:["mol⇄質量⇄体積⇄個数を迷わず往復できる","濃度換算(質量%⇄mol/L)ができる","量的関係の立式が10割"]},
 {n:4,start:"2026-09-21",ph:"kiso",short:"酸塩基",title:"酸・塩基・塩",
  note:"中和滴定は二次でも頻出。計算の型をここで固定する。",
  tasks:["酸と塩基／水素イオン濃度とpH　p.127–139","中和反応と塩／中和の量的関係　p.140–155","酸性酸化物・塩基性酸化物 ＋ 確認テスト2　p.156–159","入門＋基礎問題精講 該当範囲","基礎問題精講 滴定計算","重要問題集A 該当範囲",CHK],
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

const CAUSES = [
  {k:"知識",  label:"知識不足",     v:"--ph-muki",
   fix:"Ankiと該当節に戻す", ng:"問題数を増やす"},
  {k:"計算",  label:"計算ミス",     v:"--ph-riron",
   fix:"検算と有効数字の手順を作り直す", ng:"知識を足す／気合の問題にする"},
  {k:"読解",  label:"読解・設定ミス", v:"--ph-ensyu",
   fix:"条件を図か表に書き出す練習", ng:"解答を先に見る"},
];

const DOW = ["月","火","水","木","金","土","日"];

/* ============================================================
   2. 状態と保存
   ============================================================ */
const LS_KEY = "kanadai-chem-26w-v1";

const state = {
  weeks: {},          // "1".."26" -> {d:[bool x7], m:[num|null x7], c:[bool x3], score:null, anki:null, memo:"", tasks:null, conds:null}
  errors: [],         // {id, ref, date, cause, r:[null|"YYYY-MM-DD" x3], cleared:false, wk:n}
  meta: {pledge:"", recovery:["","",""], examK:"2027-01-16", examN:"2027-02-25"},
};

function blankWeek(){
  return {d:[false,false,false,false,false,false,false], m:[null,null,null,null,null,null,null],
          c:[false,false,false], score:null, anki:null, memo:"", tasks:null, conds:null};
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

function loadLocal(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw) Object.assign(state, JSON.parse(raw));
  }catch(e){ /* プライベートウィンドウ等。既定値のまま進む */ }
}
function saveLocal(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
}

function persist(){
  state.meta.updatedAt = Date.now();
  saveLocal();
  if(Store.remotePush && !Store.applyingRemote) Store.remotePush(exportState());
}

/* 遠隔から届いた内容を取り込む。自分が今書いた分より古ければ捨てる。 */
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
  saveLocal();
  render();
  return true;
}

function exportState(){
  return {weeks: state.weeks, errors: state.errors, meta: state.meta};
}
function importState(data, {silent} = {}){
  if(!data || typeof data !== "object" || !data.weeks) throw new Error("形式が違います");
  try{ localStorage.setItem(LS_KEY + ":backup", JSON.stringify(exportState())); }catch(e){}
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

function currentWeekNo(){
  const t = todayStr();
  const idx = Math.floor(diffDays(WEEKS[0].start, t) / 7);
  return Math.min(26, Math.max(1, idx + 1));
}
function weekDates(w){
  const s = parse(w.start);
  return Array.from({length:7}, (_,i)=> ymd(addDays(s, i)));
}

/* ============================================================
   4. 描画
   ============================================================ */
let view = "week";
let shownWeek = currentWeekNo();
let editMode = false;

const el = (tag, attrs, ...kids)=>{
  const n = document.createElement(tag);
  if(attrs) for(const [k,v] of Object.entries(attrs)){
    if(v === false || v == null) continue;
    if(k === "class") n.className = v;
    else if(k === "text") n.textContent = v;
    else if(k === "html") n.innerHTML = v;
    else if(k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if(k === "style") n.setAttribute("style", v);
    else n.setAttribute(k, v);
  }
  for(const kid of kids.flat()) if(kid != null) n.append(kid.nodeType ? kid : document.createTextNode(kid));
  return n;
};

function tasksOf(w){ const s = wk(w.n); return s.tasks || w.tasks; }
function condsOf(w){ const s = wk(w.n); return s.conds || w.conds; }

/* --- 今週 --- */
function renderWeek(){
  const root = document.getElementById("viewWeek");
  root.textContent = "";
  const w = WEEKS[shownWeek-1];
  const s = wk(w.n);
  const P = PHASE[w.ph];
  const dates = weekDates(w);
  const today = todayStr();
  const cvar = `--c:var(${P.v})`;

  /* ヘッダ */
  const head = el("section",{class:"card",style:cvar});
  head.append(
    el("div",{class:"wk-head"},
      el("div",{class:"wk-no mono"}, String(w.n).padStart(2,"0"), el("small",{text:"WEEK"})),
      el("div",{class:"wk-meta"},
        el("div",{class:"wk-dates mono"}, md(w.start) + " – " + md(dates[6]) + "　" + parse(w.start).getFullYear()),
        el("h2",{text:w.title}),
        el("div",{style:"margin:2px 0 6px"}, el("span",{class:"ph",style:cvar,text:P.name})),
      ),
      el("div",{class:"wk-nav"},
        el("button",{class:"btn",onclick:()=>{ shownWeek=Math.max(1,shownWeek-1); editMode=false; render(); },"aria-label":"前の週"},"‹"),
        el("button",{class:"btn",onclick:()=>{ shownWeek=currentWeekNo(); editMode=false; render(); }},"今週"),
        el("button",{class:"btn",onclick:()=>{ shownWeek=Math.min(26,shownWeek+1); editMode=false; render(); },"aria-label":"次の週"},"›"),
      ),
    ),
    el("p",{class:"muted",style:"margin:2px 0 12px",text:w.note}),
  );

  /* 到達メーター */
  const doneCount = s.d.filter(Boolean).length;
  head.append(
    el("p",{class:"eyebrow",style:"margin-bottom:5px"},"今週の到達　", el("span",{class:"mono",text:doneCount+" / 7"})),
    el("div",{class:"meter",style:cvar}, s.d.map(v=>el("i",{class: v ? "on" : ""}))),
    el("p",{class:"muted",style:"margin-top:8px"}, "Anki目安：" + P.anki),
  );
  root.append(head);

  /* 解き直しの期限 */
  const due = dueToday();
  if(due.length){
    const b = el("section",{class:"due-banner"},
      el("h3",{text:"今日の解き直し（" + due.length + "件）"}),
      el("p",{class:"muted",style:"margin:0 0 8px"},"誤答は翌日 → 1週間後 → 章末。3回連続正解で記録から外れる。"));
    due.forEach(e=>{
      const c = CAUSES.find(x=>x.k===e.cause) || CAUSES[0];
      b.append(el("div",{style:"display:flex;gap:8px;align-items:center;padding:3px 0;flex-wrap:wrap"},
        el("b",{class:"mono",style:"font-size:13px",text:e.ref}),
        el("span",{class:"cause",style:`--c:var(${c.v})`,text:c.label}),
        el("span",{class:"muted",text:"誤答 " + md(e.date)}),
        el("button",{class:"btn",style:"margin-left:auto",onclick:()=>{ markStep(e.id, nextStep(e)); }},"正解にする"),
        el("button",{class:"btn danger",onclick:()=>{ resetEntry(e.id); }},"また間違えた"),
      ));
    });
    root.append(b);
  }

  /* 日別タスク */
  const dayCard = el("section",{class:"card",style:cvar});
  dayCard.append(
    el("div",{style:"display:flex;align-items:baseline;gap:10px"},
      el("p",{class:"eyebrow",style:"margin:0",text:"日ごとのタスク"}),
      el("button",{class:"btn",style:"margin-left:auto",onclick:()=>{ editMode=!editMode; render(); }}, editMode ? "編集を終える" : "内容を編集"),
    ),
    el("p",{class:"muted",style:"margin:6px 0 10px"},"月〜木＝よくわかる30分＋基礎問60分／金・土＝演習／日＝週末チェック。数字は実際にやった分。"),
  );

  const days = el("div",{class:"days"});
  tasksOf(w).forEach((task, i)=>{
    const isToday = dates[i] === today;
    const row = el("div",{class:"day" + (s.d[i]?" done":"") + (isToday?" today":"") + (i===6?" sun":"")});
    row.append(el("div",{class:"dw mono"}, el("b",{text:DOW[i]}), md(dates[i])));

    if(editMode){
      const ta = el("textarea",{rows:"2",style:"font-size:13px"});
      ta.value = task;
      ta.addEventListener("change", ()=>{
        const arr = tasksOf(w).slice(); arr[i] = ta.value;
        wk(w.n).tasks = arr; persist();
      });
      row.append(ta);
    }else{
      row.append(el("div",{class:"dtask",text:task,onclick:()=>toggleDay(w.n,i)}));
    }

    row.append(
      el("div",{class:"dmin"}, (()=>{
        const inp = el("input",{type:"number",min:"0",max:"600",step:"5",placeholder:"分","aria-label":DOW[i]+"曜の学習時間（分）"});
        if(s.m[i] != null) inp.value = s.m[i];
        inp.addEventListener("change", ()=>{
          const v = inp.value === "" ? null : Math.max(0, Number(inp.value));
          wk(w.n).m[i] = v; persist(); renderWeekStatsOnly();
        });
        return inp;
      })()),
      (()=>{
        const c = el("input",{type:"checkbox",class:"chk","aria-label":DOW[i]+"曜を完了"});
        c.checked = !!s.d[i];
        c.addEventListener("change", ()=>toggleDay(w.n,i));
        return c;
      })(),
    );
    days.append(row);
  });
  dayCard.append(days);

  const mins = s.m.reduce((a,b)=>a+(b||0),0);
  dayCard.append(el("p",{class:"muted",style:"margin-top:10px"},
    "今週の合計　", el("b",{class:"mono",style:"font-size:15px;color:var(--ink)",text:mins+"分"}),
    "（" + (mins/60).toFixed(1) + "時間）　目安 90分×7 = 630分"));
  if(editMode && wk(w.n).tasks){
    dayCard.append(el("button",{class:"btn",style:"margin-top:8px",onclick:()=>{ wk(w.n).tasks=null; persist(); render(); }},"元の計画に戻す"));
  }
  root.append(dayCard);

  /* 合格条件 */
  const cc = el("section",{class:"card",style:cvar});
  cc.append(el("p",{class:"eyebrow",text:"今週の合格条件"}));
  const clist = el("div",{class:"conds"});
  condsOf(w).forEach((c,i)=>{
    if(editMode){
      const inp = el("input",{type:"text"}); inp.value = c;
      inp.addEventListener("change",()=>{ const arr=condsOf(w).slice(); arr[i]=inp.value; wk(w.n).conds=arr; persist(); });
      clist.append(el("div",{style:"padding:4px 0"}, inp));
    }else{
      const lab = el("label",{class:"cond" + (s.c[i]?" done":"")});
      const box = el("input",{type:"checkbox",class:"chk"});
      box.checked = !!s.c[i];
      box.addEventListener("change",()=>{ wk(w.n).c[i]=box.checked; persist(); render(); });
      lab.append(box, el("span",{text:c}));
      clist.append(lab);
    }
  });
  cc.append(clist);
  root.append(cc);

  /* 週末チェック */
  const wc = el("section",{class:"card",style:cvar});
  wc.append(
    el("p",{class:"eyebrow",text:"週末チェック（日曜）"}),
    el("p",{class:"muted",style:"margin-bottom:10px"},"今週の基礎問を白紙で解き直し、正答率を入れる。この判定は動かさない。"),
    el("div",{class:"row"},
      el("div",{}, el("label",{class:"fld",for:"scoreIn",text:"正答率（%）"}), (()=>{
        const inp = el("input",{type:"number",min:"0",max:"100",step:"1",id:"scoreIn",class:"mono",placeholder:"例 80"});
        if(s.score != null) inp.value = s.score;
        inp.addEventListener("change",()=>{ wk(w.n).score = inp.value==="" ? null : Number(inp.value); persist(); render(); });
        return inp;
      })()),
      el("div",{}, el("label",{class:"fld",text:"今週の新規Anki（枚）"}), (()=>{
        const inp = el("input",{type:"number",min:"0",step:"1",class:"mono",placeholder:"—"});
        if(s.anki != null) inp.value = s.anki;
        inp.addEventListener("change",()=>{ wk(w.n).anki = inp.value==="" ? null : Number(inp.value); persist(); });
        return inp;
      })()),
    ),
  );
  if(s.score != null){
    const pass = s.score >= 80;
    wc.append(el("div",{class:"verdict " + (pass?"pass":"fail")},
      pass ? "8割以上。次の章へ進む。" : "8割未満。次の章へ進まず、1週かけて補修する。ここを飛ばすと6ヶ月後に効いてくる。"));
  }else{
    wc.append(el("div",{class:"verdict"},"未記入。8割以上なら次へ、8割未満なら1週補修。"));
  }
  root.append(wc);

  /* メモ */
  const mc = el("section",{class:"card"});
  mc.append(el("p",{class:"eyebrow",text:"今週のメモ"}));
  const ta = el("textarea",{rows:"5",class:"note-area",placeholder:"詰まった箇所、新研究で引いたこと、来週に回したこと"});
  ta.value = s.memo || "";
  ta.addEventListener("input",()=>{ wk(w.n).memo = ta.value; persist(); });
  mc.append(ta);
  root.append(mc);
}

function renderWeekStatsOnly(){ /* 分の合計だけ更新したい場面用（現状は全描画で足りる） */ renderWeek(); }

function toggleDay(n, i){
  const s = wk(n);
  s.d[i] = !s.d[i];
  persist();
  render();
}

/* --- 26週 --- */
function renderAll(){
  const root = document.getElementById("viewAll");
  root.textContent = "";
  const today = todayStr();
  const now = currentWeekNo();

  /* 統計 */
  const totalDays = 26*7;
  const doneDays = WEEKS.reduce((a,w)=>a+wk(w.n).d.filter(Boolean).length,0);
  const totalMin = WEEKS.reduce((a,w)=>a+wk(w.n).m.reduce((x,y)=>x+(y||0),0),0);
  const toN = Math.max(0, diffDays(today, state.meta.examN));
  const toK = Math.max(0, diffDays(today, state.meta.examK));

  const st = el("section",{class:"card"});
  st.append(el("p",{class:"eyebrow",text:"現在地"}),
    el("div",{class:"stats"},
      el("div",{class:"stat"}, el("b",{class:"mono",text:doneDays+"/"+totalDays}), el("span",{text:"消化した日"})),
      el("div",{class:"stat"}, el("b",{class:"mono",text:(totalMin/60).toFixed(1)+"h"}), el("span",{text:"累計 化学時間"})),
      el("div",{class:"stat"}, el("b",{class:"mono",text:toK+"日"}), el("span",{text:"共通テストまで"})),
      el("div",{class:"stat"}, el("b",{class:"mono",text:toN+"日"}), el("span",{text:"二次試験まで"})),
    ));

  /* 三相構造 */
  const band = el("div",{class:"band"});
  const phases = [
    {label:"インプット期 第1–18週", n:18, v:"--ph-riron"},
    {label:"数英集中 19–20", n:2, v:"--ph-kyote"},
    {label:"化学スプリント 21–26", n:6, v:"--ph-ensyu"},
  ];
  phases.forEach(p=>{
    const d = el("div",{style:`flex:${p.n};--c:var(${p.v})`,text:p.label});
    band.append(d);
  });
  st.append(el("p",{class:"eyebrow",style:"margin:16px 0 0",text:"計画の三相構造"}), band,
    el("p",{class:"muted",style:"margin-top:6px"},"化学は共通テストにない。だから1月は維持30分だけに落として数英へ寄せ、共テ明けから全投入する。"));
  root.append(st);

  /* 週グリッド */
  const g = el("section",{class:"card"});
  g.append(el("p",{class:"eyebrow",text:"26週のトラック（タップでその週へ）"}));
  const track = el("div",{class:"track"});
  WEEKS.forEach(w=>{
    const s = wk(w.n);
    const done = s.d.filter(Boolean).length;
    const past = diffDays(weekDates(w)[6], today) > 0;
    const cell = el("button",{
      class:"cell" + (w.n===now?" now":"") + (past && done<5 ? " past-undone":""),
      style:`--c:var(${PHASE[w.ph].v})`,
      onclick:()=>{ shownWeek=w.n; editMode=false; setView("week"); window.scrollTo({top:0}); },
    },
      el("div",{class:"n",text:String(w.n).padStart(2,"0")}),
      el("div",{class:"l",text:w.short}),
      el("div",{class:"fill",style:`width:${done/7*100}%`}),
    );
    track.append(cell);
  });
  g.append(track);

  const lg = el("div",{class:"legend"});
  Object.entries(PHASE).forEach(([k,p])=>{
    lg.append(el("b",{style:`--c:var(${p.v})`}, el("i",{}), p.name));
  });
  g.append(lg);
  g.append(el("p",{class:"muted",style:"margin-top:10px"},"右上に赤点＝終わった週なのに5日未満しか消化していない週。"));
  root.append(g);

  /* 週の一覧表 */
  const tw = el("section",{class:"card"});
  tw.append(el("p",{class:"eyebrow",text:"全26週"}));
  const wrap = el("div",{class:"tbl-wrap"});
  const tb = el("table");
  tb.append(el("thead",{},el("tr",{},
    el("th",{text:"週"}),el("th",{text:"期間"}),el("th",{text:"分野"}),el("th",{text:"内容"}),el("th",{text:"消化"}),el("th",{text:"週末"}))));
  const body = el("tbody");
  WEEKS.forEach(w=>{
    const s = wk(w.n);
    const done = s.d.filter(Boolean).length;
    const sc = s.score;
    body.append(el("tr",{style:"cursor:pointer",onclick:()=>{ shownWeek=w.n; editMode=false; setView("week"); window.scrollTo({top:0}); }},
      el("td",{class:"num",text:String(w.n)}),
      el("td",{class:"num",text:md(w.start)+"–"+md(weekDates(w)[6])}),
      el("td",{}, el("span",{class:"ph",style:`--c:var(${PHASE[w.ph].v})`,text:PHASE[w.ph].name})),
      el("td",{text:w.title}),
      el("td",{class:"num",text:done+"/7"}),
      el("td",{class:"num",style: sc==null ? "" : (sc>=80?"color:var(--good)":"color:var(--bad)"), text: sc==null ? "—" : sc+"%"}),
    ));
  });
  tb.append(body); wrap.append(tb); tw.append(wrap);
  root.append(tw);

  /* リスク */
  const risk = el("section",{class:"card"});
  risk.append(el("p",{class:"eyebrow",text:"12月上旬に判断すること"}),
    el("p",{style:"margin-bottom:6px"},"第18週（12/28–1/3）の高分子が年末年始と重なる。"),
    el("p",{class:"muted",style:"margin:0"},"第15〜17週（有機）が順調なら1週前倒しし、12/21–12/27に高分子、12/28–1/3を化学基礎〜理論の総点検に充てるほうが安全。上の「内容を編集」で各週のタスクを差し替えられる。"));
  root.append(risk);
}

/* --- 誤答記録 --- */
function nextStep(e){ for(let i=0;i<3;i++) if(!e.r[i]) return i; return 2; }
function stepDue(e, i){
  if(i===0) return addDays(parse(e.date),1);
  if(i===1) return e.r[0] ? addDays(parse(e.r[0]),7) : null;
  return null; // 章末の週末チェック＝手動
}
function dueToday(){
  const t = parse(todayStr());
  return state.errors.filter(e=>{
    if(e.cleared) return false;
    const i = nextStep(e);
    if(i>2) return false;
    const d = stepDue(e,i);
    return d && d <= t;
  });
}
function markStep(id, i){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.r[i] = todayStr();
  if(e.r[0] && e.r[1] && e.r[2]) e.cleared = true;
  persist(); render();
}
function unmarkStep(id, i){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.r[i] = null; e.cleared = false; persist(); render();
}
function resetEntry(id){
  const e = state.errors.find(x=>x.id===id); if(!e) return;
  e.date = todayStr(); e.r = [null,null,null]; e.cleared = false;
  persist(); render();
}

let newCause = "知識";
function renderErr(){
  const root = document.getElementById("viewErr");
  root.textContent = "";

  /* 追加フォーム */
  const add = el("section",{class:"card"});
  add.append(el("p",{class:"eyebrow",text:"誤答を記録する"}));
  const refIn = el("input",{type:"text",placeholder:"基礎問12 / 重問A45 など"});
  const dateIn = el("input",{type:"date"}); dateIn.value = todayStr();
  const seg = el("div",{class:"seg"});
  CAUSES.forEach(c=>{
    const b = el("button",{style:`--c:var(${c.v})`,"aria-pressed": String(c.k===newCause), onclick:()=>{ newCause=c.k; render(); }}, c.label);
    seg.append(b);
  });
  add.append(
    el("div",{class:"row"},
      el("div",{style:"flex:2"}, el("label",{class:"fld",text:"問題番号"}), refIn),
      el("div",{}, el("label",{class:"fld",text:"日付"}), dateIn),
    ),
    el("div",{style:"margin-top:10px"}, el("label",{class:"fld",text:"原因（3分類）"}), seg),
    el("button",{class:"btn primary",style:"margin-top:12px",onclick:()=>{
      const ref = refIn.value.trim();
      if(!ref){ refIn.focus(); return; }
      state.errors.unshift({
        id: "e" + Date.now() + Math.random().toString(36).slice(2,6),
        ref, date: dateIn.value || todayStr(), cause: newCause,
        r:[null,null,null], cleared:false, wk: currentWeekNo(),
      });
      persist(); render();
    }},"記録する"),
    el("p",{class:"muted",style:"margin:10px 0 0"},"原因が「知識不足」のものだけ、その知識を切り出してAnkiカードにする。"),
  );
  root.append(add);

  /* 集計 */
  const live = state.errors.filter(e=>!e.cleared);
  const counts = CAUSES.map(c=>({c, n: state.errors.filter(e=>e.cause===c.k).length}));
  const total = counts.reduce((a,b)=>a+b.n,0);
  const top = counts.slice().sort((a,b)=>b.n-a.n)[0];

  const ag = el("section",{class:"card"});
  ag.append(el("p",{class:"eyebrow",text:"分類の偏り"}),
    el("p",{class:"muted",style:"margin-bottom:12px"},"2月はこの偏りが対策を決める。多い分類にだけ手を打つ。"));
  const bars = el("div",{class:"bars"});
  counts.forEach(({c,n})=>{
    bars.append(el("div",{class:"bar",style:`--c:var(${c.v})`},
      el("span",{text:c.label}),
      el("div",{class:"track2"}, el("div",{class:"t",style:`width:${total? (n/total*100):0}%`})),
      el("span",{class:"v",text:String(n)}),
    ));
  });
  ag.append(bars);
  if(total >= 3 && top.n > 0){
    ag.append(el("div",{class:"verdict",style:"margin-top:14px"},
      el("b",{text:"最多は「"+top.c.label+"」。"}), " やること：" + top.c.fix + "　／　やってはいけない：" + top.c.ng));
  }
  ag.append(el("p",{class:"muted",style:"margin-top:12px"},
    "記録 " + state.errors.length + " 件（未クリア " + live.length + " 件）。3回連続正解で記録から外れる。"));
  root.append(ag);

  /* 一覧 */
  const list = el("section",{class:"card"});
  list.append(el("p",{class:"eyebrow",text:"記録一覧"}));
  if(!state.errors.length){
    list.append(el("p",{class:"muted",style:"margin:0"},"まだ記録がありません。"));
  }
  const t = parse(todayStr());
  state.errors.forEach(e=>{
    const c = CAUSES.find(x=>x.k===e.cause) || CAUSES[0];
    const steps = el("div",{class:"steps"});
    ["翌日","1週","章末"].forEach((lab,i)=>{
      const dueD = stepDue(e,i);
      const isDue = !e.cleared && !e.r[i] && nextStep(e)===i && dueD && dueD<=t;
      const b = el("button",{
        class:"step" + (e.r[i]?" ok":"") + (isDue?" due":""),
        title: e.r[i] ? lab+"：正解 "+md(e.r[i]) : lab,
        onclick:()=> e.r[i] ? unmarkStep(e.id,i) : markStep(e.id,i),
      }, e.r[i] ? "✓" : lab);
      steps.append(b);
    });
    list.append(el("div",{class:"err" + (e.cleared?" cleared":"")},
      el("div",{class:"err-main"},
        el("div",{class:"err-ref mono",text:e.ref}),
        el("div",{class:"err-sub mono"}, "誤答 " + md(e.date) + "　第" + (e.wk||"?") + "週"),
      ),
      el("span",{class:"cause",style:`--c:var(${c.v})`,text:c.label}),
      steps,
      el("button",{class:"btn danger",onclick:()=>{
        if(!confirm("この記録を削除しますか？")) return;
        state.errors = state.errors.filter(x=>x.id!==e.id); persist(); render();
      }},"削除"),
    ));
  });
  root.append(list);
}

/* --- ルール --- */
function renderRule(){
  const root = document.getElementById("viewRule");
  root.textContent = "";

  const a = el("section",{class:"card"});
  a.append(el("p",{class:"eyebrow",text:"目標"}),
    el("h2",{text:"8割死守、あわよくば9割"}),
    el("p",{class:"muted"},"独学・初学・半年・1日90分では満点は届かない。だから網羅ではなく「落としてはいけない問題を絶対に落とさない」設計にしてある。"),
    el("p",{style:"margin-top:10px"},"優先順位　", el("b",{class:"mono",text:"理論 > 有機 > 無機 > 高分子"})),
    el("ul",{class:"tight",style:"margin-top:8px"},
      el("li",{text:"基礎問題精講のレベルを100%にする（ここだけで6〜7割）"}),
      el("li",{text:"重要問題集B問題で応用に慣れる（8割の上積みはここ）"}),
      el("li",{text:"計算ミスを技術として潰す（9割を阻む最大要因は知識不足ではなく計算ミス）"}),
    ));
  root.append(a);

  const b = el("section",{class:"card"});
  b.append(el("p",{class:"eyebrow",text:"週の型（1日90分想定）"}),
    el("ul",{class:"tight"},
      el("li",{},el("b",{text:"月〜木　"}),"よくわかるを読む（30分）＋ 基礎問題精講（60分）"),
      el("li",{},el("b",{text:"金・土　"}),"問題演習（入門／基礎問／重要問題集）"),
      el("li",{},el("b",{text:"日　　　"}),"週末チェック — その週の基礎問を白紙で解き直す"),
    ),
    el("hr",{class:"hair"}),
    el("p",{class:"eyebrow",text:"週末チェックの判定（動かさない）"}),
    el("ul",{class:"tight"},
      el("li",{},"8割以上 → 次の章へ進む"),
      el("li",{},el("b",{text:"8割未満 → 次の章へ進まず、1週かけて補修する"})),
    ),
    el("p",{class:"muted",style:"margin:0"},"この判定を守るかどうかが6ヶ月後の差になる。"));
  root.append(b);

  const c = el("section",{class:"card"});
  c.append(el("p",{class:"eyebrow",text:"Anki の運用"}),
    el("p",{style:"margin-bottom:4px"},el("b",{text:"入れる"}),"（判定基準：5秒以内に一つの答えが出るか）"),
    el("ul",{class:"tight"},
      el("li",{text:"化学反応式（「銅と濃硝酸 → ?」で式全体を書く）"}),
      el("li",{text:"沈殿・溶液の色（「Cu²⁺ に過剰のアンモニア水 → ?」）"}),
      el("li",{text:"気体の製法と捕集法"}),
      el("li",{text:"有機の反応系統・検出反応"}),
      el("li",{text:"定数・法則の定義文（自分の言葉で）"}),
    ),
    el("p",{style:"margin-bottom:4px"},el("b",{text:"入れない"})),
    el("ul",{class:"tight"},
      el("li",{text:"計算問題 — 手続き的知識。問題集の周回で処理する"}),
      el("li",{text:"長い説明・図の理解、「〜について説明せよ」型"}),
      el("li",{text:"ページ番号・問題番号 — 手がかりと想起対象がずれる"}),
    ));
  const tw = el("div",{class:"tbl-wrap"});
  const tb = el("table");
  tb.append(el("thead",{},el("tr",{},el("th",{text:"時期"}),el("th",{text:"新規"}),el("th",{text:"備考"}))));
  const tbody = el("tbody");
  [["化学基礎（1–5週）","5〜10枚/日",""],
   ["理論化学（6–12週）","0〜10枚/日","法則の定義文のみ。ここで溜め込まない"],
   ["無機化学（13–14週）","30〜40枚/日","最大の山。この2週だけAnkiに25〜30分"],
   ["有機化学（15–17週）","20枚/日",""],
   ["高分子（18週）","25〜30枚/日",""],
   ["1月の維持期","0枚","レビューのみ。1日15分"],
   ["2月の演習期","0〜5枚/日","誤答の「知識不足」から抽出した分だけ"]].forEach(r=>{
    tbody.append(el("tr",{},el("td",{text:r[0]}),el("td",{class:"num",text:r[1]}),el("td",{class:"muted",text:r[2]})));
  });
  tb.append(tbody); tw.append(tb); c.append(tw);
  c.append(el("p",{class:"muted",style:"margin-top:8px"},
    "上限の目安は600〜900枚。超えたらカードを増やさず問題集を回す。12月上旬に無機期のレビュー爆発が来る — 苦しければ保持率を90%→85%に下げると負荷が2〜3割減る。"));
  root.append(c);

  const d = el("section",{class:"card"});
  d.append(el("p",{class:"eyebrow",text:"誤答分類 → 対処"}));
  const tw2 = el("div",{class:"tbl-wrap"});
  const tb2 = el("table");
  tb2.append(el("thead",{},el("tr",{},el("th",{text:"最多の分類"}),el("th",{text:"やること"}),el("th",{text:"やってはいけないこと"}))));
  const tb2b = el("tbody");
  CAUSES.forEach(x=>{
    tb2b.append(el("tr",{},
      el("td",{}, el("span",{class:"cause",style:`--c:var(${x.v})`,text:x.label})),
      el("td",{text:x.fix}),
      el("td",{class:"muted",text:x.ng})));
  });
  tb2.append(tb2b); tw2.append(tb2); d.append(tw2);
  root.append(d);

  /* 表紙の記入欄 */
  const e2 = el("section",{class:"card"});
  e2.append(el("p",{class:"eyebrow",text:"この6ヶ月で自分が守ること"}));
  const pl = el("textarea",{rows:"3",placeholder:"一つだけ書く。増やさない。"});
  pl.value = state.meta.pledge || "";
  pl.addEventListener("input",()=>{ state.meta.pledge = pl.value; persist(); });
  e2.append(pl);
  e2.append(el("p",{class:"eyebrow",style:"margin-top:18px",text:"崩れた日の復帰ルール"}),
    el("p",{class:"muted",style:"margin-bottom:8px"},"計画が壊れるのは飛ばした日ではなく、飛ばした翌日の判断で決まる。だから連続記録は置いていない。"));
  [0,1,2].forEach(i=>{
    const inp = el("input",{type:"text",placeholder:"例：飛ばした翌日はAnkiだけやる"});
    inp.value = (state.meta.recovery||[])[i] || "";
    inp.addEventListener("input",()=>{ state.meta.recovery[i] = inp.value; persist(); });
    e2.append(el("div",{style:"margin-bottom:7px"}, inp));
  });
  root.append(e2);

  /* 試験日 */
  const f = el("section",{class:"card"});
  f.append(el("p",{class:"eyebrow",text:"試験日（未確定。募集要項が出たら直す）"}),
    el("div",{class:"row"},
      el("div",{}, el("label",{class:"fld",text:"共通テスト 初日"}), (()=>{
        const i = el("input",{type:"date"}); i.value = state.meta.examK;
        i.addEventListener("change",()=>{ state.meta.examK=i.value; persist(); render(); }); return i;
      })()),
      el("div",{}, el("label",{class:"fld",text:"二次試験 初日"}), (()=>{
        const i = el("input",{type:"date"}); i.value = state.meta.examN;
        i.addEventListener("change",()=>{ state.meta.examN=i.value; persist(); render(); }); return i;
      })()),
    ));
  root.append(f);

  /* 正直な注記 */
  const g = el("section",{class:"card"});
  g.append(el("p",{class:"eyebrow",text:"この計画表の仕掛けについて"}),
    el("p",{style:"margin-bottom:8px"},el("b",{text:"根拠が強いもの"})),
    el("ul",{class:"tight"},
      el("li",{text:"検索練習（retrieval practice）— 日曜の白紙解き直し"}),
      el("li",{text:"実行意図（implementation intentions）— 「◯◯が終わったら◯◯をやる」。メタ分析で効果量 d ≈ 0.6 前後"}),
      el("li",{text:"分散学習"}),
    ),
    el("p",{style:"margin-bottom:8px"},el("b",{text:"根拠が弱いもの"})),
    el("p",{class:"muted",style:"margin-bottom:10px"},"チェックや進捗の塗りつぶしで「達成感が出る」「ドーパミンが出る」という説明は俗流の脳科学。だから消化状況は達成感のためではなく、翌週の時間配分を決める記録として使う。"),
    el("p",{style:"margin-bottom:8px"},el("b",{text:"意図的に入れなかったもの"})),
    el("p",{class:"muted",style:"margin:0"},"連続記録（ストリーク）。1日途切れた時点で全部やめる引き金になる。代わりに上の復帰ルールを置いてある。"));
  root.append(g);

  const h = el("section",{class:"card"});
  h.append(el("p",{class:"eyebrow",text:"まだ片付いていないこと"}),
    el("ul",{class:"tight"},
      el("li",{text:"金沢大の赤本が未所有。直近6年分以上が要る（第23〜25週で6年分を解く前提）"}),
      el("li",{text:"大問構成の確認が未了。大問1〜5＋大問6（理系一括固有）という前提で計画している"}),
      el("li",{text:"試験日程は例年からの見込み。募集要項で確定させる"}),
      el("li",{text:"第18週の高分子を1週前倒しするかの判断（12月上旬）"}),
    ));
  root.append(h);
}

/* --- 設定 --- */
function syncCode(){ try{ return localStorage.getItem("chem:syncCode") || ""; }catch(e){ return ""; } }
function setSyncCode(v){
  try{ v ? localStorage.setItem("chem:syncCode", v) : localStorage.removeItem("chem:syncCode"); }catch(e){}
}
function makeCode(){
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";   // 紛らわしい文字は除く
  const buf = new Uint32Array(12);
  crypto.getRandomValues(buf);
  const raw = Array.from(buf, n => abc[n % abc.length]).join("");
  return raw.slice(0,4) + "-" + raw.slice(4,8) + "-" + raw.slice(8,12);
}
function shareUrl(code){
  return location.origin + location.pathname + "#s=" + encodeURIComponent(code);
}
async function copy(text, label){
  try{ await navigator.clipboard.writeText(text); toast(label + "をコピーしました"); }
  catch(e){ toast("コピーできませんでした。長押しで選択してください"); }
}

function renderSet(){
  const root = document.getElementById("viewSet");
  root.textContent = "";
  const code = syncCode();
  const configured = !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId);

  /* 同期 */
  const sc = el("section",{class:"card"});
  sc.append(el("p",{class:"eyebrow",text:"端末間の同期"}));

  if(!configured){
    sc.append(
      el("div",{class:"verdict"},"同期はまだ設定されていません。このままでも、この端末のブラウザに全部保存されて普通に使えます。"),
      el("p",{class:"muted",style:"margin-top:10px"},"同期を使うには firebase-config.js に接続先を入れます。手順は README.md にあります。"),
    );
  }else if(!code){
    sc.append(
      el("p",{class:"muted",style:"margin-bottom:12px"},"同期コードを作ると、同じコードを入れた端末どうしで進捗が一致します。ログインは要りません。"),
      el("button",{class:"btn primary",onclick:()=>{
        const c = makeCode();
        setSyncCode(c);
        toast("同期を有効にしました");
        render();
        setTimeout(()=>location.reload(), 700);
      }},"同期コードを作る"),
      el("hr",{class:"hair"}),
      el("label",{class:"fld",text:"すでにコードがある場合はここに入れる"}),
      (()=>{
        const row = el("div",{class:"row"});
        const inp = el("input",{type:"text",placeholder:"xxxx-xxxx-xxxx",autocapitalize:"off",autocorrect:"off",spellcheck:"false"});
        row.append(el("div",{style:"flex:2"}, inp),
          el("div",{class:"shrink"}, el("button",{class:"btn",onclick:()=>{
            const v = inp.value.trim().toLowerCase();
            if(v.length < 8){ toast("コードが短すぎます"); return; }
            setSyncCode(v); location.reload();
          }},"この端末をつなぐ")));
        return row;
      })(),
    );
  }else{
    const url = shareUrl(code);
    sc.append(
      el("p",{class:"muted",style:"margin-bottom:10px"},"別の端末でこのリンクを開くと、そのまま同じ記録につながります。"),
      el("div",{class:"codebox"},
        el("div",{class:"codeval mono",text:code}),
        el("div",{style:"display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"},
          el("button",{class:"btn",onclick:()=>copy(url,"リンク")},"リンクをコピー"),
          el("button",{class:"btn",onclick:()=>copy(code,"コード")},"コードをコピー"),
        ),
      ),
      el("p",{class:"muted",style:"margin-top:10px"},"このコードを知っている人は記録を読み書きできます。人に見せないでください。"),
      el("button",{class:"btn danger",style:"margin-top:8px",onclick:()=>{
        if(!confirm("この端末を同期から外します。記録はこの端末に残ります。")) return;
        setSyncCode(""); location.reload();
      }},"この端末の同期をやめる"),
    );
  }
  root.append(sc);

  /* バックアップ */
  const bc = el("section",{class:"card"});
  bc.append(el("p",{class:"eyebrow",text:"バックアップ"}),
    el("p",{class:"muted",style:"margin-bottom:12px"},"ブラウザの履歴を消すと記録も消えます。ときどき書き出しておくと安全です。"),
    el("div",{style:"display:flex;gap:8px;flex-wrap:wrap"},
      el("button",{class:"btn",onclick:()=>{
        const blob = new Blob([JSON.stringify(exportState(),null,1)],{type:"application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "chem-plan-" + todayStr() + ".json";
        a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
      }},"JSONで書き出す"),
      (()=>{
        const f = el("input",{type:"file",accept:"application/json,.json",style:"display:none"});
        f.addEventListener("change", ()=>{
          const file = f.files && f.files[0]; if(!file) return;
          const r = new FileReader();
          r.onload = ()=>{
            try{ importState(JSON.parse(String(r.result))); }
            catch(e){ toast("読み込めませんでした：" + e.message); }
          };
          r.readAsText(file);
          f.value = "";
        });
        const b = el("button",{class:"btn",onclick:()=>f.click()},"JSONを読み込む");
        return el("span",{}, b, f);
      })(),
    ));
  root.append(bc);

  /* 表示 */
  const tc = el("section",{class:"card"});
  tc.append(el("p",{class:"eyebrow",text:"表示"}));
  const cur = (()=>{ try{ return localStorage.getItem("chem:theme") || "auto"; }catch(e){ return "auto"; } })();
  const seg = el("div",{class:"seg",style:"--c:var(--ph-kiso)"});
  [["auto","端末に合わせる"],["light","明るい"],["dark","暗い"]].forEach(([k,label])=>{
    seg.append(el("button",{"aria-pressed":String(k===cur),onclick:()=>{
      try{ localStorage.setItem("chem:theme", k); }catch(e){}
      applyTheme(); render();
    }}, label));
  });
  tc.append(seg);
  tc.append(el("p",{class:"muted",style:"margin-top:14px"},
    "ホーム画面に追加すると、アドレスバーなしのアプリとして開きます。iPhoneは共有ボタン →「ホーム画面に追加」、Androidはメニュー →「アプリをインストール」。"));
  root.append(tc);

  /* この計画について */
  const ac = el("section",{class:"card"});
  ac.append(el("p",{class:"eyebrow",text:"この計画表について"}),
    el("p",{class:"muted",style:"margin:0"},
      "金沢大学 理系一括 二次試験 化学の6ヶ月計画（2026/8/31 – 2027/2/28、全26週）。目標は8割死守。" +
      "内容はPDF版『金沢大_二次化学_6ヶ月計画ノート』と同一で、各週のタスクは「今週」タブの「内容を編集」から書き換えられます。"));
  root.append(ac);
}

function applyTheme(){
  let t = "auto";
  try{ t = localStorage.getItem("chem:theme") || "auto"; }catch(e){}
  if(t === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t);
}

/* ============================================================
   5. ルーティング
   ============================================================ */
function setView(v){
  view = v;
  document.querySelectorAll("nav.tabs button").forEach(b=>{
    b.setAttribute("aria-selected", String(b.dataset.view === v));
  });
  render();
}
function render(){
  document.getElementById("viewWeek").classList.toggle("hidden", view!=="week");
  document.getElementById("viewAll").classList.toggle("hidden", view!=="all");
  document.getElementById("viewErr").classList.toggle("hidden", view!=="err");
  document.getElementById("viewRule").classList.toggle("hidden", view!=="rule");
  document.getElementById("viewSet").classList.toggle("hidden", view!=="set");
  if(view==="week") renderWeek();
  else if(view==="all") renderAll();
  else if(view==="err") renderErr();
  else if(view==="rule") renderRule();
  else renderSet();
}

document.querySelectorAll("nav.tabs button").forEach(b=>{
  b.addEventListener("click", ()=>setView(b.dataset.view));
});

const syncBtn = document.getElementById("syncBtn");
if(syncBtn) syncBtn.addEventListener("click", ()=>{ setView("set"); window.scrollTo({top:0}); });

applyTheme();
loadLocal();

/* #s=コード つきのリンクで開かれたら、その同期コードを採用する */
(function(){
  const m = /[#&]s=([^&]+)/.exec(location.hash);
  if(!m) return;
  const c = decodeURIComponent(m[1]).trim().toLowerCase();
  history.replaceState(null, "", location.pathname + location.search);
  if(c && c !== syncCode()){
    setSyncCode(c);
  }
})();

shownWeek = currentWeekNo();
render();
