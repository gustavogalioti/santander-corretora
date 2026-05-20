import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";

const SUPABASE_URL = "https://kqgjpboqsonhbgwlieuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_22W4SK-YSb8ij1bmP2a0YQ_yMfm6uC5";

const sb = async (path, opts = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "",
    },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const USERS_DB = {
  "gustavogalioti.santander.com.br": { senha: "1234", nome: "Gustavo Galioti", role: "admin" },
};

const formatCurrency = (v) => {
  if (!v && v !== 0) return "R$ 0";
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}K`;
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
};

const formatDate = (d) => {
  if (!d || d === "01/01/2099") return "-";
  if (d.includes("/")) return d;
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const daysUntil = (d) => {
  if (!d || d === "01/01/2099") return Infinity;
  let date;
  if (d.includes("/")) {
    const [day, m, y] = d.split("/");
    date = new Date(`${y}-${m}-${day}`);
  } else {
    date = new Date(d);
  }
  return Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
};

const S = {
  app: { minHeight: "100vh", background: "#0a0a0b", fontFamily: "'Georgia', serif", color: "#f0ede8" },
  loginPage: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0b 0%, #1a0505 50%, #0a0a0b 100%)", position: "relative", overflow: "hidden",
  },
  loginCard: {
    width: 420, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(220,30,30,0.3)",
    borderRadius: 2, padding: "48px 40px", backdropFilter: "blur(20px)", position: "relative", zIndex: 2,
  },
  logo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 36, justifyContent: "center" },
  logoText: { fontSize: 22, fontWeight: "700", color: "#dc1e1e", letterSpacing: "0.05em" },
  logoSub: { fontSize: 13, color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 2, padding: "12px 16px", color: "#f0ede8", fontSize: 14, outline: "none",
    fontFamily: "'Georgia', serif", boxSizing: "border-box", transition: "border-color 0.2s",
  },
  label: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 6, display: "block" },
  btn: {
    width: "100%", background: "#dc1e1e", border: "none", borderRadius: 2, padding: "14px",
    color: "#fff", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700",
    cursor: "pointer", fontFamily: "'Georgia', serif", transition: "background 0.2s",
  },
  btnOutline: { background: "transparent", border: "1px solid rgba(220,30,30,0.4)", color: "#dc1e1e" },
  err: {
    background: "rgba(220,30,30,0.1)", border: "1px solid rgba(220,30,30,0.3)",
    borderRadius: 2, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", marginBottom: 16,
  },
  nav: {
    background: "rgba(10,10,11,0.95)", borderBottom: "1px solid rgba(220,30,30,0.2)",
    padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 64, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)",
  },
  page: { maxWidth: 1400, margin: "0 auto", padding: "32px" },
  filterBar: { display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "flex-end" },
  select: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 2, padding: "10px 14px", color: "#f0ede8", fontSize: 13, outline: "none",
    fontFamily: "'Georgia', serif", cursor: "pointer", minWidth: 160,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 32 },
  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 3, padding: "24px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden",
  },
  cardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#dc1e1e" },
  cardIcon: {
    width: 40, height: 40, background: "rgba(220,30,30,0.12)", borderRadius: 2,
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 18,
  },
  cardLabel: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: "700", color: "#f0ede8", letterSpacing: "-0.02em" },
  cardSub: { fontSize: 12, color: "#666", marginTop: 4 },
  cardArrow: { position: "absolute", bottom: 20, right: 20, color: "#dc1e1e", fontSize: 18, opacity: 0.6 },
  modal: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200,
    display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto",
  },
  modalBox: {
    background: "#111113", border: "1px solid rgba(220,30,30,0.25)", borderRadius: 3,
    width: "100%", maxWidth: 860, padding: "36px", position: "relative",
  },
  modalClose: {
    position: "absolute", top: 16, right: 16, background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, color: "#888",
    cursor: "pointer", padding: "4px 10px", fontSize: 18, fontFamily: "'Georgia', serif",
  },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 12, color: "#666", flexWrap: "wrap" },
  breadcrumbItem: { color: "#dc1e1e", cursor: "pointer", textDecoration: "underline" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  td: { padding: "14px 16px", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  tr: { cursor: "pointer", transition: "background 0.15s" },
  trHover: { background: "rgba(220,30,30,0.06)" },
  heading: { fontSize: 28, fontWeight: "700", letterSpacing: "-0.02em", marginBottom: 4 },
  subHeading: { fontSize: 13, color: "#666", marginBottom: 32 },
  pill: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
    background: "rgba(220,30,30,0.12)", border: "1px solid rgba(220,30,30,0.25)", borderRadius: 20, fontSize: 12, color: "#dc1e1e",
  },
  uploadArea: {
    border: "2px dashed rgba(220,30,30,0.3)", borderRadius: 3, padding: "48px",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s",
  },
  tag: {
    display: "inline-block", padding: "3px 10px", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, fontSize: 11, color: "#aaa", marginRight: 6,
  },
  spinner: {
    width: 32, height: 32, border: "3px solid rgba(220,30,30,0.2)",
    borderTop: "3px solid #dc1e1e", borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};

const FlameSVG = ({ size = 32, color = "#dc1e1e" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="75" rx="35" ry="18" fill={color} />
    <path d="M35 72 Q28 50 38 30 Q42 20 50 15 Q45 35 52 42 Q56 28 62 20 Q72 40 68 60 Q65 72 55 75 Q60 55 55 48 Q48 62 35 72Z" fill={color} />
  </svg>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [senhaConf, setSenhaConf] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const VALID_DOMAINS = ["@santander.com.br", "@santandercorretora.com.br", "@toroinvestimentos.com.br", "@santanderam"];

  const handleLogin = () => {
    setErr("");
    const user = USERS_DB[email];
    if (!user || user.senha !== senha) { setErr("Email ou senha incorretos."); return; }
    onLogin({ email, nome: user.nome, role: user.role });
  };

  const handleCadastro = () => {
    setErr("");
    if (!VALID_DOMAINS.some(d => email.endsWith(d))) {
      setErr("Use seu email corporativo (@santander.com.br, @santandercorretora.com.br, @toroinvestimentos.com.br ou @santanderam)");
      return;
    }
    if (senha.length < 9) { setErr("A senha deve ter no mínimo 9 dígitos."); return; }
    if (senha !== senhaConf) { setErr("As senhas não conferem."); return; }
    if (!nome.trim()) { setErr("Informe seu nome completo."); return; }
    USERS_DB[email] = { senha, nome, role: "user" };
    setOk(`Cadastro realizado! Email de confirmação enviado para ${email}.`);
    setTimeout(() => { setMode("login"); setOk(""); }, 3000);
  };

  return (
    <div style={S.loginPage}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.loginCard}>
        <div style={S.logo}>
          <FlameSVG size={40} />
          <div>
            <div style={S.logoText}>Santander</div>
            <div style={S.logoSub}>Corretora · Analytics</div>
          </div>
        </div>
        {err && <div style={S.err}>{err}</div>}
        {ok && <div style={{ ...S.err, background: "rgba(30,220,80,0.1)", borderColor: "rgba(30,220,80,0.3)", color: "#4ade80" }}>{ok}</div>}
        {mode === "login" ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Email corporativo</label>
              <input style={S.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@santander.com.br" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={S.label}>Senha</label>
              <input style={S.input} type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button style={S.btn} onClick={handleLogin}>Entrar na plataforma</button>
            <button style={{ ...S.btn, ...S.btnOutline, marginTop: 12 }} onClick={() => setMode("cadastro")}>Não tem login? Cadastre-se</button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}><label style={S.label}>Nome completo</label><input style={S.input} value={nome} onChange={e => setNome(e.target.value)} /></div>
            <div style={{ marginBottom: 16 }}><label style={S.label}>Email corporativo</label><input style={S.input} value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div style={{ marginBottom: 16 }}><label style={S.label}>Senha (mín. 9 dígitos)</label><input style={S.input} type="password" value={senha} onChange={e => setSenha(e.target.value)} /></div>
            <div style={{ marginBottom: 28 }}><label style={S.label}>Confirmar senha</label><input style={S.input} type="password" value={senhaConf} onChange={e => setSenhaConf(e.target.value)} /></div>
            <button style={S.btn} onClick={handleCadastro}>Cadastrar</button>
            <button style={{ ...S.btn, ...S.btnOutline, marginTop: 12 }} onClick={() => setMode("login")}>← Voltar ao login</button>
          </>
        )}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#444" }}>Santander Corretora © 2025 · Uso interno</div>
      </div>
    </div>
  );
}

// ─── DRILL MODAL ──────────────────────────────────────────────────────────────
function DrillModal({ cardType, cardLabel, cardIcon, cardColor, filteredData, onClose }) {
  const [level, setLevel] = useState("tl");
  const [selectedTL, setSelectedTL] = useState(null);
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filterByCard = (rows) => {
    const fa = (r) => (r.familia_produto || "").toUpperCase();
    const ca = (r) => (r.classe_ativo || "").toUpperCase();
    const pr = (r) => (r.produto || "").toUpperCase();
    switch (cardType) {
      case "captacao": return rows.filter(r => ca(r).includes("CAPTA"));
      case "coe": return rows.filter(r => fa(r).includes("COE") || ca(r).includes("COE") || pr(r).includes("COE"));
      case "titulos": return rows.filter(r => fa(r).includes("TESOURO") || pr(r).includes("TESOURO") || fa(r).includes("TÍTULO") || fa(r).includes("TITULO"));
      case "rf": return rows.filter(r => fa(r).includes("LCI") || fa(r).includes("LCA") || fa(r).includes("CDB") || pr(r).includes("LCI") || pr(r).includes("LCA") || pr(r).includes("CDB") || fa(r).includes("CRED. PRIV") || fa(r).includes("RENDA FIXA"));
      case "liquidez": return rows.filter(r => fa(r).includes("LIQUID") || pr(r).includes("LIQUID") || (pr(r).includes("CDB") && pr(r).includes("D0")) || (pr(r).includes("CDB") && pr(r).includes("D1")));
      case "vencimento": return rows.filter(r => r.vencimento && r.vencimento !== "01/01/2099" && daysUntil(r.vencimento) !== Infinity);
      case "corretora": return rows.filter(r => ca(r).includes("CORRETORA") || fa(r).includes("AÇÕES") || fa(r).includes("ACOES") || fa(r).includes("FII") || fa(r).includes("ETF") || fa(r).includes("TERMO") || pr(r).includes("AÇÕES") || pr(r).includes("FII"));
      default: return rows;
    }
  };

  const relevant = filterByCard(filteredData);
  const totalSaldo = relevant.reduce((a, r) => a + (Number(r.saldo_inv) || 0), 0);
  const totalMedio = relevant.reduce((a, r) => a + (Number(r.saldo_medio_inv) || 0), 0);

  const byTL = {};
  relevant.forEach(r => {
    const k = r.team_leader || "Sem TL";
    if (!byTL[k]) byTL[k] = { tl: k, coord: r.coordenador, saldo: 0, medio: 0, assessores: new Set() };
    byTL[k].saldo += Number(r.saldo_inv) || 0;
    byTL[k].medio += Number(r.saldo_medio_inv) || 0;
    byTL[k].assessores.add(r.assessor);
  });
  const tlList = Object.values(byTL).sort((a, b) => b.saldo - a.saldo);

  const byAssessor = {};
  if (selectedTL) {
    relevant.filter(r => (r.team_leader || "Sem TL") === selectedTL).forEach(r => {
      const k = r.assessor || "Sem Assessor";
      if (!byAssessor[k]) byAssessor[k] = { assessor: k, saldo: 0, medio: 0, rows: [] };
      byAssessor[k].saldo += Number(r.saldo_inv) || 0;
      byAssessor[k].medio += Number(r.saldo_medio_inv) || 0;
      byAssessor[k].rows.push(r);
    });
  }
  const assessorList = Object.values(byAssessor).sort((a, b) => b.saldo - a.saldo);

  const detailRows = selectedAssessor
    ? relevant.filter(r => (r.team_leader || "Sem TL") === selectedTL && (r.assessor || "Sem Assessor") === selectedAssessor)
        .sort((a, b) => (Number(b.saldo_inv) || 0) - (Number(a.saldo_inv) || 0))
    : [];

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <button style={S.modalClose} onClick={onClose}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ ...S.cardIcon, width: 44, height: 44, fontSize: 20, background: `${cardColor}18` }}>{cardIcon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: "700" }}>{cardLabel}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Saldo Inv: <span style={{ color: "#f0ede8" }}>{formatCurrency(totalSaldo)}</span>
              {" · "}Saldo Médio: <span style={{ color: "#f0ede8" }}>{formatCurrency(totalMedio)}</span>
              {" · "}{relevant.length} registros
            </div>
          </div>
        </div>

        <div style={S.breadcrumb}>
          <span style={S.breadcrumbItem} onClick={() => { setLevel("tl"); setSelectedTL(null); setSelectedAssessor(null); }}>Todos os TLs</span>
          {selectedTL && <><span>›</span><span style={S.breadcrumbItem} onClick={() => { setLevel("assessor"); setSelectedAssessor(null); }}>{selectedTL}</span></>}
          {selectedAssessor && <><span>›</span><span style={{ color: "#f0ede8" }}>{selectedAssessor}</span></>}
        </div>

        {level === "tl" && (
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>#</th><th style={S.th}>Team Leader</th><th style={S.th}>Coordenador</th>
              <th style={S.th}>Assessores</th><th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th><th style={{ ...S.th, textAlign: "right" }}>Saldo Médio</th>
            </tr></thead>
            <tbody>{tlList.map((tl, i) => (
              <tr key={tl.tl} style={{ ...S.tr, ...(hoveredRow === tl.tl ? S.trHover : {}) }}
                onMouseEnter={() => setHoveredRow(tl.tl)} onMouseLeave={() => setHoveredRow(null)}
                onClick={() => { setSelectedTL(tl.tl); setLevel("assessor"); }}>
                <td style={{ ...S.td, color: i === 0 ? "#dc1e1e" : "#666", fontWeight: "700" }}>{i + 1}</td>
                <td style={{ ...S.td, color: "#dc1e1e", fontWeight: "600" }}>{tl.tl} →</td>
                <td style={{ ...S.td, color: "#888" }}>{tl.coord}</td>
                <td style={{ ...S.td, color: "#888" }}>{tl.assessores.size}</td>
                <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(tl.saldo)}</td>
                <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(tl.medio)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {level === "assessor" && (
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>#</th><th style={S.th}>Assessor (AAA)</th>
              <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th><th style={{ ...S.th, textAlign: "right" }}>Saldo Médio</th>
            </tr></thead>
            <tbody>{assessorList.map((a, i) => (
              <tr key={a.assessor} style={{ ...S.tr, ...(hoveredRow === a.assessor ? S.trHover : {}) }}
                onMouseEnter={() => setHoveredRow(a.assessor)} onMouseLeave={() => setHoveredRow(null)}
                onClick={() => { setSelectedAssessor(a.assessor); setLevel("detail"); }}>
                <td style={{ ...S.td, color: i === 0 ? "#dc1e1e" : "#666", fontWeight: "700" }}>{i + 1}</td>
                <td style={{ ...S.td, color: "#dc1e1e", fontWeight: "600" }}>{a.assessor} →</td>
                <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(a.saldo)}</td>
                <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(a.medio)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {level === "detail" && (
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Família</th><th style={S.th}>Produto</th><th style={S.th}>Subproduto</th>
              {cardType === "vencimento" && <th style={S.th}>Vencimento</th>}
              <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th><th style={{ ...S.th, textAlign: "right" }}>Saldo Médio</th>
            </tr></thead>
            <tbody>{(cardType === "vencimento" ? detailRows.sort((a, b) => daysUntil(a.vencimento) - daysUntil(b.vencimento)) : detailRows).map((r, i) => (
              <tr key={i} style={S.tr}>
                <td style={S.td}><span style={S.tag}>{r.familia_produto}</span></td>
                <td style={S.td}>{r.produto}</td>
                <td style={{ ...S.td, color: "#888" }}>{r.subproduto}</td>
                {cardType === "vencimento" && (
                  <td style={S.td}>
                    <span style={{ padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: "700", background: daysUntil(r.vencimento) < 180 ? "rgba(220,30,30,0.2)" : "rgba(255,255,255,0.06)", color: daysUntil(r.vencimento) < 180 ? "#ff6b6b" : "#aaa" }}>
                      {formatDate(r.vencimento)}
                    </span>
                  </td>
                )}
                <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(Number(r.saldo_inv))}</td>
                <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(Number(r.saldo_medio_inv))}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const processUpload = async (f) => {
    setLoading(true);
    setStatus("Lendo planilha...");
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Find header row
      const headerRow = rows.findIndex(r => r.some(c => String(c || "").toLowerCase().includes("assessor") || String(c || "").toLowerCase().includes("team")));
      const headers = rows[headerRow] || rows[0];
      const dataRows = rows.slice(headerRow + 1).filter(r => r.some(c => c));

      setStatus(`Processando ${dataRows.length} registros...`);

      // Map columns by name (flexible)
      const h = (name) => {
        const idx = headers.findIndex(c => String(c || "").toLowerCase().includes(name.toLowerCase()));
        return idx;
      };

      const colMes = h("mês") !== -1 ? h("mês") : h("mes") !== -1 ? h("mes") : 0;
      const colVenc = h("vencimento") !== -1 ? h("vencimento") : 1;
      const colPen = h("penumper") !== -1 ? h("penumper") : 2;
      const colCart = h("cart") !== -1 ? h("cart") : 3;
      const colAss = h("assessor") !== -1 ? h("assessor") : 4;
      const colTL = h("team") !== -1 ? h("team") : 5;
      const colCoord = h("coordenador") !== -1 ? h("coordenador") : 6;
      const colClasse = h("classe") !== -1 ? h("classe") : 7;
      const colFam = h("familia") !== -1 ? h("familia") : h("família") !== -1 ? h("família") : 8;
      const colProd = h("produto") !== -1 ? h("produto") : 9;
      const colSub = h("sub") !== -1 ? h("sub") : 10;
      const colSaldo = h("saldo inv") !== -1 ? h("saldo inv") : h("saldo_inv") !== -1 ? h("saldo_inv") : 11;
      const colMedio = h("médio") !== -1 ? h("médio") : h("medio") !== -1 ? h("medio") : h("saldo médio") !== -1 ? h("saldo médio") : 12;

      const formatVenc = (v) => {
        if (!v) return null;
        if (v instanceof Date) {
          const d = String(v.getDate()).padStart(2, "0");
          const m = String(v.getMonth() + 1).padStart(2, "0");
          const y = v.getFullYear();
          return `${d}/${m}/${y}`;
        }
        return String(v);
      };

      const cleanNum = (v) => {
        if (!v && v !== 0) return 0;
        if (typeof v === "number") return v;
        return parseFloat(String(v).replace(/[R$\s.]/g, "").replace(",", ".")) || 0;
      };

      const records = dataRows.map(r => ({
        mes: String(r[colMes] || ""),
        vencimento: formatVenc(r[colVenc]),
        penumper: String(r[colPen] || ""),
        cart_asses: String(r[colCart] || ""),
        assessor: String(r[colAss] || ""),
        team_leader: String(r[colTL] || ""),
        coordenador: String(r[colCoord] || ""),
        classe_ativo: String(r[colClasse] || ""),
        familia_produto: String(r[colFam] || ""),
        produto: String(r[colProd] || ""),
        subproduto: String(r[colSub] || ""),
        saldo_inv: cleanNum(r[colSaldo]),
        saldo_medio_inv: cleanNum(r[colMedio]),
      })).filter(r => r.assessor && r.assessor !== "undefined");

      // Delete existing data and insert new
      setStatus("Limpando dados anteriores...");
      await sb("producao?id=gte.0", { method: "DELETE", prefer: "return=minimal" });

      // Batch insert in chunks of 500
      const CHUNK = 500;
      for (let i = 0; i < records.length; i += CHUNK) {
        const chunk = records.slice(i, i + CHUNK);
        await sb("producao", {
          method: "POST",
          body: JSON.stringify(chunk),
          prefer: "return=minimal",
        });
        setProgress(Math.round(((i + CHUNK) / records.length) * 100));
        setStatus(`Enviando... ${Math.min(i + CHUNK, records.length)} / ${records.length}`);
      }

      setStatus(`✅ ${records.length} registros importados com sucesso!`);
      setLoading(false);
      setTimeout(() => { onUploadSuccess(); onClose(); }, 2000);
    } catch (e) {
      setStatus(`❌ Erro: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 540, marginTop: 80 }}>
        <button style={S.modalClose} onClick={onClose}>✕</button>
        <div style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>📤 Atualizar Base de Dados</div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 28 }}>Envie a planilha (.xlsx) — os dados anteriores serão substituídos.</div>

        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />

        <div style={{ ...S.uploadArea, ...(dragging ? { borderColor: "#dc1e1e", background: "rgba(220,30,30,0.06)" } : {}) }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}>
          {file ? (
            <div><div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: "700", color: "#dc1e1e" }}>{file.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          ) : (
            <div><div style={{ fontSize: 36, marginBottom: 12 }}>☁</div>
              <div style={{ fontWeight: "600", marginBottom: 4 }}>Arraste a planilha aqui</div>
              <div style={{ fontSize: 12, color: "#666" }}>ou clique para selecionar — .xlsx</div>
            </div>
          )}
        </div>

        {status && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 2, fontSize: 13 }}>
            {status}
            {loading && progress > 0 && (
              <div style={{ marginTop: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(progress, 100)}%`, height: 6, background: "#dc1e1e", transition: "width 0.3s" }} />
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={{ ...S.btn, opacity: file && !loading ? 1 : 0.4 }} onClick={() => file && !loading && processUpload(file)} disabled={!file || loading}>
            {loading ? "Processando..." : "Confirmar upload"}
          </button>
          <button style={{ ...S.btn, ...S.btnOutline }} onClick={onClose} disabled={loading}>Cancelar</button>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 2, fontSize: 12, color: "#666" }}>
          <strong style={{ color: "#888" }}>Colunas esperadas:</strong>
          <div style={{ marginTop: 6, lineHeight: 1.8 }}>
            Mês · Vencimento · PENUMPER · CART ASSES · Assessor · Team Leader · Coordenador · Classe Ativo · Família Produto · Produto · Subproduto · Saldo Inv · Saldo Médio Inv
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCoord, setFilterCoord] = useState("Todos");
  const [filterTL, setFilterTL] = useState("Todos");
  const [filterAssessor, setFilterAssessor] = useState("Todos");
  const [filterMes, setFilterMes] = useState("Todos");
  const [activeCard, setActiveCard] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await sb("producao?select=*&order=mes.desc&limit=100000");
      setData(rows);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const meses = [...new Set(data.map(r => r.mes))].filter(Boolean).sort().reverse();
  const coords = ["Todos", ...[...new Set(data.map(r => r.coordenador))].filter(Boolean)];
  const tls = ["Todos", ...[...new Set(data.filter(r => filterCoord === "Todos" || r.coordenador === filterCoord).map(r => r.team_leader))].filter(Boolean)];
  const assessores = ["Todos", ...[...new Set(data.filter(r => filterTL === "Todos" || r.team_leader === filterTL).map(r => r.assessor))].filter(Boolean)];

  const filtered = data.filter(r => {
    if (filterMes !== "Todos" && r.mes !== filterMes) return false;
    if (filterCoord !== "Todos" && r.coordenador !== filterCoord) return false;
    if (filterTL !== "Todos" && r.team_leader !== filterTL) return false;
    if (filterAssessor !== "Todos" && r.assessor !== filterAssessor) return false;
    return true;
  });

  const sumSaldo = (fn) => filtered.filter(fn).reduce((a, r) => a + (Number(r.saldo_inv) || 0), 0);
  const sumMedio = (fn) => filtered.filter(fn).reduce((a, r) => a + (Number(r.saldo_medio_inv) || 0), 0);

  const fa = (r) => (r.familia_produto || "").toUpperCase();
  const ca = (r) => (r.classe_ativo || "").toUpperCase();
  const pr = (r) => (r.produto || "").toUpperCase();

  const captacaoVal = sumSaldo(r => ca(r).includes("CAPTA"));
  const coeVal = sumSaldo(r => fa(r).includes("COE") || ca(r).includes("COE") || pr(r).includes("COE"));
  const titulosVal = sumSaldo(r => fa(r).includes("TESOURO") || pr(r).includes("TESOURO") || fa(r).includes("TÍTULO") || fa(r).includes("TITULO"));
  const rfVal = sumSaldo(r => fa(r).includes("LCI") || fa(r).includes("LCA") || fa(r).includes("CDB") || pr(r).includes("LCI") || pr(r).includes("LCA") || pr(r).includes("CDB") || fa(r).includes("CRED. PRIV") || fa(r).includes("RENDA FIXA"));
  const liquidezVal = sumSaldo(r => fa(r).includes("LIQUID") || pr(r).includes("LIQUID"));
  const vencimentoCount = filtered.filter(r => r.vencimento && r.vencimento !== "01/01/2099" && daysUntil(r.vencimento) !== Infinity).length;
  const corretoraVal = sumSaldo(r => ca(r).includes("CORRETORA") || fa(r).includes("AÇÕES") || fa(r).includes("FII") || fa(r).includes("ETF") || fa(r).includes("TERMO") || pr(r).includes("AÇÕES"));

  const activeMes = filterMes === "Todos" ? meses[0] : filterMes;
  const mesLabel = activeMes ? `${activeMes}` : "Todos os meses";

  const CARDS = [
    { type: "captacao", icon: "💰", label: "Captação Líquida", value: captacaoVal, medio: sumMedio(r => ca(r).includes("CAPTA")), color: "#22c55e" },
    { type: "coe", icon: "📈", label: "Aplicação em COE", value: coeVal, medio: sumMedio(r => fa(r).includes("COE") || ca(r).includes("COE")), color: "#f59e0b" },
    { type: "titulos", icon: "🏛", label: "Títulos Públicos", value: titulosVal, medio: sumMedio(r => fa(r).includes("TESOURO") || pr(r).includes("TESOURO")), color: "#3b82f6" },
    { type: "rf", icon: "🏦", label: "Renda Fixa — LCI/LCA/CDB", value: rfVal, medio: sumMedio(r => fa(r).includes("LCI") || fa(r).includes("LCA") || fa(r).includes("CDB") || fa(r).includes("CRED. PRIV") || fa(r).includes("RENDA FIXA")), color: "#8b5cf6" },
    { type: "liquidez", icon: "💧", label: "Valores em Liquidez", value: liquidezVal, medio: sumMedio(r => fa(r).includes("LIQUID") || pr(r).includes("LIQUID")), color: "#06b6d4" },
    { type: "vencimento", icon: "📅", label: "Aplicações com Vencimento", value: vencimentoCount, isCount: true, medio: sumMedio(r => r.vencimento && r.vencimento !== "01/01/2099"), color: "#f97316" },
    { type: "corretora", icon: "📊", label: "Renda Variável — Corretora", value: corretoraVal, medio: sumMedio(r => ca(r).includes("CORRETORA") || fa(r).includes("AÇÕES") || fa(r).includes("FII")), color: "#dc1e1e" },
  ];

  const totalSaldo = filtered.reduce((a, r) => a + (Number(r.saldo_inv) || 0), 0);
  const totalMedio = filtered.reduce((a, r) => a + (Number(r.saldo_medio_inv) || 0), 0);

  return (
    <div style={S.app}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FlameSVG size={28} />
          <div>
            <div style={{ fontSize: 14, fontWeight: "700", color: "#dc1e1e", letterSpacing: "0.05em" }}>Santander</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase" }}>Corretora · Analytics</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user.role === "admin" && (
            <button style={{ ...S.btn, width: "auto", padding: "8px 18px", fontSize: 12 }} onClick={() => setShowUpload(true)}>
              ⬆ Atualizar Dados
            </button>
          )}
          <div style={S.pill}>
            <span>👤</span><span>{user.nome}</span>
            {user.role === "admin" && <span style={{ background: "#dc1e1e", color: "#fff", padding: "1px 6px", borderRadius: 10, fontSize: 9, fontWeight: "700" }}>ADM</span>}
          </div>
          <button style={{ ...S.btn, ...S.btnOutline, width: "auto", padding: "6px 14px", fontSize: 12 }} onClick={onLogout}>Sair</button>
        </div>
      </nav>

      <div style={S.page}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ ...S.heading, margin: 0 }}>Painel de Produção</h1>
            <div style={S.pill}>{mesLabel}</div>
          </div>
          <div style={S.subHeading}>
            {loading ? "Carregando dados..." : `${filtered.length.toLocaleString()} registros · ${new Set(filtered.map(r => r.assessor)).size} assessores ativos`}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
            <div style={S.spinner} />
            <div style={{ color: "#666", fontSize: 14 }}>Carregando dados do banco...</div>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#555" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>Nenhum dado encontrado</div>
            <div style={{ fontSize: 13 }}>Use o botão "Atualizar Dados" para importar a planilha</div>
          </div>
        ) : (
          <>
            <div style={S.filterBar}>
              <div>
                <label style={S.label}>Mês</label>
                <select style={S.select} value={filterMes} onChange={e => setFilterMes(e.target.value)}>
                  <option value="Todos">Todos os meses</option>
                  {meses.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Coordenador / Regional</label>
                <select style={S.select} value={filterCoord} onChange={e => { setFilterCoord(e.target.value); setFilterTL("Todos"); setFilterAssessor("Todos"); }}>
                  {coords.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Team Leader</label>
                <select style={S.select} value={filterTL} onChange={e => { setFilterTL(e.target.value); setFilterAssessor("Todos"); }} disabled={filterCoord === "Todos"}>
                  {tls.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Assessor (AAA)</label>
                <select style={S.select} value={filterAssessor} onChange={e => setFilterAssessor(e.target.value)} disabled={filterTL === "Todos"}>
                  {assessores.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div style={S.grid}>
              {CARDS.map(card => (
                <div key={card.type}
                  style={{ ...S.card, ...(hoveredCard === card.type ? { border: `1px solid ${card.color}80`, background: `${card.color}08`, transform: "translateY(-2px)" } : {}) }}
                  onMouseEnter={() => setHoveredCard(card.type)} onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setActiveCard(card)}>
                  <div style={{ ...S.cardAccent, background: card.color }} />
                  <div style={{ ...S.cardIcon, background: `${card.color}18` }}>{card.icon}</div>
                  <div style={S.cardLabel}>{card.label}</div>
                  <div style={{ ...S.cardValue, color: hoveredCard === card.type ? card.color : "#f0ede8" }}>
                    {card.isCount ? `${card.value.toLocaleString()} títulos` : formatCurrency(card.value)}
                  </div>
                  <div style={S.cardSub}>Saldo médio: {formatCurrency(card.medio)}</div>
                  <div style={{ ...S.cardArrow, color: card.color }}>→</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 24, padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, flexWrap: "wrap" }}>
              <div><div style={S.cardLabel}>Total Saldo Investido</div><div style={{ fontSize: 20, fontWeight: "700", color: "#dc1e1e" }}>{formatCurrency(totalSaldo)}</div></div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div><div style={S.cardLabel}>Total Saldo Médio</div><div style={{ fontSize: 20, fontWeight: "700" }}>{formatCurrency(totalMedio)}</div></div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div><div style={S.cardLabel}>TLs ativos</div><div style={{ fontSize: 20, fontWeight: "700" }}>{new Set(filtered.map(r => r.team_leader)).size}</div></div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div><div style={S.cardLabel}>Assessores ativos</div><div style={{ fontSize: 20, fontWeight: "700" }}>{new Set(filtered.map(r => r.assessor)).size}</div></div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div><div style={S.cardLabel}>Registros</div><div style={{ fontSize: 20, fontWeight: "700" }}>{filtered.length.toLocaleString()}</div></div>
            </div>
          </>
        )}
      </div>

      {activeCard && <DrillModal cardType={activeCard.type} cardLabel={activeCard.label} cardIcon={activeCard.icon} cardColor={activeCard.color} filteredData={filtered} onClose={() => setActiveCard(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploadSuccess={loadData} />}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginPage onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
