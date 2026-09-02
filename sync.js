/* ------------------------------------------------------------------
   ログインと保存。

   記録は Firestore（クラウド）に置く。端末には置かない。
   読み書きできるのは firebase-config.js の ALLOWED_EMAIL だけで、
   これは Firestore のルール側でも同じ条件を強制している
   （画面側のチェックだけでは守りにならないため）。

   オフラインのときは Firestore が端末内のキャッシュから読み書きし、
   回線が戻った時点で自動で送る。記録の正本はあくまでクラウド側。
   ------------------------------------------------------------------ */

const V = "11.6.0";
const S = window.PlanStore;

/* ---- ログイン画面の出し分け ---- */
const gate = document.getElementById("gate");
function showGate(html, buttons){
  if(!gate) return;
  gate.innerHTML = "";
  const card = document.createElement("div");
  card.className = "gate-card";
  card.innerHTML = html;
  if(buttons) card.append(buttons);
  gate.append(card);
  gate.classList.remove("hidden");
  document.body.classList.add("gated");
}
function hideGate(){
  if(!gate) return;
  gate.classList.add("hidden");
  gate.innerHTML = "";
  document.body.classList.remove("gated");
}
function btn(label, onClick, cls){
  const b = document.createElement("button");
  b.className = "btn " + (cls || "primary");
  b.type = "button";
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}
function row(...els){
  const d = document.createElement("div");
  d.className = "gate-actions";
  els.forEach(e => e && d.append(e));
  return d;
}

const LOADING = `<div class="gate-mark">化</div>
  <h1>二次化学 26週ノート</h1>
  <p class="gate-msg">読み込んでいます…</p>`;

showGate(LOADING);

/* ---- 起動 ---- */
(async function boot(){
  if(!S) return;

  const cfg = window.FIREBASE_CONFIG;
  const allowed = (window.ALLOWED_EMAIL || "").toLowerCase();

  if(!cfg || !cfg.projectId){
    showGate(`<div class="gate-mark">化</div>
      <h1>二次化学 26週ノート</h1>
      <p class="gate-msg">保存先がまだ設定されていません。</p>
      <p class="gate-sub">記録はクラウドに保存する設定になっています。<code>firebase-config.js</code> に接続先を入れてください。手順は README.md の「保存とログインのセットアップ」にあります。</p>`);
    return;
  }

  let mods, app, auth, db, fs, authMod;
  try{
    const [a, b, c] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
    ]);
    authMod = b; fs = c;
    app  = a.initializeApp(cfg);
    auth = b.getAuth(app);
    db   = c.initializeFirestore(app, {
      localCache: c.persistentLocalCache({ tabManager: c.persistentMultipleTabManager() }),
    });
  }catch(e){
    console.warn("[auth] 読み込めませんでした", e);
    showGate(`<div class="gate-mark">化</div>
      <h1>つながりませんでした</h1>
      <p class="gate-msg">通信を確認して、開き直してください。</p>`,
      row(btn("開き直す", () => location.reload())));
    return;
  }

  const provider = new authMod.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  if(allowed) provider.setCustomParameters({ prompt: "select_account", login_hint: allowed });

  async function signIn(){
    showGate(LOADING);
    try{
      await authMod.signInWithPopup(auth, provider);
    }catch(e){
      if(e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment"){
        try{ await authMod.signInWithRedirect(auth, provider); return; }catch(e2){ e = e2; }
      }
      if(e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request"){
        showSignIn();
        return;
      }
      console.warn("[auth] ログインできませんでした", e);
      showGate(`<div class="gate-mark">化</div>
        <h1>ログインできませんでした</h1>
        <p class="gate-msg">${e.code === "auth/unauthorized-domain"
          ? "このドメインが Firebase の承認済みドメインに入っていません。Firebase コンソール → Authentication → Settings で追加してください。"
          : "もう一度試してください。"}</p>
        <p class="gate-sub mono">${e.code || ""}</p>`,
        row(btn("もう一度ログイン", signIn)));
    }
  }

  function showSignIn(){
    showGate(`<div class="gate-mark">化</div>
      <h1>二次化学 26週ノート</h1>
      <p class="gate-msg">記録はクラウドに保存されています。Googleでログインしてください。</p>
      <p class="gate-sub">${allowed ? allowed : "登録されたアカウント"} だけが開けます。</p>`,
      row(btn("Googleでログイン", signIn)));
  }

  function showWrongAccount(email){
    showGate(`<div class="gate-mark deny">×</div>
      <h1>このアカウントでは開けません</h1>
      <p class="gate-msg mono">${email || "(不明)"}</p>
      <p class="gate-sub">この計画表を開けるのは ${allowed} だけです。アカウントを切り替えてください。</p>`,
      row(btn("別のアカウントでログイン", async () => {
        await authMod.signOut(auth);
        signIn();
      })));
  }

  try{ await authMod.getRedirectResult(auth); }catch(e){ /* リダイレクト経由でないときは何もない */ }

  authMod.onAuthStateChanged(auth, user => {
    if(!user){ showSignIn(); return; }
    const email = (user.email || "").toLowerCase();
    if(allowed && email !== allowed){ showWrongAccount(user.email); return; }
    start(user);
  });

  /* ---- ログイン後：Firestore に繋ぐ ---- */
  let started = false;
  function start(user){
    S.setAccount(user.email, async () => {
      if(!confirm("ログアウトします。記録はクラウドに残ります。")) return;
      await authMod.signOut(auth);
      location.reload();
    });
    if(started){ hideGate(); return; }
    started = true;

    const ref = fs.doc(db, "plans", user.uid);
    let first = true;

    fs.onSnapshot(ref, snap => {
      hideGate();
      if(!snap.exists()){
        if(first){ first = false; push(S.get(), true); }   // まだ無いので今の内容を置く
        S.setStatus("on", "クラウドに保存");
        return;
      }
      first = false;
      let payload = snap.data() && snap.data().state;
      if(typeof payload === "string"){
        try{ payload = JSON.parse(payload); }catch(e){ return; }
      }
      const changed = S.apply(payload);
      S.setStatus("on", snap.metadata.fromCache ? "オフライン（未送信）" : "クラウドに保存");
      if(changed && !snap.metadata.hasPendingWrites) S.toast("別の端末の変更を取り込みました");
    }, err => {
      console.warn("[db] 受信できませんでした", err);
      if(err.code === "permission-denied"){
        showGate(`<div class="gate-mark deny">×</div>
          <h1>読み取りを拒否されました</h1>
          <p class="gate-msg">Firestore のルールがこのアカウントを許可していません。</p>
          <p class="gate-sub">README.md のルールを Firebase コンソールに貼り、許可するメールアドレスが ${allowed} になっているか確認してください。</p>`,
          row(btn("開き直す", () => location.reload())));
      }else{
        S.setStatus("off", "通信が切れました");
      }
    });

    let timer = null, pending = null;
    function push(stateObj, now){
      pending = stateObj;
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const body = pending; pending = null;
        S.setStatus("on", "保存中…");
        try{
          await fs.setDoc(ref, {
            state: JSON.stringify(body),
            updatedAt: (body.meta && body.meta.updatedAt) || Date.now(),
            savedAt: fs.serverTimestamp(),
            email: user.email,
          });
          S.setStatus("on", "クラウドに保存");
        }catch(e){
          console.warn("[db] 保存できませんでした", e);
          S.setStatus("off", e.code === "permission-denied" ? "保存を拒否されました" : "未送信（オフライン）");
        }
      }, now ? 0 : 800);
    }

    S.onReady(push);
  }
})();
