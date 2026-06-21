// ============================================================
// Configurazione del form di contatto (Web3Forms)
// ============================================================
// Il sito è statico (GitHub Pages): non c'è un server nostro che invia
// le email. Le invia Web3Forms, un servizio gratuito. Il form fa una
// richiesta a Web3Forms che poi gira il messaggio sulla tua casella.
//
// 👉 COSA DEVI FARE TU (una volta sola):
//   1. Vai su https://web3forms.com  e clicca "Create Access Key"
//   2. Inserisci l'email dove vuoi ricevere le richieste
//      (es. founders.dgftechsolutions@gmail.com)
//   3. Ti arriva via email una "Access Key" (un codice tipo
//      "a1b2c3d4-....-...."): incollala qui sotto al posto del placeholder.
//
// NOTA SICUREZZA: questa chiave è PUBBLICA per definizione (finisce comunque
// nel codice del browser). Non è una password: va bene che stia qui.
export const WEB3FORMS_ACCESS_KEY = "f2873aaa-7263-4b3b-8f1e-8a06dccb49d3";

// ── Protezione anti-bot (hCaptcha) ──────────────────────────────────────────
// Sostituisce Cloudflare Turnstile (che su Web3Forms è a pagamento).
// Questa è la sitekey PUBBLICA e GRATUITA condivisa di Web3Forms: funziona
// senza dover creare alcun account hCaptcha. Lasciala così com'è.
// Se un domani vuoi usare un tuo account hCaptcha, metti qui la TUA sitekey.
// Per DISATTIVARE del tutto il captcha (lasciando solo l'honeypot), metti "".
export const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

// Oggetto e mittente mostrati nell'email che ricevi.
export const CONTACT_SUBJECT_PREFIX = "Nuova richiesta dal sito";
export const CONTACT_FROM_NAME = "Sito DGF Tech Solutions";
