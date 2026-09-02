/* ------------------------------------------------------------------
   記録の保存先（Firestore）と、開けるアカウント。

   ここが空だとアプリは「保存先がまだ設定されていません」と出て止まる。
   記録はクラウドにしか置かない設計なので、これは意図した挙動。

   手順は README.md の「保存とログインのセットアップ」を見てください。
   この値はブラウザに配られる前提の公開設定で、秘密鍵ではありません。
   実際の防御は firestore.rules で行っています。
   ------------------------------------------------------------------ */

window.ALLOWED_EMAIL = "minchino067@gmail.com";

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAC_47eiX73GakhqyWOlSeYM1wJeQABt_g",
  authDomain: "chem-plan-260902-13737.firebaseapp.com",
  projectId: "chem-plan-260902-13737",
  storageBucket: "chem-plan-260902-13737.firebasestorage.app",
  messagingSenderId: "823295388015",
  appId: "1:823295388015:web:8f296710ec8809da3ea09a"
};
