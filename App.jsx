import { useState, useRef, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_DATA = [
  // TL: Marcos Vinicius | Coord: Ana Paula | Regional: São Paulo
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-04", classeAtivo: "Renda Variável", familia: "Ações", produto: "Ações", subProduto: "PETR4", saldoInv: 450000, producao: 12500, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-04", classeAtivo: "Renda Variável", familia: "FII", produto: "FII", subProduto: "HGLG11", saldoInv: 220000, producao: 6800, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-04", classeAtivo: "COE", familia: "COE", produto: "COE", subProduto: "COE Dólar", saldoInv: 180000, producao: 5400, vencimento: "2026-03-15" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-04", classeAtivo: "Renda Fixa", familia: "Títulos Públicos", produto: "Títulos Públicos", subProduto: "Tesouro IPCA+", saldoInv: 300000, producao: 9200, vencimento: "2035-05-15" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Beatriz Souza", mes: "2025-04", classeAtivo: "Renda Variável", familia: "Ações", produto: "Ações", subProduto: "VALE3", saldoInv: 380000, producao: 11200, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Beatriz Souza", mes: "2025-04", classeAtivo: "Renda Fixa", familia: "LCI/LCA/CDB", produto: "CDB", subProduto: "CDB 110% CDI", saldoInv: 250000, producao: 7500, vencimento: "2025-07-20" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Beatriz Souza", mes: "2025-04", classeAtivo: "Liquidez", familia: "CDB Liquidez", produto: "CDB Liquidez", subProduto: "CDB D0", saldoInv: 120000, producao: 3200, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Rafael Andrade", mes: "2025-04", classeAtivo: "Renda Variável", familia: "ETF", produto: "ETF", subProduto: "BOVA11", saldoInv: 90000, producao: 2700, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Rafael Andrade", mes: "2025-04", classeAtivo: "Captação Líquida", familia: "Captação", produto: "Captação Líquida", subProduto: "Entrada", saldoInv: 500000, producao: 500000, vencimento: null },

  // TL: Fernanda Lima | Coord: Ana Paula
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "João Mendes", mes: "2025-04", classeAtivo: "Renda Variável", familia: "Ações", produto: "Ações", subProduto: "ITUB4", saldoInv: 310000, producao: 9300, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "João Mendes", mes: "2025-04", classeAtivo: "Renda Variável", familia: "FII", produto: "FII", subProduto: "MXRF11", saldoInv: 140000, producao: 4200, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "Luciana Castro", mes: "2025-04", classeAtivo: "COE", familia: "COE", produto: "COE", subProduto: "COE S&P500", saldoInv: 220000, producao: 6600, vencimento: "2026-06-20" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "Luciana Castro", mes: "2025-04", classeAtivo: "Liquidez", familia: "Fundos Liquidez", produto: "Fundo D1", subProduto: "Fundo DI", saldoInv: 95000, producao: 2800, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "Paulo Rodrigues", mes: "2025-04", classeAtivo: "Renda Fixa", familia: "Títulos Públicos", produto: "Títulos Públicos", subProduto: "Tesouro Selic", saldoInv: 190000, producao: 5700, vencimento: "2026-03-01" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Fernanda Lima", assessor: "Paulo Rodrigues", mes: "2025-04", classeAtivo: "Captação Líquida", familia: "Captação", produto: "Captação Líquida", subProduto: "Entrada", saldoInv: 350000, producao: 350000, vencimento: null },

  // TL: Ricardo Santos | Coord: Roberto Alves | Regional: Campinas
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Marina Oliveira", mes: "2025-04", classeAtivo: "Renda Variável", familia: "Ações", produto: "Ações", subProduto: "BBDC4", saldoInv: 280000, producao: 8400, vencimento: null },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Marina Oliveira", mes: "2025-04", classeAtivo: "Renda Variável", familia: "TERMO", produto: "Termo", subProduto: "Termo PETR4", saldoInv: 60000, producao: 1800, vencimento: "2025-06-10" },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Diego Ferreira", mes: "2025-04", classeAtivo: "Renda Fixa", familia: "LCI/LCA/CDB", produto: "LCI", subProduto: "LCI 95% CDI", saldoInv: 200000, producao: 6000, vencimento: "2025-10-15" },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Diego Ferreira", mes: "2025-04", classeAtivo: "Renda Fixa", familia: "LCI/LCA/CDB", produto: "LCA", subProduto: "LCA 90% CDI", saldoInv: 180000, producao: 5400, vencimento: "2025-08-20" },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Tatiane Moura", mes: "2025-04", classeAtivo: "Liquidez", familia: "CDB Liquidez", produto: "CDB Liquidez", subProduto: "CDB D1", saldoInv: 75000, producao: 2250, vencimento: null },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Tatiane Moura", mes: "2025-04", classeAtivo: "Captação Líquida", familia: "Captação", produto: "Captação Líquida", subProduto: "Entrada", saldoInv: 280000, producao: 280000, vencimento: null },

  // May data
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-05", classeAtivo: "Renda Variável", familia: "Ações", produto: "Ações", subProduto: "PETR4", saldoInv: 520000, producao: 15600, vencimento: null },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Carlos Eduardo Silva", mes: "2025-05", classeAtivo: "COE", familia: "COE", produto: "COE", subProduto: "COE Ibovespa", saldoInv: 210000, producao: 6300, vencimento: "2027-01-15" },
  { coordenador: "Ana Paula Ferreira", regional: "São Paulo", tl: "Marcos Vinicius", assessor: "Beatriz Souza", mes: "2025-05", classeAtivo: "Captação Líquida", familia: "Captação", produto: "Captação Líquida", subProduto: "Entrada", saldoInv: 620000, producao: 620000, vencimento: null },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Marina Oliveira", mes: "2025-05", classeAtivo: "Renda Variável", familia: "FII", produto: "FII", subProduto: "VISC11", saldoInv: 160000, producao: 4800, vencimento: null },
  { coordenador: "Roberto Alves", regional: "Campinas", tl: "Ricardo Santos", assessor: "Diego Ferreira", mes: "2025-05", classeAtivo: "Captação Líquida", familia: "Captação", produto: "Captação Líquida", subProduto: "Entrada", saldoInv: 340000, producao: 340000, vencimento: null },
];

const USERS_DB = {
  "gustavogalioti.santander.com.br": { senha: "1234", nome: "Gustavo Galioti", role: "admin" }
};

const formatCurrency = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}K`;
  return `R$ ${v?.toLocaleString("pt-BR") || 0}`;
};

const formatDate = (d) => {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const daysUntil = (d) => {
  if (!d) return Infinity;
  const diff = new Date(d) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#0a0a0b",
    fontFamily: "'Georgia', serif",
    color: "#f0ede8",
  },
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0b 0%, #1a0505 50%, #0a0a0b 100%)",
    position: "relative",
    overflow: "hidden",
  },
  loginCard: {
    width: 420,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(220,30,30,0.3)",
    borderRadius: 2,
    padding: "48px 40px",
    backdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 2,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
    justifyContent: "center",
  },
  flame: {
    width: 36,
    height: 36,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#dc1e1e",
    letterSpacing: "0.05em",
    fontFamily: "'Georgia', serif",
  },
  logoSub: {
    fontSize: 13,
    color: "#888",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 2,
    padding: "12px 16px",
    color: "#f0ede8",
    fontSize: 14,
    outline: "none",
    fontFamily: "'Georgia', serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: "rgba(220,30,30,0.6)",
  },
  label: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 6,
    display: "block",
  },
  btn: {
    width: "100%",
    background: "#dc1e1e",
    border: "none",
    borderRadius: 2,
    padding: "14px",
    color: "#fff",
    fontSize: 13,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    transition: "background 0.2s, transform 0.1s",
  },
  btnOutline: {
    background: "transparent",
    border: "1px solid rgba(220,30,30,0.4)",
    color: "#dc1e1e",
  },
  err: {
    background: "rgba(220,30,30,0.1)",
    border: "1px solid rgba(220,30,30,0.3)",
    borderRadius: 2,
    padding: "10px 14px",
    fontSize: 13,
    color: "#ff6b6b",
    marginBottom: 16,
  },
  nav: {
    background: "rgba(10,10,11,0.95)",
    borderBottom: "1px solid rgba(220,30,30,0.2)",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  page: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "32px 32px",
  },
  filterBar: {
    display: "flex",
    gap: 12,
    marginBottom: 32,
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  select: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 2,
    padding: "10px 14px",
    color: "#f0ede8",
    fontSize: 13,
    outline: "none",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    minWidth: 160,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 3,
    padding: "24px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    overflow: "hidden",
  },
  cardHover: {
    border: "1px solid rgba(220,30,30,0.5)",
    background: "rgba(220,30,30,0.06)",
    transform: "translateY(-2px)",
  },
  cardAccent: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 3,
    background: "#dc1e1e",
  },
  cardIcon: {
    width: 40, height: 40,
    background: "rgba(220,30,30,0.12)",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f0ede8",
    letterSpacing: "-0.02em",
  },
  cardSub: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  cardArrow: {
    position: "absolute",
    bottom: 20, right: 20,
    color: "#dc1e1e",
    fontSize: 18,
    opacity: 0.6,
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 200,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px",
    overflowY: "auto",
  },
  modalBox: {
    background: "#111113",
    border: "1px solid rgba(220,30,30,0.25)",
    borderRadius: 3,
    width: "100%",
    maxWidth: 800,
    padding: "36px",
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    top: 16, right: 16,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 2,
    color: "#888",
    cursor: "pointer",
    padding: "4px 10px",
    fontSize: 18,
    fontFamily: "'Georgia', serif",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    fontSize: 12,
    color: "#666",
    flexWrap: "wrap",
  },
  breadcrumbItem: {
    color: "#dc1e1e",
    cursor: "pointer",
    textDecoration: "underline",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#666",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  td: {
    padding: "14px 16px",
    fontSize: 14,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  tr: {
    cursor: "pointer",
    transition: "background 0.15s",
  },
  trHover: {
    background: "rgba(220,30,30,0.06)",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 2,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: "-0.02em",
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 13,
    color: "#666",
    marginBottom: 32,
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    background: "rgba(220,30,30,0.12)",
    border: "1px solid rgba(220,30,30,0.25)",
    borderRadius: 20,
    fontSize: 12,
    color: "#dc1e1e",
  },
  uploadArea: {
    border: "2px dashed rgba(220,30,30,0.3)",
    borderRadius: 3,
    padding: "48px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tag: {
    display: "inline-block",
    padding: "3px 10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 2,
    fontSize: 11,
    color: "#aaa",
    marginRight: 6,
    marginBottom: 4,
  },
};

// ─── FLAME SVG ────────────────────────────────────────────────────────────────
const FlameSVG = ({ size = 32, color = "#dc1e1e" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="75" rx="35" ry="18" fill={color} />
    <path d="M35 72 Q28 50 38 30 Q42 20 50 15 Q45 35 52 42 Q56 28 62 20 Q72 40 68 60 Q65 72 55 75 Q60 55 55 48 Q48 62 35 72Z" fill={color} />
  </svg>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [senhaConf, setSenhaConf] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const VALID_DOMAINS = ["@santander.com.br", "@santandercorretora.com.br", "@toroinvestimentos.com.br", "@santanderam"];

  const handleLogin = () => {
    setErr("");
    const user = USERS_DB[email];
    if (!user || user.senha !== senha) {
      setErr("Email ou senha incorretos.");
      return;
    }
    onLogin({ email, nome: user.nome, role: user.role });
  };

  const handleCadastro = () => {
    setErr("");
    const validDomain = VALID_DOMAINS.some(d => email.endsWith(d));
    if (!validDomain) {
      setErr("Use seu email corporativo (@santander.com.br, @santandercorretora.com.br, @toroinvestimentos.com.br ou @santanderam)");
      return;
    }
    if (senha.length < 9) {
      setErr("A senha deve ter no mínimo 9 dígitos.");
      return;
    }
    if (senha !== senhaConf) {
      setErr("As senhas não conferem.");
      return;
    }
    if (!nome.trim()) {
      setErr("Informe seu nome completo.");
      return;
    }
    USERS_DB[email] = { senha, nome, role: "user" };
    setOk(`Cadastro realizado! Email de confirmação enviado para ${email}. Você já pode fazer login.`);
    setTimeout(() => { setMode("login"); setOk(""); }, 3000);
  };

  const inputStyle = (name) => ({
    ...S.input,
    ...(focusedInput === name ? S.inputFocus : {}),
  });

  return (
    <div style={S.loginPage}>
      {/* bg decoration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 1, height: "40%",
            background: "linear-gradient(to bottom, transparent, rgba(220,30,30,0.08), transparent)",
            left: `${i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }} />
        ))}
      </div>
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
              <input style={inputStyle("email")} value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedInput("email")} onBlur={() => setFocusedInput(null)}
                placeholder="usuario@santander.com.br" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={S.label}>Senha</label>
              <input style={inputStyle("senha")} type="password" value={senha} onChange={e => setSenha(e.target.value)}
                onFocus={() => setFocusedInput("senha")} onBlur={() => setFocusedInput(null)}
                placeholder="••••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button style={S.btn} onClick={handleLogin} onMouseOver={e => e.target.style.background = "#b01515"} onMouseOut={e => e.target.style.background = "#dc1e1e"}>
              Entrar na plataforma
            </button>
            <button style={{ ...S.btn, ...S.btnOutline, marginTop: 12 }} onClick={() => setMode("cadastro")}>
              Não tem login? Cadastre-se
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Nome completo</label>
              <input style={inputStyle("nome")} value={nome} onChange={e => setNome(e.target.value)}
                onFocus={() => setFocusedInput("nome")} onBlur={() => setFocusedInput(null)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Email corporativo</label>
              <input style={inputStyle("emailc")} value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedInput("emailc")} onBlur={() => setFocusedInput(null)}
                placeholder="usuario@santandercorretora.com.br" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Senha (mín. 9 dígitos)</label>
              <input style={inputStyle("sc")} type="password" value={senha} onChange={e => setSenha(e.target.value)}
                onFocus={() => setFocusedInput("sc")} onBlur={() => setFocusedInput(null)} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={S.label}>Confirmar senha</label>
              <input style={inputStyle("sc2")} type="password" value={senhaConf} onChange={e => setSenhaConf(e.target.value)}
                onFocus={() => setFocusedInput("sc2")} onBlur={() => setFocusedInput(null)} />
            </div>
            <button style={S.btn} onClick={handleCadastro} onMouseOver={e => e.target.style.background = "#b01515"} onMouseOut={e => e.target.style.background = "#dc1e1e"}>
              Cadastrar
            </button>
            <button style={{ ...S.btn, ...S.btnOutline, marginTop: 12 }} onClick={() => setMode("login")}>
              ← Voltar ao login
            </button>
          </>
        )}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#444" }}>
          Santander Corretora © 2025 · Uso interno
        </div>
      </div>
    </div>
  );
}

// ─── DRILL-DOWN MODAL ─────────────────────────────────────────────────────────
function DrillModal({ cardType, cardLabel, cardIcon, filteredData, onClose }) {
  const [level, setLevel] = useState("tl"); // tl | assessor | detail
  const [selectedTL, setSelectedTL] = useState(null);
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filterByCard = (rows) => {
    switch (cardType) {
      case "captacao": return rows.filter(r => r.classeAtivo === "Captação Líquida");
      case "coe": return rows.filter(r => r.classeAtivo === "COE");
      case "titulos": return rows.filter(r => r.familia === "Títulos Públicos");
      case "rf": return rows.filter(r => r.familia === "LCI/LCA/CDB");
      case "liquidez": return rows.filter(r => r.classeAtivo === "Liquidez");
      case "vencimento": return rows.filter(r => r.vencimento && daysUntil(r.vencimento) < 365 * 5);
      case "corretora": return rows.filter(r => ["Ações", "FII", "ETF", "TERMO"].includes(r.familia) || r.familia === "Renda Variável");
      default: return rows;
    }
  };

  const relevant = filterByCard(filteredData);

  // Group by TL
  const byTL = {};
  relevant.forEach(r => {
    if (!byTL[r.tl]) byTL[r.tl] = { tl: r.tl, coord: r.coordenador, producao: 0, saldo: 0, assessores: new Set() };
    byTL[r.tl].producao += r.producao;
    byTL[r.tl].saldo += r.saldoInv;
    byTL[r.tl].assessores.add(r.assessor);
  });
  const tlList = Object.values(byTL).sort((a, b) => b.producao - a.producao);

  // Group by assessor within selected TL
  const byAssessor = {};
  if (selectedTL) {
    relevant.filter(r => r.tl === selectedTL).forEach(r => {
      if (!byAssessor[r.assessor]) byAssessor[r.assessor] = { assessor: r.assessor, producao: 0, saldo: 0, rows: [] };
      byAssessor[r.assessor].producao += r.producao;
      byAssessor[r.assessor].saldo += r.saldoInv;
      byAssessor[r.assessor].rows.push(r);
    });
  }
  const assessorList = Object.values(byAssessor).sort((a, b) => b.producao - a.producao);

  // Detail for selected assessor
  const detailRows = selectedAssessor
    ? relevant.filter(r => r.tl === selectedTL && r.assessor === selectedAssessor).sort((a, b) => b.producao - a.producao)
    : [];

  const totalProd = relevant.reduce((a, r) => a + r.producao, 0);
  const totalSaldo = relevant.reduce((a, r) => a + r.saldoInv, 0);

  const isVencimento = cardType === "vencimento";

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <button style={S.modalClose} onClick={onClose}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ ...S.cardIcon, width: 44, height: 44, fontSize: 20 }}>{cardIcon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: "700", letterSpacing: "-0.01em" }}>{cardLabel}</div>
            <div style={{ fontSize: 12, color: "#666" }}>Produção total: <span style={{ color: "#f0ede8" }}>{formatCurrency(totalProd)}</span> · Saldo: <span style={{ color: "#f0ede8" }}>{formatCurrency(totalSaldo)}</span></div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={S.breadcrumb}>
          <span style={S.breadcrumbItem} onClick={() => { setLevel("tl"); setSelectedTL(null); setSelectedAssessor(null); }}>
            Todos os TLs
          </span>
          {selectedTL && <>
            <span>›</span>
            <span style={S.breadcrumbItem} onClick={() => { setLevel("assessor"); setSelectedAssessor(null); }}>
              {selectedTL}
            </span>
          </>}
          {selectedAssessor && <>
            <span>›</span>
            <span style={{ color: "#f0ede8" }}>{selectedAssessor}</span>
          </>}
        </div>

        {/* TL Level */}
        {level === "tl" && (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>Team Leader</th>
                <th style={S.th}>Coord./Regional</th>
                <th style={S.th}>Assessores</th>
                <th style={{ ...S.th, textAlign: "right" }}>Produção ($)</th>
                <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th>
              </tr>
            </thead>
            <tbody>
              {tlList.map((tl, i) => (
                <tr key={tl.tl} style={{ ...S.tr, ...(hoveredRow === tl.tl ? S.trHover : {}) }}
                  onMouseEnter={() => setHoveredRow(tl.tl)} onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => { setSelectedTL(tl.tl); setLevel("assessor"); }}>
                  <td style={{ ...S.td, color: i === 0 ? "#dc1e1e" : "#666", fontWeight: "700" }}>{i + 1}</td>
                  <td style={{ ...S.td, color: "#dc1e1e", fontWeight: "600" }}>{tl.tl} →</td>
                  <td style={{ ...S.td, color: "#888" }}>{tl.coord}</td>
                  <td style={{ ...S.td, color: "#888" }}>{tl.assessores.size}</td>
                  <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(tl.producao)}</td>
                  <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(tl.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Assessor Level */}
        {level === "assessor" && (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>Assessor (AAA)</th>
                <th style={{ ...S.th, textAlign: "right" }}>Produção ($)</th>
                <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th>
              </tr>
            </thead>
            <tbody>
              {assessorList.map((a, i) => (
                <tr key={a.assessor} style={{ ...S.tr, ...(hoveredRow === a.assessor ? S.trHover : {}) }}
                  onMouseEnter={() => setHoveredRow(a.assessor)} onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => { setSelectedAssessor(a.assessor); setLevel("detail"); }}>
                  <td style={{ ...S.td, color: i === 0 ? "#dc1e1e" : "#666", fontWeight: "700" }}>{i + 1}</td>
                  <td style={{ ...S.td, color: "#dc1e1e", fontWeight: "600" }}>{a.assessor} →</td>
                  <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(a.producao)}</td>
                  <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(a.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Detail Level */}
        {level === "detail" && (
          <div>
            {isVencimento ? (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Produto</th>
                    <th style={S.th}>Sub Produto</th>
                    <th style={S.th}>Vencimento</th>
                    <th style={S.th}>Dias</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Produção</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.sort((a, b) => daysUntil(a.vencimento) - daysUntil(b.vencimento)).map((r, i) => {
                    const days = daysUntil(r.vencimento);
                    return (
                      <tr key={i} style={S.tr}>
                        <td style={S.td}>{r.produto}</td>
                        <td style={S.td}>{r.subProduto}</td>
                        <td style={S.td}>{formatDate(r.vencimento)}</td>
                        <td style={S.td}>
                          <span style={{ ...S.badge, background: days < 90 ? "rgba(220,30,30,0.2)" : "rgba(255,255,255,0.06)", color: days < 90 ? "#ff6b6b" : "#aaa" }}>
                            {days} dias
                          </span>
                        </td>
                        <td style={{ ...S.td, textAlign: "right" }}>{formatCurrency(r.saldoInv)}</td>
                        <td style={{ ...S.td, textAlign: "right" }}>{formatCurrency(r.producao)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Família</th>
                    <th style={S.th}>Produto</th>
                    <th style={S.th}>Sub Produto</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Produção ($)</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Saldo Inv.</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((r, i) => (
                    <tr key={i} style={S.tr}>
                      <td style={S.td}><span style={S.tag}>{r.familia}</span></td>
                      <td style={S.td}>{r.produto}</td>
                      <td style={{ ...S.td, color: "#888" }}>{r.subProduto}</td>
                      <td style={{ ...S.td, textAlign: "right", fontWeight: "700" }}>{formatCurrency(r.producao)}</td>
                      <td style={{ ...S.td, textAlign: "right", color: "#888" }}>{formatCurrency(r.saldoInv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [ok, setOk] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    setFile(f);
  };

  const handleConfirm = () => {
    if (!file) return;
    setOk(true);
    setTimeout(() => { onUpload(file); onClose(); }, 1500);
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 520, marginTop: 80 }}>
        <button style={S.modalClose} onClick={onClose}>✕</button>
        <div style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>📤 Atualizar Base de Dados</div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 28 }}>Envie a planilha (.xlsx ou .csv) com os dados de produção.</div>

        <input ref={fileRef} type="file" accept=".xlsx,.csv,.xls" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

        <div
          style={{ ...S.uploadArea, ...(dragging ? { borderColor: "#dc1e1e", background: "rgba(220,30,30,0.06)" } : {}) }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          {file ? (
            <div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: "700", color: "#dc1e1e" }}>{file.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 36, marginBottom: 12 }}>☁</div>
              <div style={{ fontWeight: "600", marginBottom: 4 }}>Arraste a planilha aqui</div>
              <div style={{ fontSize: 12, color: "#666" }}>ou clique para selecionar — .xlsx, .csv</div>
            </div>
          )}
        </div>

        {ok && <div style={{ ...S.err, background: "rgba(30,220,80,0.1)", borderColor: "rgba(30,220,80,0.3)", color: "#4ade80", marginTop: 16 }}>✓ Base de dados atualizada com sucesso!</div>}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={{ ...S.btn, opacity: file ? 1 : 0.4 }} onClick={handleConfirm} disabled={!file}>
            Confirmar upload
          </button>
          <button style={{ ...S.btn, ...S.btnOutline }} onClick={onClose}>Cancelar</button>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 2, fontSize: 12, color: "#666" }}>
          <strong style={{ color: "#888" }}>Colunas esperadas na planilha:</strong>
          <div style={{ marginTop: 6, lineHeight: 1.8 }}>
            Coordenador · Regional · Team Leader (TL) · Assessor (AAA) · Mês de Produção · Classe de Ativos · Família de Produtos · Produto · Sub Produto · Saldo Inv. · Produção ($) · Vencimento
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [data] = useState(MOCK_DATA);
  const [filterHead] = useState("Todos");
  const [filterCoord, setFilterCoord] = useState("Todos");
  const [filterTL, setFilterTL] = useState("Todos");
  const [filterAssessor, setFilterAssessor] = useState("Todos");
  const [filterMes, setFilterMes] = useState("Todos");
  const [activeCard, setActiveCard] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Unique values
  const meses = [...new Set(data.map(r => r.mes))].sort().reverse();
  const coords = ["Todos", ...new Set(data.map(r => r.coordenador))];
  const tls = ["Todos", ...new Set(data.filter(r => filterCoord === "Todos" || r.coordenador === filterCoord).map(r => r.tl))];
  const assessores = ["Todos", ...new Set(data.filter(r => (filterTL === "Todos" || r.tl === filterTL)).map(r => r.assessor))];

  // Filtered data
  const filtered = data.filter(r => {
    if (filterMes !== "Todos" && r.mes !== filterMes) return false;
    if (filterCoord !== "Todos" && r.coordenador !== filterCoord) return false;
    if (filterTL !== "Todos" && r.tl !== filterTL) return false;
    if (filterAssessor !== "Todos" && r.assessor !== filterAssessor) return false;
    return true;
  });

  // Aggregations
  const sum = (fn) => filtered.filter(fn).reduce((a, r) => a + r.producao, 0);
  const saldoSum = (fn) => filtered.filter(fn).reduce((a, r) => a + r.saldoInv, 0);

  const captacao = sum(r => r.classeAtivo === "Captação Líquida");
  const coe = sum(r => r.classeAtivo === "COE");
  const titulos = sum(r => r.familia === "Títulos Públicos");
  const rf = sum(r => r.familia === "LCI/LCA/CDB");
  const liquidez = sum(r => r.classeAtivo === "Liquidez");
  const corretora = sum(r => ["Ações", "FII", "ETF", "TERMO"].includes(r.familia));
  const vencimentos = filtered.filter(r => r.vencimento).length;

  const activeMes = filterMes === "Todos" ? (meses[0] || "") : filterMes;
  const mesLabel = activeMes ? new Date(activeMes + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "";

  const CARDS = [
    { type: "captacao", icon: "💰", label: "Captação Líquida", value: captacao, sub: saldoSum(r => r.classeAtivo === "Captação Líquida"), color: "#22c55e" },
    { type: "coe", icon: "📈", label: "Aplicação em COE", value: coe, sub: saldoSum(r => r.classeAtivo === "COE"), color: "#f59e0b" },
    { type: "titulos", icon: "🏛", label: "Títulos Públicos", value: titulos, sub: saldoSum(r => r.familia === "Títulos Públicos"), color: "#3b82f6" },
    { type: "rf", icon: "🏦", label: "Renda Fixa — LCI/LCA/CDB", value: rf, sub: saldoSum(r => r.familia === "LCI/LCA/CDB"), color: "#8b5cf6" },
    { type: "liquidez", icon: "💧", label: "Valores em Liquidez (D0/D1)", value: liquidez, sub: saldoSum(r => r.classeAtivo === "Liquidez"), color: "#06b6d4" },
    { type: "vencimento", icon: "📅", label: "Aplicações com Vencimento", value: vencimentos, isCount: true, sub: saldoSum(r => r.vencimento), color: "#f97316" },
    { type: "corretora", icon: "📊", label: "Renda Variável — Corretora", value: corretora, sub: saldoSum(r => ["Ações", "FII", "ETF", "TERMO"].includes(r.familia)), color: "#dc1e1e" },
  ];

  return (
    <div style={S.app}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navLogo}>
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
          <div style={{ ...S.pill }}>
            <span>👤</span>
            <span>{user.nome}</span>
            {user.role === "admin" && <span style={{ background: "#dc1e1e", color: "#fff", padding: "1px 6px", borderRadius: 10, fontSize: 9, fontWeight: "700" }}>ADM</span>}
          </div>
          <button style={{ ...S.btn, ...S.btnOutline, width: "auto", padding: "6px 14px", fontSize: 12 }} onClick={onLogout}>Sair</button>
        </div>
      </nav>

      {/* PAGE */}
      <div style={S.page}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ ...S.heading, margin: 0 }}>Painel de Produção</h1>
            <div style={S.pill}>{mesLabel || "Todos os meses"}</div>
          </div>
          <div style={S.subHeading}>Visão consolidada · Dados atualizados · Filtre por hierarquia</div>
        </div>

        {/* Filters */}
        <div style={S.filterBar}>
          <div>
            <label style={S.label}>Mês</label>
            <select style={S.select} value={filterMes} onChange={e => setFilterMes(e.target.value)}>
              <option value="Todos">Todos os meses</option>
              {meses.map(m => <option key={m} value={m}>{new Date(m + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</option>)}
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

        {/* KPI Cards */}
        <div style={S.grid}>
          {CARDS.map(card => (
            <div
              key={card.type}
              style={{ ...S.card, ...(hoveredCard === card.type ? S.cardHover : {}) }}
              onMouseEnter={() => setHoveredCard(card.type)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveCard(card)}
            >
              <div style={{ ...S.cardAccent, background: card.color }} />
              <div style={{ ...S.cardIcon, background: `${card.color}18` }}>
                {card.icon}
              </div>
              <div style={S.cardLabel}>{card.label}</div>
              <div style={{ ...S.cardValue, color: hoveredCard === card.type ? card.color : "#f0ede8" }}>
                {card.isCount ? `${card.value} títulos` : formatCurrency(card.value)}
              </div>
              <div style={S.cardSub}>Saldo investido: {formatCurrency(card.sub)}</div>
              <div style={{ ...S.cardArrow, color: card.color }}>→</div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div style={{ display: "flex", gap: 24, padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, flexWrap: "wrap" }}>
          <div>
            <div style={S.cardLabel}>Total Produção</div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "#dc1e1e" }}>{formatCurrency(filtered.reduce((a, r) => a + r.producao, 0))}</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={S.cardLabel}>Total Saldo Investido</div>
            <div style={{ fontSize: 20, fontWeight: "700" }}>{formatCurrency(filtered.reduce((a, r) => a + r.saldoInv, 0))}</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={S.cardLabel}>TLs ativos</div>
            <div style={{ fontSize: 20, fontWeight: "700" }}>{new Set(filtered.map(r => r.tl)).size}</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={S.cardLabel}>Assessores ativos</div>
            <div style={{ fontSize: 20, fontWeight: "700" }}>{new Set(filtered.map(r => r.assessor)).size}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <div style={{ ...S.pill, fontSize: 11, opacity: 0.7 }}>
              <span>⬤</span> Clique em um quadro para ver o drill-down completo
            </div>
          </div>
        </div>
      </div>

      {/* Drill modal */}
      {activeCard && (
        <DrillModal
          cardType={activeCard.type}
          cardLabel={activeCard.label}
          cardIcon={activeCard.icon}
          filteredData={filtered}
          onClose={() => setActiveCard(null)}
        />
      )}

      {/* Upload modal */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUpload={(f) => console.log("Upload:", f.name)} />
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginPage onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
