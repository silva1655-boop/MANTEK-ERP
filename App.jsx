import { useState, useEffect } from "react";
import {
  AlertTriangle, CheckCircle, Clock, Wrench, BarChart2, Package,
  Users, FileText, Bell, LogOut, ChevronRight, Plus, X, Eye,
  Calendar, Zap, Shield, TrendingUp, Settings, Filter, Search,
  ClipboardList, AlertCircle, Check, RefreshCw,
  Activity, ArrowRight, Edit2
} from "lucide-react";

// ─── SEED DATA ─────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: "u1", name: "Carlos Mendoza", role: "supervisor", email: "cmendoza@navimag.cl", password: "sup123", avatar: "CM" },
  { id: "u2", name: "Roberto Silva", role: "mecanico", email: "rsilva@navimag.cl", password: "mec123", avatar: "RS" },
  { id: "u3", name: "Ana Torres", role: "mecanico", email: "atorres@navimag.cl", password: "mec456", avatar: "AT" },
  { id: "u4", name: "Luis Pérez", role: "operaciones", email: "lperez@navimag.cl", password: "op123", avatar: "LP" },
  { id: "u5", name: "Daniela Rojas", role: "operaciones", email: "drojas@navimag.cl", password: "op456", avatar: "DR" },
];

const SEED_EQUIPMENT = [
  { id: "eq1", code: "TR-618i-01", name: "Kalmar TR618i #1", type: "Tracto Terminal", location: "Patio Norte", criticality: "A", status: "operativo", lastMaint: "2026-03-15", nextMaint: "2026-05-15", hours: 4820 },
  { id: "eq2", code: "TR-618i-02", name: "Kalmar TR618i #2", type: "Tracto Terminal", location: "Patio Norte", criticality: "A", status: "mantenimiento", lastMaint: "2026-04-01", nextMaint: "2026-06-01", hours: 5120 },
  { id: "eq3", code: "RT-223-01", name: "Terberg RT223 #1", type: "Tracto Portuario", location: "Muelle 2", criticality: "A", status: "operativo", lastMaint: "2026-03-20", nextMaint: "2026-05-20", hours: 3200 },
  { id: "eq4", code: "RM-255-01", name: "RM255 Mol #1", type: "Manipulador Reach", location: "Bodega A", criticality: "B", status: "operativo", lastMaint: "2026-02-10", nextMaint: "2026-05-10", hours: 2100 },
  { id: "eq5", code: "GEN-01", name: "Generador Principal", type: "Generador", location: "Sala Máquinas", criticality: "A", status: "operativo", lastMaint: "2026-04-05", nextMaint: "2026-07-05", hours: 8900 },
  { id: "eq6", code: "COMP-01", name: "Compresor Atlas Copco", type: "Compresor", location: "Taller", criticality: "B", status: "falla", lastMaint: "2026-01-20", nextMaint: "2026-04-20", hours: 1560 },
  { id: "eq7", code: "PUA-01", name: "Puente Grúa #1", type: "Grúa", location: "Bodega B", criticality: "A", status: "operativo", lastMaint: "2026-03-28", nextMaint: "2026-06-28", hours: 6700 },
  { id: "eq8", code: "MONTA-01", name: "Montacargas 5T #1", type: "Montacargas", location: "Patio Sur", criticality: "C", status: "operativo", lastMaint: "2026-02-15", nextMaint: "2026-05-15", hours: 950 },
];

const SEED_PM_PLANS = [
  { id: "pm1", equipId: "eq1", name: "Servicio 250h - Kalmar TR618i #1", type: "preventivo", frequency: 250, unit: "horas", nextDate: "2026-05-15", tasks: ["Cambio aceite motor", "Filtro hidráulico", "Revisión frenos", "Check transmisión"], estimatedHours: 4, technician: "u2" },
  { id: "pm2", equipId: "eq3", name: "Inspección Mensual RT223 #1", type: "preventivo", frequency: 30, unit: "días", nextDate: "2026-05-20", tasks: ["Inspección visual", "Niveles fluidos", "Revisión neumáticos", "Luces y señales"], estimatedHours: 2, technician: "u3" },
  { id: "pm3", equipId: "eq5", name: "Mantenimiento Trimestral Generador", type: "preventivo", frequency: 90, unit: "días", nextDate: "2026-07-05", tasks: ["Cambio aceite", "Filtros", "Batería", "Prueba de carga"], estimatedHours: 6, technician: "u2" },
  { id: "pm4", equipId: "eq7", name: "Inspección Mensual Puente Grúa", type: "preventivo", frequency: 30, unit: "días", nextDate: "2026-05-28", tasks: ["Cadenas y cables", "Freno electromagnético", "Controles", "Lubricación"], estimatedHours: 3, technician: "u3" },
  { id: "pm5", equipId: "eq4", name: "Servicio 500h - RM255 Mol", type: "preventivo", frequency: 500, unit: "horas", nextDate: "2026-05-10", tasks: ["Aceite hidráulico", "Filtros", "Llantas", "Horquillas"], estimatedHours: 5, technician: "u2" },
];

const SEED_REQUESTS = [
  { id: "req1", equipId: "eq6", title: "Falla compresor - pierde presión", description: "El compresor no mantiene presión, se detiene a los 5 min de operación.", priority: "alta", status: "aprobada", requestedBy: "u4", requestedAt: "2026-04-22T09:30:00", approvedBy: "u1", otId: "ot3" },
  { id: "req2", equipId: "eq1", title: "Ruido extraño en transmisión", description: "Se escucha traqueteo en la caja de cambios al subir de marcha.", priority: "media", status: "pendiente", requestedBy: "u5", requestedAt: "2026-04-25T14:00:00", approvedBy: null, otId: null },
  { id: "req3", equipId: "eq8", title: "Falla indicador de batería", description: "Indicador de batería no enciende.", priority: "baja", status: "pendiente", requestedBy: "u4", requestedAt: "2026-04-26T08:15:00", approvedBy: null, otId: null },
];

const SEED_WORK_ORDERS = [
  { id: "ot1", code: "OT-2026-001", type: "preventivo", equipId: "eq2", planId: "pm1", title: "Servicio 250h - Kalmar TR618i #2", priority: "alta", status: "en_proceso", assignedTo: "u2", createdAt: "2026-04-01T08:00:00", scheduledDate: "2026-04-01", estimatedHours: 4, actualHours: null, description: "Mantenimiento preventivo programado 250h.", observations: "", parts: [{ name: "Filtro aceite", qty: 1, code: "FIL-001" }, { name: "Aceite motor 15W40", qty: 5, code: "ACE-001" }], source: "plan" },
  { id: "ot2", code: "OT-2026-002", type: "preventivo", equipId: "eq3", planId: "pm2", title: "Inspección Mensual RT223 #1", priority: "media", status: "completada", assignedTo: "u3", createdAt: "2026-03-20T08:00:00", scheduledDate: "2026-03-20", estimatedHours: 2, actualHours: 2.5, description: "Inspección mensual programada.", observations: "Se ajustaron frenos, nivel de hidráulico bajo - completado.", parts: [], source: "plan" },
  { id: "ot3", code: "OT-2026-003", type: "correctivo", equipId: "eq6", planId: null, title: "Reparación Compresor Atlas Copco - Falla presión", priority: "alta", status: "asignada", assignedTo: "u2", createdAt: "2026-04-22T10:00:00", scheduledDate: "2026-04-23", estimatedHours: 6, actualHours: null, description: "Pérdida de presión.", observations: "", parts: [{ name: "Kit sellos compresor", qty: 1, code: "KIT-002" }], source: "solicitud", reqId: "req1" },
  { id: "ot4", code: "OT-2026-004", type: "preventivo", equipId: "eq7", planId: "pm4", title: "Inspección Mensual Puente Grúa #1", priority: "alta", status: "pendiente", assignedTo: "u3", createdAt: "2026-04-26T07:00:00", scheduledDate: "2026-04-28", estimatedHours: 3, actualHours: null, description: "Inspección preventiva mensual puente grúa.", observations: "", parts: [], source: "plan" },
  { id: "ot5", code: "OT-2026-005", type: "preventivo", equipId: "eq5", planId: "pm3", title: "Mantenimiento Trimestral Generador Principal", priority: "media", status: "pendiente", assignedTo: "u2", createdAt: "2026-04-26T07:00:00", scheduledDate: "2026-05-05", estimatedHours: 6, actualHours: null, description: "Mantenimiento trimestral programado generador.", observations: "", parts: [], source: "plan" },
];

// ─── LOCALSTORAGE HELPERS ──────────────────────────────────────────────────
const KEYS = { users: "erp:users", equipment: "erp:equipment", plans: "erp:plans", requests: "erp:requests", workOrders: "erp:workorders" };

function loadData(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch { return seed; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── UTILITY ──────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
const fmtDT = (d) => d ? new Date(d).toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const uid = () => Math.random().toString(36).slice(2, 10);
const nextOTCode = (wos) => `OT-2026-${String(wos.length + 1).padStart(3, "0")}`;

const CRITICALITY_LABEL = { A: "Crítico", B: "Importante", C: "Rutinario" };
const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", color: "text-slate-400 bg-slate-400/10 border-slate-400/30" },
  asignada: { label: "Asignada", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  en_proceso: { label: "En Proceso", color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  completada: { label: "Completada", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  cancelada: { label: "Cancelada", color: "text-red-400 bg-red-400/10 border-red-400/30" },
  aprobada: { label: "Aprobada", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  rechazada: { label: "Rechazada", color: "text-red-400 bg-red-400/10 border-red-400/30" },
  operativo: { label: "Operativo", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  mantenimiento: { label: "Mantenimiento", color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  falla: { label: "Falla", color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

const Badge = ({ s, label }) => {
  const cfg = STATUS_CONFIG[s] || { label: s, color: "text-slate-400 bg-slate-400/10 border-slate-400/30" };
  return <span className={`px-2 py-0.5 rounded border text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{label || cfg.label}</span>;
};
const CRIT_COLOR = { A: "text-red-400 bg-red-400/10 border-red-400/30", B: "text-amber-400 bg-amber-400/10 border-amber-400/30", C: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };

// ─── ROLE CONFIG ─────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  supervisor: { label: "Supervisor", color: "text-violet-400", icon: Shield, nav: ["dashboard", "workorders", "equipment", "plans", "requests", "reports", "users"] },
  mecanico: { label: "Mecánico", color: "text-amber-400", icon: Wrench, nav: ["dashboard", "workorders", "reports"] },
  operaciones: { label: "Operaciones", color: "text-blue-400", icon: Activity, nav: ["dashboard", "requests", "notifications"] },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "amber" }) {
  const colors = { amber: "text-amber-400 bg-amber-400/10", blue: "text-blue-400 bg-blue-400/10", red: "text-red-400 bg-red-400/10", emerald: "text-emerald-400 bg-emerald-400/10", violet: "text-violet-400 bg-violet-400/10" };
  return (
    <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}><Icon size={20} /></div>
      <div><div className="text-slate-400 text-xs mb-0.5">{label}</div>
        <div className="text-white font-bold text-2xl leading-none">{value}</div>
        {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}</div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [err, setErr] = useState("");
  const handle = () => {
    const u = users.find(x => x.email === email && x.password === pass);
    if (u) onLogin(u); else setErr("Credenciales incorrectas");
  };
  const quick = (u) => onLogin(u);
  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", background: "#0a0e1a" }} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center">
              <Wrench size={20} className="text-black" />
            </div>
            <div className="text-left">
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }} className="text-white font-bold text-xl tracking-tight">MANTEK ERP</div>
              <div className="text-slate-500 text-xs tracking-widest">SISTEMA DE MANTENIMIENTO</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-8">
          <div className="text-slate-300 text-sm mb-6 font-medium">Iniciar Sesión</div>
          {err && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded mb-4">{err}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-slate-500 text-xs mb-1 block">CORREO</label>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="usuario@navimag.cl" />
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">CONTRASEÑA</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="••••••" />
            </div>
            <button onClick={handle} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">
              INGRESAR
            </button>
          </div>
          <div className="mt-6 border-t border-slate-700/50 pt-5">
            <div className="text-slate-500 text-xs mb-3">Acceso rápido (demo)</div>
            <div className="space-y-2">
              {[users[0], users[1], users[3]].filter(Boolean).map(u => (
                <button key={u.id} onClick={() => quick(u)} className="w-full flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 transition-colors text-left">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${ROLE_CONFIG[u.role].color} bg-slate-700`}>{u.avatar}</div>
                  <div><div className="text-white text-xs font-medium">{u.name}</div>
                    <div className={`text-xs ${ROLE_CONFIG[u.role].color}`}>{ROLE_CONFIG[u.role].label}</div></div>
                  <ArrowRight size={14} className="ml-auto text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
const NAV_ITEMS = {
  dashboard: { label: "Dashboard", icon: BarChart2 },
  workorders: { label: "Órdenes de Trabajo", icon: ClipboardList },
  equipment: { label: "Equipos", icon: Package },
  plans: { label: "Plan Preventivo", icon: Calendar },
  requests: { label: "Solicitudes", icon: Bell },
  notifications: { label: "Notificaciones", icon: Bell },
  reports: { label: "Informes", icon: FileText },
  users: { label: "Usuarios", icon: Users },
};

function Sidebar({ user, active, onNav, onLogout, notifications }) {
  const cfg = ROLE_CONFIG[user.role];
  const RoleIcon = cfg.icon;
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }} className="w-56 bg-slate-950 border-r border-slate-800/50 flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center flex-shrink-0"><Wrench size={14} className="text-black" /></div>
          <div><div className="text-white font-bold text-sm">MANTEK ERP</div><div className="text-slate-500 text-xs">v2.0</div></div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {cfg.nav.map(key => {
          const item = NAV_ITEMS[key]; if (!item) return null;
          const Icon = item.icon; const isActive = active === key;
          const notifCount = (key === "requests" || key === "notifications") ? notifications : 0;
          return (
            <button key={key} onClick={() => onNav(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>
              <Icon size={15} /><span className="flex-1 text-left">{item.label}</span>
              {notifCount > 0 && <span className="bg-amber-500 text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{notifCount}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800/50">
        <div className="flex items-center gap-2 px-2 py-2 mb-2">
          <div className={`w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ${cfg.color}`}>{user.avatar}</div>
          <div className="min-w-0"><div className="text-white text-xs font-medium truncate">{user.name}</div>
            <div className={`text-xs ${cfg.color} flex items-center gap-1`}><RoleIcon size={10} />{cfg.label}</div></div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 text-sm rounded-lg hover:bg-red-400/5 transition-all">
          <LogOut size={14} /><span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ user, data, onNav }) {
  const { wos, equip, requests } = data;
  const role = user.role;
  const pendingWOs = wos.filter(w => w.status !== "completada" && w.status !== "cancelada");
  const myWOs = wos.filter(w => w.assignedTo === user.id && w.status !== "completada");
  const fallas = equip.filter(e => e.status === "falla");
  const pendingReqs = requests.filter(r => r.status === "pendiente");
  const completed = wos.filter(w => w.status === "completada").length;
  const critical = pendingWOs.filter(w => w.priority === "alta").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl">Dashboard</h1>
        <p className="text-slate-400 text-sm">Bienvenido, {user.name} · {ROLE_CONFIG[role].label}</p>
      </div>
      {role === "supervisor" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={ClipboardList} label="OT Activas" value={pendingWOs.length} sub={`${critical} críticas`} color="amber" />
            <StatCard icon={AlertTriangle} label="Equipos en Falla" value={fallas.length} color="red" />
            <StatCard icon={Bell} label="Solicitudes Pendientes" value={pendingReqs.length} color="blue" />
            <StatCard icon={CheckCircle} label="OT Completadas" value={completed} sub="este mes" color="emerald" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">OT Recientes</h2>
                <button onClick={() => onNav("workorders")} className="text-amber-400 text-xs hover:underline flex items-center gap-1">Ver todo <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {wos.slice(0, 5).map(w => (
                  <div key={w.id} className="flex items-center gap-3 py-2 border-b border-slate-800/50 last:border-0">
                    <Badge s={w.status} /><span className="text-slate-300 text-xs flex-1 truncate">{w.title}</span><Badge s={w.priority} label={w.priority} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">Estado de Equipos</h2>
                <button onClick={() => onNav("equipment")} className="text-amber-400 text-xs hover:underline flex items-center gap-1">Ver todo <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {equip.map(e => (
                  <div key={e.id} className="flex items-center gap-3 py-2 border-b border-slate-800/50 last:border-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${e.status === "operativo" ? "bg-emerald-400" : e.status === "falla" ? "bg-red-400" : "bg-amber-400"}`} />
                    <span className="text-slate-300 text-xs flex-1 truncate">{e.name}</span>
                    <Badge s={e.criticality} label={CRITICALITY_LABEL[e.criticality]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {role === "mecanico" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={ClipboardList} label="Mis OT Pendientes" value={myWOs.length} color="amber" />
            <StatCard icon={CheckCircle} label="Completadas" value={wos.filter(w => w.assignedTo === user.id && w.status === "completada").length} color="emerald" />
          </div>
          <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Mis Órdenes de Trabajo</h2>
            <div className="space-y-3">
              {myWOs.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No tienes órdenes asignadas</p>}
              {myWOs.map(w => {
                const eq = data.equip.find(e => e.id === w.equipId);
                return (
                  <div key={w.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-amber-400 text-xs font-mono mb-1">{w.code}</div>
                        <div className="text-white text-sm font-medium">{w.title}</div>
                        <div className="text-slate-400 text-xs mt-1">{eq?.name} · {fmt(w.scheduledDate)}</div>
                      </div>
                      <Badge s={w.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      {role === "operaciones" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={AlertTriangle} label="Equipos en Falla" value={fallas.length} color="red" />
            <StatCard icon={Bell} label="Mis Solicitudes" value={requests.filter(r => r.requestedBy === user.id).length} color="blue" />
          </div>
          {fallas.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <h2 className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2"><AlertCircle size={15} />Equipos con Falla Activa</h2>
              {fallas.map(e => (
                <div key={e.id} className="bg-slate-900/50 rounded-lg p-3 mb-2 last:mb-0">
                  <div className="text-white text-sm font-medium">{e.name}</div>
                  <div className="text-slate-400 text-xs">{e.location} · Criticidad {e.criticality}</div>
                </div>
              ))}
            </div>
          )}
          <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Mis Solicitudes Recientes</h2>
            {requests.filter(r => r.requestedBy === user.id).slice(0, 5).map(r => {
              const eq = equip.find(e => e.id === r.equipId);
              return (
                <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-800/50 last:border-0">
                  <Badge s={r.status} /><span className="text-slate-300 text-xs flex-1 truncate">{r.title}</span>
                  <span className="text-slate-500 text-xs">{eq?.code}</span>
                </div>
              );
            })}
            {requests.filter(r => r.requestedBy === user.id).length === 0 && <p className="text-slate-500 text-sm text-center py-4">Sin solicitudes registradas</p>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── WORK ORDERS ──────────────────────────────────────────────────────────
function WorkOrders({ user, data, setData }) {
  const { wos, equip, users } = data;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({ actualHours: "", observations: "", status: "completada" });
  const role = user.role;

  const visible = wos.filter(w => {
    if (role === "mecanico" && w.assignedTo !== user.id) return false;
    if (filter !== "all" && w.status !== filter) return false;
    if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateWO = (id, patch) => {
    const updated = wos.map(w => w.id === id ? { ...w, ...patch } : w);
    setData(d => ({ ...d, wos: updated }));
    saveData(KEYS.workOrders, updated);
    if (selected?.id === id) setSelected(s => ({ ...s, ...patch }));
  };

  const submitReport = () => {
    if (!reportData.actualHours) return;
    updateWO(selected.id, { status: reportData.status, actualHours: parseFloat(reportData.actualHours), observations: reportData.observations });
    setShowReport(false); setReportData({ actualHours: "", observations: "", status: "completada" });
  };

  const sel = selected ? wos.find(w => w.id === selected.id) : null;
  const selEquip = sel ? equip.find(e => e.id === sel.equipId) : null;
  const selAssigned = sel ? users.find(u => u.id === sel.assignedTo) : null;

  return (
    <div className="p-6 flex gap-5 h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-5"><h1 className="text-white font-bold text-xl">Órdenes de Trabajo</h1><p className="text-slate-400 text-sm">{visible.length} registros</p></div>
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar OT..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50" />
          </div>
          {["all", "pendiente", "asignada", "en_proceso", "completada"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${filter === s ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}>
              {s === "all" ? "Todas" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {visible.map(w => {
            const eq = equip.find(e => e.id === w.equipId);
            const asn = users.find(u => u.id === w.assignedTo);
            return (
              <div key={w.id} onClick={() => setSelected(w)}
                className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/30 ${selected?.id === w.id ? "border-amber-500/40 bg-amber-500/5" : "border-slate-800/70"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-amber-400 text-xs font-mono">{w.code}</span>
                      <Badge s={w.type === "preventivo" ? "asignada" : "en_proceso"} label={w.type === "preventivo" ? "Preventivo" : "Correctivo"} />
                      <Badge s={w.status} />
                    </div>
                    <div className="text-white text-sm font-medium truncate">{w.title}</div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-slate-500 text-xs flex items-center gap-1"><Package size={10} />{eq?.code}</span>
                      <span className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={10} />{fmt(w.scheduledDate)}</span>
                      {asn && <span className="text-slate-500 text-xs flex items-center gap-1"><Users size={10} />{asn.name}</span>}
                    </div>
                  </div>
                  <Badge s={w.priority} label={w.priority.toUpperCase()} />
                </div>
              </div>
            );
          })}
          {visible.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No se encontraron órdenes</div>}
        </div>
      </div>

      {sel && (
        <div className="w-80 flex-shrink-0 bg-slate-900 border border-slate-800/70 rounded-xl p-5 h-fit sticky top-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-amber-400 text-xs font-mono">{sel.code}</span>
            <button onClick={() => setSelected(null)}><X size={16} className="text-slate-400 hover:text-white" /></button>
          </div>
          <h3 className="text-white font-semibold text-sm mb-3">{sel.title}</h3>
          <div className="flex flex-wrap gap-2 mb-4"><Badge s={sel.status} /><Badge s={sel.priority} label={sel.priority.toUpperCase()} /></div>
          <div className="space-y-2.5 text-sm mb-4">
            {[["Equipo", selEquip?.name || "—"], ["Código", selEquip?.code || "—"], ["Tipo", sel.type], ["Fuente", sel.source === "plan" ? "Plan Preventivo" : "Solicitud"], ["Programado", fmt(sel.scheduledDate)], ["Horas Est.", `${sel.estimatedHours}h`], ["Asignado a", selAssigned?.name || "—"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2"><span className="text-slate-500">{k}</span><span className="text-slate-200 text-right text-xs">{v}</span></div>
            ))}
            {sel.actualHours && <div className="flex justify-between"><span className="text-slate-500">Horas Reales</span><span className="text-emerald-400">{sel.actualHours}h</span></div>}
          </div>
          {sel.description && <div className="bg-slate-800/50 rounded-lg p-3 mb-3 text-slate-300 text-xs">{sel.description}</div>}
          {sel.observations && <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-3 mb-3 text-slate-300 text-xs"><span className="text-emerald-400 font-medium">Obs: </span>{sel.observations}</div>}
          {sel.parts?.length > 0 && (
            <div className="mb-3">
              <div className="text-slate-500 text-xs mb-2">REPUESTOS</div>
              {sel.parts.map((p, i) => <div key={i} className="text-slate-300 text-xs py-1 border-b border-slate-800/50 flex justify-between"><span>{p.name}</span><span className="text-slate-500">{p.qty}x</span></div>)}
            </div>
          )}
          <div className="space-y-2 mt-4">
            {role === "mecanico" && sel.assignedTo === user.id && sel.status !== "completada" && (
              <>
                {sel.status === "asignada" && <button onClick={() => updateWO(sel.id, { status: "en_proceso" })} className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm py-2 rounded-lg hover:bg-amber-500/20 transition">Iniciar Trabajo</button>}
                <button onClick={() => setShowReport(true)} className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm py-2 rounded-lg hover:bg-emerald-500/20 transition">Reportar Trabajo</button>
              </>
            )}
            {role === "supervisor" && sel.status !== "completada" && sel.status !== "cancelada" && (
              <select value={sel.status} onChange={e => updateWO(sel.id, { status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                <option value="pendiente">Pendiente</option><option value="asignada">Asignada</option>
                <option value="en_proceso">En Proceso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
              </select>
            )}
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold mb-4">Reportar Trabajo — {sel?.code}</h3>
            <div className="space-y-3">
              <div><label className="text-slate-400 text-xs mb-1 block">HORAS REALES *</label>
                <input type="number" step="0.5" value={reportData.actualHours} onChange={e => setReportData(d => ({ ...d, actualHours: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" placeholder="ej: 3.5" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">OBSERVACIONES</label>
                <textarea value={reportData.observations} onChange={e => setReportData(d => ({ ...d, observations: e.target.value }))} rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">ESTADO FINAL</label>
                <select value={reportData.status} onChange={e => setReportData(d => ({ ...d, status: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="completada">Completada</option><option value="en_proceso">En Proceso (parcial)</option>
                </select></div>
              <div className="flex gap-2 pt-2">
                <button onClick={submitReport} className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-2 rounded-lg text-sm hover:bg-emerald-500/20">Enviar</button>
                <button onClick={() => setShowReport(false)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:text-white">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EQUIPMENT ────────────────────────────────────────────────────────────
function Equipment({ user, data, setData }) {
  const { equip } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "", location: "", criticality: "B", status: "operativo", hours: "" });

  const addEquip = () => {
    if (!form.code || !form.name) return;
    const ne = { id: uid(), ...form, hours: parseInt(form.hours) || 0, lastMaint: new Date().toISOString().slice(0, 10), nextMaint: "" };
    const updated = [...equip, ne];
    setData(d => ({ ...d, equip: updated }));
    saveData(KEYS.equipment, updated);
    setShowForm(false); setForm({ code: "", name: "", type: "", location: "", criticality: "B", status: "operativo", hours: "" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-white font-bold text-xl">Equipos</h1><p className="text-slate-400 text-sm">{equip.length} equipos registrados</p></div>
        {user.role === "supervisor" && <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"><Plus size={15} />Nuevo Equipo</button>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {equip.map(e => (
          <div key={e.id} className="bg-slate-900 border border-slate-800/70 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-amber-400 font-mono text-xs mb-1">{e.code}</div>
                <div className="text-white font-semibold text-sm">{e.name}</div>
                <div className="text-slate-400 text-xs mt-0.5">{e.type}</div>
              </div>
              <span className={`px-2 py-0.5 rounded border text-xs font-bold ${CRIT_COLOR[e.criticality]}`}>{CRITICALITY_LABEL[e.criticality]}</span>
            </div>
            <div className="space-y-1.5 mb-3">
              {[["Ubicación", e.location], ["Horas", `${e.hours.toLocaleString()}h`], ["Últ. Mant.", fmt(e.lastMaint)], ["Próx. Mant.", fmt(e.nextMaint)]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs"><span className="text-slate-500">{k}</span><span className="text-slate-300">{v}</span></div>
              ))}
            </div>
            <Badge s={e.status} />
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-white font-semibold mb-4">Agregar Equipo</h3>
            <div className="grid grid-cols-2 gap-3">
              {[["code", "CÓDIGO"], ["name", "NOMBRE"], ["type", "TIPO"], ["location", "UBICACIÓN"]].map(([k, l]) => (
                <div key={k}><label className="text-slate-400 text-xs mb-1 block">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
              ))}
              <div><label className="text-slate-400 text-xs mb-1 block">CRITICIDAD</label>
                <select value={form.criticality} onChange={e => setForm(f => ({ ...f, criticality: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="A">A - Crítico</option><option value="B">B - Importante</option><option value="C">C - Rutinario</option>
                </select></div>
              <div><label className="text-slate-400 text-xs mb-1 block">HORAS ACTUALES</label>
                <input type="number" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addEquip} className="flex-1 bg-amber-500 text-black font-semibold py-2 rounded-lg text-sm hover:bg-amber-400">Guardar</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLANS ────────────────────────────────────────────────────────────────
function Plans({ user, data, setData }) {
  const { plans, equip, users, wos } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipId: "", name: "", frequency: "", unit: "días", nextDate: "", estimatedHours: "", technician: "", tasks: "" });

  const autoGenerateOT = (plan, allWOs) => {
    const eq = equip.find(e => e.id === plan.equipId);
    if (!eq) return null;
    const priority = eq.criticality === "A" ? "alta" : eq.criticality === "B" ? "media" : "baja";
    return {
      id: uid(), code: nextOTCode(allWOs), type: "preventivo", equipId: plan.equipId, planId: plan.id,
      title: plan.name, priority, status: "asignada", assignedTo: plan.technician,
      createdAt: new Date().toISOString(), scheduledDate: plan.nextDate,
      estimatedHours: parseFloat(plan.estimatedHours) || 0, actualHours: null,
      description: `OT generada automáticamente. Tareas: ${Array.isArray(plan.tasks) ? plan.tasks.join(", ") : plan.tasks}`,
      observations: "", parts: [], source: "plan"
    };
  };

  const addPlan = () => {
    if (!form.equipId || !form.name) return;
    const np = { id: uid(), ...form, frequency: parseInt(form.frequency) || 0, estimatedHours: parseFloat(form.estimatedHours) || 0, tasks: form.tasks.split("\n").filter(Boolean) };
    const updatedPlans = [...plans, np];
    const newOT = autoGenerateOT(np, wos);
    const updatedWOs = newOT ? [...wos, newOT] : wos;
    setData(d => ({ ...d, plans: updatedPlans, wos: updatedWOs }));
    saveData(KEYS.plans, updatedPlans);
    saveData(KEYS.workOrders, updatedWOs);
    setShowForm(false);
    if (newOT) alert(`✅ OT ${newOT.code} generada automáticamente`);
  };

  const generateOT = (plan) => {
    const newOT = autoGenerateOT(plan, wos);
    if (!newOT) return;
    const updatedWOs = [...wos, newOT];
    setData(d => ({ ...d, wos: updatedWOs }));
    saveData(KEYS.workOrders, updatedWOs);
    alert(`✅ OT ${newOT.code} generada con prioridad ${newOT.priority.toUpperCase()}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-white font-bold text-xl">Plan de Mantenimiento Preventivo</h1><p className="text-slate-400 text-sm">Programación automática de OT</p></div>
        {user.role === "supervisor" && <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"><Plus size={15} />Nuevo Plan</button>}
      </div>
      <div className="space-y-4">
        {plans.map(p => {
          const eq = equip.find(e => e.id === p.equipId);
          const tech = users.find(u => u.id === p.technician);
          const linked = wos.filter(w => w.planId === p.id);
          const daysLeft = Math.ceil((new Date(p.nextDate) - new Date()) / 86400000);
          return (
            <div key={p.id} className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-amber-400 text-xs font-mono">{eq?.code}</span>
                    <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${daysLeft <= 0 ? "text-red-400 bg-red-400/10 border-red-400/30" : daysLeft <= 7 ? "text-red-400 bg-red-400/10 border-red-400/30" : daysLeft <= 30 ? "text-amber-400 bg-amber-400/10 border-amber-400/30" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"}`}>
                      {daysLeft <= 0 ? "VENCIDO" : `En ${daysLeft}d`}
                    </span>
                  </div>
                  <div className="text-white font-semibold text-sm mb-2">{p.name}</div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1"><RefreshCw size={10} />Cada {p.frequency} {p.unit}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} />Prox: {fmt(p.nextDate)}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{p.estimatedHours}h est.</span>
                    {tech && <span className="flex items-center gap-1"><Users size={10} />{tech.name}</span>}
                  </div>
                  {Array.isArray(p.tasks) && p.tasks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tasks.map((t, i) => <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-slate-500 text-xs">{linked.length} OT generadas</span>
                  {user.role === "supervisor" && (
                    <button onClick={() => generateOT(p)} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition">
                      <Zap size={12} />Generar OT
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">Nuevo Plan de Mantenimiento</h3>
            <div className="space-y-3">
              <div><label className="text-slate-400 text-xs mb-1 block">EQUIPO</label>
                <select value={form.equipId} onChange={e => setForm(f => ({ ...f, equipId: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="">Seleccionar equipo...</option>
                  {equip.map(e => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
                </select></div>
              <div><label className="text-slate-400 text-xs mb-1 block">NOMBRE DEL PLAN</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-slate-400 text-xs mb-1 block">FRECUENCIA</label>
                  <input type="number" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">UNIDAD</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                    <option value="días">Días</option><option value="horas">Horas</option><option value="semanas">Semanas</option>
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-slate-400 text-xs mb-1 block">PRÓXIMA FECHA</label>
                  <input type="date" value={form.nextDate} onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">HRS ESTIMADAS</label>
                  <input type="number" value={form.estimatedHours} onChange={e => setForm(f => ({ ...f, estimatedHours: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
              </div>
              <div><label className="text-slate-400 text-xs mb-1 block">TÉCNICO ASIGNADO</label>
                <select value={form.technician} onChange={e => setForm(f => ({ ...f, technician: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="">Seleccionar...</option>
                  {users.filter(u => u.role === "mecanico").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select></div>
              <div><label className="text-slate-400 text-xs mb-1 block">TAREAS (una por línea)</label>
                <textarea value={form.tasks} onChange={e => setForm(f => ({ ...f, tasks: e.target.value }))} rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none"
                  placeholder={"Cambio aceite motor\nFiltro hidráulico\nRevisión frenos"} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addPlan} className="flex-1 bg-amber-500 text-black font-semibold py-2 rounded-lg text-sm hover:bg-amber-400">Guardar y Generar OT</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REQUESTS ─────────────────────────────────────────────────────────────
function Requests({ user, data, setData }) {
  const { requests, equip, users, wos } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipId: "", title: "", description: "", priority: "media" });

  const canCreate = user.role === "operaciones" || user.role === "supervisor";
  const visible = user.role === "supervisor" ? requests : requests.filter(r => r.requestedBy === user.id);

  const createRequest = () => {
    if (!form.equipId || !form.title) return;
    const nr = { id: uid(), ...form, status: "pendiente", requestedBy: user.id, requestedAt: new Date().toISOString(), approvedBy: null, otId: null };
    const updated = [...requests, nr];
    setData(d => ({ ...d, requests: updated }));
    saveData(KEYS.requests, updated);
    setShowForm(false); setForm({ equipId: "", title: "", description: "", priority: "media" });
  };

  const approve = (req) => {
    const eq = equip.find(e => e.id === req.equipId);
    const priority = req.priority === "alta" || eq?.criticality === "A" ? "alta" : req.priority;
    const mec = users.find(u => u.role === "mecanico");
    const newOT = {
      id: uid(), code: nextOTCode(wos), type: "correctivo", equipId: req.equipId, planId: null,
      title: `Reparación ${eq?.name || ""} - ${req.title}`, priority, status: "asignada",
      assignedTo: mec?.id || "", createdAt: new Date().toISOString(), scheduledDate: new Date().toISOString().slice(0, 10),
      estimatedHours: priority === "alta" ? 4 : 2, actualHours: null, description: req.description,
      observations: "", parts: [], source: "solicitud", reqId: req.id
    };
    const updWOs = [...wos, newOT];
    const updReqs = requests.map(r => r.id === req.id ? { ...r, status: "aprobada", approvedBy: user.id, otId: newOT.id } : r);
    setData(d => ({ ...d, wos: updWOs, requests: updReqs }));
    saveData(KEYS.workOrders, updWOs);
    saveData(KEYS.requests, updReqs);
    alert(`✅ OT ${newOT.code} generada — Prioridad ${priority.toUpperCase()}`);
  };

  const reject = (req) => {
    const updated = requests.map(r => r.id === req.id ? { ...r, status: "rechazada", approvedBy: user.id } : r);
    setData(d => ({ ...d, requests: updated }));
    saveData(KEYS.requests, updated);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-white font-bold text-xl">Solicitudes de Reparación</h1><p className="text-slate-400 text-sm">{visible.length} solicitudes</p></div>
        {canCreate && <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"><Plus size={15} />Nueva Solicitud</button>}
      </div>
      <div className="space-y-3">
        {visible.map(r => {
          const eq = equip.find(e => e.id === r.equipId);
          const reqBy = users.find(u => u.id === r.requestedBy);
          const linkedOT = wos.find(w => w.id === r.otId);
          return (
            <div key={r.id} className={`bg-slate-900 border rounded-xl p-5 ${r.status === "pendiente" ? "border-amber-500/20" : "border-slate-800/70"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge s={r.status} /><Badge s={r.priority} label={r.priority.toUpperCase()} />
                    {eq?.criticality && <span className={`px-2 py-0.5 rounded border text-xs font-bold ${CRIT_COLOR[eq.criticality]}`}>Equipo {CRITICALITY_LABEL[eq.criticality]}</span>}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{r.title}</div>
                  <div className="text-slate-400 text-xs mb-2">{r.description}</div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span>{eq?.name || "—"}</span><span>{reqBy?.name || "—"}</span><span>{fmtDT(r.requestedAt)}</span>
                  </div>
                  {linkedOT && <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-400/5 border border-emerald-400/20 text-emerald-400 text-xs px-3 py-1 rounded-full"><CheckCircle size={10} />OT: {linkedOT.code}</div>}
                </div>
                {user.role === "supervisor" && r.status === "pendiente" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approve(r)} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition"><Check size={12} />Aprobar + OT</button>
                    <button onClick={() => reject(r)} className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition"><X size={12} />Rechazar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No hay solicitudes</div>}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-white font-semibold mb-4">Nueva Solicitud de Reparación</h3>
            <div className="space-y-3">
              <div><label className="text-slate-400 text-xs mb-1 block">EQUIPO</label>
                <select value={form.equipId} onChange={e => setForm(f => ({ ...f, equipId: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="">Seleccionar equipo...</option>
                  {equip.map(e => <option key={e.id} value={e.id}>{e.name} ({e.code}) — Crit. {e.criticality}</option>)}
                </select></div>
              <div><label className="text-slate-400 text-xs mb-1 block">FALLA DETECTADA</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">DESCRIPCIÓN</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">PRIORIDAD</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="alta">Alta — Detiene operaciones</option>
                  <option value="media">Media — Afecta rendimiento</option>
                  <option value="baja">Baja — Sin impacto inmediato</option>
                </select></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={createRequest} className="flex-1 bg-amber-500 text-black font-semibold py-2 rounded-lg text-sm hover:bg-amber-400">Enviar Solicitud</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────
function Reports({ data }) {
  const { wos, equip } = data;
  const completed = wos.filter(w => w.status === "completada");
  const prev = wos.filter(w => w.type === "preventivo");
  const corr = wos.filter(w => w.type === "correctivo");
  const totalHrs = completed.reduce((s, w) => s + (w.actualHours || 0), 0);
  const byEquip = equip.map(e => ({
    ...e, totalWOs: wos.filter(w => w.equipId === e.id).length,
    completedWOs: completed.filter(w => w.equipId === e.id).length,
    hrs: completed.filter(w => w.equipId === e.id).reduce((s, w) => s + (w.actualHours || 0), 0)
  })).sort((a, b) => b.totalWOs - a.totalWOs);

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-white font-bold text-xl">Informes y Análisis</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle} label="OT Completadas" value={completed.length} color="emerald" />
        <StatCard icon={Wrench} label="Preventivas" value={prev.length} color="blue" />
        <StatCard icon={AlertTriangle} label="Correctivas" value={corr.length} color="red" />
        <StatCard icon={Clock} label="Horas Totales" value={`${totalHrs.toFixed(1)}h`} color="amber" />
      </div>
      <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">OT por Equipo</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-slate-500 text-xs border-b border-slate-800/50">
              <th className="text-left py-2 pr-4">Equipo</th><th className="text-left py-2 pr-4">Criticidad</th>
              <th className="text-right py-2 pr-4">Total OT</th><th className="text-right py-2 pr-4">Completadas</th><th className="text-right py-2">Horas</th>
            </tr></thead>
            <tbody>{byEquip.map(e => (
              <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition">
                <td className="py-2.5 pr-4"><div className="text-white text-xs">{e.name}</div><div className="text-amber-400 font-mono text-xs">{e.code}</div></td>
                <td className="py-2.5 pr-4"><span className={`px-2 py-0.5 rounded border text-xs font-bold ${CRIT_COLOR[e.criticality]}`}>{CRITICALITY_LABEL[e.criticality]}</span></td>
                <td className="py-2.5 pr-4 text-right text-slate-300">{e.totalWOs}</td>
                <td className="py-2.5 pr-4 text-right text-emerald-400">{e.completedWOs}</td>
                <td className="py-2.5 text-right text-slate-300">{e.hrs.toFixed(1)}h</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Distribución OT</h2>
          {[{ label: "Preventivas", value: prev.length, color: "bg-blue-400" }, { label: "Correctivas", value: corr.length, color: "bg-red-400" }].map(item => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">{item.label}</span><span className="text-white">{item.value} ({Math.round(item.value / (wos.length || 1) * 100)}%)</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.round(item.value / (wos.length || 1) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800/70 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Estado Actual OT</h2>
          {["pendiente", "asignada", "en_proceso", "completada"].map(s => (
            <div key={s} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
              <Badge s={s} /><span className="text-white font-semibold">{wos.filter(w => w.status === s).length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────
function UsersPage({ data, setData }) {
  const { users } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mecanico" });

  const addUser = () => {
    if (!form.name || !form.email || !form.password) return;
    const nu = { id: uid(), ...form, avatar: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() };
    const updated = [...users, nu];
    setData(d => ({ ...d, users: updated }));
    saveData(KEYS.users, updated);
    setShowForm(false); setForm({ name: "", email: "", password: "", role: "mecanico" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-white font-bold text-xl">Gestión de Usuarios</h1><p className="text-slate-400 text-sm">{users.length} usuarios</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"><Plus size={15} />Nuevo Usuario</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map(u => {
          const cfg = ROLE_CONFIG[u.role]; const RoleIcon = cfg.icon;
          return (
            <div key={u.id} className="bg-slate-900 border border-slate-800/70 rounded-xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm ${cfg.color}`}>{u.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{u.name}</div>
                <div className="text-slate-400 text-xs">{u.email}</div>
                <div className={`flex items-center gap-1.5 mt-1 text-xs ${cfg.color}`}><RoleIcon size={11} />{cfg.label}</div>
              </div>
              <span className="text-slate-600 font-mono text-xs">{u.password}</span>
            </div>
          );
        })}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold mb-4">Nuevo Usuario</h3>
            <div className="space-y-3">
              {[["name", "NOMBRE COMPLETO", "text"], ["email", "CORREO", "email"], ["password", "CONTRASEÑA", "text"]].map(([k, l, t]) => (
                <div key={k}><label className="text-slate-400 text-xs mb-1 block">{l}</label>
                  <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" /></div>
              ))}
              <div><label className="text-slate-400 text-xs mb-1 block">ROL</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option value="supervisor">Supervisor — Acceso completo</option>
                  <option value="mecanico">Mecánico — Reportar trabajos</option>
                  <option value="operaciones">Operaciones — Solicitudes</option>
                </select></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addUser} className="flex-1 bg-amber-500 text-black font-semibold py-2 rounded-lg text-sm hover:bg-amber-400">Crear Usuario</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────
function Notifications({ user, data }) {
  const { wos, equip, requests } = data;
  const myReqs = requests.filter(r => r.requestedBy === user.id);
  const fallas = equip.filter(e => e.status === "falla");
  const items = [
    ...fallas.map(e => ({ icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/5 border-red-400/20", title: `Equipo en falla: ${e.name}`, sub: `${e.location} · Criticidad ${e.criticality}`, time: "Activo" })),
    ...myReqs.map(r => {
      const eq = equip.find(e => e.id === r.equipId);
      const linkedOT = wos.find(w => w.id === r.otId);
      return { icon: r.status === "aprobada" ? CheckCircle : r.status === "rechazada" ? X : Clock, color: r.status === "aprobada" ? "text-emerald-400" : r.status === "rechazada" ? "text-red-400" : "text-amber-400", bg: "bg-slate-900 border-slate-800/70", title: `Solicitud: ${r.title}`, sub: `${eq?.name || "—"} · ${STATUS_CONFIG[r.status]?.label}${linkedOT ? ` · ${linkedOT.code}` : ""}`, time: fmtDT(r.requestedAt) };
    }),
  ];
  return (
    <div className="p-6">
      <div className="mb-5"><h1 className="text-white font-bold text-xl">Notificaciones</h1></div>
      <div className="space-y-3">
        {items.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">Sin notificaciones</div>}
        {items.map((n, i) => (
          <div key={i} className={`border rounded-xl p-4 flex items-start gap-3 ${n.bg}`}>
            <n.icon size={16} className={`${n.color} flex-shrink-0 mt-0.5`} />
            <div className="flex-1"><div className={`font-medium text-sm ${n.color}`}>{n.title}</div><div className="text-slate-400 text-xs mt-0.5">{n.sub}</div></div>
            <span className="text-slate-600 text-xs">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(() => ({
    users: loadData(KEYS.users, SEED_USERS),
    equip: loadData(KEYS.equipment, SEED_EQUIPMENT),
    plans: loadData(KEYS.plans, SEED_PM_PLANS),
    requests: loadData(KEYS.requests, SEED_REQUESTS),
    wos: loadData(KEYS.workOrders, SEED_WORK_ORDERS),
  }));

  const pendingReqs = data.requests.filter(r => r.status === "pendiente").length;

  if (!user) return <LoginPage users={data.users} onLogin={u => { setUser(u); setPage("dashboard"); }} />;

  const PAGES = {
    dashboard: <Dashboard user={user} data={data} onNav={setPage} />,
    workorders: <WorkOrders user={user} data={data} setData={setData} />,
    equipment: <Equipment user={user} data={data} setData={setData} />,
    plans: <Plans user={user} data={data} setData={setData} />,
    requests: <Requests user={user} data={data} setData={setData} />,
    notifications: <Notifications user={user} data={data} />,
    reports: <Reports data={data} />,
    users: <UsersPage data={data} setData={setData} />,
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "#0d1117" }} className="min-h-screen flex">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      <Sidebar user={user} active={page} onNav={setPage} onLogout={() => { setUser(null); setPage("dashboard"); }} notifications={pendingReqs} />
      <main className="flex-1 min-h-screen overflow-y-auto">{PAGES[page] || PAGES.dashboard}</main>
    </div>
  );
}
