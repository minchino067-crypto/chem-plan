/* ------------------------------------------------------------------
   端末間の同期。

   設計上の約束：ここが何をしても、アプリ本体（app.js）は動く。
   Firebase の設定が空、CDN に届かない、通信が切れている — どの場合も
   localStorage への保存はそのまま働き、この module は静かに降りる。

   仕組み：
     同期コード（例 abcd-efgh-ijkl）= Firestore の文書ID。
     同じコードを入れた端末は同じ文書を読み書きするので内容が一致する。
     ログインは要らない（匿名認証を裏で通すだけ）。
   ------------------------------------------------------------------ */

const V = "11.6.0";
const S = window.PlanStore;

function code(){
  try{ return localStorage.getItem("chem:syncCode") || ""; }catch(e){ return ""; }
}

async function boot(){
  if(!S) return;

  const cfg = window.FIREBASE_CONFIG;
  const c = code();

  if(!cfg || !cfg.projectId){ S.setStatus("", "この端末に保存"); return; }
  if(!c){ S.setStatus("", "この端末に保存"); return; }

  S.setStatus("", "接続中…");

  let app, db, auth, fs;
  try{
    const [{initializeApp}, authMod, firestore] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
    ]);
    fs = firestore;
    app  = initializeApp(cfg);
    auth = authMod.getAuth(app);
    await authMod.signInAnonymously(auth);
    db = firestore.initializeFirestore(app, {
      localCache: firestore.persistentLocalCache({
        tabManager: firestore.persistentMultipleTabManager(),
      }),
    });
  }catch(e){
    console.warn("[sync] 接続できませんでした", e);
    S.setStatus("off", "この端末のみ（同期エラー）");
    return;
  }

  const ref = fs.doc(db, "plans", c);

  /* 受信 */
  let first = true;
  fs.onSnapshot(ref, snap => {
    if(!snap.exists()){
      if(first){ push(S.get(), true); first = false; }   // まだ無いので今の内容を置く
      return;
    }
    first = false;
    const data = snap.data();
    let payload = data && data.state;
    if(typeof payload === "string"){
      try{ payload = JSON.parse(payload); }catch(e){ return; }
    }
    const changed = S.apply(payload);
    S.setStatus("on", snap.metadata.fromCache ? "同期（オフライン）" : "同期中");
    if(changed && !snap.metadata.hasPendingWrites) S.toast("別の端末の変更を取り込みました");
  }, err => {
    console.warn("[sync] 受信が止まりました", err);
    S.setStatus("off", err.code === "permission-denied" ? "同期の権限がありません" : "同期が切れました");
  });

  /* 送信（まとめて書く） */
  let timer = null, pending = null;
  function push(stateObj, now){
    pending = stateObj;
    clearTimeout(timer);
    timer = setTimeout(async ()=>{
      const body = pending; pending = null;
      try{
        await fs.setDoc(ref, {
          state: JSON.stringify(body),
          updatedAt: (body.meta && body.meta.updatedAt) || Date.now(),
          savedAt: fs.serverTimestamp(),
        });
        S.setStatus("on", "同期中");
      }catch(e){
        console.warn("[sync] 保存できませんでした", e);
        S.setStatus("off", e.code === "permission-denied" ? "同期の権限がありません" : "この端末のみ（保存エラー）");
      }
    }, now ? 0 : 800);
  }

  S.onReady(push);
  S.setStatus("on", "同期中");
}

boot();
