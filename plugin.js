/*! XuperPro Todo Externo 1.0.0 – build EXTERNO (todo unificado + eventos): clave incrustada, funciona dentro y fuera del panel. Mismo motor que XuperPro. Vease NOTICE. */
var toHex = (s) => Array.from(new TextEncoder().encode(s), (b) => b.toString(16).padStart(2, "0")).join("");
var HEX_CHUNK = 65536;
var NOT_LOWER_HEX = /[^0-9a-f]/;
var NOT_ASCII = /[^\x00-\x7f]/;
var PAIR = /../g;
function fromHex(h) {
  if (typeof h !== "string" || h.length === 0 || h.length % 2 !== 0) throw new Error("not hex");
  const parts = [];
  for (let i = 0; i < h.length; i += HEX_CHUNK) {
    const piece = h.slice(i, i + HEX_CHUNK);
    if (NOT_LOWER_HEX.test(piece)) throw new Error("not hex");
    const text3 = decodeURIComponent(piece.replace(PAIR, "%$&"));
    if (NOT_ASCII.test(text3)) throw new Error("not ascii");
    parts.push(text3);
  }
  return parts.join("");
}
var PASS_KEY = "kino-xuper-hex16";
var HOST_CHUNK = 4e6;
function hostFromHex(kino2, h) {
  if (typeof h !== "string" || h.length === 0 || h.length % 2 !== 0) throw new Error("not hex");
  const parts = [];
  for (let i = 0; i < h.length; i += HOST_CHUNK) {
    const piece = h.slice(i, i + HOST_CHUNK);
    const sealed = kino2.crypto.encrypt("aes-128-ecb", { key: PASS_KEY, data: piece, inputEncoding: "hex" });
    const text3 = kino2.crypto.decrypt("aes-128-ecb", { key: PASS_KEY, data: sealed });
    if (typeof text3 !== "string" || text3.length * 2 !== piece.length) throw new Error("not ascii");
    parts.push(text3);
  }
  return parts.join("");
}
function wireText(kino2, h) {
  let text3 = null;
  try {
    text3 = hostFromHex(kino2, h);
  } catch (_) {
  }
  return text3 === null ? { text: fromHex(h), how: "engine" } : { text: text3, how: "host" };
}
function makeCrypto(kino2, { onDecode = null } = {}) {
  const fail = (what) => kino2.error("unavailable", "el portal no se pudo " + what);
    const EMBEDDED_MAGIS = "e7af1ed7de1ffddd7bd3fe37ebdffde9ef3fe1ae39edfeb8";
    const keyArgs = () => { const m = kino2.secret("magisKey"); return (typeof m === "string" && m.startsWith("__KINO_SECRET_")) ? { key: m } : { key: EMBEDDED_MAGIS, keyEnc: "hex" }; };
  return {
    encryptBody(plain3) {
      try {
        const b64 = kino2.crypto.encrypt("des-ede3-ecb", {
          ...keyArgs(),
          data: plain3,
          padding: "pkcs7"
        });
        if (typeof b64 !== "string" || b64 === "") throw new Error("empty");
        return toHex(b64);
      } catch (_) {
        throw fail("cifrar");
      }
    },
    // `onDecode({ how, bytes, ms })`, optional: which way a wire was decoded and how long it took.
    decryptBlob(wire) {
      try {
        const startedAt = Date.now();
        const { text: b64, how } = wireText(kino2, wire);
        if (onDecode) onDecode({ how, bytes: wire.length, ms: Date.now() - startedAt });
        const text3 = kino2.crypto.decrypt("des-ede3-ecb", {
          ...keyArgs(),
          data: b64,
          padding: "pkcs7"
        });
        if (typeof text3 !== "string" || text3 === "") throw new Error("empty");
        return text3;
      } catch (_) {
        throw fail("descifrar");
      }
    }
  };
}
var hosts = ["osuhk.m3x8o50te.com", "oogoy.f30c96w8.com"];
var APP_ID = "com.android.msandroid";
var APK_VERSION = "49902";
var PORTAL_CODE = "masnew";
var SPKG_VER = "2025-08-07 05:40:11_36_16_";
var APK_VER_HEADER = "43404";
var USER_AGENT = "okhttp/3.12.12";
var UA_CDN = "Ranger/4.9.4-17294ac0";
var LIVE_USER_AGENT = "Ranger/4.9.4-17294ac0";
var LIVE_APP = "com.android.msandroid";
var LIVE_APP_VERSION = "49902";
var LIVE_X_BUFFER = "0";
var CONTENT_TYPE = "application/json;charset=utf-8";
var RATE_LIMIT_MS = 400;
var REQUEST_TIMEOUT_MS = 25e3;
var DEVICE_FIXED = Object.freeze({
  loginType: "2",
  appLanguage: "en",
  hardwareInfo: "ranchu",
  model: "sdk_gphone64_arm64",
  product: "sdk_gphone64_arm64",
  cpu: "arm64-v8a",
  B29: "",
  reserve1: "",
  deviceToken: "",
  drmId: "",
  sdkVer: 36
});
var PASSWORD_SALT = "cloudstream";
var FIXED_MAC = "02:00:00:00:00:00";
var isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
var asText = (v) => v === null || v === void 0 ? "" : typeof v === "string" ? v : String(v);
var optStringStrict = (v) => typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
var isBlank = (s) => typeof s !== "string" || s.trim() === "";
var notBlank = (s) => s.trim() !== "";
var objects = (v) => Array.isArray(v) ? v.filter(isObject) : [];
var isKinoError = (e) => e !== null && typeof e === "object" && typeof e.name === "string" && e.name.startsWith("KinoError_");
var INT = /^[+-]?\d+$/;
function intOrNull(v) {
  if (v === null || v === void 0) return null;
  const s = String(v);
  if (!INT.test(s)) return null;
  const n = Number(s);
  return n >= -2147483648 && n <= 2147483647 ? n : null;
}
var MAX_LINE_CHARS = 160;
var NAME = /^[a-z][a-z0-9_-]{0,19}$/;
var KEY = /^[a-z][a-zA-Z0-9]{0,11}$/;
var SENSITIVE_KEY = /pass|token|secret|cred|auth|bearer|cookie|session|key|mail|host|url|^sn$|user|license|sign/i;
var VALUE = /^[A-Za-z0-9_\/-]{1,20}$/;
var ID_SHAPED = /[0-9a-fA-F]{12}|[0-9]{10}/;
var APP_BLOB_CHARS = 24;
var APP_LONG_TOKEN = /(?=[A-Za-z0-9_-]*\d)[A-Za-z0-9_-]{16,}/;
function word(v) {
  let s;
  if (typeof v === "number") s = Number.isFinite(v) ? String(Math.round(v)) : "?";
  else if (typeof v === "boolean") return v ? "1" : "0";
  else s = typeof v === "string" ? v : "";
  return VALUE.test(s) && !ID_SHAPED.test(s) ? s : "?";
}
function field(k, v) {
  const w = word(v);
  return k.length + 1 + w.length >= APP_BLOB_CHARS || APP_LONG_TOKEN.test(w) ? `${k}=?` : `${k}=${w}`;
}
function lineOf(area, event, fields) {
  const parts = [`xuper:${NAME.test(area) ? area : "?"}`, NAME.test(event) ? event : "?"];
  if (fields !== null && typeof fields === "object") {
    for (const [k, v] of Object.entries(fields)) {
      if (v === void 0 || v === null || !KEY.test(k) || SENSITIVE_KEY.test(k)) continue;
      parts.push(field(k, v));
    }
  }
  return parts.join(" ").slice(0, MAX_LINE_CHARS);
}
function trace(kino2, area, event, fields = {}) {
  try {
    kino2.log(lineOf(area, event, fields));
  } catch (_) {
  }
}
var PERF_AREAS = Object.freeze({ slow: "perf_slow", timeout: "perf_timeout", cold: "perf_cold", store: "perf_store", decode: "perf_decode" });
var SLOW_CALL_MS = 8e3;
var TIMEOUT_CALL_MS = 2e4;
function msBucket(ms) {
  const s = Number.isFinite(ms) ? ms / 1e3 : 0;
  const edges = [[1, "lt1s"], [2, "1-2s"], [4, "2-4s"], [8, "4-8s"], [12, "8-12s"], [16, "12-16s"], [20, "16-20s"], [30, "20-30s"], [60, "30-60s"]];
  for (const [limit, word2] of edges) if (s < limit) return word2;
  return "ge60s";
}
function kbBucket(bytes) {
  const kb = Number.isFinite(bytes) ? bytes / 1024 : 0;
  const edges = [[256, "lt256k"], [512, "256-512k"], [1024, "512k-1m"], [2048, "1-2m"], [4096, "2-4m"]];
  for (const [limit, word2] of edges) if (kb < limit) return word2;
  return "ge4m";
}
function reportCallTime(kino2, fn, ms, ok, more = {}) {
  if (!(ms >= SLOW_CALL_MS)) return;
  trace(kino2, ms >= TIMEOUT_CALL_MS ? PERF_AREAS.timeout : PERF_AREAS.slow, "call", { fn, b: msBucket(ms), ok, ...more });
}
function makeDecodeReporter(kino2) {
  let done = false;
  return ({ how, bytes, ms }) => {
    if (done || !(bytes >= 1e6)) return;
    done = true;
    trace(kino2, PERF_AREAS.decode, "wire", { how, kb: kbBucket(bytes), b: msBucket(ms) });
  };
}
function errCode(e) {
  if (e === null || typeof e !== "object") return "error";
  const name = typeof e.name === "string" ? e.name : "";
  let c = "";
  if (name === "PortalError" && typeof e.code === "string") c = e.code;
  else if (name.startsWith("KinoError_")) c = name.slice("KinoError_".length);
  else c = name;
  return VALUE.test(c) ? c : "error";
}
async function traced(kino2, clock2, fn, body, extra = {}, late = null) {
  const t0 = clock2.now();
  trace(kino2, "call", "start", { fn, ...extra });
  const lateFields = () => {
    if (typeof late !== "function") return {};
    try {
      const f = late();
      return f !== null && typeof f === "object" ? f : {};
    } catch (_) {
      return {};
    }
  };
  let out;
  try {
    out = await body();
  } catch (e) {
    const ms2 = clock2.now() - t0;
    const more2 = lateFields();
    trace(kino2, "call", "fail", { fn, ...extra, code: errCode(e), ms: ms2, ...more2 });
    reportCallTime(kino2, fn, ms2, false, more2);
    throw e;
  }
  const ms = clock2.now() - t0;
  const more = lateFields();
  trace(kino2, "call", "ok", { fn, ...extra, ms, n: Array.isArray(out) ? out.length : void 0, ...more });
  reportCallTime(kino2, fn, ms, true, more);
  return out;
}
function isEnglish(kino2) {
  try {
    const lang = kino2 && typeof kino2.lang === "string" ? kino2.lang.trim().toLowerCase() : "";
    return lang === "en" || lang.startsWith("en-") || lang.startsWith("en_");
  } catch (_) {
    return false;
  }
}
function isSpanish(kino2) {
  try {
    const lang = kino2 && typeof kino2.lang === "string" ? kino2.lang.trim().toLowerCase() : "";
    return lang.startsWith("es");
  } catch (_) {
    return false;
  }
}
var GENRES_ES = Object.freeze({
  "Action": "Acción",
  "Adventure": "Aventura",
  "Animation": "Animación",
  "Biography": "Biografía",
  "Comedy": "Comedia",
  "Crime": "Crimen",
  "Documentary": "Documental",
  "Drama": "Drama",
  "Family": "Familia",
  "Fantasy": "Fantasía",
  "History": "Historia",
  "Horror": "Terror",
  "Music": "Música",
  "Musical": "Musical",
  "Mystery": "Misterio",
  "Romance": "Romance",
  "Sci-Fi": "Ciencia ficción",
  "Sport": "Deportes",
  "Thriller": "Suspenso",
  "War": "Guerra",
  "Western": "Western",
  "Reality-TV": "Reality",
  "Talk-Show": "Programa de entrevistas",
  "Game-Show": "Concurso",
  "News": "Noticias",
  "Film-Noir": "Cine negro",
  "Short": "Cortometraje",
  "Adult": "Adultos"
});
function genreName(name, spanish) {
  if (!spanish || typeof name !== "string") return name;
  const key = name.trim();
  return Object.hasOwn(GENRES_ES, key) ? GENRES_ES[key] : name;
}
var TEXTS = Object.freeze({
  // Where the plugin's own settings live in Kino.
  settingsPlace: ["Ajustes ▸ Xuper", "Settings ▸ Xuper"],
  // Errors the person reads (`userMessage`).
  accountSessionLost: [
    "Tu sesión de Xuper se cerró y no pudimos volver a entrar con tu cuenta. Vuelve a vincularla en {place}.",
    "Your Xuper session ended and we could not sign back in with your account. Link it again in {place}."
  ],
  accountInUseElsewhere: [
    "Tu cuenta de Xuper se abrió en otro dispositivo, y solo puede usarse en uno a la vez. Vuelve a intentarlo, o vincúlala de nuevo en {place}.",
    "Your Xuper account was opened on another device, and it can only be used on one at a time. Try again, or link it again in {place}."
  ],
  episodeGone: ["Este capítulo ya no está disponible.", "This episode is no longer available."],
  seriesGone: ["Esta serie ya no está disponible.", "This series is no longer available."],
  portalSlow: [
    "Xuper no responde en este momento; intenta de nuevo en unos minutos.",
    "Xuper is not responding right now; try again in a few minutes."
  ],
  liveNeedsAccount: ["Este canal requiere tu cuenta personal de Xuper.", "This channel requires your personal Xuper account."],
  regionBlocked: ["Xuper no ofrece este contenido en tu región.", "Xuper does not offer this content in your region."],
  cryptoUnavailable: [
    "Este aparato no pudo abrir la conexión segura con Xuper. Actualiza la aplicación; si sigue igual, el aparato no es compatible.",
    "This device could not open the secure connection with Xuper. Update the app; if it stays the same, the device is not supported."
  ],
  liveChannelsRow: ["Canales en vivo", "Live channels"],
  allChannels: ["Todos", "All"],
  sportsRow: ["Partidos de hoy", "Today's matches"],
  sportsCategory: ["Deportes · Partidos", "Sports · Matches"],
  sportsLive: ["EN VIVO", "LIVE"],
  sportsFootball: ["Fútbol", "Football"],
  // Categorías tiles of live channels, one per genre (liveTiles.js).
  liveTileSports: ["Deportes en vivo", "Live sports"],
  liveTileNews: ["Noticias en vivo", "Live news"],
  liveTileKids: ["Infantil en vivo", "Live kids"],
  liveTileMovies: ["Cine en vivo", "Live movies"],
  liveTileSeries: ["Series en vivo", "Live series"],
  liveTileMoviesSeries: ["Cine y series en vivo", "Live movies & series"],
  liveTileEntertainment: ["Entretenimiento en vivo", "Live entertainment"],
  liveTileMusic: ["Música en vivo", "Live music"],
  liveTileDocumentaries: ["Documentales en vivo", "Live documentaries"],
  liveTileAnime: ["Anime en vivo", "Live anime"],
  chapterN: ["Capítulo {n}", "Episode {n}"],
  seasonN: ["Temporada {n}", "Season {n}"],
  server: ["Servidor {n}", "Server {n}"],
  backup: ["respaldo", "backup"],
  retry: ["reintento {n}", "retry {n}"],
  versionN: ["Versión {n}", "Version {n}"],
  // The configuration screen (apiVersion 14 through the manifest's enhancements; src/screen*.js). Its nodes carry both
  // languages (`text` / `textEn`): Kino picks by the person's language.
  brTabPeliculas: ["Películas", "Movies"],
  brTabSeries: ["Series", "Series"],
  brTabInfantil: ["Infantil", "Kids"],
  brTabAnime: ["Anime", "Anime"],
  brWatch: ["Ver", "Watch"],
  brInfo: ["Más información", "More info"],
  brRecent: ["Continuar viendo", "Continue watching"],
  brSearch: ["Buscar", "Search"],
  brFailed: ["No se pudo cargar esta sección. Revisa tu conexión e inténtalo de nuevo.", "This section could not be loaded. Check your connection and try again."],
  brSearchHint: ["Buscar en Xuper", "Search Xuper"],
  brClose: ["Cerrar", "Close"],
  brSearchedBefore: ["Buscado recientemente", "Recently searched"],
  brLive: ["En vivo", "Live"],
  brLiveSearchHint: ["Buscar en los canales en vivo", "Search the live channels"],
  brLiveEmpty: ["No hay canales en vivo por ahora.", "No live channels right now."],
  brPreviousPage: ["Página anterior", "Previous page"],
  brNextPage: ["Página siguiente", "Next page"],
  brSearchTitle: ["Buscar", "Search"],
  brBack: ["Atrás", "Back"],
  brNoResults: ["No encontramos nada con esas palabras.", "Nothing matched those words."],
  brSearchFailed: ["No se pudo buscar. Revisa tu conexión e inténtalo de nuevo.", "The search failed. Check your connection and try again."],
  brSettings: ["Configuración", "Settings"],
  brRetry: ["Reintentar", "Retry"],
  brEmpty: ["Aún no hay nada aquí.", "Nothing here yet."],
  brUpToDate: ["Al día", "Up to date"],
  // The title page of the browse screen (src/detailView.js).
  dEpisodeN: ["Episodio {n}", "Episode {n}"],
  dSeasonN: ["Temporada {n}", "Season {n}"],
  dSeasonsN: ["{n} temporadas", "{n} seasons"],
  dSeriesGo: ["Ver episodios", "Watch episodes"],
  dMore: ["Más opciones", "More options"],
  dCreators: ["Creación: {v}", "Created by: {v}"],
  dDirector: ["Dirección: {v}", "Directed by: {v}"],
  dCast: ["Reparto", "Cast"],
  dEpisodes: ["Episodios", "Episodes"],
  dFailed: ["No se pudo cargar la ficha de este título. Revisa tu conexión e inténtalo de nuevo.", "This title's page could not be loaded. Check your connection and try again."],
  dSeeInKino: ["Ver en Kino", "Open in Kino"],
  brMore: ["Ver más", "See more"]
});
function say(kino2, key, vars = {}) {
  const pair = TEXTS[key];
  if (!pair) return key;
  const en = isEnglish(kino2);
  const all = { place: TEXTS.settingsPlace[en ? 1 : 0], ...vars };
  return pair[en ? 1 : 0].replace(/\{(\w+)\}/g, (m, name) => Object.hasOwn(all, name) ? String(all[name]) : m);
}
function twin(key, field2 = "text", vars = {}) {
  const pair = TEXTS[key] || [key, key];
  const fill = (text3, i) => {
    const all = { place: TEXTS.settingsPlace[i], ...vars };
    return text3.replace(/\{(\w+)\}/g, (m, name) => {
      if (!Object.hasOwn(all, name)) return m;
      const v = all[name];
      return Array.isArray(v) ? String(v[i]) : String(v);
    });
  };
  return { [field2]: fill(pair[0], 0), [field2 + "En"]: fill(pair[1], 1) };
}
function sayAll(key) {
  const pair = TEXTS[key];
  if (!pair) return [];
  return pair.map((text3, i) => text3.replace(/\{place\}/g, TEXTS.settingsPlace[i]));
}
var MAX_SLEEP_MS = 5e3;
var MAX_REQUEST_MS = 3e4;
var CONTACT_FAILED = "No se pudo contactar a Xuper; intenta de nuevo en un momento";
var PortalError = class extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = "PortalError";
    this.code = code;
    this.message = message || code;
  }
};
var SETTINGS_PLACE = sayAll("settingsPlace")[0];
var ACCOUNT_SESSION_LOST = sayAll("accountSessionLost")[0];
var ACCOUNT_IN_USE_ELSEWHERE_TEXT = sayAll("accountInUseElsewhere")[0];
var ACCOUNT_SENTENCES = /* @__PURE__ */ new Set([...sayAll("accountSessionLost"), ...sayAll("accountInUseElsewhere")]);
var ACCOUNT_IN_USE_ELSEWHERE = "aaa100083";
var SESSION_DEAD_CODES = /* @__PURE__ */ new Set(["aaa100027", "aaa100028"]);
function accountProblemMessage(code, kino2 = null) {
  if (SESSION_DEAD_CODES.has(code)) return say(kino2, "accountSessionLost");
  if (code === ACCOUNT_IN_USE_ELSEWHERE) return say(kino2, "accountInUseElsewhere");
  return null;
}
var EPISODE_GONE = sayAll("episodeGone")[0];
var SERIES_GONE = sayAll("seriesGone")[0];
var isEpisodeGone = (text3) => sayAll("episodeGone").includes(text3);
var told = (kino2, code, message, sentence) => kino2.error(code, message, { userMessage: sentence });
var GENERIC = "Xuper no está disponible ahora";
var PORTAL_SLOW = sayAll("portalSlow")[0];
function slowPortal(kino2, e) {
  if (!e || e.name !== "KinoError_unavailable" || typeof e.userMessage === "string") return e;
  return kino2.error("unavailable", typeof e.message === "string" && e.message !== "" ? e.message : GENERIC, { userMessage: say(kino2, "portalSlow") });
}
function mapPortalError(code, message, kino2, { accountLinked = false, goneMessage = EPISODE_GONE } = {}) {
  const msg = typeof message === "string" ? message : "";
  const accountText = accountLinked ? accountProblemMessage(code, kino2) : null;
  if (accountText) return told(kino2, "auth_required", `cuenta propia: ${code}`, accountText);
  if (code === "portal100006") {
    const series = sayAll("seriesGone").includes(goneMessage);
    return told(kino2, "not_found", `portal100006: ${series ? "serie" : "capítulo"} borrado`, say(kino2, series ? "seriesGone" : "episodeGone"));
  }
  if (code === "portal100004" || msg.includes("不存在")) {
    return kino2.error("not_found", "No se encontró en Xuper");
  }
  if (code === "portal100024") {
    return kino2.error("geo_blocked", "Este contenido no está disponible en tu región");
  }
  if (code === "portal200001") {
    return told(kino2, "unavailable", "portal200001: versión de conexión fuera de servicio",
      isEnglish(kino2) ? "Xuper has disabled this connection version (portal200001)." : "Xuper dejó fuera de servicio esta versión de conexión (portal200001).");
  }
  if (SESSION_DEAD_CODES.has(code)) {
    return kino2.error("auth_required", "Configura Xuper en Ajustes ▸ Plugins");
  }
  return kino2.error("unavailable", GENERIC);
}
var CALL_BUDGET_MS = {
  home: 2e4,
  browse: 2e4,
  episodes: 2e4,
  resolve: 2e4,
  search: 15e3,
  liveCategories: 2e4,
  liveChannels: 2e4,
  liveSearch: 15e3,
  section: 2e4,
  categories: 2e4
};
var BUDGET_MARGIN_MS = 2e3;
var callDeadline = (clock2, budgetMs) => clock2.now() + budgetMs - BUDGET_MARGIN_MS;
var viewOpts = ({ userId, userToken, sn, deadline }) => ({
  baseFields: true,
  userId,
  userToken,
  ...typeof sn === "string" && sn !== "" ? { sn } : {},
  ...typeof deadline === "number" ? { deadline } : {}
});
function shapeOf(s) {
  if (typeof s !== "string") return "none";
  if (s === "") return "empty";
  const first = s.charCodeAt(0);
  if (first === 31) return "gzip";
  const t = s.trimStart();
  if (t === "") return "blank";
  if (t[0] === "<") return "html";
  if (t[0] === "{" || t[0] === "[") return "json";
  let hex = true, upperHex = false, b64 = true, wrapped = false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const digit = c >= 48 && c <= 57, lower = c >= 97 && c <= 122, upper = c >= 65 && c <= 90;
    const newline = c === 10 || c === 13;
    if (newline) wrapped = true;
    if (!(digit || c >= 97 && c <= 102)) {
      if (c >= 65 && c <= 70) upperHex = true;
      else hex = false;
    }
    if (!(digit || lower || upper || c === 43 || c === 47 || c === 61 || c === 45 || c === 95 || newline)) b64 = false;
    if (!hex && !b64) return "text";
  }
  if (hex) return (upperHex ? "hex-upper" : "hex") + (s.length % 2 === 0 ? "" : "-odd");
  return wrapped ? "b64-ws" : "b64";
}
function contentClass(res) {
  const h = res !== null && typeof res === "object" && res.headers !== null && typeof res.headers === "object" ? res.headers : null;
  const ct = h && typeof h["content-type"] === "string" ? h["content-type"].toLowerCase() : "";
  if (ct === "") return "none";
  if (ct.includes("json")) return "json";
  if (ct.includes("html")) return "html";
  if (ct.startsWith("text/")) return "text";
  return "other";
}
function gzipped(res, text3) {
  const h = res !== null && typeof res === "object" && res.headers !== null && typeof res.headers === "object" ? res.headers : null;
  const enc = h && typeof h["content-encoding"] === "string" ? h["content-encoding"].toLowerCase() : "";
  return enc.includes("gzip") || typeof text3 === "string" && text3.charCodeAt(0) === 31;
}
var PATH_ALIASES = { "v2/sendEmailVerifyCode": "v2/sendCode", "v2/validateVerifyCode": "v2/checkCode" };
var tracePath = (path) => Object.hasOwn(PATH_ALIASES, path) ? PATH_ALIASES[path] : path;
var HOST_KEY = "portalHost";
var HOST_MEMORY_MS = 7 * 24 * 36e5;
function makePortal({ kino: kino2, crypto, config, clock: clock2, snProvider, modeOf = () => "?" }) {
  const listed = (h) => typeof h === "string" && (config.hosts || []).includes(h);
  let storedHost = null;
  try {
    const h = kino2.storage.get(HOST_KEY);
    if (listed(h)) storedHost = h;
  } catch (_) {
  }
  let preferredHost = storedHost;
  const remember = (host) => {
    preferredHost = host;
    if (host === storedHost || storedHost === null && host === (config.hosts || [])[0]) return;
    storedHost = host;
    try {
      kino2.storage.set(HOST_KEY, host, { ttlMs: HOST_MEMORY_MS });
    } catch (_) {
    }
  };
  let lastCallMs = null;
  const decryptFails = /* @__PURE__ */ new Map();
  const hostOrder = () => {
    const hosts2 = config.hosts || [];
    if (preferredHost === null) return hosts2;
    return [preferredHost, ...hosts2.filter((h) => h !== preferredHost)];
  };
  let slotTail = Promise.resolve();
  function waitTurn() {
    const run = slotTail.then(async () => {
      const now = clock2.now();
      if (lastCallMs !== null) {
        const wait = Math.min(MAX_SLEEP_MS, Math.ceil(RATE_LIMIT_MS - (now - lastCallMs)));
        if (wait > 0) await kino2.sleep(wait);
      }
      lastCallMs = clock2.now();
    });
    slotTail = run.then(() => {
    }, () => {
    });
    return run;
  }
  function deviceDict(sn) {
    return {
      ...DEVICE_FIXED,
      apkVersion: config.apkVersion,
      sysVersion: SPKG_VER,
      appId: config.appId,
      sn: sn ?? snProvider()
    };
  }
  async function call(path, bean = {}, opts = {}) {
    const { baseFields = true, userId = "", userToken = "", sn = null, timeoutMs, deadline, onFetchMs, method = "POST", encrypt = true, query = null } = opts;
    const requested = Math.trunc(Number(timeoutMs));
    const perRequest = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_REQUEST_MS) : REQUEST_TIMEOUT_MS;
    const tp = tracePath(path);
    const body = {
      ...baseFields ? { portalCode: PORTAL_CODE, userId, userToken } : {},
      ...bean,
      ...deviceDict(sn)
    };
    const httpMethod = typeof method === "string" ? method.toUpperCase() : "POST";
    const sendEncrypted = encrypt !== false && httpMethod !== "GET";
    const wire = sendEncrypted ? crypto.encryptBody(JSON.stringify(body)) : httpMethod === "GET" ? null : JSON.stringify(body);
    let queryTail = "";
    if (query && typeof query === "object") {
      try {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
          if (v === void 0 || v === null) continue;
          qs.append(k, String(v));
        }
        queryTail = qs.toString();
      } catch (_) {
        queryTail = "";
      }
    }
    const pathWithQuery = queryTail ? `${path}${path.includes("?") ? "&" : "?"}${queryTail}` : path;
    const headers = {
      apk: config.appId,
      apkVer: APK_VER_HEADER,
      spkgVer: SPKG_VER,
      "User-Agent": USER_AGENT,
      "Content-Type": CONTENT_TYPE
    };
    if (!sendEncrypted) headers.needEncrypt = "false";
    const outOfTime = () => typeof deadline === "number" && Math.floor(deadline - clock2.now()) < 1;
    if (outOfTime()) {
      trace(kino2, "portal", "deadline", { path: tp });
      throw kino2.error("unavailable", CONTACT_FAILED);
    }
    await waitTurn();
    let lastError = null;
    const order = hostOrder();
    for (let i = 0; i < order.length; i++) {
      const host = order[i];
      let requestMs = perRequest;
      if (typeof deadline === "number") {
        const left = Math.floor(deadline - clock2.now());
        if (left < 1) {
          trace(kino2, "portal", "deadline", { path: tp, i });
          break;
        }
        const remaining = order.length - i;
        requestMs = Math.min(perRequest, remaining > 1 ? Math.ceil(left / remaining) : left);
      }
      let answer;
      let stage = "fetch";
      let res = null, bodyText = null;
      try {
        const sentAt = clock2.now();
        res = await kino2.fetch(`https://${host}/api/portalCore/${pathWithQuery}`, {
          method: httpMethod,
          headers,
          ...wire !== null ? { body: wire } : {},
          cookies: false,
          timeoutMs: requestMs
        });
        if (typeof onFetchMs === "function") {
          try {
            onFetchMs(clock2.now() - sentAt);
          } catch (_) {
          }
        }
        stage = "body";
        bodyText = res.text();
        answer = JSON.parse(bodyText);
        if (!isObject(answer)) throw new Error("respuesta del portal no es un objeto");
        if (i > 0) trace(kino2, "portal", "failover", { path: tp, to: i });
        remember(host);
        const rc = answer.returnCode;
        const code = rc === void 0 || rc === null ? "" : String(rc);
        if (code !== "" && code !== "0") {
          const em = answer.errorMessage;
          answer = { portalFailure: new PortalError(code, typeof em === "string" && em.trim() ? em : "") };
        } else if (typeof answer.data === "string" && answer.data !== "") {
          stage = "data";
          const plain3 = sendEncrypted ? crypto.decryptBlob(answer.data) : answer.data;
          stage = "inner";
          const inner = JSON.parse(plain3);
          if (!isObject(inner)) throw new Error("datos del portal no son un objeto");
          answer = { ok: inner };
        } else if (isObject(answer.data)) {
          answer = { ok: answer.data };
        } else if (answer.data === void 0 || answer.data === null || answer.data === "") {
          answer = { ok: answer };
        } else {
          stage = "data";
          throw new Error("datos del portal de un tipo inesperado");
        }
      } catch (e) {
        lastError = e;
        if (stage === "fetch") trace(kino2, "portal", "host_fail", { path: tp, i, why: errCode(e) });
        else decryptFail(path, i, stage, res, bodyText, answer, e);
        continue;
      }
      decryptFails.delete(path);
      if (answer.portalFailure) {
        trace(kino2, "portal", "rc", { path: tp, code: answer.portalFailure.code });
        throw answer.portalFailure;
      }
      return answer.ok;
    }
    if (order.length > 0) trace(kino2, "portal", "all_fail", { path: tp, n: order.length });
    throw kino2.error("unavailable", order.length === 0 ? "sin hosts configurados" : CONTACT_FAILED);
  }
  function decryptFail(path, i, at, res, bodyText, answer, e) {
    try {
      const attempt = (decryptFails.get(path) || 0) + 1;
      decryptFails.set(path, attempt);
      const data = at === "body" || !isObject(answer) ? void 0 : answer.data;
      let mode = "?";
      try {
        mode = String(modeOf());
      } catch (_) {
      }
      trace(kino2, "portal", "decrypt-fail", {
        path: tracePath(path),
        i,
        at,
        status: res !== null && typeof res === "object" && typeof res.status === "number" ? res.status : -1,
        ctype: contentClass(res),
        len: typeof bodyText === "string" ? bodyText.length : -1,
        shape: shapeOf(at === "body" ? bodyText : data),
        dlen: typeof data === "string" ? data.length : -1,
        gzip: gzipped(res, bodyText),
        sess: mode,
        attempt,
        why: errCode(e)
      });
    } catch (_) {
    }
  }
  return { call };
}
function makeLock() {
  let tail = Promise.resolve();
  return (task) => {
    const run = tail.then(task);
    tail = run.then(() => {
    }, () => {
    });
    return run;
  };
}
const ACCOUNT_SESSION = "account:v1";
const DEVICE_SESSION = "device:v1";
const SIGNED_OUT_ACCOUNT = "signedOutAccount:v1";
const SESSION_FAILURE = "sessionFailure:v1";
const SESSION_GENERATION = "sessionGeneration:v1";
const ANONYMOUS_ACCOUNT = "anonymous:v1";
const INTEGRATION_PENDING = "Falta habilitar la integración propia de Xuper para este plugin.";
const ACCOUNT_NEEDED = "Inicia sesión con tu cuenta de Xuper.";
const SNTOKEN_SALT = "ntFT65w6itH!lHCPw7D=@qnsFC5adD28";
const FINGERPRINT_FIXED = Object.freeze({
  board: "goldfish_arm64", brand: "google", cpuAbi: "arm64-v8a", device: "emu64a",
  diskInfo: "8GB", display: "sdk_gphone64_arm64",
  fingerprint: "google/sdk_gphone64_arm64/emu64a:14/UE1A.230829.036/11228894:user/release-keys",
  hardware: "ranchu", host: "abfarm", manufacturer: "Google", ramSize: "4GB",
  romSize: "8GB", tags: "release-keys", verId: ""
});
function makeFingerprint(host) {
  const randomHex = (bytes) => host.crypto.randomBytes(bytes, "hex");
  const randomMac = () => randomHex(6).match(/../g).join(":");
  return () => ({ ...FINGERPRINT_FIXED, androidId: randomHex(8), cpuId: randomHex(8),
    serialNumber: randomHex(8), etheMac: randomMac(), gatewayMac: randomMac(), wifiMac: randomMac() });
}
const activateBean = (snToken) => ({ snToken, authVersion: "", authCode: "", preCode: "",
  macAddr: FIXED_MAC, reserve1: "", openNum: 4, channel: "default", matadata: "", signdata: "" });
const snFrom = (host, answer, snToken) => (asText(answer.sn).trim() || host.crypto.hash("md5", snToken + SNTOKEN_SALT)).toLowerCase();
function integrationAvailable(host) {
  return true; /* build externo: clave incrustada, integración siempre disponible */
}
function requireIntegration(host) {
  if (!integrationAvailable(host)) throw host.error("unavailable", INTEGRATION_PENDING, { userMessage: INTEGRATION_PENDING });
}
function accountData(config, rootStorage = null) {
  const own = { email: String(config.get("email") || "").trim(), password: String(config.get("password") || "") };
  if (own.email || own.password) return own;
  const email = String(config.get("regEmail") || "").trim();
  const password = String(config.get("regPassword") || "");
  if (email && password && rootStorage && rootStorage.get("xp9:registeredAccount") === email.toLowerCase()) return { email, password };
  return own;
}
function accountStorage(host, email) {
  const prefix = "xp9:" + host.crypto.hash("sha256", email.toLowerCase()).slice(0, 20) + ":";
  const store = host.storage;
  return Object.create(host, { accountRootStorage: { value: host.accountRootStorage || host.storage }, storage: { value: {
    get: (key) => store.get(prefix + key),
    set: (key, value, options) => options === void 0 ? store.set(prefix + key, value) : store.set(prefix + key, value, options),
    remove: (key) => store.remove(prefix + key),
    keys: () => store.keys().filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length))
  } } });
}
function makeSession({ kino: kino2, portal, clock: clock2 }) {
  const lock = makeLock();
  let failed = null;
  let blockedRegion = false;
  function readJson(key) {
    try { return JSON.parse(kino2.storage.get(key) || "null"); } catch (_) { return null; }
  }
  const generation = () => asText(kino2.storage.get(SESSION_GENERATION));
  const checkpoint = () => generation();
  function readSession() {
    const saved = readJson(ACCOUNT_SESSION);
    if (saved && typeof saved.userToken === "string" && typeof saved.acct === "string" && asText(saved.generation) === generation()) {
      return { userId: asText(saved.userId), userToken: saved.userToken, sn: asText(saved.sn), acct: saved.acct, generation: asText(saved.generation) };
    }
    return { userId: "", userToken: "", sn: "", acct: "", generation: generation() };
  }
  const accountKey = (email, password) => kino2.crypto.hash("sha256", JSON.stringify([email, password]));
  const keyOf = ({ email, password }) => accountKey(email, password);
  const authError = () => kino2.error("auth_required", ACCOUNT_NEEDED, { userMessage: ACCOUNT_NEEDED });
  function desiredKey() {
    const pair = accountData(kino2.config, kino2.accountRootStorage || kino2.storage);
    if (!pair.email && !pair.password) return ANONYMOUS_ACCOUNT;
    return pair.email && pair.password ? keyOf(pair) : "";
  }
  function requirePair(pair) { if (!pair.email || !pair.password) throw authError(); }
  function writeSession(answer, acct, sn = "", started = checkpoint()) {
    assertUnchanged(started);
    if (!answer || typeof answer.userToken !== "string" || !answer.userToken.trim()) {
      throw new PortalError(acct === ANONYMOUS_ACCOUNT ? "active_sin_token" : "login_sin_token", "El proveedor no devolvió una sesión válida");
    }
    kino2.storage.set(ACCOUNT_SESSION, JSON.stringify({ userId: asText(answer.userId), userToken: answer.userToken, sn, acct, generation: started }));
    assertUnchanged(started);
    failed = null;
    kino2.storage.remove(SESSION_FAILURE);
    blockedRegion = false;
  }
  function assertUnchanged(started) {
    if (generation() !== started) throw authError();
  }
  function assertCurrent(key, started) {
    assertUnchanged(started);
    if (desiredKey() !== key) throw authError();
  }
  function invalidateToken(state) {
    const current = readSession();
    if (current.generation === state.generation && current.acct === state.acct && current.userToken === state.userToken) {
      kino2.storage.set(ACCOUNT_SESSION, JSON.stringify({ ...current, userId: "", userToken: "" }));
    }
  }
  function surface(err, own) {
    if (err instanceof PortalError) {
      if (err.code === "portal100024") blockedRegion = true;
      return mapPortalError(err.code, err.message, kino2, { accountLinked: own });
    }
    return err;
  }
  function rememberFailure(key, error, started = checkpoint()) {
    assertUnchanged(started);
    const until = clock2.now() + 3e4;
    failed = { key, error, until, generation: started };
    const code = typeof error?.name === "string" && error.name.startsWith("KinoError_") ? error.name.slice(10) : "unavailable";
    kino2.storage.set(SESSION_FAILURE, JSON.stringify({ key, until, code, generation: started,
      message: typeof error?.message === "string" ? error.message : "Xuper no está disponible ahora",
      userMessage: typeof error?.userMessage === "string" ? error.userMessage : void 0 }));
  }
  function checkFailure(key) {
    if (failed && failed.generation === generation() && failed.key === key && clock2.now() < failed.until) throw failed.error;
    const saved = readJson(SESSION_FAILURE);
    if (saved && asText(saved.generation) === generation() && saved.key === key && typeof saved.until === "number" && clock2.now() < saved.until) {
      if (saved.code === "geo_blocked") blockedRegion = true;
      throw kino2.error(saved.code || "unavailable", saved.message || "Xuper no está disponible ahora",
        typeof saved.userMessage === "string" ? { userMessage: saved.userMessage } : {});
    }
  }
  async function loginUnlocked(email, password, bounds = {}, expected = null) {
    const started = checkpoint();
    const key = accountKey(email, password);
    const bean = { accountType: "2", userName: email,
      password: kino2.crypto.hash("md5", password + PASSWORD_SALT), type: "1", macAddr: FIXED_MAC,
      areaCode: "", verificationCode: "", verificationToken: "", matadata: "", signdata: "", channel: "default" };
    const state = readSession();
    try {
      const answer = await portal.call("v8/login", bean, { baseFields: false, sn: state.sn || null, ...bounds });
      assertUnchanged(started);
      if (expected !== null && desiredKey() !== expected) throw authError();
      writeSession(answer, key, state.sn, started);
      kino2.storage.remove(SIGNED_OUT_ACCOUNT);
    } catch (err) { assertUnchanged(started); throw surface(err, true); }
  }
  async function anonymousUnlocked(bounds = {}, existingSn = null) {
    const started = checkpoint();
    let device = readJson(DEVICE_SESSION);
    if (!device || typeof device !== "object") device = {};
    let sn = asText(device.sn);
    if (existingSn !== null && (!existingSn || sn !== existingSn)) throw authError();
    let snToken = "";
    if (!sn) {
      // Keep this installation's identity even if the initial request fails.
      if (!device.fingerprint || typeof device.fingerprint !== "object") {
        device = { fingerprint: makeFingerprint(kino2)(), sn: "" };
        kino2.storage.set(DEVICE_SESSION, JSON.stringify(device));
      }
      const answer = await portal.call("v3/snToken", device.fingerprint, { baseFields: false, sn: "", ...bounds });
      assertCurrent(ANONYMOUS_ACCOUNT, started);
      if (!answer || !asText(answer.snToken).trim()) throw new PortalError("snToken_failed", "El proveedor no devolvió identidad para este dispositivo");
      snToken = asText(answer.snToken);
      sn = snFrom(kino2, answer, snToken);
      device = { ...device, sn };
      kino2.storage.set(DEVICE_SESSION, JSON.stringify(device));
    }
    // Reactivate only this installation. A refusal never causes another identity to be minted.
    const answer = await portal.call("v8/active", activateBean(snToken), { baseFields: false, sn, ...bounds });
    assertCurrent(ANONYMOUS_ACCOUNT, started);
    writeSession(answer, ANONYMOUS_ACCOUNT, sn, started);
  }
  async function login(email, password, bounds = {}) {
    requireIntegration(kino2);
    requirePair({ email, password });
    const started = checkpoint();
    return lock(async () => {
      assertUnchanged(started);
      failed = null;
      await loginUnlocked(email, password, bounds);
      assertUnchanged(started);
    });
  }
  async function adoptSession(answer, email, password, sn = "") {
    requireIntegration(kino2);
    requirePair({ email, password });
    const started = checkpoint();
    return lock(() => {
      assertUnchanged(started);
      writeSession(answer, accountKey(email, password), sn, started);
      kino2.storage.remove(SIGNED_OUT_ACCOUNT);
    });
  }
  async function ensure(bounds = {}) {
    requireIntegration(kino2);
    const started = checkpoint();
    const expected = desiredKey();
    if (!expected) throw authError();
    if (isSignedIn()) return;
    return lock(async () => {
      assertCurrent(expected, started);
      if (isSignedIn()) return;
      if (expected !== ANONYMOUS_ACCOUNT && kino2.storage.get(SIGNED_OUT_ACCOUNT) === expected) throw authError();
      checkFailure(expected);
      try {
        if (expected === ANONYMOUS_ACCOUNT) await anonymousUnlocked(bounds);
        else {
          const pair = accountData(kino2.config, kino2.accountRootStorage || kino2.storage);
          await loginUnlocked(pair.email, pair.password, bounds, expected);
        }
      } catch (err) {
        assertCurrent(expected, started);
        const mapped = surface(err, expected !== ANONYMOUS_ACCOUNT);
        rememberFailure(expected, mapped, started);
        throw mapped;
      }
    });
  }
  async function withValidSession(read, bounds = {}) {
    const started = checkpoint();
    await ensure(bounds);
    assertUnchanged(started);
    const original = readSession();
    const own = original.acct !== ANONYMOUS_ACCOUNT;
    const request = async (state) => {
      assertCurrent(original.acct, started);
      const result = await read({ userId: state.userId, userToken: state.userToken, sn: state.sn || null, deadline: bounds.deadline });
      assertCurrent(original.acct, started);
      if (!isSignedIn()) throw authError();
      return result;
    };
    try { return await request(original); }
    catch (err) {
      assertCurrent(original.acct, started);
      if (!(err instanceof PortalError)) throw err;
      if (!SESSION_DEAD_CODES.has(err.code) && err.code !== "portal200001") throw surface(err, own);
    }
    const renewed = await lock(async () => {
      assertCurrent(original.acct, started);
      const current = readSession();
      if (!current.userToken || current.acct !== original.acct) throw authError();
      if (current.userToken !== original.userToken) return current;
      try {
        // Keep the current session visible while renewal is pending: another valid response
        // must not look like a logout. writeSession replaces it only after activation succeeds.
        if (own) {
          const pair = accountData(kino2.config, kino2.accountRootStorage || kino2.storage);
          await loginUnlocked(pair.email, pair.password, bounds, original.acct);
        } else await anonymousUnlocked(bounds, original.sn);
        assertCurrent(original.acct, started);
        return readSession();
      } catch (err) {
        assertCurrent(original.acct, started);
        invalidateToken(original);
        const mapped = surface(err, own);
        rememberFailure(original.acct, mapped, started);
        throw mapped;
      }
    });
    try { return await request(renewed); }
    catch (err) {
      assertCurrent(original.acct, started);
      if (!(err instanceof PortalError)) throw err;
      if (SESSION_DEAD_CODES.has(err.code)) {
        await lock(() => {
          assertCurrent(original.acct, started);
          // aaa100028 may mean this content requires an account; retain the device's guest session.
          if (own || err.code !== "aaa100028") invalidateToken(renewed);
        });
        const mapped = surface(err, own);
        if (own || err.code !== "aaa100028") rememberFailure(original.acct, mapped, started);
        throw mapped;
      }
      throw surface(err, own);
    }
  }
  async function logout() {
    const saved = readSession();
    // Every runtime sharing this account's storage observes the same logout boundary.
    kino2.storage.set(SESSION_GENERATION, kino2.crypto.randomBytes(16, "hex"));
    const selected = desiredKey();
    const signedOut = selected && selected !== ANONYMOUS_ACCOUNT ? selected : saved.acct;
    if (signedOut && signedOut !== ANONYMOUS_ACCOUNT) kino2.storage.set(SIGNED_OUT_ACCOUNT, signedOut);
    kino2.storage.remove(ACCOUNT_SESSION);
    for (const key of kino2.storage.keys()) {
      if (key !== DEVICE_SESSION && key !== SIGNED_OUT_ACCOUNT && key !== SESSION_GENERATION) kino2.storage.remove(key);
    }
    failed = null;
    return lock(async () => {
      try {
        if (saved.userToken && saved.acct !== ANONYMOUS_ACCOUNT && integrationAvailable(kino2)) {
          await portal.call("v5/loginOut", { userId: saved.userId, userToken: saved.userToken },
            { baseFields: false, sn: saved.sn || null, timeoutMs: 4e3, deadline: clock2.now() + 4e3 });
        }
      } catch (_) { /* Local logout also works while the provider is unreachable. */ }
    });
  }
  function isSignedIn() {
    const state = readSession();
    return !!(state.userToken && state.acct === desiredKey() && (state.acct !== ANONYMOUS_ACCOUNT || state.sn));
  }
  function mode() {
    if (!isSignedIn()) return "none";
    return readSession().acct === ANONYMOUS_ACCOUNT ? "anon" : "own";
  }
  return { login, logout, ensure, withValidSession, isSignedIn, current: readSession, mode, kind: mode,
    accountKey, adoptSession, accountState: () => ({ kind: mode(), connected: isSignedIn() }), regionBlocked: () => blockedRegion };
}
var KINDS = [
  { root: "peliculas", label: "Películas", en: "Movies" },
  { root: "series", label: "Series", en: "Series" },
  { root: "anime", label: "Anime", en: "Anime" },
  { root: "infantil", label: "Infantil", en: "Kids" }
];
var byRoot = Object.fromEntries(KINDS.map((k) => [k.root, k]));
var MIN_GENRE_SIZE = 6;
var MAX_ROW_SIZE = 20;
var TRAILER = "trailer";
var PRECEDENCE = ["anime", "infantil", "series", "peliculas"];
var FEATURED = ["peliculas", "series"];
var GENRES = new Map(Object.entries({
  "Action": ["action", "Acción"],
  "Adventure": ["adventure", "Aventura"],
  "Comedy": ["comedy", "Comedia"],
  "Drama": ["drama", "Drama"],
  "Thriller": ["thriller", "Suspenso"],
  "Crime": ["crime", "Crimen"],
  "Sci-Fi": ["scifi", "Ciencia ficción"],
  "Fantasy": ["fantasy", "Fantasía"],
  "Romance": ["romance", "Romance"],
  "Mystery": ["mystery", "Misterio"],
  "Horror": ["horror", "Terror"],
  "Family": ["family", "Familia"],
  "Biography": ["biography", "Biografía"],
  "History": ["history", "Historia"],
  "Documentary": ["documentary", "Documental"],
  "Western": ["western", "Western"],
  "War": ["war", "Guerra"],
  "Reality-TV": ["reality", "Reality"],
  "Sport": ["sport", "Deportes"],
  "Music": ["music", "Música"],
  "Musical": ["music", "Música"]
}));
var GENRES_EN = Object.freeze({
  action: "Action",
  adventure: "Adventure",
  comedy: "Comedy",
  drama: "Drama",
  thriller: "Thriller",
  crime: "Crime",
  scifi: "Sci-Fi",
  fantasy: "Fantasy",
  romance: "Romance",
  mystery: "Mystery",
  horror: "Horror",
  family: "Family",
  biography: "Biography",
  history: "History",
  documentary: "Documentary",
  western: "Western",
  war: "War",
  reality: "Reality",
  sport: "Sports",
  music: "Music"
});
var YEAR_SECTION = /^(\d{4})(.*)$/;
var FEATURED_PREFIXES = ["magis_recent_", "magis_new_", "magis_top_"];
var isFeatured = (rowId) => FEATURED_PREFIXES.some((p) => rowId.startsWith(p));
function rootOfRow(rowId) {
  if (typeof rowId !== "string") return null;
  const prefix = [...FEATURED_PREFIXES, "magis_g_"].find((p) => rowId.startsWith(p));
  if (prefix === void 0) return null;
  const rest = rowId.slice(prefix.length);
  const root = prefix === "magis_g_" ? rest.slice(0, Math.max(0, rest.indexOf("_"))) : rest;
  return Object.hasOwn(byRoot, root) ? root : null;
}
function localizedRowTitle(row2, english) {
  if (!english) return row2.title;
  const fixed = {
    magis_recent_peliculas: "Recently added · Movies",
    magis_new_series: "Series with new episodes",
    magis_top_peliculas: "Top rated movies",
    magis_top_series: "Top rated series",
    magis_new_peliculas: "In theaters"
  };
  if (Object.hasOwn(fixed, row2.id)) return fixed[row2.id];
  const root = rootOfRow(row2.id);
  if (root !== null && row2.id.startsWith(`magis_g_${root}_`)) {
    const key = row2.id.slice(`magis_g_${root}_`.length);
    if (Object.hasOwn(GENRES_EN, key)) return `${GENRES_EN[key]} · ${byRoot[root].en}`;
  }
  return row2.title;
}
function genreOfRow(rowId) {
  const root = rootOfRow(rowId);
  if (root === null) return null;
  return rowId === `magis_g_${root}_documentary` ? "documentales" : root;
}
var cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var byScore = (a, b) => cmp(b.score ?? -1, a.score ?? -1) || cmp(a.title, b.title) || cmp(a.id, b.id);
var plain = (text3) => text3.toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").trim();
function distinctBy(list, key) {
  const seen = /* @__PURE__ */ new Set();
  return list.filter((x) => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
var row = (id, title2, items) => ({ id, title: title2, shown: items.slice(0, MAX_ROW_SIZE), all: items });
var genresOf = (item) => distinctBy(item.genres.map((g) => GENRES.get(g.trim())).filter((g) => g !== void 0), (g) => g[0]);
var newestFirst = (items) => items.some((i) => i.shelvedAtMs > 0) ? [...items].sort((a, b) => b.shelvedAtMs - a.shelvedAtMs) : items;
var playable = (section3) => distinctBy(section3.items.filter((i) => i.type !== TRAILER), (i) => i.id);
function yearSections(sections) {
  const out = [];
  for (const s of sections) {
    const m = YEAR_SECTION.exec(s.name.trim());
    if (m) out.push({ year: Number(m[1]), suffix: plain(m[2]), section: s });
  }
  return out.sort((a, b) => b.year - a.year);
}
function plainYearSection(sections) {
  for (const y of yearSections(sections)) {
    if (y.suffix !== "") continue;
    const items = playable(y.section);
    if (items.length > 0) return items;
  }
  return null;
}
function recentMoviesRow(sectionsOf) {
  const items = plainYearSection(sectionsOf.peliculas);
  return items && row("magis_recent_peliculas", "Recién agregadas · Películas", newestFirst(items));
}
function updatedSeriesRow(sectionsOf) {
  const items = plainYearSection(sectionsOf.series);
  return items && row("magis_new_series", "Series con capítulos nuevos", newestFirst(items));
}
function cinemaRow(sectionsOf) {
  for (const y of yearSections(sectionsOf.peliculas)) {
    if (!y.suffix.includes("teatral")) continue;
    const items = playable(y.section);
    if (items.length > 0) return row("magis_new_peliculas", "Estrenos de cine", items);
  }
  return null;
}
function topRatedRows(byKind) {
  const out = [];
  for (const root of FEATURED) {
    const ranked = [...byKind[root]].sort(byScore);
    if (ranked.length === 0) continue;
    out.push({
      id: `magis_top_${root}`,
      title: `${byRoot[root].label} mejor valoradas`,
      shown: ranked.slice(0, MAX_ROW_SIZE),
      all: ranked
    });
  }
  return out;
}
function genreRows(byKind) {
  const perKind = KINDS.map(({ root }) => {
    const members = /* @__PURE__ */ new Map();
    const labels = /* @__PURE__ */ new Map();
    for (const item of byKind[root]) {
      for (const [key, label] of genresOf(item)) {
        if (!members.has(key)) members.set(key, []);
        members.get(key).push(item);
        labels.set(key, label);
      }
    }
    const groups = [];
    for (const [key, items] of members) {
      if (items.length >= MIN_GENRE_SIZE) groups.push({ root, key, label: labels.get(key), items });
    }
    return groups.sort((a, b) => b.items.length - a.items.length || cmp(a.label, b.label));
  });
  const ordered = [];
  const longest = Math.max(0, ...perKind.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const groups of perKind) if (groups[i]) ordered.push(groups[i]);
  const seen = /* @__PURE__ */ new Set();
  return ordered.map((g) => {
    const shown = [...g.items].sort((a, b) => (seen.has(a.id) ? 1 : 0) - (seen.has(b.id) ? 1 : 0) || byScore(a, b)).slice(0, MAX_ROW_SIZE);
    for (const i of shown) seen.add(i.id);
    return {
      id: `magis_g_${g.root}_${g.key}`,
      title: `${g.label} · ${byRoot[g.root].label}`,
      shown,
      all: [...g.items].sort(byScore)
    };
  });
}
function classify(roots) {
  const sectionsOf = Object.fromEntries(KINDS.map((k) => [k.root, roots[k.root] || []]));
  const kindOf = /* @__PURE__ */ new Map();
  for (const root of PRECEDENCE) {
    for (const section3 of sectionsOf[root]) {
      for (const item of section3.items) {
        if (item.type !== TRAILER && !kindOf.has(item.id)) kindOf.set(item.id, [root, item]);
      }
    }
  }
  const byKind = Object.fromEntries(KINDS.map((k) => [k.root, []]));
  for (const [root, item] of kindOf.values()) byKind[root].push(item);
  return [recentMoviesRow(sectionsOf), updatedSeriesRow(sectionsOf)].filter(Boolean).concat(topRatedRows(byKind), [cinemaRow(sectionsOf)].filter(Boolean), genreRows(byKind));
}
var FEATURED_ORDER = ["magis_recent_peliculas", "magis_new_series", "magis_top_peliculas", "magis_top_series", "magis_new_peliculas"];
function orderRows(rows) {
  const featured = FEATURED_ORDER.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
  const genre = KINDS.map(({ root }) => rows.filter((r) => !isFeatured(r.id) && rootOfRow(r.id) === root));
  const out = [...featured];
  const longest = Math.max(0, ...genre.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const g of genre) if (g[i]) out.push(g[i]);
  return out;
}
function mergeRoot(rows, root, rootRows) {
  return orderRows([...rows.filter((r) => rootOfRow(r.id) !== root), ...rootRows]);
}
var ID = /^[A-Za-z0-9._~-]{1,128}$/;
var REF_PREFIX = "xlive1:";
var MAX_CODE_CHARS = 2e3;
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var plainCode = (code) => ID.test(code) && !code.startsWith("~") && !code.startsWith("x.");
function b64url(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const n = bytes[i] << 16 | (bytes[i + 1] ?? 0) << 8 | (bytes[i + 2] ?? 0);
    out += B64[n >> 18 & 63] + B64[n >> 12 & 63];
    if (i + 1 < bytes.length) out += B64[n >> 6 & 63];
    if (i + 2 < bytes.length) out += B64[n & 63];
  }
  return out;
}
function hash128(s) {
  const lanes = [2166136261, 16777619 ^ 2654435769, 3735928559, 1103547991];
  const mul = [16777619, 2246822519, 3266489917, 668265263];
  for (const b of new TextEncoder().encode(s)) {
    for (let i = 0; i < 4; i++) {
      lanes[i] = Math.imul(lanes[i] ^ b + i, mul[i]);
      lanes[i] ^= lanes[(i + 1) % 4] >>> 13;
    }
  }
  return lanes.map((n) => (n >>> 0).toString(16).padStart(8, "0")).join("");
}
function channelOf(code) {
  if (typeof code !== "string" || code.trim() === "" || code.length > MAX_CODE_CHARS) return null;
  if (plainCode(code)) return { id: code, ref: code };
  const body = b64url(new TextEncoder().encode(code));
  const id = ("x.b" + body).length <= 128 ? "x.b" + body : "x.h" + hash128(code);
  return { id, ref: REF_PREFIX + code };
}
var idOfCode = (code) => channelOf(code)?.id ?? null;
var isWrappedRef = (ref) => typeof ref === "string" && ref.startsWith(REF_PREFIX) && ref.length > REF_PREFIX.length && ref.length <= 4096;
var codeOfRef = (ref) => isWrappedRef(ref) ? ref.slice(REF_PREFIX.length) : ref;
var PREFIX = "magis1";
var SERIES = /* @__PURE__ */ new Set(["teleplay", "series", "variety"]);
var isSeries = (programType) => SERIES.has(programType);
var INT2 = /^[+-]?\d+$/;
function toIntOrNull(text3) {
  if (!INT2.test(text3)) return null;
  const n = Number(text3);
  return n >= -2147483648 && n <= 2147483647 ? n : null;
}
var make = (contentId, programType, episode) => ({ contentId, programType, episode, isSeries: isSeries(programType) });
function encode({ contentId, programType = "movie", episode = 0 }) {
  return `${PREFIX}:${programType || "movie"}:${episode}:${contentId}`;
}
function encodeChapter(seriesNumber, seasonContentId) {
  return encode({ contentId: seasonContentId, programType: "teleplay", episode: seriesNumber });
}
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function base64UrlToText(data) {
  const body = data.replace(/={1,2}$/, "");
  if (body.length % 4 === 1 || /[^A-Za-z0-9_-]/.test(body)) return null;
  const bytes = [];
  let acc = 0, bits = 0;
  for (const ch of body) {
    acc = acc << 6 | ALPHABET.indexOf(ch);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push(acc >> bits & 255);
      acc &= (1 << bits) - 1;
    }
  }
  return utf8(bytes);
}
function utf8(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    if (b < 128) {
      out += String.fromCharCode(b);
      i++;
      continue;
    }
    const need = b >= 194 && b < 224 ? 1 : b >= 224 && b < 240 ? 2 : b >= 240 && b < 245 ? 3 : 0;
    if (need === 0 || i + need > bytes.length - 1) {
      out += "�";
      i++;
      continue;
    }
    let cp = b & 255 >> need + 2;
    let ok = true;
    for (let k = 1; k <= need; k++) {
      const c = bytes[i + k];
      if ((c & 192) !== 128) {
        ok = false;
        break;
      }
      cp = cp << 6 | c & 63;
    }
    if (!ok || cp > 1114111) {
      out += "�";
      i++;
      continue;
    }
    out += String.fromCodePoint(cp);
    i += need + 1;
  }
  return out;
}
function optInt(v) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number(v.trim());
    return v.trim() !== "" && Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  return 0;
}
function fromGatewayRef(ref) {
  const dot = ref.indexOf(".");
  if (dot < 0) return null;
  const data = ref.slice(0, dot);
  if (isBlank(data)) return null;
  let json;
  try {
    const text3 = base64UrlToText(data);
    json = text3 === null ? null : JSON.parse(text3);
  } catch (_) {
    return null;
  }
  if (json === null || typeof json !== "object" || Array.isArray(json)) return null;
  if (asText(json.s) !== "magis") return null;
  const p = json.p;
  if (p === null || typeof p !== "object" || Array.isArray(p)) return null;
  const contentId = asText(p.content_id);
  if (isBlank(contentId)) return null;
  return make(contentId, asText(p.program_type).trim() === "" ? "movie" : asText(p.program_type), optInt(p.episode));
}
function decode(ref) {
  if (typeof ref !== "string" || isBlank(ref)) return null;
  if (ref.startsWith(PREFIX + ":")) {
    const parts = ref.split(":");
    if (parts.length < 4) return null;
    const contentId = parts.slice(3).join(":");
    if (isBlank(contentId)) return null;
    const type = parts[1];
    return make(contentId, type.trim() === "" ? "movie" : type, toIntOrNull(parts[2]) ?? 0);
  }
  return fromGatewayRef(ref);
}
var CHANNEL_CODE = /^[A-Za-z0-9._~-]{1,128}$/;
function isChannelRef(ref) {
  if (isWrappedRef(ref)) return true;
  return typeof ref === "string" && CHANNEL_CODE.test(ref) && !ref.startsWith("~") && decode(ref) === null;
}
var PORTAL_OFFSET_MS = 8 * 36e5;
var nonBlank = (v) => {
  const s = asText(v);
  return s.trim() === "" ? null : s;
};
var DEC = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
function numberOrNull(v) {
  if (v === null || v === void 0) return null;
  const s = String(v);
  return DEC.test(s) ? Number(s) : null;
}
function parseShelveTime(text3) {
  const raw = typeof text3 === "string" ? text3.trim() : "";
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(raw);
  if (!m) return 0;
  const [y, mo, d, h, mi, s] = m.slice(1).map(Number);
  const t = Date.UTC(y, mo - 1, d, h, mi, s);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d || back.getUTCHours() !== h || back.getUTCMinutes() !== mi || back.getUTCSeconds() !== s) return 0;
  return t - PORTAL_OFFSET_MS;
}
function imageOf(asset, fileType, accept) {
  if (!Array.isArray(asset.posterList)) return null;
  for (const p of asset.posterList) {
    if (typeof p?.fileType === "string" && p.fileType.toLowerCase() === fileType && !isBlank(p.fileUrl) && (!accept || accept(p.fileUrl))) return p.fileUrl;
  }
  return null;
}
var logoOf = (a) => imageOf(a, "icon") ?? nonBlank(a.posterUrl);
function catalogBackdrop(asset) {
  return imageOf(asset, "poster", https) || imageOf(asset, "background", https) || imageOf(asset, "banner", https);
}
function itemFrom(a) {
  if (a === null || typeof a !== "object") return null;
  const id = nonBlank(a.contentId);
  if (id === null) return null;
  const type = nonBlank(a.programType) ?? "movie";
  const tags = asText(a.tags).split(",").map((t) => t.trim()).filter((t) => t !== "");
  const ids = catalogIds(a.ids);
  return {
    id,
    ...(ids ? { ids } : {}),
    title: nonBlank(a.name) ?? asText(a.alias),
    poster: imageOf(a, "icon") ?? nonBlank(a.posterUrl),
    backdrop: catalogBackdrop(a),
    durationS: intOrNull(a.duration) ?? 0,
    type,
    genres: tags,
    score: numberOrNull(a.score),
    description: asText(a.description),
    shelvedAtMs: parseShelveTime(asText(a.shelveTime))
  };
}
function parseTree(response) {
  const columns = response && Array.isArray(response.recommendList) ? response.recommendList : [];
  const sections = [];
  for (const c of columns) {
    if (c === null || typeof c !== "object") continue;
    const name = nonBlank(c.name);
    if (name === null) continue;
    const items = [];
    if (Array.isArray(c.assetList)) for (const a of c.assetList) {
      const it = itemFrom(a);
      if (it) items.push(it);
    }
    sections.push({ name, items });
  }
  return sections;
}
var refOf = (item) => encode({ contentId: item.id, programType: item.type, episode: 0 });
function storedLength(s) {
  let n = s.length + countOf(s, /["\\/\t\b\n\r\f]/g) + 5 * countOf(s, /[\x00-\x07\x0b\x0e-\x1f]/g);
  if (NON_ASCII.test(s)) {
    const pairs = countOf(s, /[\ud800-\udbff][\udc00-\udfff]/g) / 2;
    n += countOf(s, /[\u0080-\u07ff]/g) + 2 * countOf(s, /[\u0800-\ud7ff\ue000-\uffff]/g) + 2 * pairs + 2 * (countOf(s, /[\ud800-\udfff]/g) - 2 * pairs);
  }
  return n;
}
var NON_ASCII = /[^\x00-\x7f]/;
var countOf = (s, re) => s.length - s.replace(re, "").length;
var ROWS_FORMAT = 1;
var META_KEY = "rows:meta";
var PART_PREFIX = "rows:";
var SNAPSHOT_BUDGET_BYTES = 8e4;
var PART_BUDGET_BYTES = 2e4;
var META_RESERVE_BYTES = 400;
var PART_TAG_BYTES = 16;
var TEXT_BUDGET_BYTES = SNAPSHOT_BUDGET_BYTES - META_RESERVE_BYTES - 4 * PART_TAG_BYTES;
function commonPrefix(urls) {
  if (urls.length === 0) return "";
  let p = urls[0];
  for (const u of urls) {
    while (!u.startsWith(p)) p = p.slice(0, -1);
    if (p === "") break;
  }
  return p.length >= 12 ? p : "";
}
function collect(rows, keepFull) {
  const index = /* @__PURE__ */ new Map();
  const items = [];
  const refs = rows.map((r, n) => {
    const shown = n < keepFull ? r.shown : r.shown.slice(0, 1);
    return shown.map((i) => {
      let k = index.get(i);
      if (k === void 0) {
        k = items.length;
        index.set(i, k);
        items.push(i);
      }
      return k;
    });
  });
  return { items, refs };
}
var descCost = (d) => storedLength(JSON.stringify(d)) - 4;
function encodeRows(rows, { descItems = Infinity, genres = true, keepFull = Infinity } = {}) {
  const { items, refs } = collect(rows, keepFull);
  const urls = [];
  for (const i2 of items) {
    if (i2.poster) urls.push(i2.poster);
    if (i2.backdrop) urls.push(i2.backdrop);
  }
  const p = commonPrefix(urls);
  const strip = (u) => u ? u.slice(p.length) : null;
  const genreIx = /* @__PURE__ */ new Map();
  const typeIx = /* @__PURE__ */ new Map();
  const ix = (map, v) => {
    let k = map.get(v);
    if (k === void 0) {
      k = map.size;
      map.set(v, k);
    }
    return k;
  };
  const i = items.map((it, n) => [
    it.id,
    it.title,
    strip(it.poster),
    strip(it.backdrop),
    it.durationS,
    ix(typeIx, it.type),
    genres ? it.genres.map((g) => ix(genreIx, g)) : [],
    it.score,
    n < descItems ? it.description : "",
    it.shelvedAtMs > 0 ? Math.round(it.shelvedAtMs / 1e3) : 0
  ]);
  const r = rows.map((row2, n) => [row2.id, row2.title, refs[n]]);
  const c = keepFull >= rows.length || rows.slice(keepFull).every((row2) => row2.shown.length <= 1) ? 1 : 0;
  const ids = {};
  for (let n = 0; n < items.length; n++) if (items[n].ids) ids[n] = items[n].ids;
  return JSON.stringify({ v: ROWS_FORMAT, c, p, g: [...genreIx.keys()], t: [...typeIx.keys()], i, r, ...(Object.keys(ids).length ? { ids } : {}) });
}
function fitRows(rows, { budget = TEXT_BUDGET_BYTES, keepFull = Infinity } = {}) {
  const partial = keepFull < rows.length ? keepFull : Infinity;
  const homeItems = collect(rows.slice(0, keepFull), Infinity).items.length;
  const steps = [
    { keepFull: Infinity, genres: true, least: homeItems },
    { keepFull: partial, genres: true, least: 0 },
    { keepFull: partial, genres: false, least: 0 }
  ];
  for (let s = 0; s < steps.length; s++) {
    const { keepFull: kf, genres, least } = steps[s];
    const items = collect(rows, kf).items;
    let floor = 0;
    for (let n = 0; n < items.length && floor <= budget; n++) {
      floor += items[n].id.length + items[n].title.length + 9 + (n < least ? items[n].description.length : 0);
    }
    if (floor > budget) continue;
    const whole2 = encodeRows(rows, { keepFull: kf, genres });
    let size = storedLength(whole2);
    if (size <= budget) return { text: whole2, step: s };
    let k = items.length;
    while (k > 0 && size > budget) {
      k--;
      size -= descCost(items[k].description);
    }
    if (size > budget || k < least) continue;
    const fitted = encodeRows(rows, { keepFull: kf, genres, descItems: k });
    if (storedLength(fitted) <= budget) return { text: fitted, step: s };
  }
  return null;
}
var isIndexList = (a, n) => Array.isArray(a) && a.every((k) => Number.isInteger(k) && k >= 0 && k < n);
function decodeRows(text3) {
  const o = JSON.parse(text3);
  if (o === null || typeof o !== "object" || o.v !== ROWS_FORMAT || typeof o.p !== "string" || !Array.isArray(o.g) || !Array.isArray(o.t) || !Array.isArray(o.i) || !Array.isArray(o.r) || o.c !== 0 && o.c !== 1) {
    throw new Error("stored rows are malformed");
  }
  const full = (u) => typeof u === "string" ? o.p + u : null;
  const items = o.i.map((r, index) => {
    if (!Array.isArray(r) || r.length !== 10 || typeof r[0] !== "string" || typeof o.t[r[5]] !== "string" || !isIndexList(r[6], o.g.length)) {
      throw new Error("stored item is malformed");
    }
    const ids = catalogIds(o.ids?.[index]);
    return {
      ...(ids ? { ids } : {}),
      id: r[0],
      title: asText(r[1]),
      poster: full(r[2]),
      backdrop: full(r[3]),
      durationS: Number(r[4]) || 0,
      type: o.t[r[5]],
      genres: r[6].map((g) => asText(o.g[g])),
      score: typeof r[7] === "number" ? r[7] : null,
      description: asText(r[8]),
      shelvedAtMs: (Number(r[9]) || 0) * 1e3
    };
  });
  const rows = o.r.map((r) => {
    if (!Array.isArray(r) || typeof r[0] !== "string" || typeof r[1] !== "string" || !isIndexList(r[2], items.length)) {
      throw new Error("stored row is malformed");
    }
    return { id: r[0], title: r[1], shown: r[2].map((k) => items[k]), all: null };
  });
  return { rows, complete: o.c === 1 };
}
function splitParts(text3, budget = PART_BUDGET_BYTES) {
  const parts = [];
  let start = 0;
  while (start < text3.length) {
    let len = Math.min(budget, text3.length - start);
    for (; ; ) {
      let end = start + len;
      const c = text3.charCodeAt(end - 1);
      if (end < text3.length && c >= 55296 && c < 56320) end--;
      const size = storedLength(text3.slice(start, end));
      if (size <= budget || end - start <= 1) {
        len = end - start;
        break;
      }
      len = Math.max(1, Math.min(end - start - 1, Math.floor((end - start) * budget / size) - 2));
    }
    parts.push(text3.slice(start, start + len));
    start += len;
  }
  return parts.length === 0 ? [""] : parts;
}
function checksum(text3) {
  let h = 2166136261;
  for (let k = 0; k < text3.length; k++) {
    h ^= text3.charCodeAt(k);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}
function makeRowsStore({ kino: kino2, ttlMs }) {
  const partKey = (n) => `${PART_PREFIX}${n}`;
  const isPartKey = (k) => k.startsWith(PART_PREFIX) && /^\d+$/.test(k.slice(PART_PREFIX.length));
  const digest = (text3) => {
    try {
      const h = kino2.crypto.hash("md5", text3);
      if (typeof h === "string" && h !== "") return { m: h };
    } catch (_) {
    }
    return { h: checksum(text3) };
  };
  const ROOT_NAMES = ["peliculas", "series", "anime", "infantil"];
  function read() {
    try {
      const rawMeta = kino2.storage.get(META_KEY);
      if (rawMeta === null || rawMeta === void 0) return null;
      const m = JSON.parse(rawMeta);
      if (m === null || typeof m !== "object" || m.v !== ROWS_FORMAT || typeof m.g !== "string" || !Number.isInteger(m.n) || m.n < 1 || m.n > 64 || !Number.isInteger(m.len) || typeof m.h !== "string" && typeof m.m !== "string" || !Number.isFinite(m.at)) return null;
      const tag = m.g + ":";
      let text3 = "";
      for (let n = 0; n < m.n; n++) {
        const part = kino2.storage.get(partKey(n));
        if (typeof part !== "string" || !part.startsWith(tag)) return null;
        text3 += part.slice(tag.length);
      }
      if (text3.length !== m.len) return null;
      if (typeof m.m === "string" ? digest(text3).m !== m.m : checksum(text3) !== m.h) return null;
      const { rows, complete } = decodeRows(text3);
      let roots;
      if (m.r === void 0) roots = Object.fromEntries(ROOT_NAMES.map((r) => [r, m.at]));
      else if (m.r !== null && typeof m.r === "object" && Object.entries(m.r).every(([k, t]) => ROOT_NAMES.includes(k) && Number.isFinite(t))) roots = m.r;
      else return null;
      let whole2;
      if (m.w === void 0) whole2 = complete ? Object.keys(roots) : [];
      else if (Array.isArray(m.w) && m.w.every((r) => ROOT_NAMES.includes(r))) whole2 = m.w;
      else return null;
      return { rows, complete, at: m.at, roots, whole: whole2 };
    } catch (_) {
      return null;
    }
  }
  function write(text3, at, roots, whole2) {
    const sum = digest(text3);
    const gen = (Math.floor(at) % 2176782336).toString(36) + String(sum.m ?? sum.h).slice(0, 4);
    const parts = splitParts(text3, PART_BUDGET_BYTES - PART_TAG_BYTES);
    let keys = [];
    try {
      keys = kino2.storage.keys();
    } catch (_) {
    }
    for (const k of keys) {
      if (k === META_KEY || k.startsWith("tree:") || isPartKey(k) && Number(k.slice(PART_PREFIX.length)) >= parts.length) {
        try {
          kino2.storage.remove(k);
        } catch (_) {
        }
      }
    }
    try {
      parts.forEach((p, n) => kino2.storage.set(partKey(n), `${gen}:${p}`, { ttlMs }));
      kino2.storage.set(META_KEY, JSON.stringify({ v: ROWS_FORMAT, g: gen, n: parts.length, len: text3.length, ...sum, at, r: roots, w: whole2 }), { ttlMs });
      return true;
    } catch (e) {
      for (let n = 0; n < parts.length; n++) {
        try {
          kino2.storage.remove(partKey(n));
        } catch (_) {
        }
      }
      throw e;
    }
  }
  return { read, write };
}
function makeByteCache({ kino: kino2, key, budgetBytes, clock: clock2, ttlMs, valid: valid3 = () => true, keepMs = ttlMs }) {
  const what = String(key).split(":")[0];
  const decode2 = (raw) => {
    try {
      const o = JSON.parse(raw);
      if (!isObject(o) || o.v !== 1 || !Array.isArray(o.e)) return [];
      return o.e.filter((x) => isObject(x) && typeof x.k === "string" && Number.isFinite(x.s) && x.i !== void 0 && valid3(x.i));
    } catch (_) {
      return [];
    }
  };
  const encode2 = (entries) => JSON.stringify({ v: 1, e: entries });
  const remainingBytes = (k, i, s = clock2.now()) => budgetBytes - storedLength(encode2([{ k, s, i }]));
  function read() {
    try {
      const raw = kino2.storage.get(key);
      return raw === null || raw === void 0 ? [] : decode2(raw);
    } catch (_) {
      return [];
    }
  }
  const fresh = (entry, nowMs) => nowMs - entry.s < ttlMs;
  function get(k, entries = read(), nowMs = clock2.now()) {
    const hit = entries.find((e) => e.k === k && fresh(e, nowMs));
    return hit === void 0 ? void 0 : hit.i;
  }
  const kept = (entry, nowMs) => nowMs - entry.s < Math.max(ttlMs, keepMs);
  function getStale(k, entries = read(), nowMs = clock2.now()) {
    const hit = entries.find((e) => e.k === k && kept(e, nowMs));
    return hit === void 0 ? void 0 : hit.i;
  }
  function write(added, touched = []) {
    try {
      const now = clock2.now();
      let entries = read().filter((e) => kept(e, now));
      for (const k of touched) {
        const at = entries.findIndex((e) => e.k === k);
        if (at >= 0) entries.push(...entries.splice(at, 1));
      }
      for (const a of added) {
        const entry = { k: a.k, s: now, i: a.i };
        if (remainingBytes(entry.k, entry.i, now) < 0) {
          trace(kino2, "store", "skip", { what });
          continue;
        }
        entries = entries.filter((e) => e.k !== a.k);
        entries.push(entry);
      }
      let text3 = encode2(entries);
      let evicted = 0;
      while (storedLength(text3) > budgetBytes && entries.length > 0) {
        entries.shift();
        evicted++;
        text3 = encode2(entries);
      }
      if (evicted > 0) trace(kino2, "store", "evict", { what, n: evicted });
      if (entries.length === 0) return;
      kino2.storage.set(key, text3);
    } catch (e) {
      trace(kino2, "store", "full", { what, code: errCode(e) });
    }
  }
  return { read, get, getStale, fresh, remainingBytes, write };
}
var B = "(?<![\\p{L}\\p{N}_])";
var E = "(?![\\p{L}\\p{N}_])";
var SEASON_SOURCE = `(?:${B}T\\s?([0-9]{1,3})${E}|${B}Temp\\.?\\s?([0-9]{1,3})${E}|${B}Temporada\\s?([0-9]{1,3})${E}|${B}S([0-9]{1,3})${E})`;
var B2 = "(?<![\\p{L}\\p{N}_])";
var E2 = "(?![\\p{L}\\p{N}_])";
var LANGUAGE = new RegExp(
  `${B2}(?:audio\\s+)?(?:espa[ñn]ol(?:\\s+latino)?|castellano|latino|latam|subtitulad[oa]|doblad[oa]|dual|sub(?:\\s+esp)?|hd|4k|\\d{3,4}p)${E2}`,
  "giu"
);
var SEASON = new RegExp(SEASON_SOURCE, "giu");
var BRACKETS = /[([{][^)\]}]*[)\]}]/g;
function cleanSeriesTitle(title2) {
  if (typeof title2 !== "string") return "";
  const t = title2.replace(BRACKETS, " ").replace(SEASON, " ").replace(LANGUAGE, " ").replace(/[\s_.:;,|/\\-]+/g, " ").trim();
  return t.length >= 2 ? t : "";
}
var ENDS_IN_DIGIT = /[0-9]\s*$/;
var tails = null;
function tailRegexes() {
  if (tails === null) {
    const tags = `(?:${B2}audio\\s+(?:latino|espa[ñn]ol|castellano)|${B2}espa[ñn]ol(?:\\s+latino)?|${B2}castellano|${B2}subtitulad[oa]|${B2}doblad[oa]|${B2}hd|${B2}4k|${B2}\\d{3,4}p)${E2}`;
    tails = {
      tags: new RegExp(`(?:[\\s_.:;,|/\\\\-]*${tags})+[\\s_.:;,|/\\\\-]*$`, "iu"),
      season: new RegExp(`(?:[\\s_.:;,|/\\\\-]*)${SEASON_SOURCE}\\s*$`, "iu")
    };
  }
  return tails;
}
function displaySeriesTitle(title2) {
  if (typeof title2 !== "string") return "";
  if (!ENDS_IN_DIGIT.test(title2)) return title2;
  const { tags, season } = tailRegexes();
  const m = season.exec(title2);
  if (!m) return title2;
  const rest = title2.slice(0, m.index).replace(tags, "").replace(/[\s_.:;,|/\\-]+$/g, "").trim();
  return rest.length >= 2 ? rest : title2;
}
var ITEM_ID = /^[A-Za-z0-9._~-]{1,128}$/;
var MAX_OUTPUT_ITEMS = 100;
var MAX_ALT_TITLES = 5;
var MAX_SPANISH_FORMS = 3;
var MAX_FULL_TITLE_RETRIES = 4;
var PAGE_SIZE = 20;
var PORTAL_SHARE_MS = 6e3;
var CACHE_KEY = "search:v1";
var CACHE_BUDGET_BYTES = 24e3;
var CACHE_FRESH_MS = 6 * 36e5;
function seasonFromName(name) {
  const m = new RegExp(SEASON_SOURCE, "iu").exec(typeof name === "string" ? name : "");
  if (!m) return 1;
  const digits = m.slice(1).find((g) => g !== void 0 && g.trim() !== "");
  return digits === void 0 ? 1 : Number(digits);
}
var withoutSeason = (name) => (typeof name === "string" ? name : "").replace(new RegExp(SEASON_SOURCE, "giu"), "").trim().toLowerCase();
function sortSeasons(items) {
  const slots = [];
  items.forEach((it, i) => {
    if (isSeries(it.p)) slots.push(i);
  });
  if (slots.length < 2) return items;
  const order = /* @__PURE__ */ new Map();
  for (const i of slots) {
    const key = withoutSeason(items[i].t);
    if (!order.has(key)) order.set(key, order.size);
  }
  const sorted = slots.map((i) => items[i]).sort((a, b) => order.get(withoutSeason(a.t)) - order.get(withoutSeason(b.t)) || seasonFromName(a.t) - seasonFromName(b.t));
  const out = items.slice();
  slots.forEach((i, pos) => {
    out[i] = sorted[pos];
  });
  return out;
}
var seriesKey = (name) => String(name).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
var COLLAPSE_SEASON_LIMIT = 8;
function collapseSeasons(items, read) {
  const groups = /* @__PURE__ */ new Map();
  const byIndex = items.map((item, index) => {
    const { title: title2, series } = read(item);
    if (!series) return null;
    const shown = displaySeriesTitle(title2);
    if (shown === title2) return null;
    const key = seriesKey(shown);
    const season = seasonFromName(title2);
    let group = groups.get(key);
    if (!group) {
      group = { index, lowest: season, seasons: /* @__PURE__ */ new Set() };
      groups.set(key, group);
    }
    group.seasons.add(season);
    if (season < group.lowest) {
      group.index = index;
      group.lowest = season;
    }
    return group;
  });
  if (groups.size === 0) return items;
  const kept = [];
  items.forEach((item, index) => {
    const group = byIndex[index];
    if (group && group.seasons.size > COLLAPSE_SEASON_LIMIT) kept.push({ ...item, keepSeasonTag: true });
    else if (!group || group.index === index) kept.push(item);
  });
  return kept;
}
var str3 = (v) => typeof v === "string" ? v : "";
var INT3 = /^[+-]?\d+$/;
var ADULT_TAG = "adult";
var taggedAdult = (tags) => str3(tags).split(",").some((t) => t.trim().toLowerCase() === ADULT_TAG);
function wholeNumberOrNull(v) {
  if (typeof v === "number") return Number.isInteger(v) ? v : null;
  if (typeof v === "string" && INT3.test(v)) {
    const n = Number(v);
    return n >= -2147483648 && n <= 2147483647 ? n : null;
  }
  return null;
}
function slim(raw) {
  if (!isObject(raw)) return null;
  const c = str3(raw.contentId);
  if (c.trim() === "") return null;
  const alias = str3(raw.alias);
  const t = [raw.name, raw.viewPoint, raw.alias].map(str3).find((s) => s.trim() !== "") ?? "";
  const out = { c, t };
  if (alias !== t && alias.trim() !== "") out.a = alias;
  const programType = str3(raw.programType).trim() === "" ? "movie" : str3(raw.programType);
  if (programType !== "movie") out.p = programType;
  const year = str3(raw.releaseTime).slice(0, 4);
  if (/^[0-9]{4}$/.test(year)) out.y = year;
  const n = wholeNumberOrNull(raw.volumnCount) ?? wholeNumberOrNull(raw.updateCount) ?? 0;
  if (n !== 0) out.n = n;
  if (taggedAdult(raw.tags)) out.x = 1;
  const poster = imageOf(raw, "icon");
  const backdrop = catalogBackdrop(raw);
  if (poster) out.m = poster;
  if (backdrop) out.b = backdrop;
  const ids = catalogIds(raw.ids);
  if (ids) out.ids = ids;
  return out;
}
var eachObject = (list, f) => {
  if (Array.isArray(list)) {
    for (const x of list) if (isObject(x)) f(x);
  }
};
function flatten(response) {
  const out = [];
  if (isObject(response)) {
    eachObject(response.searchItemList, (group) => eachObject(group.itemList, (x) => out.push(x)));
    if (out.length === 0) eachObject(Array.isArray(response.assetList) ? response.assetList : response.list, (x) => out.push(x));
  }
  return out;
}
var validEntryItems = (items) => Array.isArray(items) && items.every((it) => isObject(it) && typeof it.c === "string" && typeof it.t === "string");
var validSearchPage = (entry) => validEntryItems(entry) || isObject(entry) && entry.more === true && validEntryItems(entry.items);
var intOr0 = (v) => typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : 0;
var distinctBy2 = (list, keyOf) => {
  const seen = /* @__PURE__ */ new Set();
  return list.filter((x) => {
    const k = keyOf(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
function makeSearch({ kino: kino2, portal, session, clock: clock2, tmdb = null, isAdultId = () => false, idsLookup = () => () => null, onItems = () => {
} }) {
  const surface = (e) => {
    if (e instanceof PortalError) return mapPortalError(e.code, e.message, kino2);
    if (isKinoError(e)) return e;
    return kino2.error("unavailable", "Xuper no está disponible ahora");
  };
  const cache = makeByteCache({ kino: kino2, key: CACHE_KEY, budgetBytes: CACHE_BUDGET_BYTES, clock: clock2, ttlMs: CACHE_FRESH_MS, valid: validSearchPage });
  function contextOf(query) {
    const q = isObject(query) ? query : {};
    const rawType = typeof q.type === "string" ? q.type.trim() : "";
    return {
      q: typeof q.q === "string" ? q.q.trim() : "",
      type: rawType === "" ? "movie" : rawType === "series" ? "tv" : rawType,
      season: intOr0(q.season),
      episode: intOr0(q.episode),
      tmdbId: intOr0(q.tmdbId),
      originalTitle: typeof q.originalTitle === "string" ? q.originalTitle : "",
      altTitles: Array.isArray(q.altTitles) ? q.altTitles.filter((s) => typeof s === "string").slice(0, MAX_ALT_TITLES) : []
    };
  }
  async function titleForms(ctx, deadline) {
    const forms = [ctx.q];
    if (ctx.tmdbId > 0 && tmdb) {
      let detail = null;
      try {
        detail = await tmdb.titleForms(ctx.type === "movie" ? "movie" : "tv", ctx.tmdbId, { deadline: deadline - PORTAL_SHARE_MS });
      } catch (_) {
        detail = null;
      }
      if (detail) {
        for (const t of [detail.title, detail.originalTitle, detail.englishTitle]) if (typeof t === "string" && t.trim() !== "") forms.push(t);
        for (const t of (Array.isArray(detail.spanishTitles) ? detail.spanishTitles : []).slice(0, MAX_SPANISH_FORMS)) forms.push(t);
      }
    }
    for (const t of [ctx.originalTitle, ...ctx.altTitles]) if (t.trim() !== "") forms.push(t);
    return distinctBy2(forms, (f) => f.trim().toLowerCase());
  }
  async function search2(query) {
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.search);
    const ctx = contextOf(query);
    if (ctx.q === "") return [];
    const forms = await titleForms(ctx, deadline);
    const queries = distinctBy2(forms.map((f) => kino2.rank.shortQuery(f)), (f) => f.toLowerCase());
    const entries = cache.read();
    const nowMs = clock2.now();
    const touched = [];
    const added = [];
    const seen = /* @__PURE__ */ new Set();
    const pool = [];
    let lastError = null;
    let ensuring = null;
    let pendingPage = null;
    function addResults(part) {
      for (const item of part) if (!seen.has(item.c)) {
        seen.add(item.c);
        pool.push(item);
      }
    }
    async function portalItems(q, pageNum = 1) {
      ensuring ?? (ensuring = session.ensure({ deadline }));
      await ensuring;
      const response = await session.withValidSession((v) => portal.call(
        "v3/searchByName",
        { value: q, type: "0", columnId: "", filter: "", pageNum, pageSize: PAGE_SIZE },
        viewOpts(v)
      ), { deadline });
      const flat = flatten(response);
      try {
        if (flat.length > 0 && isObject(flat[0])) {
          const keys = Object.keys(flat[0]);
          trace(kino2, "search", "raw_keys", { n: keys.length, idKeys: keys.filter((k) => /imdb|tmdb|douban|keyword|extern|ident/i.test(k)).join("|").slice(0, 80), kwImdb: /^tt\d{7,10}$/.test(str3(flat[0].keyWords)) ? 1 : 0 });
        }
      } catch (_) {
      }
      const items2 = flat.map(slim).filter((x) => x !== null);
      const total = isObject(response) ? wholeNumberOrNull(response.totalSize) : null;
      if (pageNum === 1 && items2.length && total > Math.max(PAGE_SIZE, flat.length)) return { items: items2, more: true };
      return items2;
    }
    async function fetchInto(qs) {
      for (const q of qs) {
        const key = q.toLowerCase();
        let part = null;
        const hit = cache.get(key, entries, nowMs);
        if (hit !== void 0) {
          part = hit;
          touched.push(key);
        } else {
          try {
            part = await portalItems(q);
            if (!Array.isArray(part) || part.length > 0) added.push({ k: key, i: part });
          } catch (e) {
            lastError = e;
            part = null;
          }
        }
        if (Array.isArray(part)) addResults(part);
        else if (part) {
          addResults(part.items);
          if (q === queries[0]) pendingPage = { query: q, key, items: part.items };
        }
      }
    }
    const titlesOf = (item) => [item.t, item.a ?? ""];
    const ranked = () => kino2.rank.filterRelevant(kino2.rank.sortBySimilarity(pool, forms, titlesOf), forms, titlesOf);
    let items;
    try {
      await fetchInto(queries);
      if (pool.length === 0 && lastError !== null) throw surface(lastError);
      items = ranked();
      if (pendingPage && deadline - clock2.now() >= PORTAL_SHARE_MS) {
        const wantedSeason = (ctx.type === "tv" || ctx.type === "anime") && ctx.season > 0;
        const enough = wantedSeason ? items.some((it) => isSeries(it.p) && seasonFromName(it.t) === ctx.season) : items.length >= PAGE_SIZE;
        if (!enough) {
          try {
            const extra = await portalItems(pendingPage.query, 2);
            const merged = distinctBy2([...pendingPage.items, ...extra], (it) => it.c);
            added.push({ k: pendingPage.key, i: merged });
            addResults(extra);
            items = ranked();
          } catch (_) {
          }
        }
      }
      if (items.length === 0) {
        const asked = new Set(queries.map((s) => s.trim().toLowerCase()));
        const full = distinctBy2(
          forms.map((f) => f.trim()).filter((f) => f !== "" && !asked.has(f.toLowerCase())),
          (f) => f.toLowerCase()
        ).slice(0, MAX_FULL_TITLE_RETRIES);
        if (full.length > 0) {
          await fetchInto(full);
          items = ranked();
        }
      }
    } finally {
      if (added.length > 0 || touched.length > 0) cache.write(added, touched);
    }
    if ((ctx.type === "tv" || ctx.type === "anime") && ctx.season > 0) {
      const matching = items.filter((it) => !isSeries(it.p ?? "movie") || seasonFromName(it.t) === ctx.season);
      if (matching.length > 0) items = matching;
    }
    if (items.length === 0 && ctx.tmdbId > 0) trace(kino2, "search", "empty", { type: ctx.type, pool: pool.length });
    const out = [];
    let idsOf;
    try {
      idsOf = idsLookup();
    } catch (_) {
      idsOf = () => null;
    }
    const ordered = sortSeasons(items);
    const listed = ctx.season > 0 ? ordered : collapseSeasons(ordered, (it) => ({ title: it.t, series: isSeries(it.p ?? "movie") }));
    for (const it of listed) {
      if (!ITEM_ID.test(it.c)) continue;
      const programType = it.p ?? "movie";
      const series = isSeries(programType);
      const item = {
        id: it.c,
        ref: encode({ contentId: it.c, programType, episode: ctx.episode }),
        title: it.t.trim() === "" ? it.c : series && !it.keepSeasonTag ? displaySeriesTitle(it.t) : it.t,
        kind: series ? "series" : "movie",
        year: it.y ?? "",
        season: series ? seasonFromName(it.t) : ctx.season,
        episodeCount: it.n ?? 0
      };
      if (it.m) item.poster = it.m;
      if (it.b) item.backdrop = it.b;
      let adult = it.x === 1;
      if (!adult) {
        try {
          adult = isAdultId(it.c) === true;
        } catch (_) {
          adult = false;
        }
      }
      if (adult) item.adult = true;
      const ids = catalogIds(it.ids, idsOf(it.c));
      if (ids) item.ids = ids;
      out.push(item);
      if (out.length >= MAX_OUTPUT_ITEMS) break;
    }
    try {
      onItems(out);
    } catch (_) {
    }
    return out;
  }
  return { search: search2 };
}
function parseSeasonCounts(body) {
  const o = typeof body === "string" ? safeParse(body) : body;
  if (o === null || typeof o !== "object" || Array.isArray(o)) return null;
  const seasons = Array.isArray(o.seasons) ? o.seasons : [];
  const out = [];
  for (const s of seasons) {
    if (s === null || typeof s !== "object") continue;
    const season = Number(s.season_number);
    const count = Number(s.episode_count);
    if (Number.isInteger(season) && season >= 1 && Number.isInteger(count) && count > 0) out.push({ season, count });
  }
  out.sort((a, b) => a.season - b.season);
  return out;
}
function safeParse(text3) {
  try {
    return JSON.parse(text3);
  } catch (_) {
    return null;
  }
}
function pickSeasonRun(counts, total, portalSeason) {
  if (!Array.isArray(counts) || counts.length === 0 || !Number.isInteger(total) || total <= 0) return null;
  const runs = [];
  const starts = portalSeason === 1 ? [0] : counts.map((_, i) => i);
  for (const from of starts) {
    let sum = 0;
    for (let i = from; i < counts.length; i++) {
      sum += counts[i].count;
      if (sum === total) {
        runs.push(counts.slice(from, i + 1));
        break;
      }
      if (sum > total) break;
    }
  }
  return runs.length === 1 ? runs[0] : null;
}
var CACHE_KEY2 = "chapters:v1";
var CACHE_BUDGET_BYTES2 = 32e3;
var CACHE_FRESH_MS2 = 6 * 36e5;
var CACHE_KEEP_MS = 7 * 24 * 36e5;
var CHAPTERS_REFRESH_MS = 8e3;
var CHAPTERS_COLD_MS = 12e3;
var EPISODES_DEADLINE_MS = 15e3;
var IMDB = /^tt\d{7,}$/;
var MAX_EPISODES = 5e3;
var MAX_SEASONS = 50;
var INT4 = /^[+-]?\d+$/;
var GENERIC_TITLE = /^(?:(?:capitulo|episodio|chapter|episode|cap|ep|e)\.?\s*#?\s*)?\d*$/;
var TRAILING_NUMBER = /[\s._-]*\d+$/;
var plainTitle = (s) => s.toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/\s+/g, " ").trim();
function isGenericTitle(s) {
  if (typeof s !== "string") return true;
  const t = plainTitle(s);
  if (GENERIC_TITLE.test(t)) return true;
  const cut = t.lastIndexOf("_");
  if (cut < 0) return false;
  const series = t.slice(0, cut).trim();
  const rest = t.slice(cut + 1).trim();
  return GENERIC_TITLE.test(rest) || TRAILING_NUMBER.test(rest) && rest.replace(TRAILING_NUMBER, "").trim() === series;
}
function toIntOrNull2(v) {
  const text3 = typeof v === "string" ? v : typeof v === "number" ? String(v) : null;
  if (text3 === null || !INT4.test(text3)) return null;
  const n = Number(text3);
  return n >= -2147483648 && n <= 2147483647 ? n || 0 : null;
}
function parseSeasonList(list, ownId) {
  let own = null;
  const all = [];
  const entries = Array.isArray(list) ? list : [];
  for (const entry of entries) {
    if (!isObject(entry)) continue;
    const id = optStringStrict(entry.contentId);
    const number = toIntOrNull2(entry.seasonNumber);
    if (id === ownId) own = number;
    if (id.trim() !== "" && number !== null) all.push({ id, number });
  }
  if (own === null && entries.length === 0) own = 1;
  all.sort((a, b) => a.number - b.number);
  return { own, all };
}
function findChapter(items, episode) {
  if (episode <= 0) return items[0];
  return items.find((it) => typeof it.seriesNumber === "string" && it.seriesNumber.trim() === String(episode));
}
function detailFields(overview, releaseTime, poster, backdrop) {
  const fields = {};
  const summary = text(overview).trim().slice(0, 2000);
  const match = /^(\d{4})(?:$|[-/.\s])/.exec(text(releaseTime).trim());
  if (summary) fields.overview = summary;
  if (match && Number(match[1]) >= 1870 && Number(match[1]) <= 2100) fields.year = match[1];
  if (https(poster)) fields.poster = poster;
  if (https(backdrop)) fields.backdrop = backdrop;
  return fields;
}
var validPayload = (p) => isObject(p) && typeof p.i === "string" && Array.isArray(p.a) && Array.isArray(p.e) && p.e.every((x) => Array.isArray(x) && typeof x[1] === "string" && typeof x[2] === "string") && p.a.every((x) => Array.isArray(x) && typeof x[0] === "string" && Number.isInteger(x[1])) && (p.s === null || Number.isInteger(p.s)) && (p.d === null || Number.isInteger(p.d)) && (p.t === void 0 || typeof p.t === "string");
function pack(raw, seriesId, cache) {
  const packed = {
    i: raw.imdb,
    s: raw.season,
    d: raw.declared,
    ...raw.title ? { t: raw.title } : {},
    ...Object.keys(raw.info).length ? { m: raw.info } : {},
    a: raw.seasons.map((x) => [x.id, x.number]),
    e: raw.items.map((it) => it.duration === void 0 ? [it.seriesNumber, it.contentId, it.name] : [it.seriesNumber, it.contentId, it.name, it.duration])
  };
  // Episode references and durations remain available offline even for a long season with large still URLs.
  let remaining = cache.remainingBytes(seriesId, packed);
  if (remaining < 0 && packed.m) {
    delete packed.m;
    remaining = cache.remainingBytes(seriesId, packed);
  }
  for (let index = 0; index < packed.e.length && remaining > 0; index++) {
    const still = raw.items[index].still;
    if (!still) continue;
    const row = packed.e[index];
    const withStill = [row[0], row[1], row[2], row[3], still];
    const cost = storedLength(JSON.stringify(withStill)) - storedLength(JSON.stringify(row));
    if (cost <= remaining) {
      packed.e[index] = withStill;
      remaining -= cost;
    }
  }
  return packed;
}
var unpack = (p) => ({
  items: p.e.map((x) => ({ seriesNumber: x[0], contentId: x[1], name: x[2], duration: x[3] ?? void 0, still: https(x[4]) })),
  imdb: p.i,
  season: p.s,
  declared: p.d,
  seasons: p.a.map((x) => ({ id: x[0], number: x[1] })),
  title: typeof p.t === "string" ? p.t : "",
  info: detailFields(p.m?.overview, p.m?.year, p.m?.poster, p.m?.backdrop)
});
function makePortalChapters({ kino: kino2, portal, session, clock: clock2, onServed = () => {
}, ids = null }) {
  const cache = makeByteCache({
    kino: kino2,
    key: CACHE_KEY2,
    budgetBytes: CACHE_BUDGET_BYTES2,
    clock: clock2,
    ttlMs: CACHE_FRESH_MS2,
    keepMs: CACHE_KEEP_MS,
    valid: validPayload
  });
  async function fetchDetail(seriesId, deadline) {
    let response;
    try {
      await session.ensure({ deadline });
      response = await session.withValidSession((v) => portal.call(
        "v4/getItemData",
        { contentId: seriesId, type: "0", sortType: "0", language: "en", macAddr: FIXED_MAC },
        viewOpts(v)
      ), { deadline });
    } catch (e) {
      if (e instanceof PortalError) throw mapPortalError(e.code, e.message, kino2);
      if (isKinoError(e)) throw e;
      throw kino2.error("unavailable", "Xuper no está disponible ahora");
    }
    const data = isObject(response) ? response.assetData : void 0;
    if (!isObject(data)) throw kino2.error("unavailable", "Xuper devolvió una capítulos sin datos");
    return data;
  }
  return async function portalChapters(seriesId, deadline = callDeadline(clock2, CALL_BUDGET_MS.episodes)) {
    const entries = cache.read();
    const cached = cache.get(seriesId, entries);
    if (cached !== void 0) {
      onServed("cache");
      return unpack(cached);
    }
    const kept = cache.getStale(seriesId, entries);
    const portalEnd = Math.min(deadline, clock2.now() + (kept !== void 0 ? CHAPTERS_REFRESH_MS : CHAPTERS_COLD_MS));
    let data;
    try {
      data = await fetchDetail(seriesId, portalEnd);
    } catch (e) {
      if (kept !== void 0 && isKinoError(e) && e.name === "KinoError_unavailable") {
        trace(kino2, "episodes", "kept", { code: errCode(e) });
        onServed("cache");
        return unpack(kept);
      }
      throw slowPortal(kino2, e);
    }
    const items = (Array.isArray(data.simpleProgramList) ? data.simpleProgramList : []).filter(isObject).map((it) => {
      const seriesNumber = typeof it.seriesNumber === "string" ? it.seriesNumber : typeof it.seriesNumber === "number" ? String(it.seriesNumber) : null;
      const item = { seriesNumber, contentId: optStringStrict(it.contentId), name: optStringStrict(it.name), duration: void 0 };
      const still = imageOf(it, "stage", https);
      if (still) item.still = still;
      if (typeof it.duration === "string" || typeof it.duration === "number" && Number.isFinite(it.duration)) item.duration = it.duration;
      return item;
    });
    const seasonList = parseSeasonList(data.sameSeasonSeriesList, seriesId);
    const title2 = [data.name, data.viewPoint, data.alias].find((v) => typeof v === "string" && v.trim() !== "") ?? "";
    const info = detailFields(data.description, data.releaseTime, imageOf(data, "icon", https), imageOf(data, "background", https) || imageOf(data, "poster", https));
    const raw = { items, imdb: optStringStrict(data.keyWords), season: seasonList.own, declared: toIntOrNull2(data.volumnCount), seasons: seasonList.all, title: title2, info };
    if (items.length > 0) cache.write([{ k: seriesId, i: pack(raw, seriesId, cache) }]);
    if (ids) {
      ids.remember(seriesId, raw.imdb);
      if (IMDB.test(raw.imdb)) ids.rememberSeasons(raw.seasons, raw.imdb);
    }
    onServed("fresh");
    return raw;
  };
}
function makeEpisodes({ kino: kino2, tmdb = null, portalChapters, clock: clock2 = null, ids = null }) {
  async function acrossTmdbSeasons(tvId, portalSeason, expected, bounds) {
    if (typeof tmdb.seriesSeasons !== "function") return null;
    try {
      const all = await tmdb.seriesSeasons(tvId, bounds);
      const run = pickSeasonRun(all, expected, portalSeason);
      const c = (i) => Array.isArray(all) && all[i] ? all[i].count : -1;
      trace(kino2, "episodes", "run", { seasons: Array.isArray(all) ? all.length : -1, c1: c(0), c2: c(1), c3: c(2), c4: c(3), c5: c(4), c6: c(5), c7: c(6), c8: c(7), total: expected, found: run === null ? 0 : run.length });
      if (run === null) return null;
      const out = [];
      for (const s of run) {
        const eps = await tmdb.seasonEpisodes(tvId, s.season, void 0, bounds);
        if (!eps || eps.length !== s.count) {
          trace(kino2, "episodes", "run_season", { season: s.season, want: s.count, got: eps ? eps.length : -1 });
          return null;
        }
        for (const e of eps) out.push({ ...e, episode: out.length + 1 });
      }
      return out.length === expected ? out : null;
    } catch (_) {
      return null;
    }
  }
  async function enrich(raw, bounds, byTitle = null) {
    const none = { extra: /* @__PURE__ */ new Map(), series: null };
    const why = (reason, more = {}) => trace(kino2, "episodes", "enrich", { why: reason, season: raw.season ?? -1, declared: raw.declared ?? -1, items: raw.items.length, ...more });
    if (!tmdb) {
      why("no_tmdb");
      return none;
    }
    if (raw.season === null) {
      why("no_season");
      return none;
    }
    const viaImdb = IMDB.test(raw.imdb);
    if (!viaImdb && !byTitle) {
      why("no_series_id");
      return none;
    }
    try {
      const series = viaImdb ? await tmdb.seriesByImdb(raw.imdb, bounds) : byTitle;
      if (!series) {
        why("series_null", { via: viaImdb ? "imdb" : "title" });
        return none;
      }
      let fromTmdb = await tmdb.seasonEpisodes(series.tmdbId, raw.season, void 0, bounds);
      if (!fromTmdb) {
        why("season_null", { via: viaImdb ? "imdb" : "title" });
        return { extra: /* @__PURE__ */ new Map(), series };
      }
      let acrossSeasons = false;
      const expected = raw.declared !== null && raw.declared > 0 ? raw.declared : raw.items.length;
      if (expected !== fromTmdb.length) {
        const merged = fromTmdb.length < expected ? await acrossTmdbSeasons(series.tmdbId, raw.season, expected, bounds) : null;
        if (merged === null) {
          why("count_mismatch", { expected, tmdbLen: fromTmdb.length, via: viaImdb ? "imdb" : "title" });
          return { extra: /* @__PURE__ */ new Map(), series };
        }
        fromTmdb = merged;
        acrossSeasons = true;
      }
      why("ok", { tmdbLen: fromTmdb.length, stills: fromTmdb.filter((c) => c.still.trim() !== "").length, via: viaImdb ? "imdb" : "title", merged: acrossSeasons ? 1 : 0 });
      const rows = /* @__PURE__ */ new Map();
      for (const c of fromTmdb) {
        const row2 = {
          still: c.still.trim() !== "" ? c.still : null,
          // TMDB's blank name reads "Episodio N" (parseSeasonEpisodes): no better than the portal's.
          title: !isGenericTitle(c.name) ? c.name : null,
          overview: c.overview.trim() !== "" ? c.overview : null,
          airDate: c.airDate || null,
          runtimeMinutes: c.runtimeMinutes > 0 ? c.runtimeMinutes : null
        };
        if (Object.values(row2).some((v) => v !== null)) rows.set(c.episode, row2);
        else rows.delete(c.episode);
      }
      const missing = new Set([...rows].filter(([, r]) => r.overview === null).map(([n]) => n));
      if (missing.size === 0 || acrossSeasons) return { extra: rows, series };
      let inEnglish = [];
      try {
        inEnglish = await tmdb.seasonEpisodes(series.tmdbId, raw.season, "en-US", bounds) ?? [];
      } catch (_) {
        inEnglish = [];
      }
      for (const c of inEnglish) {
        if (missing.has(c.episode) && c.overview.trim() !== "") rows.set(c.episode, { ...rows.get(c.episode), overview: c.overview });
      }
      return { extra: rows, series };
    } catch (_) {
      return none;
    }
  }
  return async function episodes2(ref) {
    const magis = decode(ref);
    if (!magis) throw kino2.error("unavailable", "ese ref no es de Xuper: no se pueden listar capítulos");
    const deadline = clock2 ? Math.min(clock2.now() + EPISODES_DEADLINE_MS, callDeadline(clock2, CALL_BUDGET_MS.episodes)) : void 0;
    let raw;
    try {
      raw = await portalChapters(magis.contentId, deadline);
    } catch (e) {
      if (isKinoError(e) && isEpisodeGone(e.userMessage)) throw mapPortalError("portal100006", "", kino2, { goneMessage: SERIES_GONE });
      throw e;
    }
    let byTitle = null;
    if (!IMDB.test(raw.imdb) && tmdb && typeof tmdb.seriesByTitle === "function") {
      const clean = cleanSeriesTitle(raw.title);
      if (clean !== "") {
        try {
          byTitle = await tmdb.seriesByTitle(clean, { deadline });
        } catch (_) {
          byTitle = null;
        }
      }
    }
    const { extra, series } = await enrich(raw, { deadline }, byTitle);
    if (ids) {
      if (IMDB.test(raw.imdb)) {
        ids.remember(magis.contentId, raw.imdb, series?.tmdbId ?? 0);
        ids.rememberSeasons(raw.seasons, raw.imdb, series?.tmdbId ?? 0);
      } else if (byTitle) {
        ids.remember(magis.contentId, "", byTitle.tmdbId);
        ids.rememberSeasons(raw.seasons, "", byTitle.tmdbId);
      }
    }
    const list = raw.items.slice(0, MAX_EPISODES).map((it) => {
      const number = toIntOrNull2(it.seriesNumber) ?? 0;
      const numbered = number > 0 && it.name.includes("_") && isGenericTitle(it.name);
      const ep = {
        number,
        title: it.name.trim() !== "" && !numbered ? it.name : say(kino2, "chapterN", { n: number }),
        // The series plus the number: whoever plays it looks the chapter back up in the list.
        ref: encodeChapter(number, magis.contentId)
      };
      const t = extra.get(number);
      if (t?.title && isGenericTitle(it.name)) ep.title = t.title;
      const still = it.still || t?.still;
      if (still) ep.still = still;
      if (t?.overview) ep.overview = t.overview;
      if (t?.airDate) ep.airDate = t.airDate;
      if (t?.runtimeMinutes) ep.runtimeMinutes = t.runtimeMinutes;
      if (raw.season !== null) ep.season = raw.season;
      return ep;
    });
    const out = { episodes: list };
    if (IMDB.test(raw.imdb)) {
      const tmdbId = series?.tmdbId ?? 0;
      out.series = {
        ids: tmdbId > 0 ? { imdb: raw.imdb, tmdb: tmdbId } : { imdb: raw.imdb },
        title: series?.title ?? "",
        poster: series?.poster ?? "",
        backdrop: series?.backdrop ?? ""
      };
    } else if (byTitle) {
      out.series = { ids: { tmdb: byTitle.tmdbId }, title: byTitle.title, poster: byTitle.poster, backdrop: byTitle.backdrop };
    }
    if (raw.info && Object.keys(raw.info).length) out.series = { ...out.series, ...raw.info };
    if (raw.seasons.length > 0) {
      const currentIndex = raw.seasons.findIndex((s) => s.id === magis.contentId);
      // Keep neighboring seasons selectable when a series exceeds the host's limit.
      const centeredStart = currentIndex - Math.floor(MAX_SEASONS / 2);
      const start = Math.max(0, Math.min(centeredStart, raw.seasons.length - MAX_SEASONS));
      out.seasons = raw.seasons.slice(start, start + MAX_SEASONS).map((s) => ({
        id: s.id,
        // A season IS a portal title of the same kind: its ref is what a search would give it.
        ref: encode({ contentId: s.id, programType: magis.programType, episode: 0 }),
        title: say(kino2, "seasonN", { n: s.number }),
        number: s.number,
        current: s.id === magis.contentId
      }));
    }
    return out;
  };
}
var IMDB2 = /^tt\d{7,10}$/;
var TMDB_MS = 8e3;
function makeDetails({ kino: kino2, tmdb = null, portalChapters, clock: clock2 = null, ids = null, titles = null }) {
  const bounds = () => clock2 ? { deadline: callDeadline(clock2, TMDB_MS) } : void 0;
  async function byTitle(contentId, title2, year = "") {
    if (!tmdb || typeof tmdb.movieByTitle !== "function" || typeof title2 !== "string" || title2.trim() === "") return null;
    let found = null;
    try {
      found = await tmdb.movieByTitle(title2, bounds(), year);
    } catch (_) {
      found = null;
    }
    const tmdbId = found && Number.isInteger(found.tmdbId) && found.tmdbId > 0 ? found.tmdbId : 0;
    trace(kino2, "details", "tmdb", { match: tmdbId > 0 ? 1 : 0 });
    if (tmdbId === 0) return null;
    if (ids) ids.remember(contentId, "", tmdbId);
    return { ids: { tmdb: tmdbId } };
  }
  return async function details2(ref) {
    let r;
    try {
      r = decode(ref);
    } catch (_) {
      return null;
    }
    if (r === null || r === void 0 || r.isSeries || isSeries(r.programType)) {
      trace(kino2, "details", "skip", { why: "not_a_movie" });
      return null;
    }
    const remembered = titles ? titles.titleOf(r.contentId) : null;
    trace(kino2, "details", "title", { remembered: remembered ? 1 : 0 });
    if (remembered) {
      const hit = await byTitle(r.contentId, remembered.title, remembered.year);
      if (hit) return { ...remembered, ...hit };
    }
    let raw = null;
    try {
      raw = await portalChapters(r.contentId);
    } catch (_) {
      trace(kino2, "details", "portal", { ok: 0 });
    }
    if (!raw) return remembered;
    const title = text(raw.title).trim();
    const info = { ...remembered, ...raw.info };
    if (title) info.title = title;
    trace(kino2, "details", "portal", { ok: 1, imdb: IMDB2.test(raw.imdb) ? 1 : 0, titleLen: title.length });
    if (IMDB2.test(raw.imdb)) {
      if (ids) ids.remember(r.contentId, raw.imdb);
      return { ...info, ids: { imdb: raw.imdb } };
    }
    if (title && title !== remembered?.title) {
      const hit = await byTitle(r.contentId, title, info.year);
      return { ...info, ...hit };
    }
    return Object.keys(info).length ? info : null;
  };
}
var KEY2 = "titles:v1";
var BUDGET_BYTES = 12e3;
var KEEP_MS = 30 * 24 * 36e5;
var MAX_TITLE = 100;
var valid = (p) => Array.isArray(p) && typeof p[0] === "string" && p[0] !== "" && (p[1] === void 0 || typeof p[1] === "string");
function makeTitlesStore({ kino: kino2, clock: clock2 }) {
  const cache = makeByteCache({ kino: kino2, key: KEY2, budgetBytes: BUDGET_BYTES, clock: clock2, ttlMs: KEEP_MS, valid });
  function rememberMovies(items) {
    try {
      const added = [];
      for (const it of Array.isArray(items) ? items : []) {
        if (it === null || typeof it !== "object" || it.kind !== "movie") continue;
        if (typeof it.id !== "string" || it.id === "" || typeof it.title !== "string" || it.title.trim() === "") continue;
        const art = {};
        if (https(it.poster)) art.poster = it.poster;
        if (https(it.backdrop)) art.backdrop = it.backdrop;
        if (text(it.overview)) art.overview = it.overview.slice(0, 400);
        added.push({ k: it.id, i: [it.title.trim().slice(0, MAX_TITLE), it.year === void 0 || it.year === null ? "" : String(it.year), art] });
      }
      if (added.length > 0) cache.write(added);
    } catch (_) {
    }
  }
  function titleOf(contentId) {
    try {
      const hit = cache.get(contentId);
      return Array.isArray(hit) ? { ...isObject(hit[2]) ? hit[2] : {}, title: hit[0], year: typeof hit[1] === "string" ? hit[1] : "" } : null;
    } catch (_) {
      return null;
    }
  }
  return { rememberMovies, titleOf };
}
var KEY3 = "ids:v1";
var BUDGET_BYTES2 = 1e4;
var KEEP_MS2 = 60 * 24 * 36e5;
var IMDB3 = /^tt\d{7,10}$/;
var MAX_TMDB = 2147483647;
var validTmdb = (n) => Number.isInteger(n) && n > 0 && n <= MAX_TMDB;
function catalogIds(given, remembered) {
  const published = {};
  if (validTmdb(given?.tmdb)) published.tmdb = given.tmdb;
  if (typeof given?.imdb === "string" && IMDB3.test(given.imdb)) published.imdb = given.imdb;
  if (Object.keys(published).length === 0) return remembered ?? null;
  if (Object.keys(published).some((key) => remembered?.[key] && remembered[key] !== published[key])) return published;
  return { ...remembered, ...published };
}
var valid2 = (p) => Array.isArray(p) && typeof p[0] === "string" && Number.isInteger(p[1]) && p[1] >= 0 && (IMDB3.test(p[0]) || p[0] === "" && validTmdb(p[1]));
var idsOfPayload = (p) => {
  if (!valid2(p)) return null;
  if (p[0] === "") return { tmdb: p[1] };
  return validTmdb(p[1]) ? { imdb: p[0], tmdb: p[1] } : { imdb: p[0] };
};
function makeIdsStore({ kino: kino2, clock: clock2 }) {
  const cache = makeByteCache({ kino: kino2, key: KEY3, budgetBytes: BUDGET_BYTES2, clock: clock2, ttlMs: KEEP_MS2, valid: valid2 });
  function rememberSeasons(siblings, imdb, tmdb = 0) {
    try {
      for (const s of Array.isArray(siblings) ? siblings : []) if (s && typeof s.id === "string") remember(s.id, imdb, tmdb);
    } catch (_) {
    }
  }
  function remember(contentId, imdb, tmdb = 0) {
    try {
      if (typeof contentId !== "string" || contentId.trim() === "" || typeof imdb !== "string") return;
      if (!IMDB3.test(imdb) && !(imdb === "" && validTmdb(tmdb))) return;
      const entries = cache.read();
      const old = cache.get(contentId, entries);
      const keptTmdb = validTmdb(tmdb) ? tmdb : old && old[0] === imdb ? old[1] : 0;
      if (old && old[0] === imdb && old[1] === keptTmdb) return;
      cache.write([{ k: contentId, i: [imdb, keptTmdb] }]);
    } catch (_) {
    }
  }
  function lookup() {
    let byId;
    try {
      byId = new Map(cache.read().map((e) => [e.k, e.i]));
    } catch (_) {
      byId = /* @__PURE__ */ new Map();
    }
    return (contentId) => byId.has(contentId) ? idsOfPayload(byId.get(contentId)) : null;
  }
  return { remember, rememberSeasons, lookup };
}
var LIVE_TILE_PREFIX = "xlive:";
var MAX_LIVE_TILES = 6;
var GENRE_ORDER = ["deportes", "noticias", "infantil", "cineyseries", "peliculas", "series", "entretenimiento", "musica", "documentales", "anime"];
var TITLE_KEY = {
  deportes: "liveTileSports",
  noticias: "liveTileNews",
  infantil: "liveTileKids",
  peliculas: "liveTileMovies",
  cineyseries: "liveTileMoviesSeries",
  series: "liveTileSeries",
  entretenimiento: "liveTileEntertainment",
  musica: "liveTileMusic",
  documentales: "liveTileDocumentaries",
  anime: "liveTileAnime"
};
var LIVE_TILES_COLD_MS = 8e3;
var PAGE_SIZE2 = 100;
var MAX_PAGES = 20;
var isLiveTileRef = (ref) => typeof ref === "string" && ref.startsWith(LIVE_TILE_PREFIX);
function genresOf2(categories2) {
  const by = /* @__PURE__ */ new Map();
  for (const { id, genre } of categories2) {
    if (!Object.hasOwn(TITLE_KEY, genre)) continue;
    if (!by.has(genre)) by.set(genre, []);
    if (!by.get(genre).includes(id)) by.get(genre).push(id);
  }
  return GENRE_ORDER.filter((g) => by.has(g)).map((genre) => ({ genre, ids: by.get(genre) }));
}
function makeLiveTiles({ kino: kino2, live: live2, clock: clock2 }) {
  async function tiles({ strict = false } = {}) {
    try {
      const deadline = Math.min(clock2.now() + LIVE_TILES_COLD_MS, callDeadline(clock2, CALL_BUDGET_MS.categories));
      const genres = genresOf2(await live2.genreCategories(deadline)).slice(0, MAX_LIVE_TILES);
      const logos = live2.genreLogos();
      return genres.map(({ genre }) => {
        const tile = { id: `xlive-${genre}`, title: say(kino2, TITLE_KEY[genre]).slice(0, 40), ref: LIVE_TILE_PREFIX + genre };
        if (Object.hasOwn(logos, genre)) tile.art = logos[genre];
        return tile;
      });
    } catch (e) {
      trace(kino2, "categories", "live_tiles_fail", { code: errCode(e) });
      if (strict) throw e;
      return [];
    }
  }
  const notFound = () => kino2.error("not_found", "No se encontró esa categoría");
  function cursorOf(cursor) {
    const m = typeof cursor === "string" ? /^(\d{1,2})\.(\d{1,3})$/.exec(cursor) : null;
    return m ? { at: Number(m[1]), page: Math.max(1, Number(m[2])) } : { at: 0, page: 1 };
  }
  async function browse2(ref, cursor, { strict = false } = {}) {
    const genre = ref.slice(LIVE_TILE_PREFIX.length);
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.browse);
    let ids;
    try {
      ids = genresOf2(await live2.genreCategories(deadline)).find((g) => g.genre === genre)?.ids;
    } catch (e) {
      throw live2.surface(e);
    }
    if (!ids) throw notFound();
    let { at, page } = cursorOf(cursor);
    const first = cursor === null || cursor === void 0;
    while (at < ids.length && page <= MAX_PAGES) {
      let got;
      try {
        got = await live2.channelsPage(ids[at], page, PAGE_SIZE2, deadline);
      } catch (e) {
        if (strict || first && at === 0 && page === 1) throw live2.surface(e);
        trace(kino2, "live", "tile_page_fail", { genre, page, code: errCode(e) });
        return { items: [] };
      }
      const next = got.full && page < MAX_PAGES ? `${at}.${page + 1}` : at + 1 < ids.length ? `${at + 1}.1` : null;
      const items = got.items.map((c) => {
        const item = { kind: "live", id: c.id, title: c.title, ref: c.ref };
        if (c.logo) item.poster = c.logo;
        if (c.adult === true) item.adult = true;
        return item;
      });
      if (strict || items.length > 0 || next === null) return next ? { items, next } : { items };
      ({ at, page } = cursorOf(next));
    }
    return { items: [] };
  }
  return { tiles, browse: browse2 };
}
var ROOT_CODES = { peliculas: "masnew_movies", series: "masnew_series", anime: "masnew_anime", infantil: "masnew_kids" };
var ADULT_ROOT_CODE = "masnew_adult";
var ADULT_REF = "magis_adultos";
var ROWS_FRESH_MS = 2 * 36e5;
var SNAPSHOT_TTL_MS = 14 * 24 * 36e5;
var TREE_PAGE_SIZE = 60;
var REFRESH_GAP_MS = 5 * 6e4;
var SLICE_START_MS = 1500;
var SLICE_MARGIN_MS = 2e3;
var WARM_REFRESH_MS = 8e3;
var COLD_DEADLINE_MS = 12e3;
var LIVE_ROW_MS = WARM_REFRESH_MS;
var SESSION_WARM_MS = 2e4;
var COLD_PARALLEL = 2;
var SLOW_FETCH_MS = 4e3;
var SLOW_KEY = "portalSlow";
var SLOW_MEMORY_MS = 30 * 6e4;
var HEAVY_REFRESH_MS = 8e3;
var SLOW_REFRESH_GAP_MS = 30 * 6e4;
var HEAVY_KEY = "refreshHeavy";
var HEAVY_MEMORY_MS = 24 * 36e5;
var REFRESH_AT_KEY = "refreshAt";
var BROWSE_PAGE = 50;
var MAX_HOME_ROWS = 20;
var MAX_ROW_ITEMS = 60;
var MAX_GENRES = 5;
var NEW_WINDOW_MS = 48 * 36e5;
var ITEM_ID2 = /^[A-Za-z0-9._~-]{1,128}$/;
var noIds = () => null;
var oneEach = (items) => collapseSeasons(items, (i) => ({ title: i.title, series: isSeries(i.type) }));
function projectItem(item, nowMs, idsOf = noIds, english = false, spanish = false) {
  if (!ITEM_ID2.test(item.id)) return null;
  const out = {
    id: item.id,
    ref: refOf(item),
    title: item.title.trim() === "" ? item.id : isSeries(item.type) && !item.keepSeasonTag ? displaySeriesTitle(item.title) : item.title,
    kind: isSeries(item.type) ? "series" : "movie"
  };
  if (item.poster) out.poster = item.poster;
  if (item.backdrop) out.backdrop = item.backdrop;
  if (item.description.trim() !== "") out.overview = item.description;
  if (item.genres.length > 0) out.genres = item.genres.slice(0, MAX_GENRES).map((g) => genreName(g, spanish));
  if (item.score !== null && Number.isFinite(item.score) && item.score >= 0 && item.score <= 10) out.rating = item.score;
  const minutes = Math.trunc(item.durationS / 60);
  if (minutes >= 1 && minutes <= 1e3) out.runtimeMinutes = minutes;
  if (item.shelvedAtMs > 0 && nowMs - item.shelvedAtMs <= NEW_WINDOW_MS) out.badges = [english ? "NEW" : "NUEVO"];
  const ids = catalogIds(item.ids, idsOf(item.id));
  if (ids) out.ids = ids;
  return out;
}
var plainWords = (text3) => String(text3).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
var homeTitleKey = (t) => plainWords(typeof t === "string" ? t : "");
function rankWithin(kino2, pool, q) {
  const words = plainWords(q).split(" ").filter((w) => w !== "");
  const forms = [q];
  const titlesOf = (item) => [item.title];
  const relevant = new Set(kino2.rank.filterRelevant(pool, forms, titlesOf));
  const hits = pool.filter((item) => {
    if (relevant.has(item)) return true;
    const title2 = plainWords(item.title);
    return words.length > 0 && words.every((w) => title2.includes(w));
  });
  return kino2.rank.sortBySimilarity(hits, forms, titlesOf);
}
function projectRows(rows, nowMs, idsOf = noIds, english = false, spanish = false) {
  const out = [];
  for (const r of rows) {
    const items = oneEach(r.shown).map((i) => projectItem(i, nowMs, idsOf, english, spanish)).filter((i) => i !== null).slice(0, MAX_ROW_ITEMS);
    if (items.length === 0) continue;
    const title2 = localizedRowTitle(r, english);
    const genre = genreOfRow(r.id);
    out.push(genre !== null ? { id: r.id, title: title2, ref: r.id, items, genre } : { id: r.id, title: title2, ref: r.id, items });
  }
  return out.slice(0, MAX_HOME_ROWS);
}
var hasItems = (sections) => sections.some((s) => s.items.length > 0);
var INT5 = /^[+-]?\d+$/;
function offsetOf(cursor) {
  if (typeof cursor !== "string" || !INT5.test(cursor)) return 0;
  const n = Number(cursor);
  return n > 0 && n <= 2147483647 ? n : 0;
}
function makeCatalog({ kino: kino2, portal, session, clock: clock2, tmdb = null, countryRow = null }) {
  const store = makeRowsStore({ kino: kino2, ttlMs: SNAPSHOT_TTL_MS });
  const ids = makeIdsStore({ kino: kino2, clock: clock2 });
  const titles = makeTitlesStore({ kino: kino2, clock: clock2 });
  const stale = (at) => {
    const age = clock2.now() - at;
    return age < 0 || age >= ROWS_FRESH_MS;
  };
  const trees = /* @__PURE__ */ new Map();
  let current;
  let dirty = false;
  const failedAt = /* @__PURE__ */ new Map();
  function getCurrent() {
    if (current === void 0) {
      const snap = store.read();
      current = snap ? { rows: snap.rows, roots: snap.roots, whole: new Set(snap.whole), withAll: /* @__PURE__ */ new Set() } : null;
    }
    return current;
  }
  function homeRowsCount(rows2) {
    let shown = 0;
    for (let n = 0; n < rows2.length; n++) {
      if (rows2[n].shown.some((i) => ITEM_ID2.test(i.id)) && ++shown >= MAX_HOME_ROWS) return n + 2;
    }
    return rows2.length;
  }
  function save() {
    dirty = false;
    const { rows: rows2, roots } = current;
    if (rows2.length === 0) return;
    const startedAt = clock2.now();
    const keepFull = homeRowsCount(rows2);
    const fit = fitRows(rows2, { keepFull });
    if (fit === null) {
      trace(kino2, "store", "skip", { what: "rows" });
      return;
    }
    if (fit.step > 0) trace(kino2, "store", "trim", { what: "rows", step: fit.step });
    const cut = fit.step === 0 ? /* @__PURE__ */ new Set() : new Set(rows2.slice(keepFull).filter((r) => r.shown.length > 1).map((r) => rootOfRow(r.id)));
    const whole2 = Object.keys(roots).filter((r) => current.whole.has(r) && !cut.has(r));
    try {
      store.write(fit.text, Math.min(...Object.values(roots)), roots, whole2);
      const ms = clock2.now() - startedAt;
      trace(kino2, PERF_AREAS.store, "write", { b: msBucket(ms), kb: kbBucket(fit.text.length), step: fit.step });
    } catch (e) {
      trace(kino2, "store", "full", { what: "rows", code: errCode(e) });
    }
  }
  let slowAt = null;
  const portalSlow = () => {
    if (slowAt === null) {
      try {
        const v = Number(kino2.storage.get(SLOW_KEY));
        slowAt = Number.isFinite(v) && v > 0 ? v : 0;
      } catch (_) {
        slowAt = 0;
      }
    }
    const age = clock2.now() - slowAt;
    return slowAt > 0 && age >= 0 && age < SLOW_MEMORY_MS;
  };
  const noteFetchMs = (ms) => {
    const slow = ms >= SLOW_FETCH_MS;
    if (slow === portalSlow()) {
      if (slow) slowAt = clock2.now();
      return;
    }
    slowAt = slow ? clock2.now() : 0;
    try {
      if (slow) kino2.storage.set(SLOW_KEY, String(slowAt), { ttlMs: SLOW_MEMORY_MS });
      else kino2.storage.remove(SLOW_KEY);
    } catch (_) {
    }
  };
  const stampAge = (key) => {
    try {
      const v = Number(kino2.storage.get(key));
      const age = clock2.now() - v;
      return Number.isFinite(v) && v > 0 && age >= 0 ? age : Infinity;
    } catch (_) {
      return Infinity;
    }
  };
  const stamp = (key, ttlMs) => {
    try {
      kino2.storage.set(key, String(clock2.now()), { ttlMs });
    } catch (_) {
    }
  };
  const refreshHeld = () => stampAge(HEAVY_KEY) < HEAVY_MEMORY_MS && stampAge(REFRESH_AT_KEY) < SLOW_REFRESH_GAP_MS;
  const markHeavy = () => stamp(HEAVY_KEY, HEAVY_MEMORY_MS);
  const noteRefresh = (ms) => {
    if (ms >= HEAVY_REFRESH_MS) {
      markHeavy();
      trace(kino2, "home", "heavy_refresh", { b: msBucket(ms) });
      return;
    }
    if (stampAge(HEAVY_KEY) !== Infinity) {
      try {
        kino2.storage.remove(HEAVY_KEY);
      } catch (_) {
      }
    }
  };
  async function fetchRoot(root, deadline) {
    try {
      const response = await session.withValidSession((v) => portal.call(
        "getNextColumns",
        { columnCode: ROOT_CODES[root], pageNum: 1, pageSize: TREE_PAGE_SIZE, version: "" },
        { ...viewOpts(v), onFetchMs: noteFetchMs }
      ), { deadline });
      const sections = parseTree(response);
      return { sections: hasItems(sections) ? sections : [], error: null };
    } catch (e) {
      trace(kino2, "home", "root_fail", { root, code: errCode(e) });
      return { sections: [], error: isKinoError(e) ? e : kino2.error("unavailable", "Xuper no está disponible ahora") };
    }
  }
  const inflight = /* @__PURE__ */ new Map();
  function sharedFetchRoot(root, deadline) {
    let pending = inflight.get(root);
    if (!pending) {
      pending = fetchRoot(root, deadline).finally(() => inflight.delete(root));
      inflight.set(root, pending);
    }
    return pending;
  }
  const worstOf = (fetched) => (fetched.find((f) => f.error.name !== "KinoError_unavailable") || fetched[0]).error;
  function summarizeFailure(fetched, passes) {
    const codes = [];
    for (const f of [...fetched].sort((a, b) => (a.error.name === "KinoError_unavailable") - (b.error.name === "KinoError_unavailable"))) {
      const c = errCode(f.error);
      if (!codes.includes(c)) codes.push(c);
    }
    const fields = { roots: fetched.length, rounds: passes };
    codes.slice(0, 3).forEach((c, i) => {
      fields["c" + (i + 1)] = c;
    });
    trace(kino2, "home", "all_fail", fields);
  }
  function nextRoot(need, root, asked, refreshing = true) {
    const cur = getCurrent();
    const roots = cur ? cur.roots : {};
    const all = KINDS.map((k) => k.root);
    const required = root !== null && all.includes(root) && (need === "section" ? !(cur && cur.whole.has(root)) : need === "full" ? !(cur && cur.withAll.has(root)) : false) ? [root] : [];
    const missing = all.filter((r) => !(r in roots));
    const stalest = refreshing ? all.filter((r) => r in roots && stale(roots[r])).sort((x, y) => roots[x] - roots[y]) : [];
    const order = [.../* @__PURE__ */ new Set([...required, ...missing, ...stalest])].filter((r) => !asked.has(r));
    const failedRecently = (r) => failedAt.has(r) && clock2.now() - failedAt.get(r) < REFRESH_GAP_MS;
    if (cur) return order.find((r) => !failedRecently(r)) ?? null;
    return [...order].sort((x, y) => (failedAt.get(x) ?? -Infinity) - (failedAt.get(y) ?? -Infinity))[0] ?? null;
  }
  async function rootSlice(root, deadline) {
    const r = await sharedFetchRoot(root, deadline);
    if (r.error !== null) {
      failedAt.set(root, clock2.now());
      return r;
    }
    failedAt.delete(root);
    const at = clock2.now();
    trees.set(root, { sections: r.sections, at });
    const news = !current || !(root in current.roots) || stale(current.roots[root]);
    const roots = { ...current ? current.roots : {}, ...news ? { [root]: at } : {} };
    if (KINDS.every(({ root: k }) => trees.has(k) && !stale(trees.get(k).at))) {
      const rows2 = classify(Object.fromEntries(KINDS.map(({ root: k }) => [k, trees.get(k).sections])));
      const everyRoot = KINDS.map(({ root: k }) => k);
      current = { rows: rows2, roots: Object.fromEntries(everyRoot.map((k) => [k, trees.get(k).at])), whole: new Set(everyRoot), withAll: new Set(everyRoot) };
    } else {
      const rows2 = mergeRoot(current ? current.rows : [], root, classify({ [root]: r.sections }));
      current = { rows: rows2, roots, whole: /* @__PURE__ */ new Set([...current ? current.whole : [], root]), withAll: /* @__PURE__ */ new Set([...current ? current.withAll : [], root]) };
    }
    if (news) dirty = true;
    return r;
  }
  let served = null;
  const servedNow = () => {
    const cur = getCurrent();
    if (!cur) return "none";
    if (KINDS.some(({ root }) => !(root in cur.roots))) return "partial";
    return KINDS.some(({ root }) => stale(cur.roots[root])) ? "cache" : "fresh";
  };
  async function buildRows(need = "full", budgetMs = CALL_BUDGET_MS.home, root = null) {
    const startedAt = clock2.now();
    getCurrent();
    const warm = current !== null;
    const phaseEnd = Math.min(startedAt + (warm ? WARM_REFRESH_MS : COLD_DEADLINE_MS), startedAt + budgetMs - SLICE_MARGIN_MS);
    const storedBefore = warm ? Object.keys(current.roots).length : 0;
    const failed = [];
    let got = 0;
    let ensuring = null;
    let ensureError = null;
    const asked = /* @__PURE__ */ new Set();
    const held = warm && refreshHeld();
    let refreshed = false;
    async function lane() {
      let next;
      while (ensureError === null && clock2.now() - startedAt < SLICE_START_MS && (next = nextRoot(need, root, asked, !held)) !== null) {
        asked.add(next);
        try {
          await (ensuring ?? (ensuring = session.ensure({ deadline: phaseEnd })));
        } catch (e) {
          ensureError = e;
          break;
        }
        if (current === null && failed.length === 0 && got === 0) trace(kino2, "home", "refresh", { why: "cold" });
        const refresh = warm && current !== null && next in current.roots;
        if (refresh && !refreshed) {
          refreshed = true;
          stamp(REFRESH_AT_KEY, SLOW_REFRESH_GAP_MS);
        }
        const r = await rootSlice(next, phaseEnd);
        if (r.error !== null) failed.push(r);
        else got++;
        if (refresh && clock2.now() - startedAt >= HEAVY_REFRESH_MS) markHeavy();
      }
    }
    await Promise.all(Array.from({ length: !warm && portalSlow() ? COLD_PARALLEL : 1 }, lane));
    if (ensureError !== null && !current) throw slowPortal(kino2, ensureError);
    if (dirty) save();
    if (refreshed) noteRefresh(clock2.now() - startedAt);
    const storedAfter = current ? Object.keys(current.roots).length : 0;
    if (storedAfter > storedBefore && storedBefore < KINDS.length) {
      trace(
        kino2,
        PERF_AREAS.cold,
        storedAfter === KINDS.length ? "done" : "progress",
        { stored: storedAfter, of: KINDS.length, b: msBucket(clock2.now() - startedAt) }
      );
    }
    const how = servedNow();
    served = { served: how, got, fail: failed.length, ...held && how !== "fresh" ? { held: 1 } : {} };
    if (current) return current.rows;
    if (failed.length > 0) {
      summarizeFailure(failed, 1);
      throw slowPortal(kino2, worstOf(failed));
    }
    return [];
  }
  function rowMissing() {
    const cur = getCurrent();
    if (!cur || KINDS.some(({ root }) => !(root in cur.roots))) {
      throw kino2.error("unavailable", "Xuper todavía está cargando su catálogo, intenta de nuevo en un momento");
    }
    throw kino2.error("not_found", "No se encontró esa lista");
  }
  async function home2() {
    const live2 = countryRow ? countryRow(Math.min(clock2.now() + LIVE_ROW_MS, callDeadline(clock2, CALL_BUDGET_MS.home))).catch(() => null) : Promise.resolve(null);
    const rows2 = projectRows(await buildRows("home", CALL_BUDGET_MS.home), clock2.now(), ids.lookup(), isEnglish(kino2), isSpanish(kino2));
    titles.rememberMovies(rows2.flatMap((r) => r.items));
    let warm = false;
    try {
      warm = kino2.config.get("warmSession") === true || JSON.parse(kino2.storage.get("warmSession")) === true;
    } catch (_) {
      warm = false;
    }
    if (warm) {
      try {
        session.ensure({ deadline: clock2.now() + SESSION_WARM_MS }).catch(() => {
        });
      } catch (_) {
      }
    }
    const row2 = await live2;
    return row2 ? [...rows2.slice(0, MAX_HOME_ROWS - 1), row2] : rows2;
  }
  let adultInflight = null;
  let adultIds = /* @__PURE__ */ new Set();
  async function fetchAdult(deadline) {
    await session.ensure({ deadline });
    const response = await session.withValidSession((v) => portal.call(
      "getNextColumns",
      { columnCode: ADULT_ROOT_CODE, pageNum: 1, pageSize: TREE_PAGE_SIZE, version: "" },
      viewOpts(v)
    ), { deadline });
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const listed = /* @__PURE__ */ new Set();
    for (const s of parseTree(response)) {
      for (const item of s.items) {
        listed.add(item.id);
        if (isSeries(item.type) || seen.has(item.id)) continue;
        seen.add(item.id);
        out.push(item);
      }
    }
    if (listed.size > 0) adultIds = listed;
    return out;
  }
  function adultMovies(deadline) {
    if (!adultInflight) adultInflight = fetchAdult(deadline).finally(() => {
      adultInflight = null;
    });
    return adultInflight;
  }
  const adultWithin = async (budgetMs) => {
    try {
      return await adultMovies(Math.min(clock2.now() + COLD_DEADLINE_MS, callDeadline(clock2, budgetMs)));
    } catch (e) {
      throw slowPortal(kino2, e);
    }
  };
  async function browseAdult(cursor) {
    const all = oneEach(await adultWithin(CALL_BUDGET_MS.browse));
    const offset = offsetOf(cursor);
    const nowMs = clock2.now();
    const idsOf = ids.lookup();
    const items = all.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null).map((i) => ({ ...i, adult: true }));
    const next = offset + BROWSE_PAGE;
    return next < all.length ? { items, next: String(next) } : { items };
  }
  async function browse2(ref, cursor) {
    if (ref === ADULT_REF) return browseAdult(cursor);
    const row2 = typeof ref === "string" ? (await buildRows("full", CALL_BUDGET_MS.browse, rootOfRow(ref))).find((r) => r.id === ref) : void 0;
    if (!row2) rowMissing();
    const offset = offsetOf(cursor);
    const nowMs = clock2.now();
    const list = oneEach(row2.all ?? (offset === 0 ? row2.shown : []));
    const idsOf = ids.lookup();
    const items = list.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null);
    titles.rememberMovies(items);
    const next = offset + BROWSE_PAGE;
    return row2.all && next < list.length ? { items, next: String(next) } : { items };
  }
  const { search: globalSearch } = makeSearch({ kino: kino2, portal, session, clock: clock2, tmdb, isAdultId: (id) => adultIds.has(id), idsLookup: ids.lookup, onItems: (items) => titles.rememberMovies(items) });
  async function searchWithin(query) {
    const q = typeof query.q === "string" ? query.q.trim() : "";
    if (q === "") return { items: [] };
    const within = query.within;
    if (isLiveTileRef(within)) return null;
    const adult = within === ADULT_REF;
    let pool;
    if (adult) {
      pool = await adultWithin(CALL_BUDGET_MS.search);
    } else {
      const row2 = typeof within === "string" ? (await buildRows("full", CALL_BUDGET_MS.search, rootOfRow(within))).find((r) => r.id === within) : void 0;
      if (!row2) return null;
      pool = row2.all ?? row2.shown;
    }
    const ranked = oneEach(rankWithin(kino2, pool, q));
    const offset = offsetOf(query.cursor);
    const nowMs = clock2.now();
    const idsOf = ids.lookup();
    const items = ranked.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null).map((i) => adult ? { ...i, adult: true } : i);
    const next = offset + BROWSE_PAGE;
    return next < ranked.length ? { items, next: String(next) } : { items };
  }
  async function search2(query) {
    if (query !== null && typeof query === "object" && query.within !== void 0 && query.within !== null) return searchWithin(query);
    return globalSearch(query);
  }
  const portalChapters = makePortalChapters({ kino: kino2, portal, session, clock: clock2, onServed: (how) => {
    served = { served: how };
  }, ids });
  const episodes2 = makeEpisodes({ kino: kino2, tmdb, portalChapters, clock: clock2, ids });
  const details2 = makeDetails({ kino: kino2, tmdb, portalChapters, clock: clock2, ids, titles });
  const rows = (need = "full", root = null) => buildRows(need, CALL_BUDGET_MS[need] ?? CALL_BUDGET_MS.home, root);
  const servedBy2 = () => {
    const out = served ?? {};
    served = null;
    return out;
  };
  const idsLookup = () => ids.lookup();
  const peek = () => {
    const cur = getCurrent();
    return cur ? { rows: cur.rows, roots: { ...cur.roots }, whole: [...cur.whole] } : null;
  };
  async function homeCurated(deadline) {
    await session.ensure({ deadline });
    const response = await session.withValidSession(
      (v) => portal.call("getHome", { homePageCode: "", version: "" }, viewOpts(v)),
      { deadline }
    );
    const sections = parseTree(response);
    if (sections.length === 0) return [];
    const nowMs = clock2.now();
    const en = isEnglish(kino2);
    const es = isSpanish(kino2);
    const idsOf = ids.lookup();
    const rows = [];
    for (const s of sections) {
      const items = s.items.map((it) => projectItem(it, nowMs, idsOf, en, es)).filter((i) => i !== null).slice(0, MAX_ROW_ITEMS);
      if (items.length > 0) rows.push({ title: s.name, items });
    }
    return rows.slice(0, MAX_HOME_ROWS);
  }
  return { home: home2, homeCurated, browse: browse2, rows, peek, search: search2, episodes: episodes2, details: details2, portalChapters, servedBy: servedBy2, idsLookup };
}
var TMDB_BASE = "https://api.themoviedb.org/3";
var TMDB_LANGUAGE = "es-MX";
var TIMEOUT_MS = 8e3;
var MIN_TIMEOUT_MS = 500;
var IMG = "https://image.tmdb.org/t/p";
var IMDB_ID = /^tt\d{7,}$/;
var text = (v) => typeof v === "string" ? v : "";
var blank3 = (s) => s.trim() === "";
var AIR_DATE = /^\d{4}-\d{2}-\d{2}$/;
var MIN_RUNTIME = 1;
var MAX_RUNTIME = 1e3;
function bodyOf(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_) {
      return null;
    }
  }
  return body !== null && typeof body === "object" ? body : null;
}
function parseTitleForms(type, body) {
  const o = bodyOf(body);
  if (o === null || typeof o !== "object" || Array.isArray(o)) return null;
  const isTv = type === "tv";
  const localized = text(isTv ? o.name : o.title);
  const original = text(isTv ? o.original_name : o.original_title);
  const list = o.translations && Array.isArray(o.translations.translations) ? o.translations.translations : [];
  const entries = list.filter((t) => t !== null && typeof t === "object");
  const titleOf = (t) => t.data !== null && typeof t.data === "object" ? text(isTv ? t.data.name : t.data.title) : "";
  const englishEntry = entries.find((t) => t.iso_639_1 === "en");
  const spanish = [];
  const seen = /* @__PURE__ */ new Set();
  for (const t of entries) {
    if (t.iso_639_1 !== "es") continue;
    const title2 = titleOf(t);
    const key = title2.trim().toLowerCase();
    if (blank3(title2) || key === localized.toLowerCase() || seen.has(key)) continue;
    seen.add(key);
    spanish.push(title2);
  }
  return {
    title: localized,
    originalTitle: original,
    englishTitle: englishEntry ? titleOf(englishEntry) : "",
    spanishTitles: spanish
  };
}
var INT6 = /^[+-]?\d+$/;
function optInt2(v) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && INT6.test(v.trim())) return Number(v.trim());
  return 0;
}
var imageUrl = (path, size) => typeof path !== "string" || blank3(path) || path === "null" ? "" : `${IMG}/${size}${path}`;
function parseSeriesByImdb(body) {
  const o = bodyOf(body);
  const tv = isObject(o) && Array.isArray(o.tv_results) && isObject(o.tv_results[0]) ? o.tv_results[0] : null;
  if (tv === null) return null;
  const tmdbId = optInt2(tv.id);
  if (tmdbId <= 0) return null;
  return { tmdbId, title: text(tv.name), poster: imageUrl(tv.poster_path, "w500"), backdrop: imageUrl(tv.backdrop_path, "w1280") };
}
var plainWords2 = (t) => String(t).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function pickSeriesByTitle(body, title2) {
  const r = pickResultByTitle(body, title2, "name", "original_name");
  return r === null ? null : { tmdbId: optInt2(r.id), title: text(r.name), poster: imageUrl(r.poster_path, "w500"), backdrop: imageUrl(r.backdrop_path, "w1280") };
}
function pickMovieByTitle(body, title2, year = "") {
  const wanted = /^\d{4}$/.test(String(year ?? "").trim()) ? String(year).trim() : "";
  let source = body;
  let sameYear = [];
  if (wanted) {
    const o = bodyOf(body);
    if (isObject(o) && Array.isArray(o.results)) {
      sameYear = o.results.filter((r2) => isObject(r2) && optInt2(r2.id) > 0 && text(r2.release_date).startsWith(wanted));
      if (sameYear.length > 0) source = { results: sameYear };
    }
  }
  const r = pickResultByTitle(source, title2, "title", "original_title");
  if (r !== null) return { tmdbId: optInt2(r.id), title: text(r.title) };
  if (wanted && sameYear.length === 1) {
    const only = sameYear[0];
    const want = plainWords2(title2).split(" ").filter((w) => w !== "");
    if (want.length >= 2) {
      const have = /* @__PURE__ */ new Set([...plainWords2(text(only.title)).split(" "), ...plainWords2(text(only.original_title)).split(" ")]);
      if (want.filter((w) => have.has(w)).length / want.length >= 0.75) return { tmdbId: optInt2(only.id), title: text(only.title) };
    }
  }
  return null;
}
function pickResultByTitle(body, title2, nameKey, originalKey) {
  const o = bodyOf(body);
  const want = plainWords2(title2);
  if (!isObject(o) || !Array.isArray(o.results) || want === "") return null;
  const hits = o.results.filter((r) => isObject(r) && optInt2(r.id) > 0).slice(0, 10);
  const forms = (r) => [plainWords2(text(r[nameKey])), plainWords2(text(r[originalKey]))];
  const exact = hits.filter((r) => forms(r).includes(want));
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return null;
  const words = want.split(" ");
  const holding = hits.filter((r) => forms(r).some((f) => {
    const fw = f.split(" ");
    return words.every((w) => fw.includes(w));
  }));
  if (holding.length === 1) return holding[0];
  if (holding.length > 1) {
    const ranked = holding.slice().sort((a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0));
    if ((Number(ranked[0].popularity) || 0) >= 2 * (Number(ranked[1].popularity) || 0) && (Number(ranked[0].popularity) || 0) > 0) return ranked[0];
  }
  return null;
}
function parseSeasonEpisodes(body) {
  const o = bodyOf(body);
  if (!isObject(o)) return null;
  const list = Array.isArray(o.episodes) ? o.episodes : [];
  return list.filter(isObject).map((e) => {
    const episode = optInt2(e.episode_number);
    const name = text(e.name);
    const airDate = text(e.air_date).trim();
    const runtime = optInt2(e.runtime);
    return {
      episode,
      name: blank3(name) ? `Episodio ${episode}` : name,
      overview: text(e.overview),
      still: imageUrl(e.still_path, "w300"),
      airDate: AIR_DATE.test(airDate) ? airDate : "",
      runtimeMinutes: runtime >= MIN_RUNTIME && runtime <= MAX_RUNTIME ? runtime : 0
    };
  });
}
function makeTmdb({ kino: kino2, clock: clock2 = null }) {
  const recentDetails = new Map();
  const detailTtlMs = 10 * 60 * 1000;
  const detailLimit = 16;
  const now = () => clock2 ? clock2.now() : Date.now();
  function timeoutFor(bounds) {
    const deadline = bounds && typeof bounds.deadline === "number" && clock2 ? bounds.deadline : null;
    if (deadline === null) return TIMEOUT_MS;
    const ms = Math.min(TIMEOUT_MS, Math.floor(deadline - clock2.now()));
    return ms >= MIN_TIMEOUT_MS ? ms : null;
  }
  function keyMarker() {
    try {
      return kino2.secret("tmdbKey");
    } catch (_) {
      return null;
    }
  }
  async function titleForms(type, id, bounds) {
    try {
      if (!Number.isInteger(id) || id <= 0) return null;
      const kind = type === "movie" ? "movie" : "tv";
      const body = await read(`/${kind}/${id}`, { language: TMDB_LANGUAGE, append_to_response: "translations" }, bounds);
      return body === null ? null : parseTitleForms(kind, body);
    } catch (_) {
      return null;
    }
  }
  async function read(path, params, bounds) {
    try {
      const timeoutMs = timeoutFor(bounds);
      if (timeoutMs === null) return null;
      const key = keyMarker();
      if (!key) return null;
      const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
      const res = await kino2.fetch(`${TMDB_BASE}${path}?api_key=${key}&${query}`, { cookies: false, timeoutMs });
      if (!res || !res.ok) return null;
      return res.text();
    } catch (_) {
      return null;
    }
  }
  async function seriesByImdb(imdbId, bounds) {
    if (typeof imdbId !== "string" || !IMDB_ID.test(imdbId)) return null;
    const body = await read(`/find/${imdbId}`, { external_source: "imdb_id", language: TMDB_LANGUAGE }, bounds);
    return body === null ? null : parseSeriesByImdb(body);
  }
  async function seriesByTitle(title2, bounds) {
    if (typeof title2 !== "string" || title2.trim() === "") return null;
    const body = await read("/search/tv", { query: title2.trim(), language: TMDB_LANGUAGE }, bounds);
    return body === null ? null : pickSeriesByTitle(body, title2);
  }
  async function movieByTitle(title2, bounds, year = "") {
    if (typeof title2 !== "string" || title2.trim() === "") return null;
    const params = { query: title2.trim(), language: TMDB_LANGUAGE };
    if (/^\d{4}$/.test(String(year ?? "").trim())) params.year = String(year).trim();
    const body = await read("/search/movie", params, bounds);
    try {
      const o = bodyOf(body);
      trace(kino2, "tmdb", "movie_search", { results: isObject(o) && Array.isArray(o.results) ? o.results.length : -1 });
    } catch (_) {
    }
    return body === null ? null : pickMovieByTitle(body, title2, year);
  }
  async function seriesSeasons(tvId, bounds) {
    if (!Number.isInteger(tvId) || tvId <= 0) return null;
    const body = await read(`/tv/${tvId}`, { language: TMDB_LANGUAGE }, bounds);
    return body === null ? null : parseSeasonCounts(body);
  }
  async function seasonEpisodes(tvId, season, language = TMDB_LANGUAGE, bounds) {
    if (!Number.isInteger(tvId) || tvId <= 0 || !Number.isInteger(season)) return null;
    const body = await read(`/tv/${tvId}/season/${season}`, { language }, bounds);
    return body === null ? null : parseSeasonEpisodes(body);
  }
  async function metadata(card, bounds) {
    if (!keyMarker()) return null;
    const kind = card.kind === "series" ? "tv" : "movie";
    let id = card.ids && card.ids.tmdb;
    if (!validTmdb(id)) {
      const hit = kind === "tv" ? await seriesByTitle(card.title, bounds) : await movieByTitle(card.title, bounds, card.year);
      id = hit && hit.tmdbId;
    }
    if (!validTmdb(id)) return null;
    const cacheKey = kind + "/" + id;
    const cached = recentDetails.get(cacheKey);
    if (cached && now() < cached.expiresAt) return cached.detail;
    recentDetails.delete(cacheKey);
    const raw = bodyOf(await read(`/${kind}/${id}`, {
      language: TMDB_LANGUAGE,
      append_to_response: "credits,images,release_dates,content_ratings",
      include_image_language: "es,en,null"
    }, bounds));
    if (!isObject(raw) || raw.id !== id) return { ids: { tmdb: id } };
    const image = (path, size) => typeof path === "string" && path.startsWith("/") ? imageUrl(path, size) : "";
    const list = (v) => Array.isArray(v) ? v.filter(isObject) : [];
    const date = text(raw.release_date || raw.first_air_date);
    const credits = raw.credits || {};
    const logos = list(raw.images && raw.images.logos);
    const logo2 = logos.find((l) => l.iso_639_1 === "es") || logos.find((l) => l.iso_639_1 === "en") || logos[0];
    const directors = kind === "tv" ? list(raw.created_by) : list(credits.crew).filter((c) => c.job === "Director");
    const ratings = kind === "tv" ? list(raw.content_ratings && raw.content_ratings.results) : list(raw.release_dates && raw.release_dates.results);
    const regional = ratings.find((r) => r.iso_3166_1 === "MX") || ratings.find((r) => r.iso_3166_1 === "US");
    const certificate = kind === "tv" ? regional && regional.rating : list(regional && regional.release_dates).find((r) => text(r.certification))?.certification;
    const backdrop = image(raw.backdrop_path, "w1280");
    const detail = {
      ids: { tmdb: id },
      title: text(kind === "tv" ? raw.name : raw.title),
      year: /^\d{4}-/.test(date) ? Number(date.slice(0, 4)) : 0,
      overview: text(raw.overview),
      tagline: text(raw.tagline),
      backdrop,
      poster: image(raw.poster_path, "w500"),
      images: backdropsOf(raw.images, backdrop),
      logo: image(logo2 && logo2.file_path, "w500"),
      genres: list(raw.genres).map((g) => text(g.name)).filter(Boolean),
      directors: directors.map((c) => text(c.name)).filter(Boolean),
      runtimeMinutes: Number(raw.runtime || (Array.isArray(raw.episode_run_time) ? raw.episode_run_time[0] : 0)) || 0,
      certification: text(certificate),
      ratings: raw.vote_count > 0 && Number.isFinite(raw.vote_average) ? [{ source: "tmdb", value: Math.round(raw.vote_average * 10) / 10 }] : [],
      cast: list(credits.cast).slice(0, MAX_CAST).filter((c) => text(c.name)).map((c) => ({ name: c.name, character: text(c.character), photo: image(c.profile_path, "w185") }))
    };
    if (recentDetails.size >= detailLimit) recentDetails.delete(recentDetails.keys().next().value);
    recentDetails.set(cacheKey, { detail, expiresAt: now() + detailTtlMs });
    return detail;
  }
  return { titleForms, seriesByImdb, seriesByTitle, movieByTitle, seriesSeasons, seasonEpisodes, metadata, available: () => !!keyMarker() };
}
var SLB_DEFAULT_TTL_S = 300;
var FOLLOW_UP_RESERVE_MS = 3e3;
var AUTH_MARGIN_S = 300;
var EXPIRED = /expired=(\d+)/;
var MAX_SUBTITLES = 30;
var MAX_ALTERNATIVES = 8;
var RETRY_COPIES = 3;
var RETRY_COPIES_SELF_RETRYING = 1;
var SELF_RETRYING_KINO = [0, 9, 54];
var APP_VERSION = /^(\d+)\.(\d+)\.(\d+)/;
var MAX_LABEL_CHARS = 48;
var EXPIRES_MIN_S = 30;
var EXPIRES_MAX_S = 86400;
var INT7 = /^[+-]?\d+$/;
function retryCopiesFor(kino2) {
  let version = "";
  try {
    version = kino2 && typeof kino2.appVersion === "string" ? kino2.appVersion.trim() : "";
  } catch (_) {
    return RETRY_COPIES;
  }
  const m = APP_VERSION.exec(version);
  if (!m) return RETRY_COPIES;
  const parts = m.slice(1, 4).map(Number);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== SELF_RETRYING_KINO[i]) return parts[i] > SELF_RETRYING_KINO[i] ? RETRY_COPIES_SELF_RETRYING : RETRY_COPIES;
  }
  return RETRY_COPIES_SELF_RETRYING;
}
var DIGITS = /^[0-9]+$/;
function isCfl(url) {
  return url.slice(url.lastIndexOf("?") + 1).split("&").some((p) => p.trim() === "sign_type=cfl");
}
function withScheme(mainAddr) {
  const clean = mainAddr.replace(/\/+$/, "");
  return clean.startsWith("http://") || clean.startsWith("https://") ? clean : `https://${clean}`;
}
function portalDurationMs(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw * 1e3) : 0;
  if (typeof raw !== "string") return 0;
  const text3 = raw.trim();
  if (text3 === "") return 0;
  const parts = text3.split(":");
  if (parts.length > 3 || parts.some((p) => !DIGITS.test(p))) return 0;
  return parts.reduce((acc, p) => acc * 60 + Number(p), 0) * 1e3;
}
var mediaScore = (m) => (optStringStrict(m.encodeFormat).toLowerCase() === "h264" ? 0 : 2) + (optStringStrict(m.videoFormat).toLowerCase() === "mp4" ? 0 : 1);
function selectPlaybackEpisode(play, chapter) {
  const rows = objects(play?.episodeList);
  if (!chapter) return rows[0];
  const requestedId = optStringStrict(chapter.contentId).trim();
  const requestedNumber = toIntOrNull2(optStringStrict(chapter.seriesNumber).trim());
  const numberOf = (row) => toIntOrNull2(optStringStrict(row.episodeNumber).trim());
  const sameId = requestedId ? rows.filter((row) => optStringStrict(row.programContentId).trim() === requestedId) : [];
  const candidates = sameId.length ? sameId : rows;
  if (requestedNumber > 0) {
    const matches = candidates.filter((row) => numberOf(row) === requestedNumber);
    if (matches.length) return matches.length === 1 || sameId.length ? matches[0] : void 0;
  }
  if (sameId.length) {
    const firstNumber = numberOf(sameId[0]);
    const oneEpisode = sameId.every((row) => numberOf(row) === firstNumber);
    if (oneEpisode && !(requestedNumber > 0 && firstNumber > 0)) return sameId[0];
  }
  // Older single-episode responses may omit the number or use zero for it.
  if (rows.length === 1 && !(requestedNumber > 0 && numberOf(rows[0]) > 0)) {
    if (!requestedId || !optStringStrict(rows[0].programContentId).trim()) return rows[0];
  }
  if (requestedNumber === 1 && candidates.every((row) => numberOf(row) === 0 || numberOf(row) > 1)) {
    const first = candidates.filter((row) => numberOf(row) === 0);
    if (first.length === 1) return first[0];
  }
}
function rankedMedia(episode) {
  if (!episode) return [];
  const candidates = objects(episode.totalMovieList).flatMap((group) => {
    return objects(group.movieList).map((track) => ({
      ...track,
      resolution: vodResolution(track) || vodResolution(group),
      quality: vodProviderTier(track.quality) || vodProviderTier(group.quality)
    }));
  }).filter((m) => notBlank(optStringStrict(m.contentId)));
  return candidates.map((m, i) => ({ m, i, s: mediaScore(m) })).sort((a, b) => a.s - b.s || a.i - b.i).map((x) => x.m);
}
function vodResolution(track) {
  for (const value of [track.videoHeight, track.height]) {
    const height = optStringStrict(value).trim();
    if (/^[1-9][0-9]{2,3}$/.test(height)) return height + "p";
  }
  for (const value of [track.resolution, track.screenFormat]) {
    const label = optStringStrict(value).trim();
    const dimensions = /^[1-9][0-9]{1,4}\s*[x×]\s*([1-9][0-9]{2,3})$/i.exec(label);
    if (dimensions) return dimensions[1] + "p";
    const pixels = /^([1-9][0-9]{2,3})p$/i.exec(label);
    if (pixels) return pixels[1] + "p";
  }
  return "";
}
function vodProviderTier(quality) {
  const tier = optStringStrict(quality).trim();
  if (/^[1-9][0-9]{2,3}p$/i.test(tier)) return tier.toLowerCase();
  return /^(sd|hd|fhd|full hd|uhd|4k|8k)$/i.test(tier) ? tier.toUpperCase() : "";
}
var CODEC_NAMES = { h264: "H.264", avc: "H.264", h265: "H.265", hevc: "H.265", av1: "AV1", vp9: "VP9" };
var codecName = (m) => {
  const raw = optStringStrict(m.encodeFormat).trim();
  return CODEC_NAMES[raw.toLowerCase()] ?? raw.toUpperCase();
};
var VOD_AUDIO_CODES = {
  ar: "AR",
  ara: "AR",
  de: "DE",
  deu: "DE",
  ger: "DE",
  el: "EL",
  ell: "EL",
  gre: "EL",
  en: "EN",
  eng: "EN",
  es: "ES",
  spa: "ES",
  fr: "FR",
  fra: "FR",
  fre: "FR",
  he: "HE",
  heb: "HE",
  hi: "HI",
  hin: "HI",
  id: "ID",
  ind: "ID",
  it: "IT",
  ita: "IT",
  ja: "JA",
  jpn: "JA",
  ko: "KO",
  kor: "KO",
  ms: "MS",
  msa: "MS",
  may: "MS",
  nl: "NL",
  nld: "NL",
  dut: "NL",
  pl: "PL",
  pol: "PL",
  pt: "PT",
  por: "PT",
  ru: "RU",
  rus: "RU",
  sv: "SV",
  swe: "SV",
  th: "TH",
  tha: "TH",
  tr: "TR",
  tur: "TR",
  uk: "UK",
  ukr: "UK",
  vi: "VI",
  vie: "VI",
  zh: "ZH",
  zho: "ZH",
  chi: "ZH"
};
function vodAudio(track) {
  const languages = /* @__PURE__ */ new Set();
  for (const entry of optStringStrict(track.audioInfo).split(",")) {
    const match = /^([a-z]{2,3})(?:[-_]([a-z]{2}|[0-9]{3}))?$/i.exec(entry.trim());
    if (!match || !Object.hasOwn(VOD_AUDIO_CODES, match[1].toLowerCase())) continue;
    const language = VOD_AUDIO_CODES[match[1].toLowerCase()];
    languages.add(match[2] ? language + "-" + match[2].toUpperCase() : language);
  }
  return languages.size ? "Audio " + [...languages].join("/") : "";
}
function vodTrackPrefix(track, kino2) {
  const tier = vodProviderTier(track.quality);
  const quality = vodResolution(track) || (tier ? tier + (isEnglish(kino2) ? " (provider)" : " (proveedor)") : "");
  return [quality, codecName(track), vodAudio(track)].filter(Boolean).join(" · ");
}
function vodCopyLabel(first, metadata) {
  const parts = [first];
  for (let part of metadata.split(" · ").filter(Boolean)) {
    const room = MAX_LABEL_CHARS - parts.join(" · ").length - 3;
    if (part.length > room && part.startsWith("Audio ")) {
      const end = part.lastIndexOf("/", room - 1);
      part = end > 0 ? part.slice(0, end) + "…" : "";
    }
    if (part && part.length <= room) parts.push(part);
  }
  return parts.join(" · ");
}
function expiresInSeconds(auth, nowMs) {
  const m = EXPIRED.exec(typeof auth === "string" ? auth : "");
  if (!m) return null;
  const left = Number(m[1]) - Math.floor(nowMs / 1e3) - AUTH_MARGIN_S;
  if (!Number.isFinite(left)) return null;
  return Math.min(EXPIRES_MAX_S, Math.max(EXPIRES_MIN_S, left));
}
var licenseOf = (m) => optStringStrict(objects(m.licenseList)[0]?.license);
function readSubtitles(episode) {
  const tracks = /* @__PURE__ */ new Map();
  const zuperTracks = !!globalThis.zuper && globalThis.zuper === globalThis.kino;
  for (const sub of objects(episode?.subtitleList)) {
    const language = optStringStrict(sub.language).trim();
    const tag = language.replace(/_/g, "-");
    const lang = tag.length <= 16 && /^[a-z]{2,3}(?:-[a-z0-9]{1,8})*$/i.test(tag) ? tag : "und";
    const label = optStringStrict(sub.transLanguage).trim() || (lang === "und" && language !== "und" ? language : "");
    for (const file of objects(sub.file)) {
      const url = optStringStrict(file.url).trim();
      if (!/^https?:\/\//i.test(url)) continue;
      let track = tracks.get(url);
      if (!track) {
        if (tracks.size >= MAX_SUBTITLES) continue;
        track = { url, lang };
        tracks.set(url, track);
      }
      if (track.lang === "und" && lang !== "und") track.lang = lang;
      if (zuperTracks && !track.label && label && label.length <= 60 && !/[\u0000-\u001f\u007f]/.test(label)) track.label = label;
      if (track.format || track.mime) continue;
      const format = optStringStrict(file.fileType).trim().toLowerCase();
      if (format === "srt" || format === "application/x-subrip") track.format = "srt";
      else if (format === "vtt" || format === "text/vtt") track.format = "vtt";
      else if (zuperTracks && ["ass", "ssa", "text/x-ssa"].includes(format)) track.mime = "text/x-ssa";
      else if (zuperTracks && ["ttml", "application/ttml+xml"].includes(format)) track.mime = "application/ttml+xml";
    }
  }
  return Array.from(tracks.values());
}
function vodCdns(slb) {
  const out = [];
  for (const cdn of objects(slb.cdn_list)) {
    if (optStringStrict(cdn.tag) !== "vod") continue;
    for (const u of objects(cdn.url_list)) {
      const url = optStringStrict(u.url);
      if ((isCfl(url) || optStringStrict(u.sign_type) === "cfl") && optStringStrict(u.tag) === "free") {
        const bases = [withScheme(optStringStrict(cdn.main_addr))];
        const spare = optStringStrict(cdn.spared_addr);
        if (notBlank(spare) && !bases.includes(withScheme(spare.trim()))) bases.push(withScheme(spare.trim()));
        out.push({ bases, auth: url });
        break;
      }
    }
  }
  return out;
}
function vodCdn(slb) {
  const first = vodCdns(slb)[0];
  return first ? { base: first.bases[0], auth: first.auth } : null;
}
function slbLifetime(slb, nowMs) {
  const text3 = optStringStrict(slb.invalidTime);
  const declaredN = INT7.test(text3) ? Number(text3) : NaN;
  const declared = declaredN > 0 ? declaredN : SLB_DEFAULT_TTL_S;
  const cdn = vodCdn(slb);
  if (!cdn) return 0;
  const m = EXPIRED.exec(cdn.auth);
  if (!m) return declared;
  return Math.min(declared, Number(m[1]) - Math.floor(nowMs / 1e3) - AUTH_MARGIN_S);
}
var slbBean = (apkVersion, liveCodes = ["masnew_live"]) => ({
  hasPay: "0",
  userIdentity: "1",
  type: "merge",
  appVer: apkVersion,
  lang: "es",
  encMediaSupported: 1,
  liveCodeList: [...liveCodes],
  appParams: "",
  reserve1: FIXED_MAC,
  pipFlag: "0"
});
function makeResolve({ kino: kino2, portal, session, clock: clock2, config, portalChapters, live: live2 = null }) {
  const unavailable = (text3) => kino2.error("unavailable", text3);
  let slbCache = null;
  const slbFor = async (v) => {
    if (slbCache && slbCache.token === v.userToken && clock2.now() < slbCache.expiresMs) return slbCache.slb;
    const answer = await portal.call("v15/getSlbInfo", slbBean(config.apkVersion), viewOpts(v));
    const fresh = isObject(answer) ? answer : {};
    const ttl = slbLifetime(fresh, clock2.now());
    slbCache = ttl > 0 ? { slb: fresh, token: v.userToken, expiresMs: clock2.now() + ttl * 1e3 } : null;
    return fresh;
  };
  async function chapterFrom(magis, deadline) {
    const { items } = await portalChapters(magis.contentId, deadline);
    if (items.length === 0) throw unavailable(`la serie ${magis.contentId} vino sin capítulos`);
    const chapter2 = findChapter(items, magis.episode);
    if (!chapter2) throw unavailable(`la serie no tiene el capítulo ${magis.episode}`);
    return chapter2;
  }
  async function resolveVod(magis, chapter2, deadline) {
    await session.ensure({ deadline: deadline - FOLLOW_UP_RESERVE_MS });
    const contentId = chapter2 && notBlank(chapter2.contentId) ? chapter2.contentId : magis.contentId;
    const play = await session.withValidSession((v) => {
      return portal.call(
        "v10/startPlayVOD",
        { contentId, seriesContentId: chapter2 ? magis.contentId : "", startTime: 0, type: "1", columnId: 0, authType: "" },
        viewOpts(v)
      );
    }, { deadline: deadline - FOLLOW_UP_RESERVE_MS });
    const episode = selectPlaybackEpisode(play, chapter2);
    const tracks = rankedMedia(episode);
    const best = tracks[0];
    if (!best) throw unavailable("Xuper devolvió sin media reproducible");
    const license = licenseOf(best);
    if (!notBlank(license)) throw unavailable("Xuper devolvió sin licenseList");
    const cdns = vodCdns(await session.withValidSession(slbFor, { deadline }));
    if (cdns.length === 0) throw unavailable("Xuper no expuso CDN de vod con token libre");
    const copies = [];
    const seen = /* @__PURE__ */ new Set();
    const seenTracks = /* @__PURE__ */ new Set();
    const prefixes = /* @__PURE__ */ new Set();
    for (const track of tracks) {
      const id = optStringStrict(track.contentId);
      const trackLicense = track === best ? license : licenseOf(track);
      if (track !== best && (!notBlank(id) || !notBlank(trackLicense) || seenTracks.has(id))) continue;
      seenTracks.add(id);
      let prefix = vodTrackPrefix(track, kino2);
      if (!prefix && track !== best) prefix = say(kino2, "versionN", { n: seenTracks.size });
      if (prefixes.has(prefix)) prefix += ` (${seenTracks.size})`;
      prefixes.add(prefix);
      const ext = optStringStrict(track.videoFormat).toLowerCase() === "ts" ? "ts" : "mp4";
      for (const [ci, cdn] of cdns.entries()) {
        for (const [bi, base] of cdn.bases.entries()) {
          const url = `${base}/vod/${id}_media.${ext}`;
          if (seen.has(url)) continue;
          seen.add(url);
          const server = `${say(kino2, "server", { n: ci + 1 })}${bi > 0 ? ` · ${say(kino2, "backup")}` : ""}`;
          copies.push({
            url,
            label: vodCopyLabel(server, prefix),
            mime: ext === "mp4" ? "video/mp4" : "video/mp2t",
            headers: {
              "Content-Auth": cdn.auth,
              // the querystring verbatim: VOD is not re-signed
              "Content-License": trackLicense,
              "User-Agent": UA_CDN,
              App: config.appId,
              "App-Version": config.apkVersion
            }
          });
        }
      }
    }
    const bestCopy = copies[0];
    const retryCopies = retryCopiesFor(kino2);
    for (let n = 1; bestCopy && n <= retryCopies && copies.length <= MAX_ALTERNATIVES; n++) {
      copies.push({
        ...bestCopy,
        url: `${bestCopy.url}${bestCopy.url.includes("?") ? "&" : "?"}retry=${n}`,
        label: vodCopyLabel(say(kino2, "retry", { n }), bestCopy.label)
      });
    }
    const [first, ...others] = copies;
    const alternatives = others.slice(0, MAX_ALTERNATIVES);
    if (alternatives.length > 0) trace(kino2, "resolve", "alts", { n: alternatives.length, tracks: seenTracks.size, cdns: cdns.length });
    const expires = expiresInSeconds(first.headers["Content-Auth"], clock2.now());
    return {
      ...first,
      subtitles: readSubtitles(episode),
      // A chapter's own declared duration wins (the portal sends it empty for most series).
      durationMs: chapter2 ? portalDurationMs(chapter2.duration) : portalDurationMs(best.duration),
      ...expires !== null ? { expiresInSeconds: expires } : {},
      ...alternatives.length > 0 ? { alternatives } : {}
    };
  }
  async function resolve2(ref, options) {
    if (live2 && isChannelRef(ref)) return live2.resolveLive(codeOfRef(ref), options);
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.resolve);
    try {
      const magis = decode(ref);
      if (!magis) throw unavailable("ese ref no es de Xuper: no se puede reproducir");
      const chapter2 = magis.isSeries ? await chapterFrom(magis, deadline - 2 * FOLLOW_UP_RESERVE_MS) : null;
      return await resolveVod(magis, chapter2, deadline);
    } catch (e) {
      if (e instanceof PortalError) throw mapPortalError(e.code, e.message, kino2);
      if (isKinoError(e)) throw e;
      throw unavailable("Xuper no está disponible ahora");
    }
  }
  return { resolve: resolve2 };
}
var CATEGORIES_BY_COUNTRY = Object.freeze({
  CO: "Colombia",
  VE: "Venezuela",
  EC: "Ecuador",
  CL: "Chile",
  MX: "México",
  PE: "Perú",
  BO: "Bolivia",
  UY: "Uruguay",
  PY: "Paraguay",
  PA: "Panamá",
  PR: "Puerto Rico",
  ES: "España",
  CR: "Costa Rica",
  US: "Estados Unidos",
  HN: "Honduras",
  SV: "El Salvador",
  DO: "República Dominicana",
  GT: "Centroamérica",
  NI: "Centroamérica",
  BZ: "Centroamérica"
});
var COUNTRY_OPTIONS = Object.freeze([
  { value: "none", label: "Ninguno" },
  { value: "BO", label: "Bolivia" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "CR", label: "Costa Rica" },
  { value: "EC", label: "Ecuador" },
  { value: "SV", label: "El Salvador" },
  { value: "ES", label: "España" },
  { value: "US", label: "Estados Unidos" },
  { value: "GT-NI-BZ", label: "Guatemala, Nicaragua o Belice" },
  { value: "HN", label: "Honduras" },
  { value: "MX", label: "México" },
  { value: "PA", label: "Panamá" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Perú" },
  { value: "PR", label: "Puerto Rico" },
  { value: "DO", label: "República Dominicana" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" }
]);
var OPTION_GROUPS = Object.freeze({ "GT-NI-BZ": Object.freeze(["GT", "NI", "BZ"]) });
function countriesOf(value) {
  if (typeof value !== "string") return [];
  if (Object.hasOwn(OPTION_GROUPS, value)) return [...OPTION_GROUPS[value]];
  return Object.hasOwn(CATEGORIES_BY_COUNTRY, value) ? [value] : [];
}
var HOME_COUNTRY_SETTING = "homeCountry";
var COUNTRY_ROW_ID = "live-country";
var COUNTRY_ROW_LIMIT = 20;
function makeCountryRow({ kino: kino2, live: live2 }) {
  return async function countryRow(deadline) {
    try {
      const names = [...new Set(countriesOf(kino2.config.get(HOME_COUNTRY_SETTING)).map((cc) => CATEGORIES_BY_COUNTRY[cc]))];
      if (names.length === 0) return null;
      const all = await live2.categoriesWithin(deadline);
      const categories2 = names.map((n) => all.find((c) => c.name === n)).filter(Boolean);
      const channels = [];
      const seen = /* @__PURE__ */ new Set();
      for (const category of categories2) {
        if (channels.length >= COUNTRY_ROW_LIMIT) break;
        for (const c of await live2.channelsWithin(category.id, deadline)) if (!seen.has(c.id) && seen.add(c.id)) channels.push(c);
      }
      const items = channels.slice(0, COUNTRY_ROW_LIMIT).map((c) => {
        const item = { kind: "live", id: c.id, title: c.title, ref: c.ref };
        if (c.logo) item.poster = c.logo;
        if (c.adult === true) item.adult = true;
        return item;
      });
      return items.length > 0 ? { id: COUNTRY_ROW_ID, title: say(kino2, "liveChannelsRow"), items } : null;
    } catch (e) {
      trace(kino2, "home", "live_row_fail", { code: errCode(e) });
      return null;
    }
  };
}
var LIVE_ROOT = "masnew_live";
var CATEGORIES_PAGE_SIZE = 200;
var LIST_PAGE_SIZE = 250;
var LIST_MAX_PAGES = 20;
var SWEEP_PAGE_SIZE = 500;
var MAX_PAGES2 = 10;
var MAX_CATEGORIES = 200;
var ID2 = /^[A-Za-z0-9._~-]{1,128}$/;
var POSITIVE = /^\d{1,9}$/;
var SEARCH_INDEX_TTL_MS = 60 * 6e4;
var PARTIAL_INDEX_TTL_MS = 3 * 6e4;
var MAX_SEARCH_HITS = 100;
var MIN_SEARCH_CHARS = 2;
var CATEGORIES_KEY = "liveCats:v2";
var OLD_CATEGORIES_KEYS = ["liveCats:v1"];
var CATEGORIES_TTL_MS = 12 * 36e5;
var LOGOS_KEY = "liveLogos:v1";
var LOGOS_TTL_MS = 7 * 24 * 36e5;
var MAX_LOGO_CHARS = 512;
var plain2 = (text3) => String(text3).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/\s+/g, " ").trim();
var ALL_CHANNELS = "ChannelList";
var NAMES = { [ALL_CHANNELS]: "Todos" };
var ADULT_NAMES = /* @__PURE__ */ new Set(["18+", "adultos", "adulto", "xxx", "+18"]);
var GENRE_BY_NAME = new Map(Object.entries({
  deportes: "deportes",
  deporte: "deportes",
  sports: "deportes",
  futbol: "deportes",
  noticias: "noticias",
  news: "noticias",
  infantil: "infantil",
  infantiles: "infantil",
  kids: "infantil",
  ninos: "infantil",
  musica: "musica",
  music: "musica",
  documentales: "documentales",
  documental: "documentales",
  peliculas: "peliculas",
  series: "series",
  anime: "anime",
  entretenimiento: "entretenimiento"
}));
var genreOfCategory = (name) => GENRE_BY_NAME.get(plain2(name)) ?? null;
var TILE_GENRE_BY_NAME = new Map(Object.entries({ "cine y series": "cineyseries" }));
var tileGenreOfCategory = (name) => genreOfCategory(name) ?? TILE_GENRE_BY_NAME.get(plain2(name)) ?? null;
var COUNTRY_BY_NAME = (() => {
  const codes = /* @__PURE__ */ new Map();
  for (const [cc, name] of Object.entries(CATEGORIES_BY_COUNTRY)) codes.set(plain2(name), codes.has(plain2(name)) ? null : cc);
  return codes;
})();
var countryOfCategory = (name) => COUNTRY_BY_NAME.get(plain2(name)) ?? null;
function displayLiveTitle(raw) {
  const title2 = raw.trim().replace(/\s+/g, " ");
  const prefix = /^(?:[┃│║|]([A-Z]{2})[┃│║|]|\[([A-Z]{2})\]|([A-Z]{2})(?:\s*[┃│║▎•:]|\s+[-–—]\s+))\s*(.+)$/u.exec(title2);
  const suffix = prefix ? null : /^(.+?)\s*[┃│║▎|]\s*([A-Z]{2})[┃│║▎|]?$/u.exec(title2);
  if (!prefix && !suffix) return title2;
  const country = prefix ? prefix[1] || prefix[2] || prefix[3] : suffix[2];
  const station = (prefix ? prefix[4] : suffix[1]).trim();
  return Object.hasOwn(CATEGORIES_BY_COUNTRY, country) && /[\p{L}\p{N}]/u.test(station) ? station + " · " + country : title2;
}
function displayedLiveChannels(items) {
  const labels = items.map((item) => displayLiveTitle(item.title));
  const first = /* @__PURE__ */ new Map();
  const ambiguous = /* @__PURE__ */ new Set();
  for (let i = 0; i < items.length; i++) {
    const key = plain2(labels[i]);
    if (first.has(key) && first.get(key) !== items[i].title) ambiguous.add(key);
    else first.set(key, items[i].title);
  }
  return items.map((item, i) => labels[i] === item.title || ambiguous.has(plain2(labels[i])) ? item : { ...item, title: labels[i] });
}
function rankLiveTitle(name, query) {
  const text2 = plain2(name);
  if (text2.startsWith(query)) return 1;
  if (text2.includes(" " + query)) return 2;
  return text2.includes(query) ? 3 : Infinity;
}
function liveDial(value) {
  if (typeof value !== "number" && typeof value !== "string") return 0;
  const n = intOrNull(value);
  return n !== null && n >= 1 && n <= 9999 ? n : 0;
}
function makeLiveCatalog({ kino: kino2, portal, session, clock: clock2 }) {
  let adultIds = null;
  let genreById = null;
  const surface = (e) => {
    if (e instanceof PortalError) return mapPortalError(e.code, e.message, kino2);
    if (isKinoError(e)) return e;
    return kino2.error("unavailable", "Xuper no está disponible ahora");
  };
  async function readCategories(deadline) {
    let response;
    try {
      await session.ensure({ deadline });
      response = await session.withValidSession(({ userId, userToken }) => portal.call(
        "getNextColumns",
        { columnCode: LIVE_ROOT, pageNum: 1, pageSize: CATEGORIES_PAGE_SIZE, version: "" },
        { baseFields: true, userId, userToken, deadline }
      ), { deadline });
    } catch (e) {
      throw surface(e);
    }
    const columns = isObject(response) && Array.isArray(response.recommendList) ? response.recommendList : [];
    const out = [];
    for (const c of columns) {
      if (!isObject(c)) continue;
      const id = intOrNull(c.columnId);
      if (id === null || id <= 0) continue;
      const raw = asText(c.name);
      const name = Object.hasOwn(NAMES, raw) ? NAMES[raw] : raw;
      if (isBlank(name)) continue;
      out.push({ id: String(id), name, adult: ADULT_NAMES.has(name.trim().toLowerCase()), ...raw === ALL_CHANNELS ? { all: true } : {} });
    }
    if (out.length > 0) {
      adultIds = new Set(out.filter((c) => c.adult).map((c) => c.id));
      genreById = new Map(genreCategoriesOf(out).map((c) => [c.id, c.genre]));
      store(out);
    }
    return out;
  }
  const genreCategoriesOf = (list) => list.filter((c) => !c.adult && !c.all && POSITIVE.test(c.id) && Number(c.id) > 0).map((c) => ({ id: c.id, genre: tileGenreOfCategory(c.name) })).filter((c) => c.genre !== null);
  function store(list) {
    try {
      const rows = genreCategoriesOf(list).slice(0, MAX_CATEGORIES).map((c) => [c.id, c.genre]);
      kino2.storage.set(CATEGORIES_KEY, JSON.stringify(rows), { ttlMs: CATEGORIES_TTL_MS });
      for (const k of OLD_CATEGORIES_KEYS) kino2.storage.remove(k);
    } catch (_) {
    }
  }
  let logos;
  function genreLogos() {
    if (logos !== void 0) return logos;
    logos = {};
    try {
      const text3 = kino2.storage.get(LOGOS_KEY);
      const map = typeof text3 === "string" ? JSON.parse(text3) : null;
      if (isObject(map)) {
        for (const [g, url] of Object.entries(map)) if (usableLogo(url)) logos[g] = url;
      }
    } catch (_) {
    }
    return logos;
  }
  const usableLogo = (url) => typeof url === "string" && url.length <= MAX_LOGO_CHARS && url.startsWith("https://");
  function genreOfId(categoryId) {
    if (genreById !== null) return genreById.get(categoryId) ?? null;
    return storedGenreCategories()?.find((c) => c.id === categoryId)?.genre ?? null;
  }
  function noteLogo(categoryId, items) {
    try {
      const genre = genreOfId(categoryId);
      if (genre === null) return;
      const known = genreLogos();
      if (Object.hasOwn(known, genre)) return;
      const logo2 = items.find((c) => usableLogo(c.logo))?.logo;
      if (!logo2) return;
      logos = { ...known, [genre]: logo2 };
      kino2.storage.set(LOGOS_KEY, JSON.stringify(logos), { ttlMs: LOGOS_TTL_MS });
    } catch (_) {
    }
  }
  function storedGenreCategories() {
    try {
      const text3 = kino2.storage.get(CATEGORIES_KEY);
      if (typeof text3 !== "string") return null;
      const rows = JSON.parse(text3);
      if (!Array.isArray(rows)) return null;
      return rows.filter((r) => Array.isArray(r) && typeof r[0] === "string" && POSITIVE.test(r[0]) && typeof r[1] === "string").map((r) => ({ id: r[0], genre: r[1] }));
    } catch (_) {
      return null;
    }
  }
  async function liveCategories2() {
    const all = await readCategories(callDeadline(clock2, CALL_BUDGET_MS.liveCategories));
    return all.filter((c) => ID2.test(c.id)).slice(0, MAX_CATEGORIES).map((c) => {
      if (c.adult) return { id: c.id, title: c.name, adult: true };
      const out = { id: c.id, title: c.all ? say(kino2, "allChannels") : c.name };
      const country = countryOfCategory(c.name);
      if (country !== null) out.country = country;
      const genre = genreOfCategory(c.name);
      if (genre !== null) out.genre = genre;
      return out;
    });
  }
  async function isAdultCategory(id, deadline) {
    if (adultIds === null) {
      await readCategories(deadline);
      if (adultIds === null) throw kino2.error("unavailable", "Xuper no está disponible ahora");
    }
    return adultIds.has(id);
  }
  async function fetchPage(columnId, page, deadline, pageSize = LIST_PAGE_SIZE) {
    await session.ensure({ deadline });
    const response = await session.withValidSession(({ userId, userToken }) => portal.call(
      "v6/getLiveData",
      { columnId: Number(columnId), pageNum: page, pageSize, dataVersion: "", expireTimeStr: "" },
      { baseFields: true, userId, userToken, deadline }
    ), { deadline });
    return isObject(response) && Array.isArray(response.channelList) ? response.channelList : [];
  }
  function project(list, categoryId, adult, drops = {}, searchIndex = null) {
    const seen = /* @__PURE__ */ new Set();
    const items = [];
    const drop = (why) => {
      drops[why] = (drops[why] ?? 0) + 1;
    };
    for (const c of list) {
      if (!isObject(c)) {
        drop("shape");
        continue;
      }
      const code = asText(c.channelCode);
      const title2 = asText(c.name);
      if (isBlank(code) || isBlank(title2)) {
        drop("blank");
        continue;
      }
      const channel = channelOf(code);
      if (!channel) {
        drop("badid");
        continue;
      }
      if (seen.has(channel.id)) {
        drop("dup");
        continue;
      }
      seen.add(channel.id);
      const fixedNumber = liveDial(c.fixedChannelNumber);
      const number = liveDial(c.channelNumber) || fixedNumber;
      const item = { id: channel.id, title: title2, ref: channel.ref, categoryId, number };
      if (adult) item.adult = true;
      const logo2 = logoOf(c);
      if (logo2) item.logo = logo2;
      if (searchIndex && !searchIndex.has(item.id)) {
        searchIndex.set(item.id, {
          item: { ...item, adult },
          fixedNumber,
          alias: typeof c.alias === "string" ? plain2(c.alias) : "",
          keyWords: typeof c.keyWords === "string" ? plain2(c.keyWords) : ""
        });
      }
      items.push(item);
    }
    return items;
  }
  async function liveChannels2({ categoryId, cursor } = {}) {
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.liveChannels);
    if (typeof categoryId !== "string" || !POSITIVE.test(categoryId) || Number(categoryId) <= 0) {
      throw kino2.error("not_found", "No se encontró esa categoría");
    }
    const id = String(Number(categoryId));
    const page = typeof cursor === "string" && POSITIVE.test(cursor) && Number(cursor) >= 1 ? Number(cursor) : 1;
    if (page > LIST_MAX_PAGES) return { items: [] };
    try {
      const adult = await isAdultCategory(id, deadline);
      const list = await fetchPage(id, page, deadline);
      const drops = {};
      const items = displayedLiveChannels(project(list, id, adult, drops));
      if (!adult) noteLogo(id, items);
      trace(kino2, "live", "page", { cat: id, page, raw: list.length, kept: items.length, ...drops });
      return list.length >= LIST_PAGE_SIZE && page < LIST_MAX_PAGES ? { items, next: String(page + 1) } : { items };
    } catch (e) {
      if (page > 1) {
        trace(kino2, "live", "page_fail", { cat: id, page, code: errCode(e) });
        return { items: [] };
      }
      throw surface(e);
    }
  }
  const categoriesWithin = (deadline) => readCategories(deadline);
  async function channelsWithin(id, deadline) {
    const adult = await isAdultCategory(id, deadline);
    return displayedLiveChannels(project(await fetchPage(id, 1, deadline), id, adult));
  }
  let index = null;
  let partial = null;
  let sweeping = null;
  async function sweepCategory(category, into, deadline, read = { pages: 0 }) {
    for (let page = 1; page <= MAX_PAGES2; page++) {
      const list = await fetchPage(category.id, page, deadline, SWEEP_PAGE_SIZE);
      read.pages++;
      project(list, category.id, category.adult, {}, into);
      if (list.length < SWEEP_PAGE_SIZE) return;
    }
  }
  async function sweep(deadline) {
    const channels = /* @__PURE__ */ new Map();
    let complete = true;
    try {
      const all = (await readCategories(deadline)).filter((c) => ID2.test(c.id) && POSITIVE.test(c.id));
      if (all.length === 0) throw kino2.error("unavailable", "Xuper no está disponible ahora");
      for (const c of all.filter((c2) => c2.adult)) await sweepCategory(c, channels, deadline);
      const everything = all.find((c) => c.all && !c.adult);
      const plainOnes = everything ? [everything] : all.filter((c) => !c.adult);
      const read = { pages: 0 };
      for (const c of plainOnes) {
        try {
          await sweepCategory(c, channels, deadline, read);
        } catch (e) {
          if (read.pages === 0) throw e;
          complete = false;
          trace(kino2, "live", "search_partial", { code: errCode(e), pages: read.pages });
          break;
        }
      }
    } catch (e) {
      throw surface(e);
    }
    return { complete, channels };
  }
  async function channelIndex(deadline) {
    if (index && clock2.now() - index.atMs < SEARCH_INDEX_TTL_MS) return index.channels;
    if (partial && clock2.now() - partial.atMs < PARTIAL_INDEX_TTL_MS) return partial.channels;
    sweeping ?? (sweeping = sweep(deadline).finally(() => {
      sweeping = null;
    }));
    const { complete, channels } = await sweeping;
    if (complete) {
      index = { atMs: clock2.now(), channels };
      partial = null;
    } else partial = { atMs: clock2.now(), channels };
    return channels;
  }
  async function liveSearch2(arg) {
    const raw = isObject(arg) && typeof arg.query === "string" ? arg.query : "";
    const q = plain2(raw);
    if (q.length < MIN_SEARCH_CHARS) return { items: [] };
    const cursor = arg.cursor ?? "";
    if (typeof cursor !== "string" || cursor !== "" && !POSITIVE.test(cursor)) return { items: [] };
    const offset = Number(cursor);
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.liveSearch);
    const channels = await channelIndex(deadline);
    const n = POSITIVE.test(q) ? Number(q) : null;
    const hits = [];
    for (const { item, fixedNumber, alias, keyWords } of channels.values()) {
      let rank;
      if (n > 0 && item.number === n) rank = -1;
      else if (n > 0 && fixedNumber === n) rank = 0;
      else {
        rank = rankLiveTitle(item.title, q);
        const shown = displayLiveTitle(item.title);
        if (shown !== item.title) rank = Math.min(rank, rankLiveTitle(shown, q));
        if (rank === Infinity && (alias.includes(q) || keyWords.includes(q))) rank = 4;
      }
      if (rank < Infinity) hits.push({ item, rank, i: hits.length });
    }
    hits.sort((a, b) => a.rank - b.rank || a.i - b.i);
    const end = offset + MAX_SEARCH_HITS;
    const items = displayedLiveChannels(hits.slice(offset, end).map((h) => ({ ...h.item })));
    return end < hits.length ? { items, next: String(end) } : { items };
  }
  const genreCategories = async (deadline) => storedGenreCategories() ?? genreCategoriesOf(await readCategories(deadline));
  async function channelsPage(id, page, size, deadline) {
    const list = await fetchPage(id, page, deadline, size);
    const items = displayedLiveChannels(project(list, id, false));
    noteLogo(id, items);
    return { items, full: list.length >= size };
  }
  return { liveCategories: liveCategories2, liveChannels: liveChannels2, categoriesWithin, channelsWithin, liveSearch: liveSearch2, genreCategories, genreLogos, channelsPage, surface };
}
var K = Object.freeze([
  3614090360,
  3905402710,
  606105819,
  3250441966,
  4118548399,
  1200080426,
  2821735955,
  4249261313,
  1770035416,
  2336552879,
  4294925233,
  2304563134,
  1804603682,
  4254626195,
  2792965006,
  1236535329,
  4129170786,
  3225465664,
  643717713,
  3921069994,
  3593408605,
  38016083,
  3634488961,
  3889429448,
  568446438,
  3275163606,
  4107603335,
  1163531501,
  2850285829,
  4243563512,
  1735328473,
  2368359562,
  4294588738,
  2272392833,
  1839030562,
  4259657740,
  2763975236,
  1272893353,
  4139469664,
  3200236656,
  681279174,
  3936430074,
  3564056709,
  76029189,
  // [42] tweaked: standard d4ef3085
  3654602809,
  3871185381,
  530742520,
  3299628645,
  // [45] tweaked: standard e6db99e5
  4096336452,
  1126891415,
  2878612391,
  4237533241,
  1700485571,
  2399980690,
  4293706877,
  2240044497,
  // [54] tweaked: standard ffeff47d
  1873313359,
  4264355552,
  2734768916,
  1309151649,
  4149444226,
  3174756917,
  765973179,
  3951481745
  // [62] tweaked: standard 2ad7d2bb
]);
var TWEAKED_STEPS = Object.freeze([42, 45, 54, 62]);
var S = [
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21
];
var ROUND1 = [10, 11, 12, 13, 14, 15, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
var G = Array.from({ length: 64 }, (_, i) => i < 16 ? ROUND1[i] : i < 32 ? (5 * i + 1) % 16 : i < 48 ? (3 * i + 5) % 16 : 7 * i % 16);
var SALT = new Uint8Array([
  115,
  97,
  108,
  116,
  51,
  51,
  51,
  51,
  61,
  52,
  152,
  13,
  10,
  21,
  50,
  201,
  195,
  130,
  23,
  8,
  192
]);
var rotl = (x, n) => (x << n | x >>> 32 - n) >>> 0;
function compress(state, block, off) {
  const m = new Array(16);
  for (let j = 0; j < 16; j++) {
    const p = off + j * 4;
    m[j] = (block[p] | block[p + 1] << 8 | block[p + 2] << 16 | block[p + 3] << 24) >>> 0;
  }
  let [a, b, c, d] = state;
  for (let i = 0; i < 64; i++) {
    let f;
    if (i < 16) f = b & c | ~b & d;
    else if (i < 32) f = d & b | ~d & c;
    else if (i < 48) f = b ^ c ^ d;
    else f = c ^ (b | ~d);
    const sum = f + a + K[i] + m[G[i]] >>> 0;
    a = d;
    d = c;
    c = b;
    b = b + rotl(sum, S[i]) >>> 0;
  }
  state[0] = state[0] + a >>> 0;
  state[1] = state[1] + b >>> 0;
  state[2] = state[2] + c >>> 0;
  state[3] = state[3] + d >>> 0;
}
function digestHex(bytes) {
  const state = [1732584193, 4023233417, 2562383102, 271733878];
  const len = bytes.length;
  const padLen = (56 - (len + 1) % 64 + 64) % 64;
  const total = new Uint8Array(len + 1 + padLen + 8);
  total.set(bytes, 0);
  total[len] = 128;
  const low = len % 536870912 * 8;
  const high = Math.floor(len / 536870912);
  for (let i = 0; i < 4; i++) {
    total[len + 1 + padLen + i] = low >>> 8 * i & 255;
    total[len + 5 + padLen + i] = high >>> 8 * i & 255;
  }
  for (let off = 0; off < total.length; off += 64) compress(state, total, off);
  let out = "";
  for (const w of state) for (let i = 0; i < 4; i++) out += (w >>> 8 * i & 255).toString(16).padStart(2, "0");
  return out;
}
function signO3(token, startMomentMs) {
  const head = new TextEncoder().encode(
    `token=${token}&sign2_method=sign_o3&instance=0&start_moment=${startMomentMs}`
  );
  const msg = new Uint8Array(head.length + SALT.length);
  msg.set(head, 0);
  msg.set(SALT, head.length);
  return digestHex(msg);
}
var MAX_CONTEXT_CHARS = 4096;
var TOKEN = /token=([0-9A-Fa-f]{32})/;
var HEX32 = /^[0-9A-Fa-f]{32}$/;
var URL_AUTHORITY = /^[A-Za-z][A-Za-z0-9+.-]*:\/\/([^/?#]*)/;
function tokenOf(authBase) {
  const m = TOKEN.exec(typeof authBase === "string" ? authBase : "");
  return m ? m[1] : "";
}
var normalize = (authority) => String(authority).toLowerCase().replace(/:80$/, "");
function authorityOf(url) {
  const m = URL_AUTHORITY.exec(typeof url === "string" ? url : "");
  if (!m) return "";
  const at = m[1].lastIndexOf("@");
  return normalize(at >= 0 ? m[1].slice(at + 1) : m[1]);
}
function buildSignContext(license, cdns, builtAtMs) {
  const built = Number.isFinite(builtAtMs) ? { b: Math.trunc(builtAtMs / 1e3) } : {};
  const encode2 = (list, withToken) => JSON.stringify({
    l: license,
    c: list.map((d) => withToken ? { h: d.cflHost, a: d.authBase, t: tokenOf(d.authBase) } : { h: d.cflHost, a: d.authBase }),
    ...built
  });
  const full = encode2(cdns, true);
  if (full.length <= MAX_CONTEXT_CHARS) return { context: full, kept: cdns };
  for (let n = cdns.length; n >= 1; n--) {
    const kept = cdns.slice(0, n);
    const context = encode2(kept, false);
    if (context.length <= MAX_CONTEXT_CHARS) return { context, kept };
  }
  return null;
}
var signError = (why, message) => Object.assign(new Error(message), { why });
function readContext(context) {
  let ctx;
  try {
    ctx = JSON.parse(context);
  } catch (_) {
    ctx = null;
  }
  const ok = ctx && typeof ctx === "object" && typeof ctx.l === "string" && Array.isArray(ctx.c) && ctx.c.length > 0 && ctx.c.every((d) => d && typeof d.h === "string" && typeof d.a === "string");
  if (!ok) throw signError("context", "live signContext is not readable");
  return ctx;
}
function signRequest({ url, context }, nowMs) {
  const ctx = readContext(context);
  const want = authorityOf(url);
  const cdn = ctx.c.find((d) => normalize(d.h) === want) || ctx.c[0];
  const token = typeof cdn.t === "string" && HEX32.test(cdn.t) ? cdn.t : tokenOf(cdn.a);
  if (token === "") throw signError("no_token", "live CDN entry without a token");
  const moment = Math.trunc(nowMs);
  return {
    headers: {
      "Content-Auth": `${cdn.a}&sign2_method=sign_o3&instance=0&start_moment=${moment}&sign2=${signO3(token, moment)}`,
      "Content-License": ctx.l,
      "User-Agent": LIVE_USER_AGENT,
      App: LIVE_APP,
      "App-Version": LIVE_APP_VERSION,
      "X-Buffer": LIVE_X_BUFFER
    }
  };
}
var DEFAULT_TTL_S = 300;
var MIN_EXPIRES_S = 30;
var MAX_EXPIRES_S = 86400;
var MAX_ALTERNATE_HOSTS = 6;
var NOT_LOGGED_IN = "aaa100028";
var INT8 = /^[+-]?\d+$/;
var ALTERNATE_HOST = /^[A-Za-z0-9.-]{1,253}(:[0-9]{1,5})?$/;
var SLB_RESERVE_MS = 3e3;
var TEXT = {
  noAddresses: "No se pudo abrir el canal: Xuper no dio la dirección de la señal",
  // live_no_addresses
  noCdn: "No se pudo abrir el canal: Xuper no dio un servidor de vivo",
  // live_no_cfl_cdn
  noLicense: "No se pudo abrir el canal: Xuper no dio la licencia de la señal",
  // live_no_license
  noToken: "No se pudo abrir el canal: el servidor de vivo no trae su token",
  // live_no_cfl_token
  badHost: "No se pudo abrir el canal: Xuper dio una dirección de servidor de vivo que no es válida",
  tooLong: "No se pudo abrir el canal: los datos de la señal son demasiado largos",
  unknownChannel: "No se encontró ese canal en Xuper",
  generic: "Xuper no está disponible ahora"
};
function bareHost(mainAddr) {
  let s = typeof mainAddr === "string" ? mainAddr : "";
  if (s.startsWith("https://")) s = s.slice(8);
  if (s.startsWith("http://")) s = s.slice(7);
  const slash = s.indexOf("/");
  return slash >= 0 ? s.slice(0, slash) : s;
}
function signalFrom(play) {
  let firstLicense = null;
  for (const a of objects(isObject(play) ? play.liveAddressList : null)) {
    const license = optStringStrict(a.license);
    const playCode = optStringStrict(a.playCode);
    if (firstLicense === null) firstLicense = license;
    if (notBlank(playCode) && notBlank(license)) return { playCode, license };
  }
  return firstLicense === null ? null : { playCode: "", license: firstLicense };
}
function liveCdns(slb) {
  const out = [];
  for (const cdn of objects(isObject(slb) ? slb.cdn_list : null)) {
    if (optStringStrict(cdn.tag) !== "live") continue;
    for (const u of objects(cdn.url_list)) {
      const url = optStringStrict(u.url);
      if (!isCfl(url) && optStringStrict(u.sign_type) !== "cfl") continue;
      const host = bareHost(optStringStrict(cdn.main_addr));
      if (notBlank(host)) out.push({ cflHost: host, authBase: url });
    }
  }
  return out;
}
function expiresOf(slb) {
  const text3 = optStringStrict(isObject(slb) ? slb.invalidTime : "");
  const n = INT8.test(text3) ? Number(text3) : NaN;
  const ttl = n > 0 ? n : DEFAULT_TTL_S;
  return Math.min(MAX_EXPIRES_S, Math.max(MIN_EXPIRES_S, ttl));
}
function makeLive({ kino: kino2, portal, session, clock: clock2, config }) {
  const unavailable = (text3) => kino2.error("unavailable", text3);
  const bad = (why, text3) => {
    trace(kino2, "live", "bad", { why });
    return unavailable(text3);
  };
  const channelNotFound = (e) => e.code === "not_found" ? kino2.error("not_found", TEXT.unknownChannel) : e;
  const surface = (e) => {
    if (e instanceof PortalError) return channelNotFound(mapPortalError(e.code, e.message, kino2));
    if (isKinoError(e)) return channelNotFound(e);
    return unavailable(TEXT.generic);
  };
  async function open(code, deadline) {
    let lastCode = null;
    await session.ensure({ deadline: deadline - SLB_RESERVE_MS });
    const call = (path, bean, by) => session.withValidSession(async ({ userId, userToken }) => {
      try {
        return await portal.call(path, bean, { baseFields: true, userId, userToken, deadline: by });
      } catch (e) {
        lastCode = e instanceof PortalError ? e.code : null;
        throw e;
      }
    }, { deadline: by });
    let play;
    try {
      play = await call("v4/startPlayLive", { channelCode: code, columnId: 0, type: "1" }, deadline - SLB_RESERVE_MS);
    } catch (e) {
      trace(kino2, "live", "open_fail", { step: "play", code: lastCode ?? errCode(e) });
      const notLoggedIn = e instanceof PortalError && e.code === NOT_LOGGED_IN || isKinoError(e) && e.code === "auth_required" && lastCode === NOT_LOGGED_IN;
      if (notLoggedIn && !(isKinoError(e) && ACCOUNT_SENTENCES.has(e.userMessage))) {
        throw kino2.error("auth_required", "el canal necesita una cuenta (aaa100028)", { userMessage: say(kino2, "liveNeedsAccount") });
      }
      throw e;
    }
    const signal = signalFrom(play);
    if (!signal) throw bad("no_address", TEXT.noAddresses);
    lastCode = null;
    let slb;
    try {
      slb = await call("v15/getSlbInfo", slbBean(config.apkVersion, [code]), deadline);
    } catch (e) {
      trace(kino2, "live", "open_fail", { step: "slb", code: lastCode ?? errCode(e) });
      throw e;
    }
    const all = liveCdns(slb);
    if (all.length === 0) throw bad("no_cdn", TEXT.noCdn);
    if (!notBlank(signal.license)) throw bad("no_license", TEXT.noLicense);
    const withToken = all.filter((d) => tokenOf(d.authBase) !== "");
    if (withToken.length === 0) throw bad("no_token", TEXT.noToken);
    const cdns = withToken.filter((d) => ALTERNATE_HOST.test(d.cflHost));
    if (cdns.length === 0) throw bad("bad_cdn", TEXT.badHost);
    const built = buildSignContext(signal.license, cdns, clock2.now());
    if (!built) throw bad("too_long", TEXT.tooLong);
    if (built.kept.length < cdns.length) trace(kino2, "live", "cdn_cut", { kept: built.kept.length, of: cdns.length });
    const primary = built.kept[0].cflHost;
    const alternates = [];
    for (const d of built.kept.slice(1)) {
      if (d.cflHost.toLowerCase() === primary.toLowerCase() || alternates.some((h) => h.toLowerCase() === d.cflHost.toLowerCase())) continue;
      if (alternates.length < MAX_ALTERNATE_HOSTS) alternates.push(d.cflHost);
    }
    const playCode = notBlank(signal.playCode) ? signal.playCode : code;
    const primaryIndex = all.indexOf(built.kept[0]);
    trace(kino2, "live", "open", { cdns: all.length, kept: built.kept.length, primary: primaryIndex, alts: alternates.length, exp: expiresOf(slb) });
    if (primaryIndex > 0) trace(kino2, "live_cdn", "skip", { primary: primaryIndex, of: all.length });
    return {
      url: `http://${primary}/live/${playCode}.m3u8`,
      mime: "application/x-mpegurl",
      signing: "request",
      signContext: built.context,
      alternateHosts: alternates,
      expiresInSeconds: expiresOf(slb)
    };
  }
  async function resolveLive(code) {
    try {
      return await open(code, callDeadline(clock2, CALL_BUDGET_MS.resolve));
    } catch (e) {
      throw surface(e);
    }
  }
  return { resolveLive };
}
var TABS = [
  { id: "peliculas", label: "Películas" },
  { id: "series", label: "Series" },
  { id: "infantil", label: "Infantil" },
  { id: "anime", label: "Anime" }
];
var TAB_LABELS_EN = Object.freeze({ peliculas: "Movies", series: "Series", infantil: "Kids", anime: "Anime" });
var MAX_HERO_TEXT = 300;
var rowsOfTab = (rows, tab, nowMs, idsOf = void 0, english = false, spanish = false) => projectRows(rows.filter((r) => rootOfRow(r.id) === tab), nowMs, idsOf, english, spanish);
function heroOf(rows) {
  for (const row2 of rows) {
    for (const item of row2.items) {
      if (item.adult === true || !item.backdrop || typeof item.overview !== "string" || item.overview.trim() === "") continue;
      const text3 = item.overview.trim();
      return {
        title: item.title,
        text: text3.length <= MAX_HERO_TEXT ? text3 : `${text3.slice(0, MAX_HERO_TEXT - 1).trimEnd()}…`,
        image: item.backdrop
      };
    }
  }
  return null;
}
function makeSection({ kino: kino2, catalog, clock: clock2 }) {
  async function section3(arg) {
    const asked = arg !== null && typeof arg === "object" ? arg.tab : null;
    const tab = asked === null || asked === void 0 || asked === "" ? TABS[0].id : asked;
    if (!TABS.some((t) => t.id === tab)) throw kino2.error("not_found", "No se encontró esa pestaña");
    const rows = await catalog.rows("section", tab);
    const idsOf = typeof catalog.idsLookup === "function" ? catalog.idsLookup() : void 0;
    const english = isEnglish(kino2);
    const tabRows = rowsOfTab(rows, tab, clock2.now(), idsOf, english, isSpanish(kino2));
    const hero2 = heroOf(tabRows);
    const tabs = TABS.map((t) => ({ id: t.id, label: english ? TAB_LABELS_EN[t.id] : t.label }));
    return { tabs, tab, ...hero2 ? { hero: hero2 } : {}, rows: tabRows };
  }
  return { section: section3 };
}
var MAX_CATEGORIES2 = 24;
var MAX_TITLE2 = 40;
function tilesOf(rows, english = false) {
  const out = [];
  for (const r of rows) {
    if (out.length >= MAX_CATEGORIES2) break;
    if (r.shown.length === 0) continue;
    const first = r.shown[0];
    const art = first.backdrop && first.backdrop.trim() || first.poster && first.poster.trim() || null;
    const tile = { id: r.id, title: localizedRowTitle(r, english).slice(0, MAX_TITLE2), ref: r.id };
    if (art) tile.art = art;
    out.push(tile);
  }
  return out;
}
var ADULT_TILE = Object.freeze({ id: ADULT_REF, title: "18+", ref: ADULT_REF, adult: true });
var SPORTS_CAT_ID = "xpro-sports";
var SPORTS_HOME_MS = 8e3;
var SPORTS_PAGE_SIZE = 50;
var SPORTS_ROW_MAX = 30;
var SPORTS_TTL_MS = 6e4;
var SPORTS_LIVE_STATUS = /^(live|1|playing|inplay|started|ongoing)$/i;
var EVENTS_MAX = 200;
var EVENT_LINKS_MAX = 20;
var SPORTS_REFRESH_S = 60;
var EVENT_ID_BAD = /[^A-Za-z0-9._~-]/g;
var GAMETIME_RE = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/;
var SCORE_RE = /^(\d{1,3})\s*[-:]\s*(\d{1,3})$/;
// El portal manda gameTime "yyyy-MM-dd HH:mm" SIN zona, y su zona es FIJA (no la del equipo de cada persona). Por eso
// NO se interpreta en la zona local del motor (daría horas distintas por país, y pasa UTC según el motor): se trata
// como reloj de pared en una zona fija y se calcula el instante absoluto con Date.UTC menos el offset del portal.
// OFFSET_PORTAL_MIN = minutos del portal respecto a UTC. Placeholder 0 (UTC): CALIBRAR con un partido real en el panel.
// Si la hora sale corrida N horas al oeste, poner -N*60 (UTC-5 → -300, UTC-6 → -360). Así el instante es igual para todos.
var OFFSET_PORTAL_MIN = 0;
function epochFromGameTime(time) {
  const g = GAMETIME_RE.exec(asText(time));
  if (!g) return null;
  const t = Date.UTC(Number(g[1]), Number(g[2]) - 1, Number(g[3]), Number(g[4]), Number(g[5]), 0) - OFFSET_PORTAL_MIN * 6e4;
  return Number.isFinite(t) ? t : null;
}
function splitScore(score) {
  const g = SCORE_RE.exec(asText(score).trim());
  return g ? [g[1], g[2]] : null;
}
function sanitizeEventId(s) {
  const clean = asText(s).replace(EVENT_ID_BAD, "-").replace(/^-+|-+$/g, "").slice(0, 128);
  return clean || null;
}
// Deportes/EPG de Wiwy sobre el mismo portal: epg/v5/getNearestMatch (GET, sin cifrar, sin sesión; appId+pageSize).
// Un partido se reproduce por su channelCode con el camino de canal existente (channelOf + resolveLive). El Match ya
// trae score/gameStatus/logos, así que no hace falta getScoreboard para la fila ni la categoría.
function makeSports({ kino: kino2, portal, clock: clock2, config }) {
  let cache = null;
  function pickLogo(m) {
    const cands = [m.matchLogo, isObject(m.team_a) ? m.team_a.teamLogo : "", isObject(m.team_b) ? m.team_b.teamLogo : ""];
    for (const c of cands) {
      const s = asText(c);
      if (/^https?:\/\//i.test(s)) return s;
    }
    return "";
  }
  function channelsOf(m) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (code, nm) => {
      const c = asText(code);
      if (!c || seen.has(c) || !channelOf(c)) return;
      seen.add(c);
      out.push({ code: c, name: asText(nm) });
    };
    add(m.channelCode, m.channelName);
    if (Array.isArray(m.channelInfoList)) for (const c of m.channelInfoList) {
      if (isObject(c)) add(c.channelCode, asText(c.channelName) || asText(c.epgName));
    }
    return out;
  }
  function normalize(m) {
    if (!isObject(m)) return null;
    const ch = channelOf(asText(m.channelCode));
    if (!ch) return null;
    const a = isObject(m.team_a) ? asText(m.team_a.teamName) : "";
    const b = isObject(m.team_b) ? asText(m.team_b.teamName) : "";
    const name = asText(m.matchName) || asText(m.matchAlias);
    const title = a && b ? `${a} vs ${b}` : name || asText(m.channelName);
    if (isBlank(title)) return null;
    const league = name && name !== title ? name : "";
    return {
      id: ch.id,
      ref: ch.ref,
      gameId: asText(m.gameId),
      title,
      league,
      score: asText(m.score),
      time: asText(m.gameTime),
      live: SPORTS_LIVE_STATUS.test(asText(m.gameStatus)),
      logo: pickLogo(m),
      teamA: a ? { name: a, logo: isObject(m.team_a) ? asText(m.team_a.teamLogo) : "" } : null,
      teamB: b ? { name: b, logo: isObject(m.team_b) ? asText(m.team_b.teamLogo) : "" } : null,
      channels: channelsOf(m)
    };
  }
  async function fetchMatches(deadline) {
    if (cache && clock2.now() - cache.at < SPORTS_TTL_MS) return cache.matches;
    const data = await portal.call(
      "epg/v5/getNearestMatch",
      {},
      { method: "GET", encrypt: false, baseFields: false, query: { appId: config.appId, pageSize: SPORTS_PAGE_SIZE }, deadline }
    );
    const list = isObject(data) && Array.isArray(data.teamList) ? data.teamList : [];
    const matches = [];
    const seen = /* @__PURE__ */ new Set();
    for (const raw of list) {
      const m = normalize(raw);
      if (!m || seen.has(m.id)) continue;
      seen.add(m.id);
      matches.push(m);
    }
    cache = { at: clock2.now(), matches };
    return matches;
  }
  function itemFor(m, categoryId) {
    const title = m.score ? `${m.title} · ${m.score}` : m.title;
    const item = { id: m.id, title: title.slice(0, 200), ref: m.ref };
    if (categoryId) item.categoryId = categoryId;
    else item.kind = "live";
    if (m.logo) item.logo = m.logo;
    const badges = [];
    if (m.live) badges.push(say(kino2, "sportsLive"));
    if (m.league) badges.push(m.league.slice(0, 20));
    if (badges.length) item.badges = badges.slice(0, 3);
    return item;
  }
  function participant(team, score) {
    const p = { name: team.name.slice(0, 80) };
    if (team.logo) p.logo = team.logo;
    if (score !== "" && score !== null && score !== void 0) p.score = String(score).slice(0, 12);
    return p;
  }
  // Un partido como evento de «Eventos del día»: startsAt (epoch), equipos como participantes, marcador, liga, y sus
  // servidores (links) que reproduce resolve(ref) por el camino de canal (startPlayLive/getSlbInfo). El estado lo
  // calcula la app desde startsAt. Un partido sin hora válida o sin canal reproducible se descarta.
  function toEvent(m) {
    const startsAt = epochFromGameTime(m.time);
    if (startsAt === null) return null;
    const id = sanitizeEventId(m.gameId) || sanitizeEventId(m.id);
    if (!id) return null;
    const links = m.channels.slice(0, EVENT_LINKS_MAX).map((c, i) => {
      const ref = channelOf(c.code).ref;
      const nm = c.name && c.name.trim() ? c.name.trim() : say(kino2, "server", { n: i + 1 });
      return { ref, name: nm.slice(0, 60) };
    });
    if (links.length === 0) return null;
    const ev = { id, title: m.title.slice(0, 200), startsAt, sport: say(kino2, "sportsFootball"), links };
    if (m.league) ev.competition = m.league.slice(0, 80);
    const parts = splitScore(m.score);
    const participants = [];
    if (m.teamA) participants.push(participant(m.teamA, parts ? parts[0] : ""));
    if (m.teamB) participants.push(participant(m.teamB, parts ? parts[1] : ""));
    if (participants.length) ev.participants = participants;
    if (m.logo) ev.image = m.logo;
    return ev;
  }
  async function homeRow(deadline) {
    try {
      const matches = await fetchMatches(deadline);
      if (!matches.length) return null;
      const items = matches.slice(0, SPORTS_ROW_MAX).map((m) => itemFor(m, null));
      return { id: SPORTS_CAT_ID, title: say(kino2, "sportsRow"), genre: "deportes", items };
    } catch (e) {
      trace(kino2, "sports", "home_fail", { why: errCode(e) });
      return null;
    }
  }
  function category() {
    return { id: SPORTS_CAT_ID, title: say(kino2, "sportsCategory"), genre: "deportes" };
  }
  const isCategory = (id) => id === SPORTS_CAT_ID;
  async function channels(deadline) {
    const matches = await fetchMatches(deadline);
    return { items: matches.map((m) => itemFor(m, SPORTS_CAT_ID)) };
  }
  async function events() {
    const matches = await fetchMatches(clock2.now() + SPORTS_HOME_MS);
    const items = [];
    const seen = /* @__PURE__ */ new Set();
    for (const m of matches) {
      const ev = toEvent(m);
      if (!ev || seen.has(ev.id)) continue;
      seen.add(ev.id);
      items.push(ev);
      if (items.length >= EVENTS_MAX) break;
    }
    return { items, refreshSeconds: SPORTS_REFRESH_S };
  }
  return { homeRow, category, isCategory, channels, events };
}
function makeCategories({ catalog, kino: kino2 = null, liveTiles = null }) {
  return {
    // An empty catalog stays empty: an 18+ tile alone would be the only thing Xuper offers. Live tiles alone
    // are shown (the VOD catalog failing must not hide them, nor they it: tiles() never throws).
    categories: async () => {
      const [rows, live2] = await Promise.all([
        catalog.rows("categories").then((r) => ({ r }), (e) => ({ e })),
        liveTiles ? liveTiles.tiles() : Promise.resolve([])
      ]);
      if (rows.e && live2.length === 0) throw rows.e;
      const tiles = rows.e ? [] : tilesOf(rows.r, isEnglish(kino2));
      if (tiles.length === 0) return live2;
      return [...tiles.slice(0, MAX_CATEGORIES2 - 1 - live2.length), ...live2, { ...ADULT_TILE }];
    }
  };
}
var deps = null;
var dependencyAccount = null;
var clock = { now: () => Date.now() };
function getDeps() {
  return getDepsForAccount(accountData(kino.config, kino.storage).email);
}
function getDepsForAccount(account) {
  if (deps && dependencyAccount === account) return deps;
  dependencyAccount = account;
  const host = accountStorage(kino, account);
  const crypto = makeCrypto(host, { onDecode: makeDecodeReporter(host) });
  const config = { hosts, appId: APP_ID, apkVersion: APK_VERSION };
  let session = null;
  const portal = makePortal({ kino: host, crypto, config, clock, snProvider: () => session.current().sn, modeOf: () => session.mode() });
  session = makeSession({ kino: host, portal, clock });
  const tmdb = makeTmdb({ kino: host, clock });
  const live2 = makeLiveCatalog({ kino: host, portal, session, clock });
  const countryRow = makeCountryRow({ kino: host, live: live2 });
  const catalog = makeCatalog({ kino: host, portal, session, clock, tmdb, countryRow });
  const liveStream = makeLive({ kino: host, portal, session, clock, config });
  const recent = makeRecentStore({ kino: host, clock });
  const resolve2 = makeResolve({ kino: host, portal, session, clock, config, portalChapters: catalog.portalChapters, live: liveStream });
  const section3 = makeSection({ kino: host, catalog, clock });
  const liveTiles = makeLiveTiles({ kino: host, live: live2, clock });
  const categories2 = makeCategories({ catalog, kino: host, liveTiles });
  const sports = makeSports({ kino: host, portal, clock, config });
  deps = { clock, host, recent, crypto, portal, session, tmdb, catalog, resolve: resolve2, live: live2, liveStream, section: section3, categories: categories2, liveTiles, countryRow, sports };
  return deps;
}
async function guarded(body) {
  try {
    requireIntegration(kino);
    const current = getDeps();
    await current.session.ensure({ deadline: Date.now() + 15e3 });
    return await body(current);
  } catch (e) {
    if (isKinoError(e)) throw e;
    trace(kino, "call", "bug", { code: errCode(e) });
    throw kino.error("unavailable", "Xuper no está disponible ahora");
  }
}
var LIVE_PROVIDERS = /* @__PURE__ */ new Set(["xuper", "legacy"]);
var ITEM_ID3 = /^[A-Za-z0-9._~-]{1,128}$/;
var MAX_NUMBER = 99999;
var MAX_SEASON = 999;
var whole = (v, max) => Number.isInteger(v) && v >= 1 && v <= max ? v : null;
function ownRef(ref) {
  if (typeof ref !== "string" || ref.startsWith("plg1:")) return null;
  return decode(ref);
}
function title(input) {
  const magis = ownRef(input.ref);
  if (!magis || !ITEM_ID3.test(magis.contentId)) return null;
  return {
    kind: magis.isSeries ? "series" : "movie",
    id: magis.contentId,
    ref: encode({ contentId: magis.contentId, programType: magis.programType, episode: 0 })
  };
}
function chapter(input) {
  const magis = ownRef(input.ref);
  if (!magis || !ITEM_ID3.test(magis.contentId)) return null;
  const number = whole(magis.episode, MAX_NUMBER) ?? whole(input.episode, MAX_NUMBER) ?? 1;
  const out = { kind: "episode", ref: encodeChapter(number, magis.contentId), number };
  const season = whole(input.season, MAX_SEASON);
  if (season !== null) out.season = season;
  return out;
}
function live(input) {
  if (!LIVE_PROVIDERS.has(input.provider)) return null;
  const id = typeof input.code === "string" ? idOfCode(input.code) : null;
  return id === null ? null : { kind: "live", code: id };
}
function makeMigrate() {
  async function migrate2(input) {
    await null;
    try {
      if (!isObject(input)) return null;
      if (input.kind === "title") return title(input);
      if (input.kind === "chapter") return chapter(input);
      if (input.kind === "live") return live(input);
      return null;
    } catch (_) {
      return null;
    }
  }
  return { migrate: migrate2 };
}
var MAX_SLIDES = 6;
var MAX_RAILS = 8;
var MAX_RAIL_ITEMS = 20;
var MAX_SLIDE_TEXT = 160;
var HTTPS = /^https:\/\//;
var TAB_IDS = TABS.map((t) => t.id);
function cardOf(item) {
  const out = { id: item.id, ref: item.ref, title: item.title, kind: item.kind };
  if (item.poster && HTTPS.test(item.poster)) out.poster = item.poster;
  if (item.backdrop && HTTPS.test(item.backdrop)) out.backdrop = item.backdrop;
  if (item.year) out.year = item.year;
  if (item.overview) out.overview = item.overview;
  if (item.badges) out.badges = item.badges;
  if (item.adult === true) out.adult = true;
  if (item.rating !== void 0) out.rating = item.rating;
  if (item.ids) out.ids = item.ids;
  return out;
}
function slidesOf(rows) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row2 of rows) {
    for (const item of row2.items) {
      if (out.length >= MAX_SLIDES) return out;
      if (item.adult === true || seen.has(item.id) || !item.backdrop || !HTTPS.test(item.backdrop)) continue;
      const text3 = typeof item.overview === "string" ? item.overview.trim() : "";
      if (text3 === "") continue;
      seen.add(item.id);
      out.push({
        id: item.id,
        ref: item.ref,
        kind: item.kind,
        title: item.title,
        image: item.backdrop,
        ...item.ids ? { ids: item.ids } : {},
        ...item.year ? { year: item.year } : {},
        ...item.poster ? { poster: item.poster } : {},
        text: text3.length <= MAX_SLIDE_TEXT ? text3 : `${text3.slice(0, MAX_SLIDE_TEXT - 1).trimEnd()}…`
      });
    }
  }
  return out;
}
function railsOf(rows) {
  return rows.slice(0, MAX_RAILS).map((r) => ({
    id: r.id,
    title: r.title,
    ref: r.ref,
    items: r.items.slice(0, MAX_RAIL_ITEMS).map(cardOf)
  }));
}
function tabOf(rows, tab, nowMs, idsOf, english, spanish) {
  const projected = projectRows(rows.filter((r) => rootOfRow(r.id) === tab), nowMs, idsOf, english, spanish);
  if (projected.length === 0) return null;
  return { slides: slidesOf(projected), rails: railsOf(projected) };
}
function recentOf(rows, ids, nowMs, idsOf, english, spanish) {
  if (ids.length === 0) return [];
  const byId = /* @__PURE__ */ new Map();
  for (const r of rows) for (const item of oneEach(r.shown)) if (!byId.has(item.id)) byId.set(item.id, item);
  const out = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (!item) continue;
    const card = projectItem(item, nowMs, idsOf, english, spanish);
    if (card) out.push(cardOf(card));
  }
  return out;
}
var LOGO_ASPECT = "2.56:1";
var LOGO_DATA = "data:image/png;base64,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";
var HTTPS2 = /^https:\/\//;
var EPISODES_PER_PAGE = 20;
var MAX_CAST = 12;
var LEAD_MAX = 140;
var same = (text3) => ({ text: text3, textEn: text3 });
var num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
var https = (v) => typeof v === "string" && HTTPS2.test(v) && v.length <= 2048 ? v : void 0;
var opensPage = (card) => !!card && (card.kind === "movie" || card.kind === "series") && typeof card.ref === "string" && card.ref.length < 600 && typeof card.id === "string";
function backdropsOf(images, first) {
  const base = "https://image.tmdb.org/t/p/w780";
  const list = (images && images.backdrops || []).filter((b) => b && typeof b.file_path === "string" && b.file_path.startsWith("/") && b.width >= 1e3).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).map((b) => base + b.file_path);
  const out = [];
  for (const u of [first, ...list]) if (u && !out.some((x) => x.slice(x.lastIndexOf("/")) === u.slice(u.lastIndexOf("/")))) out.push(u);
  return out.slice(0, 6);
}
function openArgs(card) {
  const year = num(card.year);
  const args = { open: card.ref, i: card.id, t: String(card.title || "").slice(0, 100), k: card.kind };
  if (year >= 1870 && year <= 2100) args.y = year;
  if (validTmdb(card.ids && card.ids.tmdb)) args.tm = card.ids.tmdb;
  for (const [key, value] of [["b", https(card.backdrop || card.image)], ["p", https(card.poster)], ["o", text(card.overview || card.text).slice(0, 400)]]) {
    if (!value) continue;
    args[key] = value;
    if (storedLength(JSON.stringify(args)) > 4e3) delete args[key];
  }
  return args;
}
var cardNode = (card, size, scope) => ({
  type: "titleCard",
  key: `${scope}-${card.id}`,
  size,
  item: card,
  ...opensPage(card) ? { onTap: { event: "openTitle", arg: JSON.stringify(openArgs(card)) } } : {}
});
var cardRow = (items, key, size) => ({ type: "SingleChildScrollView", key: key + "-s", direction: "horizontal", children: [{ type: "Row", key: key + "-r", gap: 12, children: items.map((c) => cardNode(c, size, key)) }] });
var cardGrid = (items, key) => ({ type: "GridView", key, columns: { compact: 3, expanded: 6 }, children: items.map((c) => cardNode(c, "medium", key)) });
function pushOf(arg) {
  let a = null;
  try {
    a = JSON.parse(String(arg));
  } catch (_) {
    a = null;
  }
  if (!a || typeof a.open !== "string" || typeof a.i !== "string" || a.k !== "movie" && a.k !== "series") return null;
  return { push: "detail", params: openArgs({ ref: a.open, id: a.i, title: a.t, kind: a.k, year: a.y, ids: { tmdb: a.tm }, backdrop: a.b, poster: a.p, overview: a.o }) };
}
var hoursOf = (min) => {
  const m = num(min);
  return m > 0 ? m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min` : "";
};
var MONTHS = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
var dateText = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 ? { es: `${d} ${MONTHS.es[m - 1]} ${y}`, en: `${MONTHS.en[m - 1]} ${d}, ${y}` } : { es: iso, en: iso };
};
async function loadDetail(args, { tmdb, catalog }) {
  const kind = args.k === "movie" ? "movie" : "series";
  const card = { id: args.i, kind, title: text(args.t), year: Number(args.y) || 0, ids: { tmdb: args.tm } };
  const [meta, chapters] = await Promise.all([
    tmdb ? tmdb.metadata(card).catch(() => null) : null,
    kind === "series" && catalog ? catalog.episodes(args.open).catch(() => null) : null
  ]);
  const m = meta || {};
  const series = chapters?.series || {};
  const d = {
    id: card.id,
    kind,
    title: String(m.title || card.title || card.id).slice(0, 200),
    year: num(m.year) || num(series.year) || card.year,
    overview: text(m.overview || series.overview || args.o),
    poster: https(m.poster) || https(series.poster) || https(args.p),
    backdrop: https(m.backdrop) || https(series.backdrop) || https(args.b) || https(m.poster) || https(series.poster) || https(args.p),
    logo: https(m.logo),
    genres: (m.genres || []).slice(0, 4),
    runtime: num(m.runtimeMinutes),
    tagline: text(m.tagline),
    certification: text(m.certification),
    directors: (m.directors || []).slice(0, 3),
    ratings: (m.ratings || []).slice(0, 3),
    cast: (m.cast || []).slice(0, MAX_CAST),
    images: m.images || [],
    episodes: []
  };
  if (chapters && Array.isArray(chapters.episodes)) {
    d.episodes = chapters.episodes.filter((e) => e && num(e.number) >= 1).slice(0, MAX_EPISODES).map((e) => ({
      s: num(e.season) || 1,
      n: num(e.number),
      title: text(e.title).slice(0, 120),
      overview: text(e.overview).slice(0, 110),
      still: https(e.still),
      air: AIR_DATE.test(text(e.airDate)) ? e.airDate : ""
    }));
  }
  return d;
}
var heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var railSkeleton = () => ({
  type: "Column",
  key: "dskel1",
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `dsk${i}`, flex: 1 })) }
  ]
});
var sectionTitle = (key) => ({ type: "Text", ...twin(key), style: "h4" });
var episodeGo = (d, r) => ({ go: { title: { ref: r.ref, kind: "series", id: r.id, title: d.title } } });
function episodeRow(d, r, ep) {
  const facts = ep.air ? dateText(ep.air) : null;
  const heading = ep.title ? { text: `${ep.n}. ${ep.title}`, textEn: `${ep.n}. ${ep.title}` } : twin("dEpisodeN", "text", { n: ep.n });
  return {
    type: "Row",
    key: `ep-${ep.s}-${ep.n}`,
    gap: 12,
    crossAxisAlignment: "center",
    onTap: episodeGo(d, r),
    canRequestFocus: true,
    children: [
      { type: "Image", key: `epi-${ep.s}-${ep.n}`, width: 120, aspect: "16:9", fit: "cover", radius: "medium", ...ep.still ? { url: ep.still } : {}, fallback: { type: "Skeleton", shape: "block", height: 64 } },
      { type: "Column", flex: 1, gap: 4, children: [
        { type: "Text", bold: true, maxLines: 2, ...heading },
        ...facts ? [{ type: "Text", style: "caption", color: "muted", text: facts.es, textEn: facts.en }] : [],
        ...ep.overview ? [{ type: "Text", style: "caption", color: "muted", maxLines: 2, ...same(ep.overview) }] : []
      ] }
    ]
  };
}
function castItem(c) {
  const name = String(c.name || "").slice(0, 60);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    type: "Column",
    key: "cast-" + name.replace(/[^A-Za-z0-9]/g, "").slice(0, 24) + "-" + String(c.character || "").length,
    width: 96,
    gap: 4,
    crossAxisAlignment: "center",
    canRequestFocus: true,
    children: [
      { type: "CircleAvatar", radius: 32, ...https(c.photo) ? { image: https(c.photo) } : {}, text: initials, textEn: initials },
      { type: "Text", ...same(name), style: "caption", maxLines: 2 },
      ...c.character ? [{ type: "Text", ...same(String(c.character).slice(0, 40)), style: "caption", color: "muted", maxLines: 1 }] : []
    ]
  };
}
function detailView({ r, entry, season, episodePage = 0, logo: logo2, back }) {
  const d = entry && entry.d;
  const appBar = { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: back, title: logo2 };
  const body = [];
  let hero2 = null;
  if (!entry) {
    hero2 = heroSkeleton();
    body.push(railSkeleton());
  } else if (!d) {
    body.push({ type: "MaterialBanner", key: "detailFailed", role: "error", ...twin("dFailed"), action: { ...twin("brRetry", "label"), onTap: "dretry" } });
    body.push({ type: "ElevatedButton", key: "dkino", icon: "play", ...twin("dSeeInKino", "labelText"), onPressed: { go: { title: { ref: r.ref, kind: r.kind, id: r.id, title: r.title } } } });
  } else {
    const series = d.kind === "series";
    const seasons = [...new Set(d.episodes.map((e) => e.s))].sort((a, b) => a - b);
    const shown = seasons.includes(season) ? season : seasons[0];
    const toKino = { go: { title: { ref: r.ref, kind: d.kind, id: r.id, title: r.title || d.title } } };
    const buttons = series ? [{ type: "ElevatedButton", key: "dplay", ...twin("dSeriesGo", "labelText"), icon: "play", autofocus: true, onPressed: toKino }] : [
      { type: "ElevatedButton", key: "dplay", ...twin("brWatch", "labelText"), icon: "play", autofocus: true, onPressed: { go: { play: { ref: r.ref, kind: "movie", id: r.id, title: d.title } } } },
      { type: "TextButton", key: "dmore", ...twin("dMore", "labelText"), onPressed: toKino }
    ];
    const lead = d.tagline || (d.overview.length <= LEAD_MAX ? d.overview : d.overview.slice(0, LEAD_MAX - 1).trimEnd() + "…");
    const images = (d.images && d.images.length ? d.images : [d.backdrop || ""]).slice(0, 6);
    const slide = (image, i) => ({
      type: "heroCard",
      key: i ? "dhero-" + i : "dhero",
      h: { compact: 240, expanded: 320 },
      title: d.title,
      titleEn: d.title,
      ...lead ? same(lead) : {},
      ...image ? { image } : {},
      ...d.logo ? { logo: d.logo } : {},
      buttons: i ? buttons.map((b) => ({ ...b, key: b.key + "-" + i, autofocus: false })) : buttons
    });
    hero2 = images.length > 1 ? { type: "PageView", key: "hero" + images.length, autoPlayMs: 6e3, children: images.map(slide) } : slide(images[0], 0);
    const rating = d.ratings.find((x) => x.source === "imdb") || d.ratings.find((x) => x.source === "tmdb");
    const facts = [];
    if (rating) facts.push("★ " + rating.value);
    if (d.year) facts.push(String(d.year));
    if (d.certification) facts.push(d.certification);
    if (d.runtime) facts.push(hoursOf(d.runtime));
    const seasonsText = series && seasons.length ? twin("dSeasonsN", "t", { n: seasons.length }) : null;
    const es = facts.concat(seasonsText ? [seasonsText.t] : []);
    const en = facts.concat(seasonsText ? [seasonsText.tEn] : []);
    if (es.length) body.push({ type: "Text", key: "dfacts", style: "h4", text: es.join("  ·  "), textEn: en.join("  ·  ") });
    if (d.genres.length) body.push({ type: "Row", key: "dgenres", gap: 8, children: d.genres.map((g, i) => ({ type: "Badge", key: "dg-" + i, ...same(g) })) });
    if (d.overview) body.push({ type: "Text", key: "dsynopsis", canRequestFocus: true, ...same(d.overview) });
    if (d.directors.length) body.push({ type: "Text", ...twin(series ? "dCreators" : "dDirector", "text", { v: d.directors.join(", ") }), color: "muted" });
    if (d.cast.length) {
      body.push(sectionTitle("dCast"));
      body.push({ type: "SingleChildScrollView", key: "dcast", direction: "horizontal", children: [{ type: "Row", gap: 12, children: d.cast.map(castItem) }] });
    }
    if (series && seasons.length) {
      body.push(seasons.length > 1 ? { type: "DropdownButton", key: "dseason", value: String(shown), onChanged: "season", options: seasons.map((s) => ({ value: String(s), ...twin("dSeasonN", "label", { n: s }) })) } : sectionTitle("dEpisodes"));
      const episodes = d.episodes.filter((e) => e.s === shown);
      const pageCount = Math.ceil(episodes.length / EPISODES_PER_PAGE);
      const page = Math.max(0, Math.min(Number.isInteger(episodePage) ? episodePage : 0, pageCount - 1));
      if (pageCount > 1) {
        const options = Array.from({ length: pageCount }, (_, i) => {
          const start = i * EPISODES_PER_PAGE;
          const first = episodes[start].n;
          const last = episodes[Math.min(start + EPISODES_PER_PAGE, episodes.length) - 1].n;
          const label = first === last ? String(first) : first + "–" + last;
          return { value: String(i), label, labelEn: label };
        });
        body.push({ type: "DropdownButton", key: "episodeRange", ...twin("dEpisodes", "labelText"),
          value: String(page), onChanged: "episodePage", options });
      }
      const start = page * EPISODES_PER_PAGE;
      for (const ep of episodes.slice(start, start + EPISODES_PER_PAGE)) body.push(episodeRow(d, r, ep));
    }
  }
  return {
    type: "Scaffold",
    appBar,
    body: { type: "SingleChildScrollView", key: "detail-page", children: [...hero2 ? [hero2] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...!entry ? { every: { ms: 1e3, event: "dtick" } } : {}
  };
}
var TAB_KEYS = { peliculas: "brTabPeliculas", series: "brTabSeries", infantil: "brTabInfantil", anime: "brTabAnime" };
var POLL_MS = 1500;
var railSkeleton2 = (n) => ({
  type: "Column",
  key: "skel" + n,
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, sizes: ["compact"], children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}c${i}`, flex: 1 })) },
    { type: "Row", gap: 12, sizes: ["medium", "expanded"], children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}w${i}`, flex: 1 })) }
  ]
});
var heroSkeleton2 = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var slideNode = (s) => ({
  type: "heroCard",
  key: "slide-" + s.id,
  h: { compact: 200, expanded: 240 },
  ...s.logo ? { logo: s.logo } : {},
  title: s.title,
  text: s.text,
  image: s.image,
  buttons: [
    {
      type: "ElevatedButton",
      key: "watch-" + s.id,
      ...twin("brWatch", "labelText"),
      icon: "play",
      onPressed: { go: { play: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } }
    },
    {
      type: "TextButton",
      key: "info-" + s.id,
      ...twin("brInfo", "labelText"),
      onPressed: s.kind === "movie" || s.kind === "series" ? { go: { screen: { args: openArgs(s) } } } : { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } }
    }
  ]
});
var hero = (slides) => slides.length === 1 ? slideNode(slides[0]) : {
  type: "PageView",
  key: "hero" + slides.length,
  autoPlayMs: 6e3,
  children: slides.map(slideNode)
};
var logo = () => ({
  type: "Image",
  key: "logo",
  url: LOGO_DATA,
  aspect: LOGO_ASPECT,
  fit: "contain",
  h: 40,
  alt: "Xuper",
  altEn: "Xuper",
  fallback: { type: "Text", text: "Xuper", textEn: "Xuper", style: "h4" }
});
var tabBar = (active) => ({ type: "TabBar", key: "tabs", divider: false, value: active, onChanged: "tab", tabs: TAB_IDS.map((id) => ({ value: id, ...twin(TAB_KEYS[id], "label") })) });
var roundChannel = (c, n) => ({
  type: "Column",
  key: "ch-" + n,
  w: 120,
  gap: 8,
  crossAxisAlignment: "center",
  onTap: { go: { play: { ref: c.ref, kind: "live", id: c.id, title: c.title } } },
  children: [
    { type: "CircleAvatar", key: "chl-" + n, radius: 44, ...c.poster ? { image: c.poster } : { text: String(c.title).slice(0, 2).toUpperCase() }, labelText: c.title, labelTextEn: c.title },
    { type: "Text", text: c.title, textEn: c.title, style: "caption", maxLines: 1, textAlign: "center" }
  ]
});
var roundRail = (items, titleOverride) => ({
  type: "Column",
  key: "live",
  gap: 8,
  children: [
    { type: "Text", ...titleOverride, style: "h4" },
    { type: "SingleChildScrollView", key: "liveScroll", direction: "horizontal", children: [{ type: "Row", gap: 24, children: items.slice(0, 20).map(roundChannel) }] }
  ]
});
var rail = (r, key, titleOverride) => ({
  type: "Column",
  key,
  gap: 8,
  children: [
    { type: "Row", key: key + "-h", crossAxisAlignment: "center", children: [
      { type: "Text", style: "h4", flex: 1, text: titleOverride ? titleOverride.title : r.title, textEn: titleOverride ? titleOverride.titleEn : r.title },
      ...r.ref ? [{ type: "TextButton", key: key + "-more", ...twin("brMore", "labelText"), onPressed: { go: { browse: { ref: r.ref, title: r.title } } } }] : []
    ] },
    cardRow(r.items, key, "medium")
  ]
});
var SEARCH_CAP = 60;
var gridSkeleton = () => ({
  type: "Column",
  key: "gridSkeleton",
  gap: 12,
  children: [
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["compact"], key: `gc${r}`, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `gc${r}-${i}`, flex: 1 })) })),
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["medium", "expanded"], key: `gw${r}`, children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `gw${r}-${i}`, flex: 1 })) }))
  ]
});
function searchView({ query, status, items, history = [], device = "phone" }) {
  const tv = device === "tv";
  const searchForm = () => ({
    type: "Form",
    key: "searchForm",
    onSubmitted: "search",
    gap: 8,
    children: tv ? [{ type: "Row", key: "searchRow", gap: 16, crossAxisAlignment: "center", children: [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true, weight: 1 },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ] }] : [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ]
  });
  const body = tv ? [] : [searchForm()];
  if (status === "fail") {
    body.push({ type: "MaterialBanner", key: "searchFailed", role: "error", ...twin("brSearchFailed"), action: { ...twin("brRetry", "label"), onTap: "sretry" } });
  } else if (status === "done" && items) {
    if (items.length === 0) body.push({ type: "Text", ...twin("brNoResults", "text"), color: "muted" });
    else body.push(cardGrid(items.slice(0, SEARCH_CAP), "results"));
  } else if (status !== "idle") {
    body.push(gridSkeleton());
  } else if (history.length > 0) {
    body.push({ type: "Text", ...twin("brSearchedBefore", "text"), style: "h4" });
    body.push(cardGrid(history.slice(0, SEARCH_CAP), "history"));
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" },
      ...tv ? { title: searchForm() } : twin("brSearchTitle", "title")
    },
    body: { type: "SingleChildScrollView", key: "search-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...status === "loading" ? { every: { ms: 1e3, event: "stick" } } : {}
  };
}
function liveView({ tiles, cat, items, query, previous, next, failed, loading, pageKey, device = "phone" }) {
  const tv = device === "tv";
  const liveForm = () => ({
    type: "Form",
    key: "liveSearch",
    onSubmitted: "lsearch",
    gap: 8,
    children: tv ? [{ type: "Row", key: "liveSearchRow", gap: 16, crossAxisAlignment: "center", children: [
      { type: "TextField", key: "lq", kind: "text", value: query, ...twin("brLiveSearchHint", "labelText"), maxLength: 100, weight: 1 },
      { type: "ElevatedButton", key: "lsearchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ] }] : [
      { type: "TextField", key: "lq", kind: "text", value: query, ...twin("brLiveSearchHint", "labelText"), maxLength: 100 },
      { type: "ElevatedButton", key: "lsearchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ]
  });
  const body = tv ? [] : [liveForm()];
  if (failed) body.push({ type: "MaterialBanner", key: "liveFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "lretry" } });
  else if (loading) body.push(gridSkeleton());
  else if (!items.length) body.push({ type: "Text", ...twin(query ? "brNoResults" : "brLiveEmpty", "text"), color: "muted" });
  else if (tv) body.push({ type: "Row", key: "channels", wrap: true, gap: 24, children: items.map(roundChannel) });
  else body.push({ type: "titleGrid", key: "channels", columns: { compact: 3, expanded: 6 }, items });
  if (previous || next) body.push({ type: "Row", key: "livePager", gap: 8, children: [
    ...previous ? [{ type: "TextButton", key: "livePrevious", ...twin("brPreviousPage", "labelText"), onPressed: "lprev" }] : [],
    ...next ? [{ type: "ElevatedButton", key: "liveNext", ...twin("brNextPage", "labelText"), onPressed: "lnext" }] : []
  ] });
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" },
      ...tv ? { title: liveForm() } : twin("brLive", "title")
    },
    body: { type: "Column", key: "livePage", children: [
      ...tiles && tiles.length > 1 && query === "" ? [{ type: "TabBar", key: "genres", divider: false, value: cat, onChanged: "lcat", tabs: tiles.map((t) => ({ value: t.ref, label: t.title, labelEn: t.title })) }] : [],
      { type: "SingleChildScrollView", key: "live-" + String(cat).replace(/[^A-Za-z0-9_-]/g, "_") + "-" + pageKey, flex: 1, children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] }
    ] },
    ...loading && !failed ? { every: { ms: 1e3, event: "ltick" } } : {}
  };
}
function browseView({ tab, data, recent: recent2, live: live2 = [], pending, failed, device = "phone" }) {
  const tv = device === "tv";
  const active = TAB_IDS.includes(tab) ? tab : TAB_IDS[0];
  const body = [];
  if (data) {
    if (data.slides.length > 0) body.push(hero(data.slides));
    if (recent2.length > 0) body.push(rail({ items: recent2 }, "recent", twin("brRecent", "title")));
    if (live2.length > 0) body.push(tv ? roundRail(live2, twin("brLive", "text")) : rail({ items: live2 }, "live", twin("brLive", "title")));
    for (const r of data.rails) body.push(rail(r, "rail-" + r.id));
    if (data.rails.length === 0) body.push({ type: "Text", ...twin("brEmpty", "text"), color: "muted" });
  } else if (failed) {
    body.push({
      type: "MaterialBanner",
      key: "loadFailed",
      role: "error",
      ...twin("brFailed"),
      action: { ...twin("brRetry", "label"), onTap: "retry" }
    });
  } else {
    body.push(heroSkeleton2(), railSkeleton2(1), railSkeleton2(2), railSkeleton2(3));
  }
  const isBanner = (n) => !!n && (n.type === "heroCard" || n.key === "heroSkeleton" || n.type === "PageView" && String(n.key).startsWith("hero"));
  const banner2 = body.length > 0 && isBanner(body[0]) ? body.shift() : null;
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      divider: false,
      // One bar instead of two (Kino 0.9.81+; an older Kino draws its own bar above and this one under it, as before):
      // the close button where Kino's was, the name where the plugin's was, search and settings at the end.
      mergeWithKinoBar: true,
      dense: true,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin("brClose", "labelText"), ...twin("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // The plugin's logo where its name was; the name itself when the logo cannot be drawn (an older Kino, a refused picture).
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [logo(), tabBar(active)] } : logo(),
      actions: [
        // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
        ...tv ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin("brSearch", "labelText"), ...twin("brSearch", "tooltip"), onPressed: "openSearch" }] : [],
        { type: "IconButton", key: "liveButton", icon: "tv", ...twin("brLive", "labelText"), ...twin("brLive", "tooltip"), onPressed: { event: "go", arg: "live" } },
        { type: "IconButton", key: "settings", icon: "settings", ...twin("brSettings", "labelText"), ...twin("brSettings", "tooltip"), onPressed: { event: "go", arg: "settings" } }
      ]
    },
    // The tabs stay pinned under the bar; only the rows scroll.
    ...tv ? {} : { floatingActionButton: { type: "FloatingActionButton", key: "searchFab", icon: "search", ...twin("brSearch", "tooltip"), onPressed: "openSearch" } },
    body: { type: "Column", key: "page", children: [
      // The tabs line up with the bar's buttons and the cards below (a wide window and the TV pad their content by 24).
      ...tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(active)] }],
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [...banner2 ? [banner2] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] }
    ] },
    ...pending ? { every: { ms: POLL_MS, event: "tick" } } : {}
  };
}
function detailPage({ r, entry, season, episodePage }) {
  const back = { type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" };
  return detailView({ r, entry, season, episodePage, logo: logo(), back });
}
var KEY4 = "meta1";
var MAX = 120;
var CALL_MS = 8e3;
var HTTPS3 = /^https:\/\//;
function makeMetaCache({ kino: kino2, tmdb = null, clock: clock2 = { now: () => Date.now() } }) {
  const usable = () => !!tmdb && tmdb.available();
  let book = null;
  function read() {
    if (book) return book;
    try {
      const o = JSON.parse(kino2.storage.get(KEY4) || "null");
      book = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (_) {
      book = {};
    }
    return book;
  }
  function write() {
    try {
      const ids = Object.keys(book);
      if (ids.length > MAX) for (const id of ids.slice(0, ids.length - MAX)) delete book[id];
      kino2.storage.set(KEY4, JSON.stringify(book));
    } catch (_) {
    }
  }
  function known(id) {
    const e = read()[id];
    if (!e) return {};
    return { ...e.t > 0 ? { tmdb: e.t } : {}, ...e.l && HTTPS3.test(e.l) ? { logo: e.l } : {} };
  }
  function dress(cards) {
    return cards.map((c) => {
      const k = known(c.id);
      return k.tmdb && !(c.ids && c.ids.tmdb) ? { ...c, ids: { ...c.ids || {}, tmdb: k.tmdb } } : c;
    });
  }
  async function fill(cards, budgetMs) {
    if (!usable()) return 0;
    const b = read();
    const end = clock2.now() + budgetMs;
    let asked = 0;
    for (const c of cards) {
      if (clock2.now() + CALL_MS > end) break;
      if (!c || typeof c.id !== "string" || Object.hasOwn(b, c.id) || c.ids && c.ids.tmdb && c.noLogo) continue;
      try {
        const a = await tmdb.metadata(c, { deadline: end });
        if (typeof a?.logo !== "string") continue;
        b[c.id] = { t: a && a.ids && Number.isInteger(a.ids.tmdb) ? a.ids.tmdb : 0, l: a && typeof a.logo === "string" ? a.logo : "" };
      } catch (e) {
        if (e && e.code === "rate_limited") break;
        continue;
      }
      asked++;
    }
    if (asked > 0) write();
    return asked;
  }
  return { known, dress, fill, usable };
}
var TAB_KEY = "browseTab";
function makeBrowse({ kino: kino2, catalog, tmdb = null, recent: recent2, clock: clock2, liveTiles = null, countryRow = null, live: live2 = null }) {
  const meta = makeMetaCache({ kino: kino2, tmdb, clock: clock2 });
  const enrich = (data) => data ? {
    slides: data.slides.map((s) => {
      const k = meta.known(s.id);
      return k.logo ? { ...s, logo: k.logo } : s;
    }),
    rails: data.rails.map((r) => ({ ...r, items: meta.dress(r.items) }))
  } : data;
  const memo = /* @__PURE__ */ new Map();
  let recentCards = [];
  let seen = null;
  const lang = () => ({ english: isEnglish(kino2), spanish: isSpanish(kino2) });
  const stored = () => {
    try {
      const t = kino2.storage.get(TAB_KEY);
      return TAB_IDS.includes(t) ? t : null;
    } catch (_) {
      return null;
    }
  };
  const remember = (tab) => {
    try {
      kino2.storage.set(TAB_KEY, tab);
    } catch (_) {
    }
  };
  const idsOf = () => typeof catalog.idsLookup === "function" ? catalog.idsLookup() : void 0;
  function paint(tab) {
    const kept = catalog.peek();
    if (!kept) return;
    if (seen !== kept.rows) {
      seen = kept.rows;
      for (const [t, m] of memo) if (!m.whole) memo.delete(t);
    }
    if (!memo.has(tab)) {
      const { english: english2, spanish: spanish2 } = lang();
      const data = tabOf(kept.rows, tab, clock2.now(), idsOf(), english2, spanish2);
      if (data) memo.set(tab, { data, whole: false });
    }
    const { english, spanish } = lang();
    recentCards = recentOf(kept.rows, recent2.ids(), clock2.now(), idsOf(), english, spanish);
  }
  const tabFromArgs = (route) => {
    const a = route && route.args && typeof route.args === "object" ? route.args : {};
    return TAB_IDS.includes(a.tab) ? a.tab : null;
  };
  function needed(tab, device) {
    const order = [tab, ...TAB_IDS.filter((t) => t !== tab)];
    return order.filter((t, i) => (i === 0 || device !== "tv") && !(memo.get(t) && memo.get(t).whole));
  }
  const HIST_KEY = "searchHist:v1";
  const HIST_MAX = 24;
  const slim2 = (c) => ({ id: c.id, ref: c.ref, title: c.title, kind: c.kind, ...c.poster ? { poster: c.poster } : {}, ...c.backdrop ? { backdrop: c.backdrop } : {}, ...c.year ? { year: c.year } : {}, ...c.ids ? { ids: c.ids } : {} });
  function readHistory() {
    try {
      const raw = kino2.storage.get(HIST_KEY);
      const o = raw ? JSON.parse(raw) : null;
      return o && o.v === 1 && Array.isArray(o.e) ? o.e.filter((c) => c && typeof c.id === "string" && typeof c.ref === "string" && typeof c.title === "string").slice(0, HIST_MAX) : [];
    } catch (_) {
      return [];
    }
  }
  function rememberFound(cards) {
    try {
      const fresh = cards.filter((c) => c.adult !== true).slice(0, 12).map(slim2);
      const ids = new Set(fresh.map((c) => c.id));
      const next = [...fresh, ...readHistory().filter((c) => !ids.has(c.id))].slice(0, HIST_MAX);
      kino2.storage.set(HIST_KEY, JSON.stringify({ v: 1, e: next }));
    } catch (_) {
    }
  }
  const CHANNELS_PER_SCREEN = 40;
  let liveRow = null;
  let liveTilesList = null;
  const livePages = new Map();
  const liveCards = (items) => (Array.isArray(items) ? items : []).filter((i) => i && !i.adult && typeof i.id === "string" && typeof i.ref === "string").map((i) => cardOf({ ...i, kind: "live", poster: i.poster || i.logo }));
  function livePageState(state) {
    const cat = typeof state.lcat === "string" ? state.lcat : liveTilesList?.[0]?.ref ?? null;
    const query = typeof state.lq === "string" ? state.lq : "";
    const path = Array.isArray(state.lpath) ? state.lpath : [];
    const cursor = path[path.length - 1];
    const key = JSON.stringify([query, query ? null : cat, cursor]);
    const page = livePages.get(key);
    const last = page ? Math.max(0, Math.ceil(page.items.length / CHANNELS_PER_SCREEN) - 1) : 0;
    const part = state.lpart === -1 ? last : Math.min(last, Math.max(0, Number(state.lpart) || 0));
    return { cat, query, path, cursor, key, page, last, part };
  }
  async function loadLiveRow() {
    let items = [];
    try {
      const row2 = countryRow ? await countryRow(clock2.now() + 6e3) : null;
      items = row2 && Array.isArray(row2.items) ? row2.items : [];
      if (items.length === 0 && liveTiles) {
        const tiles = await liveTiles.tiles();
        if (tiles.length > 0) {
          const page = await liveTiles.browse(tiles[0].ref);
          items = page && page.items ? page.items : [];
        }
      }
    } catch (e) {
      trace(kino2, "browse", "live_fail", { code: errCode(e) });
    }
    liveRow = liveCards(items).slice(0, 20);
  }
  async function loadLiveTiles() {
    const tiles = liveTiles ? await liveTiles.tiles({ strict: true }) : [];
    liveTilesList = tiles.filter((t) => t && typeof t.ref === "string" && typeof t.title === "string" && !t.adult).map((t) => ({ ref: t.ref, title: t.title }));
  }
  let found = null;
  const details2 = /* @__PURE__ */ new Map();
  const paramsOf = (route) => route && route.params && typeof route.params === "object" ? route.params : {};
  function view2(ctx) {
    const st = ctx.state && typeof ctx.state === "object" ? ctx.state : {};
    if (ctx.route && ctx.route.name === "detail") {
      const p = paramsOf(ctx.route);
      if (typeof p.open === "string" && typeof p.i === "string") {
        return detailPage({ r: { ref: p.open, id: p.i, kind: p.k === "movie" ? "movie" : "series", title: typeof p.t === "string" ? p.t : "" }, entry: details2.get(p.open) || null, season: Number(st.season) || 0, episodePage: st.episodePage });
      }
    }
    if (ctx.route && ctx.route.name === "search") {
      const query = typeof st.sq === "string" ? st.sq : "";
      const items = found && found.q === query ? found.items : null;
      const status = query === "" ? "idle" : st.sstate === "fail" ? "fail" : items ? "done" : "loading";
      return searchView({ query, status, items, history: query === "" ? readHistory() : [], device: ctx.device });
    }
    if (ctx.route && ctx.route.name === "live") {
      const { cat, query, path, page, part, last } = livePageState(st);
      const start = part * CHANNELS_PER_SCREEN;
      return liveView({
        tiles: liveTilesList, cat, query, device: ctx.device,
        items: page ? page.items.slice(start, start + CHANNELS_PER_SCREEN) : [],
        previous: part > 0 || path.length > 0,
        next: part < last || Boolean(page?.next), pageKey: path.length + "-" + part,
        failed: st.lfail === true, loading: !page && (query !== "" || !liveTilesList || cat !== null)
      });
    }
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(ctx.route) ?? stored() ?? TAB_IDS[0];
    paint(tab);
    const m = memo.get(tab);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    return browseView({ tab, data: m ? enrich(m.data) : null, recent: meta.dress(recentCards), live: liveRow || [], pending, failed: !!(st.failed && st.failed[tab]), device: ctx.device });
  }
  async function load(tab) {
    const rows = await catalog.rows("section", tab);
    const { english, spanish } = lang();
    const data = tabOf(rows, tab, clock2.now(), idsOf(), english, spanish);
    if (data) memo.set(tab, { data, whole: true });
    seen = null;
    return data !== null;
  }
  const events = {
    open({ route, state, device }) {
      const tab = tabFromArgs(route) ?? (TAB_IDS.includes(state.tab) ? state.tab : stored() ?? TAB_IDS[0]);
      paint(tab);
      const list = needed(tab, device);
      const out = { state: { tab, pending: liveRow === null ? [...list.slice(0, 1), "live", ...list.slice(1)] : list, failed: null } };
      const a = route && route.args && typeof route.args === "object" ? route.args : {};
      if (typeof a.open === "string" && typeof a.i === "string" && (a.k === "movie" || a.k === "series")) {
        out.route = pushOf(JSON.stringify(a));
        out.state.season = null;
        out.state.episodePage = null;
      }
      return out;
    },
    // A card of the list was tapped: its page goes over the list.
    openTitle({ arg }) {
      const route = pushOf(arg);
      return route ? { route, state: { season: null, episodePage: null } } : null;
    },
    // The page's timer: loads the title once, then no timer.
    async dtick({ route }) {
      const p = paramsOf(route);
      if (typeof p.open !== "string" || details2.has(p.open)) return { state: { dv: Date.now() } };
      try {
        details2.set(p.open, { d: await loadDetail(p, { tmdb, catalog }) });
      } catch (e) {
        trace(kino2, "browse", "detail_fail", { code: errCode(e) });
        details2.set(p.open, { d: null });
      }
      return { state: { dv: Date.now() } };
    },
    dretry({ route }) {
      details2.delete(paramsOf(route).open);
      return { state: { dv: Date.now() } };
    },
    season({ value, arg }) {
      const n = parseInt(value != null ? value : arg, 10);
      return n > 0 ? { state: { season: n, episodePage: null } } : null;
    },
    episodePage({ value, arg }) {
      const input = value ?? arg;
      const page = Number(input);
      return input != null && input !== "" && Number.isSafeInteger(page) && page >= 0 ? { state: { episodePage: page } } : null;
    },
    tab({ value, arg, state, device }) {
      const tab = TAB_IDS.includes(value) ? value : TAB_IDS.includes(arg) ? arg : null;
      if (!tab) return null;
      remember(tab);
      paint(tab);
      const failed = { ...state.failed || {} };
      delete failed[tab];
      const pending = [tab, ...Array.isArray(state.pending) ? state.pending.filter((t) => t !== tab) : []];
      return { state: { tab, pending: memo.get(tab) && memo.get(tab).whole ? pending.slice(1) : pending, failed } };
    },
    // The floating button: straight to the search page, empty and ready for the words.
    openSearch() {
      return { route: { push: "search" }, state: { sq: "", sstate: null } };
    },
    // The search page's submit: the search page opens in this very plugin (skeletons first, results as they come).
    search({ value, route }) {
      const q = value && typeof value.q === "string" ? value.q.trim().slice(0, 100) : "";
      if (q === "") return null;
      const state = { sq: q, sstate: "loading" };
      return route && route.name === "search" ? { state } : { route: { push: "search" }, state };
    },
    // The search page's timer: one portal search per press, then no timer.
    async stick({ state }) {
      const q = typeof state.sq === "string" ? state.sq : "";
      if (q === "" || state.sstate !== "loading") return null;
      try {
        const out = await catalog.search({ q });
        found = { q, items: (Array.isArray(out) ? out : []).slice(0, 60).map(cardOf) };
        rememberFound(found.items);
        return { state: { sstate: "done" } };
      } catch (e) {
        trace(kino2, "browse", "search_fail", { code: errCode(e) });
        return { state: { sstate: "fail" } };
      }
    },
    sretry({ state }) {
      return typeof state.sq === "string" && state.sq !== "" ? { state: { sstate: "loading" } } : null;
    },
    back() {
      return { route: { pop: true }, state: { sq: null, sstate: null } };
    },
    // Read only the provider page the user opened. Older pages can be revisited by cursor.
    async ltick({ state }) {
      if (state.lfail) return null;
      const { cat, query, path, cursor, key, page } = livePageState(state);
      try {
        if (!query && !liveTilesList) await loadLiveTiles();
        else if (!page && (query || cat)) {
          const result = query ? await live2?.liveSearch({ query, cursor }) : await liveTiles.browse(cat, cursor, { strict: true });
          const next = typeof result?.next === "string" && !path.includes(result.next) ? result.next : "";
          if (livePages.size >= 3) livePages.delete(livePages.keys().next().value);
          livePages.set(key, { items: liveCards(result?.items), next });
        }
        return { state: { lfail: null } };
      } catch (e) {
        trace(kino2, "browse", "live_page_fail", { code: errCode(e) });
        return { state: { lfail: true } };
      }
    },
    lnext({ state }) {
      const { page, path, part, last } = livePageState(state);
      if (part < last) return { state: { lpart: part + 1 } };
      return page?.next ? { state: { lpath: [...path, page.next], lpart: 0, lfail: null } } : null;
    },
    lprev({ state }) {
      const { path, part } = livePageState(state);
      if (part > 0) return { state: { lpart: part - 1 } };
      return path.length ? { state: { lpath: path.slice(0, -1), lpart: -1, lfail: null } } : null;
    },
    lretry() {
      return { state: { lfail: null } };
    },
    // The live page's search box: its words show the matching channels; empty words go back to the genres.
    lsearch({ value }) {
      const q = value && typeof value.lq === "string" ? value.lq.trim().slice(0, 100) : "";
      return { state: { lq: q || null, lpath: null, lpart: null, lfail: null } };
    },
    lcat({ value }) {
      return typeof value === "string" && value !== "" ? { state: { lcat: value, lq: null, lpath: null, lpart: null, lfail: null } } : null;
    },
    // The gear opens account settings.
    go({ arg }) {
      if (arg === "live") return { route: { push: "live" }, state: { lcat: null, lq: null, lpath: null, lpart: null, lfail: null } };
      return arg === "settings" ? { route: { push: "settings" }, state: { fromBrowse: true } } : null;
    },
    retry({ state, device }) {
      const tab = TAB_IDS.includes(state.tab) ? state.tab : TAB_IDS[0];
      return { state: { failed: null, pending: [tab, ...needed(tab, device).filter((t) => t !== tab)] } };
    },
    async tick({ state }) {
      const pending = Array.isArray(state.pending) ? state.pending : [];
      if (pending.length === 0) return null;
      const [next, ...rest] = pending;
      const failed = { ...state.failed || {} };
      if (typeof next === "string" && next.startsWith("meta:")) {
        const m = memo.get(next.slice(5));
        if (m) await meta.fill([...m.data.slides, ...m.data.rails.flatMap((r) => r.items.slice(0, 6))], 12e3);
        return { state: { pending: rest } };
      }
      if (next === "live") {
        await loadLiveRow();
        return { state: { pending: rest } };
      }
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
        if (ok && meta.usable()) rest.unshift("meta:" + next);
      } catch (e) {
        trace(kino2, "browse", "tab_fail", { code: errCode(e) });
        failed[next] = true;
      }
      return { state: { pending: rest, failed } };
    }
  };
  async function event(ev) {
    const handler = Object.hasOwn(events, ev.name) ? events[ev.name] : null;
    return handler ? await handler({ ...ev, state: ev.state || {} }) ?? null : null;
  }
  return { view: view2, event };
}
var KEY5 = "recent:v1";
var MAX_RECENT = 12;
function makeRecentStore({ kino: kino2, clock: clock2 }) {
  function read() {
    try {
      const raw = kino2.storage.get(KEY5);
      if (raw === null || raw === void 0) return [];
      const o = JSON.parse(raw);
      if (!isObject(o) || o.v !== 1 || !Array.isArray(o.e)) return [];
      return o.e.filter((x) => isObject(x) && typeof x.id === "string" && x.id !== "" && Number.isFinite(x.at)).slice(0, MAX_RECENT);
    } catch (_) {
      return [];
    }
  }
  function note(ref) {
    try {
      const magis = decode(ref);
      if (!magis) return;
      const entries = read();
      if (entries[0] && entries[0].id === magis.contentId) return;
      const next = [{ id: magis.contentId, at: clock2.now() }, ...entries.filter((e) => e.id !== magis.contentId)].slice(0, MAX_RECENT);
      kino2.storage.set(KEY5, JSON.stringify({ v: 1, e: next }));
    } catch (_) {
    }
  }
  const ids = () => read().map((e) => e.id);
  return { note, ids };
}
var servedBy = () => getDeps().catalog.servedBy();
async function search(query) {
  await null;
  let scoped = false;
  try {
    scoped = query !== null && typeof query === "object" && query.within !== void 0 && query.within !== null;
  } catch (_) {
    scoped = false;
  }
  return traced(kino, clock, "search", () => guarded(({ catalog }) => catalog.search(query)), scoped ? { scope: "within" } : {}, servedBy);
}
async function home() {
  await null;
  return traced(kino, clock, "home", () => guarded(async ({ catalog, sports }) => {
    const deadline = clock.now() + SPORTS_HOME_MS;
    const [rows, sportsRow, curated] = await Promise.all([
      catalog.home(),
      sports.homeRow(deadline).catch(() => null),
      catalog.homeCurated(deadline).catch(() => null)
    ]);
    let out = Array.isArray(rows) ? rows.slice() : [];
    if (Array.isArray(curated) && curated.length > 0) {
      const have = new Set(out.map((r) => homeTitleKey(r && r.title)));
      for (const r of curated) {
        if (!r || !Array.isArray(r.items) || r.items.length === 0) continue;
        const key = homeTitleKey(r.title);
        if (have.has(key)) continue;
        have.add(key);
        out.push(r);
      }
    }
    if (sportsRow && Array.isArray(sportsRow.items) && sportsRow.items.length > 0) out = [sportsRow, ...out];
    return out.slice(0, MAX_HOME_ROWS);
  }), {}, servedBy);
}
async function browse(ref, cursor) {
  await null;
  const live2 = isLiveTileRef(ref);
  return traced(
    kino,
    clock,
    "browse",
    () => guarded(({ catalog, liveTiles }) => live2 ? liveTiles.browse(ref, cursor) : catalog.browse(ref, cursor)),
    live2 ? { kind: "live" } : {},
    servedBy
  );
}
async function section2(arg) {
  await null;
  return traced(kino, clock, "section", () => guarded(({ section: s }) => s.section(arg)), {}, servedBy);
}
async function categories() {
  await null;
  return traced(kino, clock, "categories", () => guarded(({ categories: c }) => c.categories()), {}, servedBy);
}
async function episodes(ref) {
  await null;
  return traced(kino, clock, "episodes", () => guarded(({ catalog }) => catalog.episodes(ref)), {}, servedBy);
}
async function details(ref) {
  await null;
  return traced(kino, clock, "details", () => guarded(({ catalog }) => catalog.details(ref)), {}, servedBy);
}
async function resolve(ref, options) {
  await null;
  const liveChannel = isChannelRef(ref);
  return traced(kino, clock, "resolve", () => guarded(async ({ resolve: resolver, recent, session }) => {
    const result = await resolver.resolve(ref, options);
    if (!session.isSignedIn()) throw kino.error("auth_required", ACCOUNT_NEEDED);
    if (!liveChannel) recent.note(ref);
    return result;
  }), { kind: liveChannel ? "live" : "vod" }, servedBy);
}
async function sign(request) {
  // The native signing lane only exposes crypto/config; the playback context
  // already carries the credentials issued for the resolved channel.
  try {
    return signRequest(request, clock.now());
  } catch (e) {
    if (isKinoError(e)) throw e;
    trace(kino, "sign", "fail", { why: typeof e?.why === "string" ? e.why : errCode(e) });
    throw kino.error("unavailable", "No se pudo firmar la petición del canal");
  }
}
async function liveCategories() {
  await null;
  return traced(kino, clock, "liveCategories", () => guarded(async ({ live: live2, sports }) => {
    const base = await live2.liveCategories();
    return [sports.category(), ...Array.isArray(base) ? base : []];
  }));
}
async function liveChannels(args) {
  await null;
  return traced(kino, clock, "liveChannels", () => guarded(({ live: live2, sports }) => {
    const id = isObject(args) ? args.categoryId : void 0;
    return sports.isCategory(id) ? sports.channels(clock.now() + SPORTS_HOME_MS) : live2.liveChannels(args);
  }));
}
async function liveSearch(args) {
  await null;
  return traced(kino, clock, "liveSearch", () => guarded(({ live: live2 }) => live2.liveSearch(args)));
}
async function events(arg) {
  await null;
  return traced(kino, clock, "events", () => guarded(({ sports }) => sports.events(arg)));
}
var migrator = makeMigrate();
async function migrate(input) {
  await null;
  try {
    return await traced(kino, clock, "migrate", () => migrator.migrate(input), { kind: input && typeof input.kind === "string" ? input.kind : "?" });
  } catch (e) {
    if (isKinoError(e)) throw e;
    trace(kino, "migrate", "fail", { code: errCode(e) });
    throw kino.error("unavailable", "Xuper no está disponible ahora");
  }
}
TEXTS = Object.freeze({ ...TEXTS, ...{
  "accountCreatedSignIn": [
    "Cuenta creada. Toca Iniciar sesión para entrar.",
    "Account created. Tap Sign in to enter."
  ],
  "accountCreatedSignedIn": [
    "Cuenta creada y sesión iniciada",
    "Account created and signed in"
  ],
  "accountFaqAnswer": [
    "Abre Crear cuenta, introduce tu correo y solicita el código. Después introduce el código recibido y la contraseña que quieres usar.",
    "Open Create account, enter your email and request the code. Then enter the received code and the password you want to use."
  ],
  "accountFaqQuestion": [
    "¿Cómo creo una cuenta?",
    "How do I create an account?"
  ],
  "accountPending": [
    "Cuenta guardada, pendiente de conectar.",
    "Saved account, waiting to connect."
  ],
  "askCodeAgain": [
    "Pide el código otra vez.",
    "Ask for the code again."
  ],
  "codeAlreadySent": [
    "Ya te enviamos un código; espera un minuto antes de pedir otro",
    "We already sent you a code; wait a minute before asking for another"
  ],
  "codeSentSave": [
    "Te enviamos un código a {email}. Si es otro correo, pulsa Guardar y vuelve a tocar el botón.",
    "We sent a code to {email}. If that is not the one, tap Save and press the button again."
  ],
  "connectionRegionBlocked": [
    "El proveedor rechazó la conexión en esta región.",
    "The provider refused the connection in this region."
  ],
  "credentialsRefused": [
    "Credenciales de Xuper inválidas",
    "Xuper did not accept these sign-in details"
  ],
  "diagnosticRegion": [
    "Respuesta regional",
    "Region response"
  ],
  "directConnection": [
    "Las consultas van directamente al proveedor Xuper.",
    "Requests go directly to the Xuper provider."
  ],
  "enterValidEmail": [
    "Escribe un correo válido",
    "Enter a valid email"
  ],
  "fillAccount": [
    "Faltan los datos de tu cuenta: complétalos en {place}.",
    "Your account details are missing: fill them in {place}."
  ],
  "fillCode": [
    "Escribe el código que te enviamos en {place}.",
    "Enter the code we sent you in {place}."
  ],
  "guestConnected": [
    "Sesión anónima propia conectada. La cuenta es opcional.",
    "Your guest session is connected. An account is optional."
  ],
  "guestFaqAnswer": [
    "La conexión inicial usa la activación anónima del proveedor. Algunos canales pueden exigir tu cuenta. Si el proveedor rechaza el acceso, el plugin muestra ese motivo.",
    "The initial connection uses the provider’s guest activation. Some channels may require your account. If the provider refuses access, the plugin shows that reason."
  ],
  "guestFaqQuestion": [
    "¿Necesito una cuenta?",
    "Do I need an account?"
  ],
  "guestReady": [
    "El catálogo conecta automáticamente con una sesión anónima propia. La cuenta es opcional.",
    "The catalog connects automatically with your own guest session. An account is optional."
  ],
  "integrationAvailable": [
    "Declarada en este plugin; se abre al conectar.",
    "Declared in this plugin; opened when connecting."
  ],
  "integrationLabel": [
    "Clave de comunicación",
    "Communication key"
  ],
  "integrationUnavailable": [
    "No disponible para este origen.",
    "Unavailable for this origin."
  ],
  "ownAccountOptional": [
    "Opcional: usa tu cuenta personal cuando el proveedor la requiera.",
    "Optional: use your personal account when the provider requires one."
  ],
  "privacyDescription": [
    "El plugin no envía telemetría ni comparte sesiones. Los ajustes de cuenta se guardan en la app y se usan para conectar con Xuper.",
    "The plugin sends no telemetry and shares no sessions. Account settings are stored in the app and used to connect to Xuper."
  ],
  "privacyTitle": [
    "Privacidad",
    "Privacy"
  ],
  "regionBlocked": [
    "Xuper no permite esta acción desde tu región o tu red (a veces es una VPN). Prueba con otra conexión.",
    "Xuper does not allow this from your region or network (sometimes a VPN). Try another connection."
  ],
  "registrationBusy": [
    "Espera a que termine el envío del código.",
    "Wait for the verification code request to finish."
  ],
  "requestNotSaved": [
    "No pudimos guardar tu pedido. Vuelve a tocar Crear cuenta.",
    "We could not save your request. Tap Create account again."
  ],
  "scrAccHeld": [
    "Conectado",
    "Signed in"
  ],
  "scrBack": [
    "Volver",
    "Back"
  ],
  "scrChangeAccount": [
    "Cambiar de cuenta",
    "Change account"
  ],
  "scrChangeEmail": [
    "Cambiar correo",
    "Change email"
  ],
  "scrClassicNote": [
    "Ajustes del plugin. La cuenta es opcional; el catálogo activa su propia sesión al abrirlo.",
    "Plugin settings. An account is optional; the catalog activates its own session when opened."
  ],
  "scrCodeError": [
    "Escribe el código que llegó a tu correo",
    "Enter the code that came to your email"
  ],
  "scrCodeLabel": [
    "Código",
    "Code"
  ],
  "scrCodeRules": [
    "El código vale 30 minutos y solo en este aparato.",
    "The code works for 30 minutes and only on this device."
  ],
  "scrCodeSentTo": [
    "Enviamos un código a {email}.",
    "We sent a code to {email}."
  ],
  "scrConnectNow": [
    "Conectar ahora",
    "Connect now"
  ],
  "scrCopyDiag": [
    "Copiar diagnóstico",
    "Copy diagnostics"
  ],
  "scrCreate": [
    "Crear una cuenta",
    "Create an account"
  ],
  "scrCreateButton": [
    "Crear cuenta",
    "Create account"
  ],
  "scrCreateSub": [
    "Gratis, con tu correo",
    "Free, with your email"
  ],
  "scrCreatedPending": [
    "Cuenta creada. La sesión se inicia sola en un momento, o toca Conectar ahora.",
    "Account created. The session starts by itself in a moment, or tap Connect now."
  ],
  "scrDiagDevice": [
    "Aparato",
    "Device"
  ],
  "scrDiagKino": [
    "Versión del motor compatible",
    "Compatible runtime version"
  ],
  "scrDiagNoPersonal": [
    "Sin datos personales: ni tu correo ni tus sesiones.",
    "No personal data: neither your email nor your sessions."
  ],
  "scrDiagPlugin": [
    "Versión del plugin",
    "Plugin version"
  ],
  "scrDiagTitle": [
    "Diagnóstico",
    "Diagnostics"
  ],
  "scrEmailError": [
    "Revisa el correo",
    "Check the email"
  ],
  "scrEmailLabel": [
    "Correo electrónico",
    "Email"
  ],
  "scrFaqTitle": [
    "Preguntas frecuentes",
    "Frequently asked questions"
  ],
  "scrGenericError": [
    "No se pudo completar. Inténtalo de nuevo en un momento.",
    "It could not be done. Try again in a moment."
  ],
  "scrHelp": [
    "Ayuda",
    "Help"
  ],
  "scrHomeHint": [
    "Una fila con los canales en vivo de tu país al final de Inicio.",
    "A row with your country's live channels at the end of Home."
  ],
  "scrHomeTitle": [
    "Inicio",
    "Home"
  ],
  "scrNewPassword": [
    "Contraseña de tu cuenta nueva",
    "Password for your new account"
  ],
  "scrPasswordError": [
    "Escribe la contraseña",
    "Enter the password"
  ],
  "scrPasswordLabel": [
    "Contraseña",
    "Password"
  ],
  "scrRefresh": [
    "Actualizar estado",
    "Refresh status"
  ],
  "scrRegTvNote": [
    "Es más cómodo en el teléfono: tus ajustes se sincronizan con este aparato.",
    "It is easier on the phone: your settings sync with this device."
  ],
  "scrResend": [
    "Reenviar código",
    "Send the code again"
  ],
  "scrResendConfirm": [
    "El código anterior deja de valer. ¿Enviar otro?",
    "The previous code stops working. Send another one?"
  ],
  "scrResendIn": [
    "en",
    "in"
  ],
  "scrResent": [
    "Te enviamos otro código; el anterior ya no vale.",
    "We sent you another code; the previous one no longer works."
  ],
  "scrSendCode": [
    "Enviar código",
    "Send code"
  ],
  "scrSentAt": [
    "Enviado",
    "Sent"
  ],
  "scrSession": [
    "Sesión",
    "Session"
  ],
  "scrSessionAccount": [
    "Tu cuenta",
    "Your account"
  ],
  "scrSessionAnon": [
    "Anónima propia",
    "Your own anonymous one"
  ],
  "scrSessionNone": [
    "Todavía ninguna",
    "None yet"
  ],
  "scrSignIn": [
    "Iniciar sesión",
    "Sign in"
  ],
  "scrSignInCaption": [
    "Conecta tu cuenta personal. Para explorar puedes seguir con la sesión anónima.",
    "Connect your personal account. You can browse using your guest session."
  ],
  "scrSignInTitle": [
    "Inicia sesión con tu cuenta",
    "Sign in with your account"
  ],
  "scrSignOut": [
    "Cerrar sesión",
    "Sign out"
  ],
  "scrSignOutConfirm": [
    "¿Cerrar la cuenta y volver a la sesión anónima propia?",
    "Sign out and return to your own guest session?"
  ],
  "scrStatusCard": [
    "Estado",
    "Status"
  ],
  "scrStepCode": [
    "Código y contraseña",
    "Code and password"
  ],
  "scrStepDone": [
    "Listo",
    "Done"
  ],
  "scrStepEmail": [
    "Tu correo",
    "Your email"
  ],
  "scrTabAccount": [
    "Cuenta",
    "Account"
  ],
  "scrTabConnection": [
    "Conexión",
    "Connection"
  ],
  "scrTabMore": [
    "Inicio y ayuda",
    "Home & help"
  ],
  "sendCodeFailed": [
    "Xuper no pudo enviar el código a ese correo. Revisa que esté bien escrito en {place}.",
    "Xuper could not send the code to that email. Check that it is spelled right in {place}."
  ],
  "signedIn": [
    "Sesión iniciada",
    "Signed in"
  ],
  "signedOutPrivate": [
    "Sesión cerrada. El catálogo volverá a usar una sesión anónima propia.",
    "Signed out. The catalog will use your own guest session again."
  ],
  "statusConnectedAs": [
    "Conectado como {email}",
    "Signed in as {email}"
  ],
  "statusUnknown": [
    "No se pudo consultar el estado",
    "Could not check the status"
  ],
  "accountIncomplete": [
    "Completa el correo y la contraseña de tu cuenta, o borra ambos para volver a la sesión anónima.",
    "Complete your account email and password, or clear both to return to your guest session."
  ]
} });
// Account and connection settings use the same API 9 actions and the optional native screen kit.
const ACCOUNT_UI_VERSION = "1.0.0";
const REGISTRATION_PENDING_KEY = "pendingRegistration";
const REGISTRATION_LIFETIME_MS = 30 * 60 * 1000;
const REGISTRATION_RESEND_MS = 60 * 1000;
function maskEmail(email) {
  const text = asText(email).trim();
  const at = text.lastIndexOf("@");
  if (at < 1 || at === text.length - 1) return "";
  const domain = text.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  return `${[...text][0]}•••@${[...domain][0]}•••${dot > 0 ? domain.slice(dot) : ""}`;
}
function registrationFailure(error) {
  if (isKinoError(error)) return error;
  if (error instanceof PortalError) return mapPortalError(error.code, error.message, kino);
  return kino.error("unavailable", say(kino, "scrGenericError"));
}
function makeRegistration() {
  const fingerprint = makeFingerprint(kino);
  let sending = null;
  function pendingFor(email) {
    try {
      const saved = JSON.parse(kino.storage.get(REGISTRATION_PENDING_KEY) || "null");
      if (!saved || saved.email !== email || !saved.userToken || !saved.sn || typeof saved.at !== "number") return null;
      if (clock.now() < saved.at || clock.now() - saved.at >= REGISTRATION_LIFETIME_MS) return null;
      return saved;
    } catch (_) { return null; }
  }
  async function sendRegistrationCode(email, bounds) {
    const previous = pendingFor(email);
    if (previous && clock.now() - previous.at < REGISTRATION_RESEND_MS) return { sent: false, at: previous.at };
    if (sending) return sending.email === email ? sending.promise : Promise.reject(kino.error("unavailable", say(kino, "registrationBusy")));
    const promise = (async () => {
      requireIntegration(kino);
      const { portal } = getDepsForAccount(email);
      const minted = await portal.call("v3/snToken", fingerprint(), { baseFields: false, ...bounds });
      if (!minted || !minted.snToken) throw kino.error("unavailable", say(kino, "sendCodeFailed"));
      const snToken = asText(minted.snToken);
      const sn = snFrom(kino, minted, snToken);
      const activated = await portal.call("v8/active", activateBean(snToken), { baseFields: false, sn, ...bounds });
      if (!activated || !activated.userToken) throw kino.error("unavailable", say(kino, "sendCodeFailed"));
      const pending = { userId: asText(activated.userId), userToken: asText(activated.userToken), sn, email, at: clock.now() };
      await portal.call("v2/sendEmailVerifyCode", { email, type: "1", userId: pending.userId, userToken: pending.userToken }, { baseFields: false, sn, ...bounds });
      try { kino.storage.set(REGISTRATION_PENDING_KEY, JSON.stringify(pending), { ttlMs: REGISTRATION_LIFETIME_MS }); }
      catch (_) { throw kino.error("unavailable", say(kino, "requestNotSaved")); }
      return { sent: true, at: pending.at };
    })();
    sending = { email, promise };
    try { return await promise; }
    catch (error) { throw registrationFailure(error); }
    finally { sending = null; }
  }
  async function confirmRegistration(pending, code, password, bounds) {
    requireIntegration(kino);
    const { email, userId, userToken, sn } = pending;
    const { portal, session } = getDepsForAccount(email);
    const pwd = kino.crypto.hash("md5", password + PASSWORD_SALT);
    const opts = { baseFields: false, sn, ...bounds };
    let bound = false;
    try {
      await portal.call("v2/validateVerifyCode", { type: "1", email, verifyCode: code, userToken, userId }, opts);
      await portal.call("v2/bindEmail", { email, pwd, type: "1", userId, userToken }, opts);
      kino.storage.set("xp9:registeredAccount", email.trim().toLowerCase());
      bound = true;
      const answer = await portal.call("v8/login", {
        accountType: "2", userName: email, password: pwd, type: "1", macAddr: FIXED_MAC,
        areaCode: "", verificationCode: "", verificationToken: "", matadata: "", signdata: "", channel: "default"
      }, opts);
      if (!answer || !answer.userToken) throw kino.error("auth_required", say(kino, "accountCreatedSignIn"));
      await session.adoptSession(answer, email, password, sn);
    } catch (error) {
      if (!bound) throw registrationFailure(error);
      kino.storage.remove(REGISTRATION_PENDING_KEY);
      return { loggedIn: false };
    }
    kino.storage.remove(REGISTRATION_PENDING_KEY);
    return { loggedIn: true };
  }
  return { pendingFor, sendRegistrationCode, confirmRegistration };
}
let registrationInstance = null;
const registration = () => registrationInstance || (registrationInstance = makeRegistration());
function accountFacts() {
  const pair = accountData(kino.config, kino.storage);
  const session = getDeps().session;
  const kind = session.kind();
  const configured = !!(pair.email && pair.password);
  const connected = session.isSignedIn();
  return {
    ok: true, available: integrationAvailable(kino), kind, account: kind === "own" && connected,
    ownConfigured: configured, incompleteAccount: !configured && !!(pair.email || pair.password), accountState: configured ? connected && kind === "own" ? "held" : "pending" : "none",
    emailMasked: maskEmail(pair.email), initial: [...pair.email][0]?.toUpperCase() || "?",
    regionBlocked: session.regionBlocked(), connected
  };
}
async function settingsStatus() {
  try {
    const facts = accountFacts();
    if (!facts.available) return { status: INTEGRATION_PENDING };
    if (facts.regionBlocked) return { status: say(kino, "connectionRegionBlocked") };
    if (facts.account) return { status: say(kino, "statusConnectedAs", { email: facts.emailMasked }) };
    if (facts.incompleteAccount) return { status: say(kino, "accountIncomplete") };
    if (facts.ownConfigured) return { status: say(kino, "accountPending") };
    return { status: say(kino, facts.connected ? "guestConnected" : "guestReady") };
  } catch (_) { return { status: say(kino, "statusUnknown") }; }
}
async function validateSettings(values = {}) {
  const v = isObject(values) ? values : {};
  const email = asText(v.email).trim(), password = asText(v.password);
  const regEmail = asText(v.regEmail).trim(), regPassword = asText(v.regPassword);
  const creating = !!(regEmail || regPassword || asText(v.verifyCode).trim());
  const targetEmail = creating ? regEmail : email;
  const targetPassword = creating ? regPassword : password;
  if (!targetEmail && !targetPassword) return null;
  const field = creating ? "regEmail" : "email";
  if (!targetEmail || !targetEmail.includes("@")) return { [field]: say(kino, "enterValidEmail") };
  if (!targetPassword) return creating ? null : { password: say(kino, "scrPasswordError") };
  if (!integrationAvailable(kino)) return { [field]: INTEGRATION_PENDING };
  if (creating) return null;
  const session = getDepsForAccount(targetEmail).session;
  const accepted = session.current();
  // ZUPER validates screen config again before saving. Reuse only this exact accepted account.
  if (accepted.userToken && accepted.acct === session.accountKey(targetEmail, targetPassword)) return null;
  try {
    await session.login(targetEmail, targetPassword, { timeoutMs: 12000, deadline: clock.now() + 17000 });
    return null;
  } catch (error) {
    if (isKinoError(error) && error.code === "auth_required") return { password: say(kino, "credentialsRefused") };
    throw registrationFailure(error);
  }
}
async function sendCodeTo(email) {
  const clean = asText(email).trim();
  if (!clean.includes("@")) throw kino.error("auth_required", say(kino, "enterValidEmail"));
  return registration().sendRegistrationCode(clean, { timeoutMs: 10000, deadline: clock.now() + 25000 });
}
async function registerWith({ email, code, password }) {
  const clean = asText(email).trim(), verify = asText(code).trim();
  if (!verify) throw kino.error("auth_required", say(kino, "fillCode"));
  if (!password) throw kino.error("auth_required", say(kino, "scrPasswordError"));
  const pending = registration().pendingFor(clean);
  if (!pending) throw kino.error("unavailable", say(kino, "askCodeAgain"));
  return registration().confirmRegistration(pending, verify, password, { timeoutMs: 10000, deadline: clock.now() + 25000 });
}
async function action(key) {
  if (key === "logout") {
    await getDeps().session.logout();
    kino.storage.remove("xp9:registeredAccount");
    deps = null;
    return { message: say(kino, "signedOutPrivate"), refresh: true, clearSettings: ["email", "password", "regEmail", "regPassword", "verifyCode"] };
  }
  if (key === "login") {
    requireIntegration(kino);
    const pair = accountData(kino.config, kino.storage);
    const bounds = { timeoutMs: 12000, deadline: clock.now() + 25000 };
    if (pair.email && pair.password) await getDepsForAccount(pair.email).session.login(pair.email, pair.password, bounds);
    else if (pair.email || pair.password) throw kino.error("auth_required", say(kino, "fillAccount"));
    else await getDeps().session.ensure(bounds);
    return { message: say(kino, pair.email ? "signedIn" : "guestConnected"), refresh: true };
  }
  if (key === "sendCode") {
    const email = asText(kino.config.get("regEmail")).trim();
    const out = await sendCodeTo(email);
    return { message: say(kino, out.sent ? "codeSentSave" : "codeAlreadySent", { email: maskEmail(email) }), refresh: true };
  }
  if (key === "register") {
    const email = asText(kino.config.get("regEmail")).trim();
    const password = asText(kino.config.get("regPassword"));
    const result = await registerWith({ email, password, code: kino.config.get("verifyCode") });
    return { message: say(kino, result.loggedIn ? "accountCreatedSignedIn" : "accountCreatedSignIn"), refresh: true, clearSettings: ["verifyCode", "email", "password"] };
  }
  return null;
}
const contentRoutes = new Set(["main", "categories", "search", "live", "detail"]);
function browseScreen(d) {
  if (!d.browseScreen) d.browseScreen = makeBrowse({ kino: d.host, catalog: d.catalog, tmdb: d.tmdb, recent: d.recent, clock, liveTiles: d.liveTiles, countryRow: d.countryRow, live: d.live });
  return d.browseScreen;
}
function makeAccountScreen() {
  const PLUGIN_VERSION = ACCOUNT_UI_VERSION;
  const PRESS_MS = 30000;
  const RESEND_WAIT_MS2 = REGISTRATION_RESEND_MS;
  const TABS2 = ["account", "connection", "more"];
  const EMAIL_PATTERN = "^\\s*[^@\\s]+@[^@\\s]+\\.[^@\\s]+\\s*$";
  const CODE_PATTERN = "^\\s*[0-9A-Za-z]{4,12}\\s*$";
  const text2 = (key, extra = {}, vars) => ({ type: "Text", ...twin(key, "text", vars), ...extra });
  const press = (event, arg) => ({ event, ...(arg !== undefined ? { arg } : {}), timeoutMs: PRESS_MS });
  const errorOf = (message) => typeof message === "string" && message ? { forceErrorText: message.slice(0, 200) } : {};
  const banner = (value, key) => value && typeof value.text === "string" && value.text ? [{ type: "MaterialBanner", key, role: ["info", "warning", "error", "success"].includes(value.role) ? value.role : "info", text: value.text.slice(0, 2000), ...(typeof value.textEn === "string" ? { textEn: value.textEn.slice(0, 2000) } : {}), ...(value.action ? { action: value.action } : {}) }] : [];
  const caption = (key, extra = {}, vars) => text2(key, { style: "caption", color: "muted", ...extra }, vars);
  const section = (key) => text2(key, { style: "h4" });
  const toastOf = (key, role = "info", vars = {}) => ({ ...twin(key, "text", vars), role });
  const sentence = (error) => isKinoError(error) && typeof error.userMessage === "string" && error.userMessage ? error.userMessage : isKinoError(error) && typeof error.message === "string" ? error.message.slice(0, 300) : say(kino, "scrGenericError");
  const errorToast = (error) => ({ toast: { text: sentence(error), role: "error" } });
  function accountTab(s, state) {
    const children = [];
    if (!s.available) children.push({ type: "MaterialBanner", key: "integrationMissing", role: "warning", text: INTEGRATION_PENDING });
    if (s.ownConfigured || s.incompleteAccount) children.push({ type: "Card", key: "accountCard", children: [
      { type: "ListTile", key: "accountTile", title: s.emailMasked || "•••", ...twin(s.account ? "scrAccHeld" : s.incompleteAccount ? "accountIncomplete" : "accountPending", "subtitle"), leading: { type: "CircleAvatar", text: s.initial } },
      { type: "Row", wrap: true, gap: 8, children: [
        ...(!s.account && !s.incompleteAccount ? [{ type: "ElevatedButton", key: "connectNow", ...twin("scrConnectNow", "labelText"), icon: "sync", onPressed: press("account.retry"), autofocus: true }] : []),
        { type: "Button", variant: "secondary", key: "changeAccount", ...twin("scrChangeAccount", "labelText"), icon: "person", onPressed: { event: "go", arg: "signin" } },
        { type: "TextButton", key: "signOut", ...twin("scrSignOut", "labelText"), ...twin("scrSignOutConfirm", "confirm"), onPressed: press("account.logout") }
      ] }
    ] });
    else children.push({ type: "MaterialBanner", key: "guestBanner", role: "info", ...twin(s.connected ? "guestConnected" : "guestReady") });
    children.push({ type: "Card", key: "accountActions", children: [
      ...(!s.ownConfigured && !s.incompleteAccount ? [{ type: "ListTile", key: "goSignIn", ...twin("scrSignIn", "title"), ...twin("ownAccountOptional", "subtitle"), leading: { type: "CircleAvatar", icon: "person" }, trailing: { type: "Icon", name: "arrow_forward" }, onTap: { event: "go", arg: "signin" }, autofocus: true }] : []),
      { type: "ListTile", key: "goRegister", ...twin("scrCreate", "title"), ...twin("scrCreateSub", "subtitle"), leading: { type: "CircleAvatar", icon: "add" }, trailing: { type: "Icon", name: "arrow_forward" }, onTap: { event: "go", arg: "register" } }
    ] });
    return children;
  }
  function connectionTab(s) {
    const sessionKey = s.account ? "scrSessionAccount" : s.connected ? "scrSessionAnon" : "scrSessionNone";
    return [
      { type: "Card", key: "statusCard", children: [
        section("scrStatusCard"),
        { type: "ListTile", key: "sessionRow", ...twin("scrSession", "title"), ...twin(sessionKey, "subtitle"), leading: { type: "Icon", name: "sync" } },
        { type: "ListTile", key: "integrationRow", ...twin("integrationLabel", "title"), ...twin(s.available ? "integrationAvailable" : "integrationUnavailable", "subtitle"), leading: { type: "Icon", name: "check" } },
        ...(s.regionBlocked ? [{ type: "MaterialBanner", key: "regionBlocked", role: "warning", ...twin("connectionRegionBlocked") }] : []),
        caption("directConnection"),
        { type: "Button", key: "retryConnection", ...twin("scrConnectNow", "labelText"), enabled: !s.incompleteAccount && s.available, icon: "sync", onPressed: press("account.retry") }
      ] },
      { type: "Card", key: "privacyCard", children: [section("privacyTitle"), text2("privacyDescription")] }
    ];
  }
  function diagnosticRows(s, ctx) {
    return [
      ["scrDiagPlugin", [PLUGIN_VERSION, PLUGIN_VERSION]],
      ["scrDiagKino", [ctx.appVersion || "?", ctx.appVersion || "?"]],
      ["scrDiagDevice", [ctx.device === "tv" ? "Televisor" : ctx.device === "desktop" ? "Computador" : "Teléfono", ctx.device === "tv" ? "TV" : ctx.device === "desktop" ? "Desktop" : "Phone"]],
      ["scrSession", s.account ? ["Cuenta propia", "Own account"] : s.connected ? ["Anónima propia", "Own guest session"] : ["Sin iniciar", "Not started"]],
      ["integrationLabel", s.available ? ["Disponible", "Available"] : ["No disponible", "Unavailable"]],
      ["diagnosticRegion", s.regionBlocked ? ["Rechazo regional recibido", "Region refusal received"] : ["Sin rechazo registrado", "No refusal recorded"]]
    ];
  }
  function diagnosticText(s, ctx) {
    const index = ctx.lang === "en" ? 1 : 0;
    return diagnosticRows(s, ctx).map(([key, value]) => `${twin(key, "label")[index ? "labelEn" : "label"]}: ${value[index]}`).join("\n").slice(0, 500);
  }
  function moreTab(s, ctx) {
    const rows = diagnosticRows(s, ctx).map(([key, value], n) => ({ type: "TableRow", key: "diag" + n, children: [{ type: "TableCell", ...twin(key) }, { type: "TableCell", text: value[0], textEn: value[1] }] }));
    return [
      { type: "Card", key: "homeCard", children: [section("scrHomeTitle"), caption("scrHomeHint"), { type: "settings", key: "homeForm", keys: ["homeCountry", "warmSession"], autoSave: true, onSaved: "saved" }] },
      { type: "Card", key: "faqCard", children: [section("scrFaqTitle"), { type: "ExpansionTile", key: "faq", items: [
        { key: "guest", ...twin("guestFaqQuestion", "title"), children: [text2("guestFaqAnswer")] },
        { key: "account", ...twin("accountFaqQuestion", "title"), children: [text2("accountFaqAnswer")] },
        { key: "privacy", ...twin("privacyTitle", "title"), children: [text2("privacyDescription")] }
      ] }] },
      { type: "Card", key: "diagCard", children: [section("scrDiagTitle"), { type: "DataTable", key: "diagTable", columns: [{ flex: 2 }, { flex: 3 }], wrap: true, zebra: true, children: rows }, caption("scrDiagNoPersonal"),
        { type: "Button", variant: "secondary", key: "copyDiag", icon: "copy", ...twin("scrCopyDiag", "labelText"), devices: ["phone", "desktop"], onPressed: { go: { copy: { text: diagnosticText(s, ctx), label: say(kino, "scrDiagTitle") } } } }
      ] }
    ];
  }
function mainPage(s, st, ctx) {
  const tab = TABS2.includes(st.tab) ? st.tab : "account";
  const body = tab === "connection" ? connectionTab(s, st) : tab === "more" ? moreTab(s, ctx) : accountTab(s, st);
  const tabsNode = { type: "TabBar", key: "tabs", divider: false, value: tab, onChanged: "tab", tabs: [
    { value: "account", ...twin("scrTabAccount", "label") },
    { value: "connection", ...twin("scrTabConnection", "label") },
    { value: "more", ...twin("scrTabMore", "label") }
  ] };
  const tv = ctx.device === "tv";
  return {
    type: "Scaffold",
    appBar: {
      // The same one bar as the browse screen: back where Kino's close was, the plugin's logo where its name was (the tabs beside
      // it on a TV, under it elsewhere), no line under the bar.
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "back", icon: "arrow_back", ...twin("scrBack", "labelText"), ...twin("scrBack", "tooltip"), onPressed: "back" },
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [logo(), tabsNode] } : logo(),
      actions: [
        { type: "IconButton", key: "refreshStatus", icon: "refresh", ...twin("scrRefresh", "labelText"), ...twin("scrRefresh", "tooltip"), onPressed: "refresh" },
        { type: "IconButton", key: "helpButton", icon: "help", ...twin("scrHelp", "labelText"), ...twin("scrHelp", "tooltip"), onPressed: { event: "tab", arg: "more" } }
      ]
    },
    body: { type: "Column", key: "page", children: [
      ...tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabsNode] }],
      { type: "SingleChildScrollView", key: tab + "Body", flex: 1, children: [
        { type: "Column", padding: { compact: 16, expanded: 24 }, gap: 12, children: [...banner(st.notice, "notice"), ...body] }
      ] }
    ] },
    // A sign-in that has not happened yet (credentials that arrived by sync, a background login): re-read every 15 s, no
    // network, until it settles.
    ...s.accountState === "pending" ? { every: { ms: 15e3, event: "tick" } } : {}
  };
}
function signInPage(s, st) {
  const si = st.signin || {};
  return { type: "SingleChildScrollView", key: "signinBody", children: [{ type: "Column", padding: { compact: 16, expanded: 32 }, gap: 12, children: [
    text2("scrSignInTitle", { style: "h3" }),
    caption("scrSignInCaption"),
    ...banner(si.banner, "signinBanner"),
    { type: "Form", key: "signinForm", onSubmitted: press("signin.submit"), gap: 12, children: [
      {
        type: "TextField",
        key: "signinEmail",
        kind: "email",
        ...twin("scrEmailLabel", "labelText"),
        required: true,
        maxLength: 200,
        pattern: EMAIL_PATTERN,
        ...twin("scrEmailError", "errorText"),
        ...errorOf(si.emailError),
        autofocus: true
      },
      {
        type: "TextField",
        key: "signinPw",
        obscureText: true,
        ...twin("scrPasswordLabel", "labelText"),
        required: true,
        maxLength: 500,
        ...twin("scrPasswordError", "errorText"),
        ...errorOf(si.pwError)
      },
      { type: "ElevatedButton", key: "signinSubmit", ...twin("scrSignIn", "labelText"), icon: "person", submit: true }
    ] },
  ] }] };
}
var REG_STEPS = ["email", "code", "done"];
function registerPage(s, st, ctx) {
  const r = st.reg || {};
  const step = REG_STEPS.includes(r.step) ? r.step : "email";
  const at = REG_STEPS.indexOf(step);
  const errors = r.errors || {};
  const masked = r.emailMasked || "";
  const stateOf = (k) => {
    const i = REG_STEPS.indexOf(k);
    return i < at ? "done" : i === at ? "current" : "pending";
  };
  const emailStep = [
    caption("scrRegTvNote", { devices: ["tv"] }),
    ...banner(r.banner, "regBanner"),
    { type: "Form", key: "regEmailForm", onSubmitted: press("reg.send"), gap: 12, children: [
      {
        type: "TextField",
        key: "regEmailInput",
        kind: "email",
        ...twin("scrEmailLabel", "labelText"),
        required: true,
        maxLength: 200,
        pattern: EMAIL_PATTERN,
        ...twin("scrEmailError", "errorText"),
        ...errorOf(errors.email),
        autofocus: true
      },
      { type: "ElevatedButton", key: "regSend", ...twin("scrSendCode", "labelText"), icon: "send", submit: true }
    ] }
  ];
  const resendAt = typeof r.sentAt === "number" ? r.sentAt + RESEND_WAIT_MS2 : 0;
  const codeStep = [
    text2("scrCodeSentTo", {}, { email: masked }),
    ...typeof r.sentAt === "number" ? [caption("scrSentAt", { key: "sentAt", time: r.sentAt })] : [],
    caption("scrCodeRules"),
    ...banner(r.banner, "regBanner"),
    { type: "Form", key: "regCodeForm", onSubmitted: press("reg.confirm"), gap: 12, children: [
      {
        type: "TextField",
        key: "regCode",
        kind: "text",
        ...twin("scrCodeLabel", "labelText"),
        required: true,
        maxLength: 40,
        pattern: CODE_PATTERN,
        ...twin("scrCodeError", "errorText"),
        ...errorOf(errors.code),
        autofocus: true
      },
      {
        type: "TextField",
        key: "regPw",
        obscureText: true,
        ...twin("scrNewPassword", "labelText"),
        required: true,
        maxLength: 500,
        ...twin("scrPasswordError", "errorText"),
        ...errorOf(errors.pw)
      },
      { type: "ElevatedButton", key: "regConfirm", ...twin("scrCreateButton", "labelText"), icon: "check", submit: true }
    ] },
    { type: "Row", wrap: true, gap: 8, crossAxisAlignment: "center", children: [
      {
        type: "TextButton",
        key: "regResend",
        ...twin("scrResend", "labelText"),
        ...twin("scrResendConfirm", "confirm"),
        ...resendAt > 0 ? { enabledAt: resendAt } : {},
        onPressed: press("reg.resend")
      },
      ...resendAt > ctx.now ? [caption("scrResendIn", { key: "resendIn", time: resendAt, timeFormat: "countdown" })] : [],
      { type: "TextButton", key: "regChangeEmail", ...twin("scrChangeEmail", "labelText"), onPressed: { event: "reg.back", arg: "email" } }
    ] }
  ];
  const doneStep = [
    r.loggedIn === false ? { type: "MaterialBanner", key: "regDone", role: "info", ...twin("scrCreatedPending") } : { type: "MaterialBanner", key: "regDone", role: "success", ...twin("accountCreatedSignedIn") },
    { type: "Row", wrap: true, gap: 8, children: [
      ...r.loggedIn === false ? [{ type: "ElevatedButton", key: "regConnect", ...twin("scrConnectNow", "labelText"), icon: "sync", onPressed: press("account.retry") }] : [],
      { type: "Button", variant: r.loggedIn === false ? "secondary" : "primary", key: "regFinish", ...twin("scrBack", "labelText"), onPressed: "reg.finish", autofocus: true }
    ] }
  ];
  const children = { email: emailStep, code: codeStep, done: doneStep };
  const titles = { email: "scrStepEmail", code: "scrStepCode", done: "scrStepDone" };
  return { type: "SingleChildScrollView", key: "registerBody", children: [{ type: "Column", padding: { compact: 16, expanded: 32 }, gap: 12, children: [
    text2("scrCreate", { style: "h3" }),
    { type: "steps", key: "regSteps", onStepTap: "reg.back", items: REG_STEPS.map((k) => ({
      key: k,
      ...twin(titles[k], "title"),
      state: stateOf(k),
      ...k === "email" && at > 0 && masked ? { subtitle: masked, subtitleEn: masked } : {},
      ...k === step ? { children: children[k] } : {}
    })) }
  ] }] };
}
function classicPage() {
  return { type: "SingleChildScrollView", key: "classicBody", children: [{ type: "Column", padding: 16, gap: 12, children: [
    ...(!integrationAvailable(kino) ? [{ type: "Text", text: INTEGRATION_PENDING }] : []),
    caption("scrClassicNote"),
    { type: "settings", key: "classicForm" }
  ] }] };
}
function view({ s, state, route, modern, device, appVersion, lang, now }) {
  const st = state && typeof state === "object" ? state : {};
  if (!modern) return classicPage();
  const name = route && typeof route.name === "string" ? route.name : "settings";
  const ctx = { device, appVersion, lang, now };
  if (name === "signin") return signInPage(s, st);
  if (name === "register") return registerPage(s, st, ctx);
  return mainPage(s, st, ctx);
}

  const bump = () => ({ v: clock.now() });
  function resumeRegistration() {
    const email = asText(kino.config.get("regEmail")).trim();
    const pending = email ? registration().pendingFor(email) : null;
    return pending ? { step: "code", email, emailMasked: maskEmail(email), sentAt: pending.at } : { step: "email" };
  }
  const fingerprint = () => JSON.stringify(accountFacts());
  const handlers = {
    open({ route, state }) {
      return { state: { fp: fingerprint(), ...(route?.name === "register" && !state.reg?.step ? { reg: resumeRegistration() } : {}) } };
    },
    tab({ value, arg }) {
      const tab = TABS2.includes(value) ? value : TABS2.includes(arg) ? arg : null;
      return tab ? { state: { tab, notice: null } } : null;
    },
    refresh() { return { state: { ...bump(), fp: fingerprint() } }; },
    tick({ state }) { const fp = fingerprint(); return fp === state.fp ? null : { state: { fp } }; },
    saved() { return { state: { ...bump(), fp: fingerprint() } }; },
    go({ arg }) {
      if (arg === "signin") return { route: { push: "signin" }, state: { signin: null } };
      if (arg === "register") return { route: { push: "register" }, state: { reg: resumeRegistration() } };
      return null;
    },
    back({ state }) { return state.fromBrowse ? { route: { pop: true } } : { close: true }; },
    async "signin.submit"({ value }) {
      const email = asText(value?.signinEmail).trim(), password = asText(value?.signinPw);
      const errors = {};
      if (!email.includes("@")) errors.emailError = say(kino, "enterValidEmail");
      if (!password) errors.pwError = say(kino, "scrPasswordError");
      if (Object.keys(errors).length) return { state: { signin: errors } };
      try {
        const result = await validateSettings({ email, password });
        if (result) return { state: { signin: { ...(result.email ? { emailError: result.email } : {}), ...(result.password ? { pwError: result.password } : {}) } } };
      } catch (error) {
        return { state: { signin: { banner: { role: "warning", text: sentence(error) } } } };
      }
      return { config: { email, password, regEmail: null, regPassword: null, verifyCode: null }, route: { pop: true }, state: { signin: null, ...bump() }, toast: toastOf("signedIn", "success") };
    },
    async "account.retry"() {
      try { const out = await action("login"); return { state: bump(), toast: { text: out.message, role: "success" } }; }
      catch (error) { return { state: bump(), ...errorToast(error) }; }
    },
    async "account.logout"() {
      const out = await action("logout");
      return { config: Object.fromEntries(out.clearSettings.map((key) => [key, null])), state: bump(), toast: { text: out.message, role: "info" } };
    },
    async "reg.send"({ value }) { return sendTo(asText(value?.regEmailInput).trim(), false); },
    async "reg.resend"({ state }) { return sendTo(asText(state.reg?.email).trim(), true); },
    async "reg.confirm"({ value, state }) {
      const reg = isObject(state.reg) ? state.reg : {};
      const email = asText(reg.email).trim(), password = asText(value?.regPw);
      if (!email.includes("@")) return { state: { reg: { step: "email" } } };
      const keep = { step: "code", email, emailMasked: maskEmail(email), sentAt: reg.sentAt };
      try {
        const done = await registerWith({ email, password, code: value?.regCode });
        return { config: { email: null, password: null, regEmail: email, regPassword: password, verifyCode: null }, state: { reg: { step: "done", loggedIn: done.loggedIn, emailMasked: maskEmail(email) }, ...bump() }, toast: toastOf(done.loggedIn ? "accountCreatedSignedIn" : "scrCreatedPending", done.loggedIn ? "success" : "info") };
      } catch (error) {
        return { state: { reg: { ...keep, banner: { role: "error", text: sentence(error) } } } };
      }
    },
    "reg.back"({ arg, state }) {
      const reg = state.reg || {};
      return arg === "email" && reg.step !== "done" ? { state: { reg: { step: "email", email: reg.email } } } : null;
    },
    "reg.finish"() { return { route: { pop: true }, state: { reg: null, ...bump() } }; }
  };
  async function sendTo(email, resend) {
    if (!email.includes("@")) return { state: { reg: { step: "email", errors: { email: say(kino, "enterValidEmail") } } } };
    try {
      const result = await sendCodeTo(email);
      const masked = maskEmail(email);
      return { config: { regEmail: email }, state: { reg: { step: "code", email, emailMasked: masked, sentAt: result.at } }, toast: toastOf(result.sent ? resend ? "scrResent" : "scrCodeSentTo" : "codeAlreadySent", "info", { email: masked }) };
    } catch (error) {
      return { state: { reg: { step: resend ? "code" : "email", email, emailMasked: maskEmail(email), banner: { role: "error", text: sentence(error) } } } };
    }
  }
  return {
    async view(ctx = {}) {
      const modern = Array.isArray(kino.screen?.names) && kino.screen.names.includes("steps");
      const facts = accountFacts();
      return view({ s: facts, state: ctx.state, route: ctx.route, modern, device: ctx.device === "tv" || ctx.device === "desktop" ? ctx.device : "phone", appVersion: asText(kino.appVersion), lang: ctx.lang === "en" ? "en" : "es", now: clock.now() });
    },
    async event(ev = {}) {
      const handler = Object.hasOwn(handlers, ev.name) ? handlers[ev.name] : null;
      if (!handler) return null;
      try { return await handler({ ...ev, state: isObject(ev.state) ? ev.state : {} }); }
      catch (error) { return errorToast(error); }
    }
  };
}
let accountScreenInstance = null;
const accountScreen = () => accountScreenInstance || (accountScreenInstance = makeAccountScreen());
async function screen(ctx = {}) {
  try {
    if (contentRoutes.has(ctx.route?.name)) {
      if (!integrationAvailable(kino)) return { type: "Column", padding: 16, children: [{ type: "Text", text: INTEGRATION_PENDING }, { type: "Button", variant: "secondary", key: "integrationSettings", labelText: "Conexión y diagnóstico", labelTextEn: "Connection and diagnostics", onPressed: "integration.settings" }] };
      return await browseScreen(getDeps()).view(ctx);
    }
    return await accountScreen().view(ctx);
  } catch (_) {
    return { type: "SingleChildScrollView", children: [{ type: "Column", padding: 16, children: [{ type: "settings", key: "accountForm" }] }] };
  }
}
async function screenEvent(ev = {}) {
  if (ev.name === "integration.settings") return { route: { push: "settings" }, state: { fromBrowse: true } };
  if (!contentRoutes.has(ev.route?.name)) return accountScreen().event(ev);
  try { return await browseScreen(getDeps()).event(ev); }
  catch (error) {
    const message = isKinoError(error) && typeof error.userMessage === "string" && error.userMessage ? error.userMessage : say(kino, "scrGenericError");
    return { toast: { text: message, role: "error" } };
  }
}

export {
  action,
  browse,
  categories,
  details,
  episodes,
  events,
  home,
  liveCategories,
  liveChannels,
  liveSearch,
  migrate,
  resolve,
  screen,
  screenEvent,
  search,
  section2 as section,
  settingsStatus,
  sign,
  validateSettings
};
