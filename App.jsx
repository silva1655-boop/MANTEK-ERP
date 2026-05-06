import { useState } from "react";
import {
  AlertTriangle, CheckCircle, Clock, Wrench, BarChart2, Package,
  Users, FileText, Bell, LogOut, ChevronRight, Plus, X,
  Calendar, Zap, Shield, Search, ClipboardList, AlertCircle,
  Check, RefreshCw, Activity, ArrowRight, Edit2, Trash2,
  TrendingUp, Target, Layers, Info
} from "lucide-react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:"u1", name:"Carlos Mendoza", role:"supervisor",  email:"cmendoza@navimag.cl", password:"sup123", avatar:"CM" },
  { id:"u2", name:"Roberto Silva",  role:"mecanico",    email:"rsilva@navimag.cl",   password:"mec123", avatar:"RS" },
  { id:"u3", name:"Ana Torres",     role:"mecanico",    email:"atorres@navimag.cl",  password:"mec456", avatar:"AT" },
  { id:"u4", name:"Luis Pérez",     role:"operaciones", email:"lperez@navimag.cl",   password:"op123",  avatar:"LP" },
  { id:"u5", name:"Daniela Rojas",  role:"operaciones", email:"drojas@navimag.cl",   password:"op456",  avatar:"DR" },
];
const SEED_EQUIPMENT = [
  { id:"eq1", code:"TR-618i-01", name:"Kalmar TR618i #1",      type:"Tracto Terminal",    location:"Patio Norte",   criticality:"A", status:"operativo",     lastMaint:"2026-03-15", nextMaint:"2026-05-15", hours:4820 },
  { id:"eq2", code:"TR-618i-02", name:"Kalmar TR618i #2",      type:"Tracto Terminal",    location:"Patio Norte",   criticality:"A", status:"mantenimiento", lastMaint:"2026-04-01", nextMaint:"2026-06-01", hours:5120 },
  { id:"eq3", code:"RT-223-01",  name:"Terberg RT223 #1",      type:"Tracto Portuario",   location:"Muelle 2",      criticality:"A", status:"operativo",     lastMaint:"2026-03-20", nextMaint:"2026-05-20", hours:3200 },
  { id:"eq4", code:"RM-255-01",  name:"RM255 Mol #1",          type:"Manipulador Reach",  location:"Bodega A",      criticality:"B", status:"operativo",     lastMaint:"2026-02-10", nextMaint:"2026-05-10", hours:2100 },
  { id:"eq5", code:"GEN-01",     name:"Generador Principal",   type:"Generador",          location:"Sala Máquinas", criticality:"A", status:"operativo",     lastMaint:"2026-04-05", nextMaint:"2026-07-05", hours:8900 },
  { id:"eq6", code:"COMP-01",    name:"Compresor Atlas Copco", type:"Compresor",          location:"Taller",        criticality:"B", status:"falla",         lastMaint:"2026-01-20", nextMaint:"2026-04-20", hours:1560 },
  { id:"eq7", code:"PUA-01",     name:"Puente Grúa #1",        type:"Grúa",               location:"Bodega B",      criticality:"A", status:"operativo",     lastMaint:"2026-03-28", nextMaint:"2026-06-28", hours:6700 },
  { id:"eq8", code:"MONTA-01",   name:"Montacargas 5T #1",     type:"Montacargas",        location:"Patio Sur",     criticality:"C", status:"operativo",     lastMaint:"2026-02-15", nextMaint:"2026-05-15", hours:950  },
];
const SEED_PM_PLANS = [
  { id:"pm1", equipId:"eq1", name:"Servicio 250h - Kalmar TR618i #1",   frequency:250, unit:"horas", nextDate:"2026-05-15", tasks:["Cambio aceite motor","Filtro hidráulico","Revisión frenos","Check transmisión"], estimatedHours:4, technician:"u2" },
  { id:"pm2", equipId:"eq3", name:"Inspección Mensual RT223 #1",        frequency:30,  unit:"días",  nextDate:"2026-05-20", tasks:["Inspección visual","Niveles fluidos","Revisión neumáticos","Luces y señales"],    estimatedHours:2, technician:"u3" },
  { id:"pm3", equipId:"eq5", name:"Mantenimiento Trimestral Generador", frequency:90,  unit:"días",  nextDate:"2026-07-05", tasks:["Cambio aceite","Filtros","Batería","Prueba de carga"],                            estimatedHours:6, technician:"u2" },
  { id:"pm4", equipId:"eq7", name:"Inspección Mensual Puente Grúa",     frequency:30,  unit:"días",  nextDate:"2026-05-28", tasks:["Cadenas y cables","Freno electromagnético","Controles","Lubricación"],            estimatedHours:3, technician:"u3" },
  { id:"pm5", equipId:"eq4", name:"Servicio 500h - RM255 Mol",          frequency:500, unit:"horas", nextDate:"2026-05-10", tasks:["Aceite hidráulico","Filtros","Llantas","Horquillas"],                             estimatedHours:5, technician:"u2" },
];
const SEED_REQUESTS = [
  { id:"req1", equipId:"eq6", title:"Falla compresor - pierde presión", description:"El compresor no mantiene presión, se detiene a los 5 min.", priority:"alta",  status:"aprobada",  requestedBy:"u4", requestedAt:"2026-04-22T09:30:00", approvedBy:"u1", otId:"ot3" },
  { id:"req2", equipId:"eq1", title:"Ruido extraño en transmisión",     description:"Se escucha traqueteo en la caja de cambios al subir de marcha.", priority:"media", status:"pendiente", requestedBy:"u5", requestedAt:"2026-04-25T14:00:00", approvedBy:null, otId:null },
  { id:"req3", equipId:"eq8", title:"Falla indicador de batería",       description:"Indicador de batería no enciende.", priority:"baja", status:"pendiente", requestedBy:"u4", requestedAt:"2026-04-26T08:15:00", approvedBy:null, otId:null },
];
const SEED_WORK_ORDERS = [
  { id:"ot1", code:"OT-2026-001", type:"preventivo", equipId:"eq2", planId:"pm1", title:"Servicio 250h - Kalmar TR618i #2",              priority:"alta",  status:"en_proceso", assignedTo:"u2", createdAt:"2026-04-01T08:00:00", scheduledDate:"2026-04-01", estimatedHours:4, actualHours:null, description:"Mantenimiento preventivo 250h.", observations:"", parts:[{name:"Filtro aceite",qty:1,code:"FIL-001"},{name:"Aceite motor 15W40",qty:5,code:"ACE-001"}], source:"plan" },
  { id:"ot2", code:"OT-2026-002", type:"preventivo", equipId:"eq3", planId:"pm2", title:"Inspección Mensual RT223 #1",                   priority:"media", status:"completada", assignedTo:"u3", createdAt:"2026-03-20T08:00:00", scheduledDate:"2026-03-20", estimatedHours:2, actualHours:2.5, description:"Inspección mensual programada.", observations:"Se ajustaron frenos.", parts:[], source:"plan" },
  { id:"ot3", code:"OT-2026-003", type:"correctivo", equipId:"eq6", planId:null,  title:"Reparación Compresor Atlas Copco - Falla presión", priority:"alta",  status:"asignada",  assignedTo:"u2", createdAt:"2026-04-22T10:00:00", scheduledDate:"2026-04-23", estimatedHours:6, actualHours:null, description:"Pérdida de presión.", observations:"", parts:[{name:"Kit sellos compresor",qty:1,code:"KIT-002"}], source:"solicitud", reqId:"req1" },
  { id:"ot4", code:"OT-2026-004", type:"preventivo", equipId:"eq7", planId:"pm4", title:"Inspección Mensual Puente Grúa #1",              priority:"alta",  status:"pendiente",  assignedTo:"u3", createdAt:"2026-04-26T07:00:00", scheduledDate:"2026-04-28", estimatedHours:3, actualHours:null, description:"Inspección preventiva mensual.", observations:"", parts:[], source:"plan" },
  { id:"ot5", code:"OT-2026-005", type:"preventivo", equipId:"eq5", planId:"pm3", title:"Mantenimiento Trimestral Generador Principal",   priority:"media", status:"pendiente",  assignedTo:"u2", createdAt:"2026-04-26T07:00:00", scheduledDate:"2026-05-05", estimatedHours:6, actualHours:null, description:"Mantenimiento trimestral programado.", observations:"", parts:[], source:"plan" },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const KEYS = { users:"erp:users", equipment:"erp:equipment", plans:"erp:plans", requests:"erp:requests", workOrders:"erp:workorders" };
const loadData = (k,s) => { try { const r=localStorage.getItem(k); return r?JSON.parse(r):s; } catch { return s; } };
const saveData = (k,d) => { try { localStorage.setItem(k,JSON.stringify(d)); } catch {} };

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt   = d => d ? new Date(d).toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
const fmtDT = d => d ? new Date(d).toLocaleString("es-CL",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";
const uid = () => Math.random().toString(36).slice(2,10);
const nextOTCode = wos => `OT-2026-${String(wos.length+1).padStart(3,"0")}`;
const CRIT_LABEL = { A:"Crítico", B:"Importante", C:"Rutinario" };

// ─── THEME ───────────────────────────────────────────────────────────────────
const ST = {
  pendiente:     { label:"Pendiente",     cls:"text-gray-600   bg-gray-100    border-gray-300"    },
  asignada:      { label:"Asignada",      cls:"text-blue-700   bg-blue-50     border-blue-200"    },
  en_proceso:    { label:"En Proceso",    cls:"text-amber-700  bg-amber-50    border-amber-200"   },
  completada:    { label:"Completada",    cls:"text-emerald-700 bg-emerald-50 border-emerald-200" },
  cancelada:     { label:"Cancelada",     cls:"text-red-700    bg-red-50      border-red-200"     },
  aprobada:      { label:"Aprobada",      cls:"text-emerald-700 bg-emerald-50 border-emerald-200" },
  rechazada:     { label:"Rechazada",     cls:"text-red-700    bg-red-50      border-red-200"     },
  operativo:     { label:"Operativo",     cls:"text-emerald-700 bg-emerald-50 border-emerald-200" },
  mantenimiento: { label:"Mantenimiento", cls:"text-amber-700  bg-amber-50    border-amber-200"   },
  falla:         { label:"Falla",         cls:"text-red-700    bg-red-50      border-red-200"     },
};
const CRIT_CLS = { A:"text-red-700 bg-red-50 border-red-200", B:"text-amber-700 bg-amber-50 border-amber-200", C:"text-emerald-700 bg-emerald-50 border-emerald-200" };
const PRI_CLS  = { alta:"text-red-700 bg-red-50 border-red-200", media:"text-amber-700 bg-amber-50 border-amber-200", baja:"text-emerald-700 bg-emerald-50 border-emerald-200" };

const Badge = ({s, label}) => {
  const c = ST[s] || {label:s, cls:"text-gray-600 bg-gray-100 border-gray-300"};
  return <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-semibold ${c.cls}`}>{label||c.label}</span>;
};

const ROLE_CFG = {
  supervisor:  { label:"Supervisor",  color:"text-violet-700", bg:"bg-violet-100", icon:Shield,   nav:["dashboard","workorders","equipment","plans","indicadores","requests","reports","users"] },
  mecanico:    { label:"Mecánico",    color:"text-amber-700",  bg:"bg-amber-100",  icon:Wrench,   nav:["dashboard","workorders","reports"] },
  operaciones: { label:"Operaciones", color:"text-blue-700",   bg:"bg-blue-100",   icon:Activity, nav:["dashboard","requests","notifications"] },
};

const iCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100";
const sCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400";
const card = "bg-white border border-gray-200 rounded-xl shadow-sm";

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({title, onClose, children, wide=false}) {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white border border-gray-200 rounded-2xl shadow-xl p-6 w-full max-h-[90vh] overflow-y-auto ${wide?"max-w-2xl":"max-w-lg"}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-900 font-bold text-base">{title}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-700"/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function ModalActions({onSave, onCancel, label="Guardar"}) {
  return (
    <div className="flex gap-2 mt-5">
      <button onClick={onSave}   className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">{label}</button>
      <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm transition">Cancelar</button>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({icon:Icon, label, value, sub, color="amber"}) {
  const m = { amber:"text-amber-600 bg-amber-50 border-amber-200", blue:"text-blue-600 bg-blue-50 border-blue-200", red:"text-red-600 bg-red-50 border-red-200", emerald:"text-emerald-600 bg-emerald-50 border-emerald-200", violet:"text-violet-600 bg-violet-50 border-violet-200" };
  return (
    <div className={`${card} p-5 flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${m[color]}`}><Icon size={20}/></div>
      <div>
        <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-gray-900 font-bold text-2xl leading-none">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginPage({users, onLogin}) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  const handle = () => { const u=users.find(x=>x.email===email&&x.password===pass); if(u) onLogin(u); else setErr("Credenciales incorrectas"); };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center shadow-md"><Wrench size={22} className="text-white"/></div>
            <div className="text-left">
              <p className="text-gray-900 font-bold text-xl tracking-tight">MANTEK ERP</p>
              <p className="text-gray-400 text-xs tracking-widest">SISTEMA DE MANTENIMIENTO</p>
            </div>
          </div>
        </div>
        <div className={`${card} p-8`}>
          <p className="text-gray-700 font-semibold mb-5">Iniciar Sesión</p>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4">{err}</div>}
          <div className="space-y-4">
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">CORREO</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} className={iCls} placeholder="usuario@navimag.cl"/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">CONTRASEÑA</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} className={iCls} placeholder="••••••"/></div>
            <button onClick={handle} className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm">INGRESAR</button>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-gray-400 text-xs font-medium mb-3">ACCESO RÁPIDO (DEMO)</p>
            <div className="space-y-2">
              {[users[0],users[1],users[3]].filter(Boolean).map(u=>{
                const c=ROLE_CFG[u.role];
                return (
                  <button key={u.id} onClick={()=>onLogin(u)} className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 transition text-left">
                    <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center text-xs font-bold ${c.color}`}>{u.avatar}</div>
                    <div><p className="text-gray-800 text-xs font-semibold">{u.name}</p><p className={`text-xs ${c.color}`}>{c.label}</p></div>
                    <ArrowRight size={14} className="ml-auto text-gray-300"/>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = {
  dashboard:     {label:"Dashboard",           icon:BarChart2},
  workorders:    {label:"Órdenes de Trabajo",  icon:ClipboardList},
  equipment:     {label:"Equipos",             icon:Package},
  plans:         {label:"Plan Preventivo",     icon:Calendar},
  indicadores:   {label:"Indicadores KPI",     icon:TrendingUp},
  requests:      {label:"Solicitudes",         icon:Bell},
  notifications: {label:"Notificaciones",      icon:Bell},
  reports:       {label:"Informes",            icon:FileText},
  users:         {label:"Usuarios",            icon:Users},
};
function Sidebar({user, active, onNav, onLogout, notifications}) {
  const cfg=ROLE_CFG[user.role]; const RoleIcon=cfg.icon;
  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 flex-shrink-0 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0"><Wrench size={15} className="text-white"/></div>
          <div><p className="text-gray-900 font-bold text-sm">MANTEK ERP</p><p className="text-gray-400 text-xs">v3.0</p></div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {cfg.nav.map(key=>{
          const item=NAV_ITEMS[key]; if(!item) return null;
          const Icon=item.icon; const isActive=active===key;
          const badge=(key==="requests"||key==="notifications")&&notifications>0;
          return (
            <button key={key} onClick={()=>onNav(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive?"bg-amber-50 text-amber-700 font-semibold border border-amber-200":"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              <Icon size={15}/><span className="flex-1 text-left">{item.label}</span>
              {badge&&<span className="bg-amber-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{notifications}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-2 py-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center text-xs font-bold ${cfg.color}`}>{user.avatar}</div>
          <div className="min-w-0"><p className="text-gray-800 text-xs font-semibold truncate">{user.name}</p>
            <p className={`text-xs ${cfg.color} flex items-center gap-1`}><RoleIcon size={10}/>{cfg.label}</p></div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-600 text-sm rounded-lg hover:bg-red-50 transition-all">
          <LogOut size={14}/><span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({user, data, onNav}) {
  const {wos,equip,requests}=data; const role=user.role;
  const pendingWOs=wos.filter(w=>w.status!=="completada"&&w.status!=="cancelada");
  const myWOs=wos.filter(w=>w.assignedTo===user.id&&w.status!=="completada");
  const fallas=equip.filter(e=>e.status==="falla");
  const completed=wos.filter(w=>w.status==="completada").length;
  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-gray-900 font-bold text-xl">Dashboard</h1><p className="text-gray-500 text-sm">Bienvenido, {user.name} · {ROLE_CFG[role].label}</p></div>
      {role==="supervisor"&&<>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ClipboardList} label="OT Activas"            value={pendingWOs.length} sub={`${pendingWOs.filter(w=>w.priority==="alta").length} críticas`} color="amber"/>
          <StatCard icon={AlertTriangle} label="Equipos en Falla"      value={fallas.length} color="red"/>
          <StatCard icon={Bell}          label="Solicitudes Pendientes" value={requests.filter(r=>r.status==="pendiente").length} color="blue"/>
          <StatCard icon={CheckCircle}   label="OT Completadas"         value={completed} sub="este mes" color="emerald"/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800 font-semibold text-sm">OT Recientes</h2>
              <button onClick={()=>onNav("workorders")} className="text-amber-600 text-xs hover:underline flex items-center gap-1">Ver todo<ChevronRight size={12}/></button>
            </div>
            {wos.slice(0,5).map(w=>(
              <div key={w.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <Badge s={w.status}/><span className="text-gray-700 text-xs flex-1 truncate">{w.title}</span><Badge s={w.priority} label={w.priority}/>
              </div>
            ))}
          </div>
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800 font-semibold text-sm">Estado de Equipos</h2>
              <button onClick={()=>onNav("equipment")} className="text-amber-600 text-xs hover:underline flex items-center gap-1">Ver todo<ChevronRight size={12}/></button>
            </div>
            {equip.map(e=>(
              <div key={e.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${e.status==="operativo"?"bg-emerald-500":e.status==="falla"?"bg-red-500":"bg-amber-400"}`}/>
                <span className="text-gray-700 text-xs flex-1 truncate">{e.name}</span>
                <span className={`px-1.5 py-0.5 rounded border text-xs font-bold ${CRIT_CLS[e.criticality]}`}>{CRIT_LABEL[e.criticality]}</span>
              </div>
            ))}
          </div>
        </div>
      </>}
      {role==="mecanico"&&<>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={ClipboardList} label="Mis OT Pendientes" value={myWOs.length} color="amber"/>
          <StatCard icon={CheckCircle}   label="Completadas"       value={wos.filter(w=>w.assignedTo===user.id&&w.status==="completada").length} color="emerald"/>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Mis Órdenes de Trabajo</h2>
          {myWOs.length===0&&<p className="text-gray-400 text-sm text-center py-6">No tienes órdenes asignadas</p>}
          {myWOs.map(w=>{const eq=data.equip.find(e=>e.id===w.equipId);return(
            <div key={w.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-2 last:mb-0">
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-amber-600 text-xs font-mono font-bold mb-1">{w.code}</p>
                  <p className="text-gray-800 text-sm font-semibold">{w.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{eq?.name} · {fmt(w.scheduledDate)}</p></div>
                <Badge s={w.status}/>
              </div>
            </div>
          );})}
        </div>
      </>}
      {role==="operaciones"&&<>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={AlertTriangle} label="Equipos en Falla" value={fallas.length} color="red"/>
          <StatCard icon={Bell}          label="Mis Solicitudes"  value={requests.filter(r=>r.requestedBy===user.id).length} color="blue"/>
        </div>
        {fallas.length>0&&(
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="text-red-700 font-semibold text-sm mb-3 flex items-center gap-2"><AlertCircle size={15}/>Equipos con Falla Activa</h2>
            {fallas.map(e=>(
              <div key={e.id} className="bg-white rounded-lg p-3 mb-2 last:mb-0 border border-red-100">
                <p className="text-gray-800 text-sm font-semibold">{e.name}</p>
                <p className="text-gray-500 text-xs">{e.location} · Criticidad {e.criticality}</p>
              </div>
            ))}
          </div>
        )}
        <div className={`${card} p-5`}>
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Mis Solicitudes Recientes</h2>
          {requests.filter(r=>r.requestedBy===user.id).slice(0,5).map(r=>{
            const eq=equip.find(e=>e.id===r.equipId);
            return <div key={r.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
              <Badge s={r.status}/><span className="text-gray-700 text-xs flex-1 truncate">{r.title}</span><span className="text-gray-400 text-xs">{eq?.code}</span>
            </div>;
          })}
          {requests.filter(r=>r.requestedBy===user.id).length===0&&<p className="text-gray-400 text-sm text-center py-6">Sin solicitudes registradas</p>}
        </div>
      </>}
    </div>
  );
}

// ─── WORK ORDERS ─────────────────────────────────────────────────────────────
function WorkOrders({user, data, setData}) {
  const {wos,equip,users}=data;
  const [filter,setFilter]=useState("all"); const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null); const [showRep,setShowRep]=useState(false);
  const [rep,setRep]=useState({actualHours:"",observations:"",status:"completada"});
  const role=user.role;
  const visible=wos.filter(w=>{
    if(role==="mecanico"&&w.assignedTo!==user.id) return false;
    if(filter!=="all"&&w.status!==filter) return false;
    if(search&&!w.title.toLowerCase().includes(search.toLowerCase())&&!w.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const updWO=(id,patch)=>{
    const u=wos.map(w=>w.id===id?{...w,...patch}:w);
    setData(d=>({...d,wos:u})); saveData(KEYS.workOrders,u);
    if(sel?.id===id) setSel(s=>({...s,...patch}));
  };
  const submitRep=()=>{
    if(!rep.actualHours) return;
    updWO(sel.id,{status:rep.status,actualHours:parseFloat(rep.actualHours),observations:rep.observations});
    setShowRep(false); setRep({actualHours:"",observations:"",status:"completada"});
  };
  const cur=sel?wos.find(w=>w.id===sel.id):null;
  const curEq=cur?equip.find(e=>e.id===cur.equipId):null;
  const curAs=cur?users.find(u=>u.id===cur.assignedTo):null;
  return (
    <div className="p-6 flex gap-5 h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-5"><h1 className="text-gray-900 font-bold text-xl">Órdenes de Trabajo</h1><p className="text-gray-500 text-sm">{visible.length} registros</p></div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar OT..." className={iCls+" pl-9"}/>
          </div>
          {["all","pendiente","asignada","en_proceso","completada"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${filter===s?"bg-amber-500 text-white border-amber-500":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              {s==="all"?"Todas":ST[s]?.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {visible.map(w=>{
            const eq=equip.find(e=>e.id===w.equipId); const asn=users.find(u=>u.id===w.assignedTo);
            return (
              <div key={w.id} onClick={()=>setSel(w)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-300 hover:shadow-sm ${sel?.id===w.id?"border-amber-400 bg-amber-50/30 shadow-sm":"border-gray-200"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-amber-600 text-xs font-mono font-bold">{w.code}</span>
                      <Badge s={w.type==="preventivo"?"asignada":"en_proceso"} label={w.type==="preventivo"?"Preventivo":"Correctivo"}/>
                      <Badge s={w.status}/>
                    </div>
                    <p className="text-gray-800 text-sm font-semibold truncate">{w.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-gray-400 text-xs flex items-center gap-1"><Package size={10}/>{eq?.code}</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1"><Calendar size={10}/>{fmt(w.scheduledDate)}</span>
                      {asn&&<span className="text-gray-400 text-xs flex items-center gap-1"><Users size={10}/>{asn.name}</span>}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-bold flex-shrink-0 ${PRI_CLS[w.priority]}`}>{w.priority.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
          {visible.length===0&&<div className="text-center py-12 text-gray-400 text-sm">No se encontraron órdenes</div>}
        </div>
      </div>
      {cur&&(
        <div className={`w-80 flex-shrink-0 ${card} p-5 h-fit sticky top-6 overflow-y-auto max-h-[calc(100vh-6rem)]`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-amber-600 text-xs font-mono font-bold">{cur.code}</span>
            <button onClick={()=>setSel(null)}><X size={16} className="text-gray-400 hover:text-gray-700"/></button>
          </div>
          <h3 className="text-gray-900 font-semibold text-sm mb-3">{cur.title}</h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge s={cur.status}/>
            <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${PRI_CLS[cur.priority]}`}>{cur.priority.toUpperCase()}</span>
          </div>
          <div className="space-y-2 mb-4 text-xs">
            {[["Equipo",curEq?.name||"—"],["Código",curEq?.code||"—"],["Tipo",cur.type],["Fuente",cur.source==="plan"?"Plan Preventivo":"Solicitud"],["Programado",fmt(cur.scheduledDate)],["Horas Est.",`${cur.estimatedHours}h`],["Asignado a",curAs?.name||"—"]].map(([k,v])=>(
              <div key={k} className="flex justify-between gap-2"><span className="text-gray-400">{k}</span><span className="text-gray-700 text-right">{v}</span></div>
            ))}
            {cur.actualHours&&<div className="flex justify-between"><span className="text-gray-400">Horas Reales</span><span className="text-emerald-600 font-semibold">{cur.actualHours}h</span></div>}
          </div>
          {cur.description&&<div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3 text-gray-600 text-xs">{cur.description}</div>}
          {cur.observations&&<div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-3 text-xs"><span className="text-emerald-700 font-semibold">Obs: </span>{cur.observations}</div>}
          {cur.parts?.length>0&&(
            <div className="mb-3">
              <p className="text-gray-400 text-xs font-medium mb-2">REPUESTOS</p>
              {cur.parts.map((p,i)=><div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0"><span className="text-gray-700">{p.name}</span><span className="text-gray-400">{p.qty}x</span></div>)}
            </div>
          )}
          <div className="space-y-2 mt-4">
            {role==="mecanico"&&cur.assignedTo===user.id&&cur.status!=="completada"&&<>
              {cur.status==="asignada"&&<button onClick={()=>updWO(cur.id,{status:"en_proceso"})} className="w-full bg-amber-50 border border-amber-200 text-amber-700 text-sm py-2 rounded-lg hover:bg-amber-100 transition font-medium">Iniciar Trabajo</button>}
              <button onClick={()=>setShowRep(true)} className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm py-2 rounded-lg hover:bg-emerald-100 transition font-medium">Reportar Trabajo</button>
            </>}
            {role==="supervisor"&&cur.status!=="completada"&&cur.status!=="cancelada"&&(
              <select value={cur.status} onChange={e=>updWO(cur.id,{status:e.target.value})} className={sCls}>
                <option value="pendiente">Pendiente</option><option value="asignada">Asignada</option>
                <option value="en_proceso">En Proceso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
              </select>
            )}
          </div>
        </div>
      )}
      {showRep&&(
        <Modal title={`Reportar Trabajo — ${cur?.code}`} onClose={()=>setShowRep(false)}>
          <div className="space-y-4">
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">HORAS REALES *</label>
              <input type="number" step="0.5" value={rep.actualHours} onChange={e=>setRep(r=>({...r,actualHours:e.target.value}))} className={iCls} placeholder="ej: 3.5"/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">OBSERVACIONES</label>
              <textarea value={rep.observations} onChange={e=>setRep(r=>({...r,observations:e.target.value}))} rows={3} className={iCls+" resize-none"}/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">ESTADO FINAL</label>
              <select value={rep.status} onChange={e=>setRep(r=>({...r,status:e.target.value}))} className={sCls}>
                <option value="completada">Completada</option><option value="en_proceso">En Proceso (parcial)</option>
              </select></div>
          </div>
          <ModalActions onSave={submitRep} onCancel={()=>setShowRep(false)} label="Enviar Reporte"/>
        </Modal>
      )}
    </div>
  );
}

// ─── EQUIPMENT ───────────────────────────────────────────────────────────────
const EMPTY_EQ = {code:"",name:"",type:"",location:"",criticality:"B",status:"operativo",hours:"",lastMaint:"",nextMaint:""};
function Equipment({user, data, setData}) {
  const {equip}=data; const isSup=user.role==="supervisor";
  const [search,setSearch]=useState(""); const [showForm,setShowForm]=useState(false);
  const [editTarget,setEditTarget]=useState(null); const [form,setForm]=useState(EMPTY_EQ);
  const [confirmDel,setConfirmDel]=useState(null);
  const visible=equip.filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase())||e.code.toLowerCase().includes(search.toLowerCase()));
  const openNew=()=>{setForm(EMPTY_EQ);setEditTarget(null);setShowForm(true);};
  const openEdit=e=>{setForm({...e,hours:String(e.hours)});setEditTarget(e);setShowForm(true);};
  const saveEquip=()=>{
    if(!form.code||!form.name) return;
    const updated=editTarget
      ? equip.map(e=>e.id===editTarget.id?{...e,...form,hours:parseInt(form.hours)||0}:e)
      : [...equip,{id:uid(),...form,hours:parseInt(form.hours)||0,lastMaint:form.lastMaint||new Date().toISOString().slice(0,10)}];
    setData(d=>({...d,equip:updated})); saveData(KEYS.equipment,updated); setShowForm(false);
  };
  const deleteEquip=id=>{
    const updated=equip.filter(e=>e.id!==id);
    setData(d=>({...d,equip:updated})); saveData(KEYS.equipment,updated); setConfirmDel(null);
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-gray-900 font-bold text-xl">Equipos</h1><p className="text-gray-500 text-sm">{equip.length} equipos registrados</p></div>
        {isSup&&<button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"><Plus size={15}/>Nuevo Equipo</button>}
      </div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar equipo..." className={iCls+" pl-9 max-w-xs"}/>
      </div>
      <div className={`${card} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-4 py-3">Código</th><th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Tipo</th><th className="text-left px-4 py-3 hidden lg:table-cell">Ubicación</th>
              <th className="text-left px-4 py-3">Criticidad</th><th className="text-left px-4 py-3 hidden md:table-cell">Horas</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Próx. Mant.</th><th className="text-left px-4 py-3">Estado</th>
              {isSup&&<th className="px-4 py-3 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((e,i)=>(
              <tr key={e.id} className={`border-b border-gray-100 last:border-0 hover:bg-amber-50/20 transition ${i%2===0?"bg-white":"bg-gray-50/40"}`}>
                <td className="px-4 py-3"><span className="text-amber-600 font-mono font-bold text-xs">{e.code}</span></td>
                <td className="px-4 py-3"><span className="text-gray-800 font-medium">{e.name}</span></td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{e.type}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{e.location}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${CRIT_CLS[e.criticality]}`}>{CRIT_LABEL[e.criticality]}</span></td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-xs">{e.hours.toLocaleString()}h</td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{fmt(e.nextMaint)}</td>
                <td className="px-4 py-3"><Badge s={e.status}/></td>
                {isSup&&<td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={()=>openEdit(e)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"><Edit2 size={14}/></button>
                    <button onClick={()=>setConfirmDel(e)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"><Trash2 size={14}/></button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length===0&&<p className="text-center py-10 text-gray-400 text-sm">No se encontraron equipos</p>}
      </div>
      {showForm&&(
        <Modal title={editTarget?"Editar Equipo":"Nuevo Equipo"} onClose={()=>setShowForm(false)}>
          <div className="grid grid-cols-2 gap-3">
            {[["code","CÓDIGO"],["name","NOMBRE"],["type","TIPO"],["location","UBICACIÓN"]].map(([k,l])=>(
              <div key={k}><label className="text-gray-500 text-xs font-medium mb-1 block">{l}</label>
                <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className={iCls}/></div>
            ))}
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">CRITICIDAD</label>
              <select value={form.criticality} onChange={e=>setForm(f=>({...f,criticality:e.target.value}))} className={sCls}>
                <option value="A">A — Crítico</option><option value="B">B — Importante</option><option value="C">C — Rutinario</option>
              </select></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">ESTADO</label>
              <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={sCls}>
                <option value="operativo">Operativo</option><option value="mantenimiento">Mantenimiento</option><option value="falla">Falla</option>
              </select></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">HORAS ACTUALES</label>
              <input type="number" value={form.hours} onChange={e=>setForm(f=>({...f,hours:e.target.value}))} className={iCls}/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">PRÓX. MANTENCIÓN</label>
              <input type="date" value={form.nextMaint} onChange={e=>setForm(f=>({...f,nextMaint:e.target.value}))} className={iCls}/></div>
            <div className="col-span-2"><label className="text-gray-500 text-xs font-medium mb-1 block">ÚLTIMO MANTENCIÓN</label>
              <input type="date" value={form.lastMaint} onChange={e=>setForm(f=>({...f,lastMaint:e.target.value}))} className={iCls}/></div>
          </div>
          <ModalActions onSave={saveEquip} onCancel={()=>setShowForm(false)} label={editTarget?"Guardar Cambios":"Crear Equipo"}/>
        </Modal>
      )}
      {confirmDel&&(
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center flex-shrink-0"><Trash2 size={18} className="text-red-600"/></div>
              <div><p className="text-gray-900 font-bold text-sm">Eliminar Equipo</p><p className="text-gray-500 text-xs">{confirmDel.code} — {confirmDel.name}</p></div>
            </div>
            <p className="text-gray-600 text-sm mb-5">Esta acción no se puede deshacer. ¿Confirmas?</p>
            <div className="flex gap-2">
              <button onClick={()=>deleteEquip(confirmDel.id)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-lg text-sm transition">Eliminar</button>
              <button onClick={()=>setConfirmDel(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLANS ───────────────────────────────────────────────────────────────────
const EMPTY_PLAN = {name:"",frequency:"",unit:"días",nextDate:"",estimatedHours:"",technician:"",tasks:""};

function Plans({user, data, setData}) {
  const {plans,equip,users,wos}=data;
  const [showForm,setShowForm]=useState(false);
  const [showMasivo,setShowMasivo]=useState(false);
  const [form,setForm]=useState({equipId:"",...EMPTY_PLAN});
  // masivo state
  const [mForm,setMForm]=useState(EMPTY_PLAN);
  const [selectedEquips,setSelectedEquips]=useState([]);
  const [mNamePattern,setMNamePattern]=useState(""); // e.g. "Servicio 250h - {equipo}"

  const genOT=(plan,allWOs)=>{
    const eq=equip.find(e=>e.id===plan.equipId); if(!eq) return null;
    const priority=eq.criticality==="A"?"alta":eq.criticality==="B"?"media":"baja";
    return {id:uid(),code:nextOTCode(allWOs),type:"preventivo",equipId:plan.equipId,planId:plan.id,title:plan.name,priority,status:"asignada",assignedTo:plan.technician,createdAt:new Date().toISOString(),scheduledDate:plan.nextDate,estimatedHours:parseFloat(plan.estimatedHours)||0,actualHours:null,description:`OT automática. Tareas: ${Array.isArray(plan.tasks)?plan.tasks.join(", "):plan.tasks}`,observations:"",parts:[],source:"plan"};
  };

  const addPlan=()=>{
    if(!form.equipId||!form.name) return;
    const np={id:uid(),...form,frequency:parseInt(form.frequency)||0,estimatedHours:parseFloat(form.estimatedHours)||0,tasks:form.tasks.split("\n").filter(Boolean)};
    const updP=[...plans,np]; const newOT=genOT(np,wos); const updW=newOT?[...wos,newOT]:wos;
    setData(d=>({...d,plans:updP,wos:updW})); saveData(KEYS.plans,updP); saveData(KEYS.workOrders,updW);
    setShowForm(false); if(newOT) alert(`✅ OT ${newOT.code} generada automáticamente`);
  };

  const addPlanMasivo=()=>{
    if(selectedEquips.length===0||!mNamePattern) return;
    let allWOs=[...wos]; let newPlans=[...plans]; let generated=0;
    selectedEquips.forEach(eqId=>{
      const eq=equip.find(e=>e.id===eqId); if(!eq) return;
      const planName=mNamePattern.replace("{equipo}",eq.name).replace("{codigo}",eq.code);
      const np={id:uid(),equipId:eqId,name:planName,frequency:parseInt(mForm.frequency)||0,unit:mForm.unit,nextDate:mForm.nextDate,tasks:mForm.tasks.split("\n").filter(Boolean),estimatedHours:parseFloat(mForm.estimatedHours)||0,technician:mForm.technician};
      newPlans.push(np);
      const newOT=genOT(np,allWOs);
      if(newOT){allWOs.push(newOT); generated++;}
    });
    setData(d=>({...d,plans:newPlans,wos:allWOs}));
    saveData(KEYS.plans,newPlans); saveData(KEYS.workOrders,allWOs);
    setShowMasivo(false); setSelectedEquips([]); setMForm(EMPTY_PLAN); setMNamePattern("");
    alert(`✅ ${selectedEquips.length} planes creados, ${generated} OT generadas automáticamente`);
  };

  const generateOT=plan=>{
    const newOT=genOT(plan,wos); if(!newOT) return;
    const updW=[...wos,newOT]; setData(d=>({...d,wos:updW})); saveData(KEYS.workOrders,updW);
    alert(`✅ OT ${newOT.code} — Prioridad ${newOT.priority.toUpperCase()}`);
  };

  const toggleEquip=id=>setSelectedEquips(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-gray-900 font-bold text-xl">Plan de Mantenimiento Preventivo</h1>
          <p className="text-gray-500 text-sm">Programación automática de OT</p></div>
        {user.role==="supervisor"&&(
          <div className="flex gap-2">
            <button onClick={()=>setShowMasivo(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm">
              <Layers size={15}/>Plan Masivo
            </button>
            <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm">
              <Plus size={15}/>Nuevo Plan
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {plans.map(p=>{
          const eq=equip.find(e=>e.id===p.equipId); const tech=users.find(u=>u.id===p.technician);
          const linked=wos.filter(w=>w.planId===p.id);
          const daysLeft=Math.ceil((new Date(p.nextDate)-new Date())/86400000);
          return (
            <div key={p.id} className={`${card} p-5 hover:shadow-md transition`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-amber-600 font-mono font-bold text-xs">{eq?.code}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${daysLeft<=0?"text-red-700 bg-red-50 border-red-200":daysLeft<=7?"text-red-700 bg-red-50 border-red-200":daysLeft<=30?"text-amber-700 bg-amber-50 border-amber-200":"text-emerald-700 bg-emerald-50 border-emerald-200"}`}>
                      {daysLeft<=0?"VENCIDO":`En ${daysLeft}d`}
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm mb-2">{p.name}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><RefreshCw size={10}/>Cada {p.frequency} {p.unit}</span>
                    <span className="flex items-center gap-1"><Calendar size={10}/>Prox: {fmt(p.nextDate)}</span>
                    <span className="flex items-center gap-1"><Clock size={10}/>{p.estimatedHours}h est.</span>
                    {tech&&<span className="flex items-center gap-1"><Users size={10}/>{tech.name}</span>}
                  </div>
                  {Array.isArray(p.tasks)&&p.tasks.length>0&&(
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tasks.map((t,i)=><span key={i} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-gray-400 text-xs">{linked.length} OT generadas</span>
                  {user.role==="supervisor"&&<button onClick={()=>generateOT(p)} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-medium"><Zap size={12}/>Generar OT</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAN INDIVIDUAL */}
      {showForm&&(
        <Modal title="Nuevo Plan de Mantenimiento" onClose={()=>setShowForm(false)}>
          <div className="space-y-3">
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">EQUIPO</label>
              <select value={form.equipId} onChange={e=>setForm(f=>({...f,equipId:e.target.value}))} className={sCls}>
                <option value="">Seleccionar...</option>{equip.map(e=><option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
              </select></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">NOMBRE DEL PLAN</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={iCls}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">FRECUENCIA</label>
                <input type="number" value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))} className={iCls}/></div>
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">UNIDAD</label>
                <select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} className={sCls}>
                  <option value="días">Días</option><option value="horas">Horas</option><option value="semanas">Semanas</option>
                </select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">PRÓXIMA FECHA</label>
                <input type="date" value={form.nextDate} onChange={e=>setForm(f=>({...f,nextDate:e.target.value}))} className={iCls}/></div>
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">HRS ESTIMADAS</label>
                <input type="number" value={form.estimatedHours} onChange={e=>setForm(f=>({...f,estimatedHours:e.target.value}))} className={iCls}/></div>
            </div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">TÉCNICO ASIGNADO</label>
              <select value={form.technician} onChange={e=>setForm(f=>({...f,technician:e.target.value}))} className={sCls}>
                <option value="">Seleccionar...</option>{users.filter(u=>u.role==="mecanico").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </select></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">TAREAS (una por línea)</label>
              <textarea value={form.tasks} onChange={e=>setForm(f=>({...f,tasks:e.target.value}))} rows={4}
                className={iCls+" resize-none"} placeholder={"Cambio aceite motor\nFiltro hidráulico\nRevisión frenos"}/></div>
          </div>
          <ModalActions onSave={addPlan} onCancel={()=>setShowForm(false)} label="Guardar y Generar OT"/>
        </Modal>
      )}

      {/* PLAN MASIVO */}
      {showMasivo&&(
        <Modal title="Plan Masivo — Aplicar a múltiples equipos" onClose={()=>setShowMasivo(false)} wide={true}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-700 text-xs flex items-start gap-2">
            <Info size={14} className="flex-shrink-0 mt-0.5"/>
            <span>Selecciona los equipos y define la plantilla del plan. Usa <strong>{"{equipo}"}</strong> o <strong>{"{codigo}"}</strong> en el nombre para personalizarlo automáticamente. Se creará un plan y una OT por cada equipo seleccionado.</span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {/* Columna izquierda: selección de equipos */}
            <div>
              <p className="text-gray-700 font-semibold text-sm mb-3">Seleccionar Equipos <span className="text-amber-600 font-bold">({selectedEquips.length})</span></p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {equip.map(e=>{
                  const checked=selectedEquips.includes(e.id);
                  return (
                    <label key={e.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${checked?"bg-amber-50 border-amber-300":"bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={checked} onChange={()=>toggleEquip(e.id)} className="accent-amber-500 w-4 h-4"/>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-800 text-xs font-semibold truncate">{e.name}</p>
                        <p className="text-gray-400 text-xs">{e.code} · Crit. {e.criticality}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>setSelectedEquips(equip.map(e=>e.id))} className="flex-1 text-xs text-blue-600 hover:underline py-1">Seleccionar todos</button>
                <button onClick={()=>setSelectedEquips([])} className="flex-1 text-xs text-gray-400 hover:underline py-1">Limpiar</button>
              </div>
            </div>
            {/* Columna derecha: plantilla */}
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold text-sm mb-1">Plantilla del Plan</p>
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">NOMBRE (usa {"{equipo}"} o {"{codigo}"})</label>
                <input value={mNamePattern} onChange={e=>setMNamePattern(e.target.value)} className={iCls} placeholder="Servicio 250h - {equipo}"/></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-500 text-xs font-medium mb-1 block">FRECUENCIA</label>
                  <input type="number" value={mForm.frequency} onChange={e=>setMForm(f=>({...f,frequency:e.target.value}))} className={iCls}/></div>
                <div><label className="text-gray-500 text-xs font-medium mb-1 block">UNIDAD</label>
                  <select value={mForm.unit} onChange={e=>setMForm(f=>({...f,unit:e.target.value}))} className={sCls}>
                    <option value="días">Días</option><option value="horas">Horas</option><option value="semanas">Semanas</option>
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-500 text-xs font-medium mb-1 block">PRÓXIMA FECHA</label>
                  <input type="date" value={mForm.nextDate} onChange={e=>setMForm(f=>({...f,nextDate:e.target.value}))} className={iCls}/></div>
                <div><label className="text-gray-500 text-xs font-medium mb-1 block">HRS ESTIMADAS</label>
                  <input type="number" value={mForm.estimatedHours} onChange={e=>setMForm(f=>({...f,estimatedHours:e.target.value}))} className={iCls}/></div>
              </div>
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">TÉCNICO ASIGNADO</label>
                <select value={mForm.technician} onChange={e=>setMForm(f=>({...f,technician:e.target.value}))} className={sCls}>
                  <option value="">Seleccionar...</option>{users.filter(u=>u.role==="mecanico").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                </select></div>
              <div><label className="text-gray-500 text-xs font-medium mb-1 block">TAREAS (una por línea)</label>
                <textarea value={mForm.tasks} onChange={e=>setMForm(f=>({...f,tasks:e.target.value}))} rows={3}
                  className={iCls+" resize-none"} placeholder={"Cambio aceite\nFiltros\nRevisión general"}/></div>
            </div>
          </div>
          {selectedEquips.length>0&&mNamePattern&&(
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
              <p className="font-semibold mb-1">Vista previa ({selectedEquips.length} planes a crear):</p>
              {selectedEquips.slice(0,3).map(id=>{
                const eq=equip.find(e=>e.id===id);
                return <p key={id} className="text-emerald-600">• {mNamePattern.replace("{equipo}",eq?.name||"").replace("{codigo}",eq?.code||"")}</p>;
              })}
              {selectedEquips.length>3&&<p className="text-emerald-500">... y {selectedEquips.length-3} más</p>}
            </div>
          )}
          <ModalActions onSave={addPlanMasivo} onCancel={()=>setShowMasivo(false)} label={`Crear ${selectedEquips.length} Planes y Generar OT`}/>
        </Modal>
      )}
    </div>
  );
}

// ─── INDICADORES KPI (MTBF / MTTR) ──────────────────────────────────────────
function Indicadores({data}) {
  const {wos, equip} = data;

  // MTTR = promedio horas reales en OT correctivas completadas
  // MTBF = horas acumuladas del equipo / número de fallas (OT correctivas)
  const calcMetrics = (eqId) => {
    const eq = equip.find(e=>e.id===eqId);
    const correctivas = wos.filter(w=>w.equipId===eqId&&w.type==="correctivo");
    const completadas = correctivas.filter(w=>w.status==="completada"&&w.actualHours);
    const nFallas = correctivas.length;
    const mttr = completadas.length>0 ? (completadas.reduce((s,w)=>s+(w.actualHours||0),0)/completadas.length) : null;
    const mtbf = nFallas>0&&eq ? (eq.hours/nFallas) : null;
    const disponibilidad = (mtbf!==null&&mttr!==null&&(mtbf+mttr)>0) ? (mtbf/(mtbf+mttr)*100) : null;
    return {nFallas, mttr, mtbf, disponibilidad, completadas:completadas.length};
  };

  const globalCorrectivas = wos.filter(w=>w.type==="correctivo");
  const globalCompletadas = globalCorrectivas.filter(w=>w.status==="completada"&&w.actualHours);
  const globalMTTR = globalCompletadas.length>0 ? (globalCompletadas.reduce((s,w)=>s+(w.actualHours||0),0)/globalCompletadas.length) : null;
  const totalHours = equip.reduce((s,e)=>s+e.hours,0);
  const totalFallas = globalCorrectivas.length;
  const globalMTBF = totalFallas>0 ? (totalHours/totalFallas) : null;
  const globalDisp = (globalMTBF!==null&&globalMTTR!==null&&(globalMTBF+globalMTTR)>0) ? (globalMTBF/(globalMTBF+globalMTTR)*100) : null;

  const fmtH = v => v===null?"N/D":`${v.toFixed(1)}h`;
  const fmtPct = v => v===null?"N/D":`${v.toFixed(1)}%`;

  const dispColor = v => v===null?"text-gray-400":v>=90?"text-emerald-600":v>=70?"text-amber-600":"text-red-600";
  const dispBg    = v => v===null?"bg-gray-100":v>=90?"bg-emerald-50 border-emerald-200":v>=70?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 font-bold text-xl">Indicadores de Mantenimiento</h1>
        <p className="text-gray-500 text-sm">MTBF · MTTR · Disponibilidad — General y por equipo</p>
      </div>

      {/* DEFINICIONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {label:"MTBF",name:"Mean Time Between Failures",desc:"Horas operativas promedio entre fallas",color:"blue"},
          {label:"MTTR",name:"Mean Time To Repair",desc:"Horas promedio para completar una reparación",color:"amber"},
          {label:"Disponibilidad",name:"Availability",desc:"MTBF / (MTBF + MTTR) × 100%",color:"emerald"},
        ].map(k=>(
          <div key={k.label} className={`${card} p-4`}>
            <p className={`text-xs font-bold mb-0.5 ${k.color==="blue"?"text-blue-700":k.color==="amber"?"text-amber-700":"text-emerald-700"}`}>{k.label} — {k.name}</p>
            <p className="text-gray-500 text-xs">{k.desc}</p>
          </div>
        ))}
      </div>

      {/* KPIs GLOBALES */}
      <div>
        <h2 className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2"><Target size={15} className="text-violet-600"/>Resumen General (toda la flota)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Clock}        label="MTBF Global"          value={fmtH(globalMTBF)}  sub="horas entre fallas"      color="blue"/>
          <StatCard icon={Wrench}       label="MTTR Global"          value={fmtH(globalMTTR)}  sub="horas promedio reparación" color="amber"/>
          <StatCard icon={TrendingUp}   label="Disponibilidad Global" value={fmtPct(globalDisp)} sub="de la flota"             color="emerald"/>
          <StatCard icon={AlertTriangle} label="Total Fallas"        value={totalFallas}        sub="OT correctivas registradas" color="red"/>
        </div>
      </div>

      {/* POR EQUIPO */}
      <div>
        <h2 className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2"><BarChart2 size={15} className="text-amber-600"/>KPIs por Equipo</h2>
        <div className={`${card} overflow-hidden`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-4 py-3">Equipo</th>
                <th className="text-left px-4 py-3">Criticidad</th>
                <th className="text-right px-4 py-3">Horas Acum.</th>
                <th className="text-right px-4 py-3">Fallas</th>
                <th className="text-right px-4 py-3">MTBF</th>
                <th className="text-right px-4 py-3">MTTR</th>
                <th className="text-center px-4 py-3">Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {equip.map((e,i)=>{
                const m=calcMetrics(e.id);
                return (
                  <tr key={e.id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${i%2===0?"bg-white":"bg-gray-50/40"}`}>
                    <td className="px-4 py-3">
                      <p className="text-gray-800 font-medium text-sm">{e.name}</p>
                      <p className="text-amber-600 font-mono text-xs">{e.code}</p>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${CRIT_CLS[e.criticality]}`}>{CRIT_LABEL[e.criticality]}</span></td>
                    <td className="px-4 py-3 text-right text-gray-600 text-xs font-medium">{e.hours.toLocaleString()}h</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-sm ${m.nFallas>0?"text-red-600":"text-gray-400"}`}>{m.nFallas}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-blue-700 font-semibold text-sm">{fmtH(m.mtbf)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-amber-700 font-semibold text-sm">{fmtH(m.mttr)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.disponibilidad!==null ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-bold text-sm ${dispColor(m.disponibilidad)}`}>{fmtPct(m.disponibilidad)}</span>
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${m.disponibilidad>=90?"bg-emerald-500":m.disponibilidad>=70?"bg-amber-400":"bg-red-500"}`}
                              style={{width:`${Math.min(100,m.disponibilidad)}%`}}/>
                          </div>
                        </div>
                      ) : <span className="text-gray-400 text-xs">Sin datos</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTA METODOLÓGICA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5"/>
        <div className="text-xs text-blue-700">
          <p className="font-semibold mb-1">Nota metodológica</p>
          <p><strong>MTBF</strong> = Horas acumuladas del equipo ÷ Número de OT correctivas registradas. <strong>MTTR</strong> = Promedio de horas reales reportadas en OT correctivas completadas. <strong>Disponibilidad</strong> = MTBF ÷ (MTBF + MTTR) × 100. Valores marcados como "N/D" requieren al menos una falla o reparación completada con horas reportadas.</p>
        </div>
      </div>
    </div>
  );
}

// ─── REQUESTS ────────────────────────────────────────────────────────────────
function Requests({user, data, setData}) {
  const {requests,equip,users,wos}=data;
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({equipId:"",title:"",description:"",priority:"media"});
  const canCreate=user.role==="operaciones"||user.role==="supervisor";
  const visible=user.role==="supervisor"?requests:requests.filter(r=>r.requestedBy===user.id);
  const createReq=()=>{
    if(!form.equipId||!form.title) return;
    const nr={id:uid(),...form,status:"pendiente",requestedBy:user.id,requestedAt:new Date().toISOString(),approvedBy:null,otId:null};
    const updated=[...requests,nr]; setData(d=>({...d,requests:updated})); saveData(KEYS.requests,updated);
    setShowForm(false); setForm({equipId:"",title:"",description:"",priority:"media"});
  };
  const approve=req=>{
    const eq=equip.find(e=>e.id===req.equipId);
    const priority=req.priority==="alta"||eq?.criticality==="A"?"alta":req.priority;
    const mec=users.find(u=>u.role==="mecanico");
    const newOT={id:uid(),code:nextOTCode(wos),type:"correctivo",equipId:req.equipId,planId:null,title:`Reparación ${eq?.name||""} - ${req.title}`,priority,status:"asignada",assignedTo:mec?.id||"",createdAt:new Date().toISOString(),scheduledDate:new Date().toISOString().slice(0,10),estimatedHours:priority==="alta"?4:2,actualHours:null,description:req.description,observations:"",parts:[],source:"solicitud",reqId:req.id};
    const updW=[...wos,newOT]; const updR=requests.map(r=>r.id===req.id?{...r,status:"aprobada",approvedBy:user.id,otId:newOT.id}:r);
    setData(d=>({...d,wos:updW,requests:updR})); saveData(KEYS.workOrders,updW); saveData(KEYS.requests,updR);
    alert(`✅ OT ${newOT.code} generada — Prioridad ${priority.toUpperCase()}`);
  };
  const reject=req=>{
    const updated=requests.map(r=>r.id===req.id?{...r,status:"rechazada",approvedBy:user.id}:r);
    setData(d=>({...d,requests:updated})); saveData(KEYS.requests,updated);
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-gray-900 font-bold text-xl">Solicitudes de Reparación</h1><p className="text-gray-500 text-sm">{visible.length} solicitudes</p></div>
        {canCreate&&<button onClick={()=>setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"><Plus size={15}/>Nueva Solicitud</button>}
      </div>
      <div className="space-y-3">
        {visible.map(r=>{
          const eq=equip.find(e=>e.id===r.equipId); const reqBy=users.find(u=>u.id===r.requestedBy); const linkedOT=wos.find(w=>w.id===r.otId);
          return (
            <div key={r.id} className={`bg-white border rounded-xl p-5 shadow-sm ${r.status==="pendiente"?"border-amber-300":"border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge s={r.status}/><span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${PRI_CLS[r.priority]}`}>{r.priority.toUpperCase()}</span>
                    {eq?.criticality&&<span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${CRIT_CLS[eq.criticality]}`}>Equipo {CRIT_LABEL[eq.criticality]}</span>}
                  </div>
                  <p className="text-gray-800 font-semibold text-sm mb-1">{r.title}</p>
                  <p className="text-gray-500 text-xs mb-2">{r.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span>{eq?.name||"—"}</span><span>·</span><span>{reqBy?.name||"—"}</span><span>·</span><span>{fmtDT(r.requestedAt)}</span>
                  </div>
                  {linkedOT&&<div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium"><CheckCircle size={10}/>OT: {linkedOT.code}</div>}
                </div>
                {user.role==="supervisor"&&r.status==="pendiente"&&(
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={()=>approve(r)} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition font-medium"><Check size={12}/>Aprobar + OT</button>
                    <button onClick={()=>reject(r)}  className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"><X size={12}/>Rechazar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {visible.length===0&&<div className="text-center py-12 text-gray-400 text-sm">No hay solicitudes</div>}
      </div>
      {showForm&&(
        <Modal title="Nueva Solicitud de Reparación" onClose={()=>setShowForm(false)}>
          <div className="space-y-3">
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">EQUIPO</label>
              <select value={form.equipId} onChange={e=>setForm(f=>({...f,equipId:e.target.value}))} className={sCls}>
                <option value="">Seleccionar...</option>{equip.map(e=><option key={e.id} value={e.id}>{e.name} ({e.code}) — Crit. {e.criticality}</option>)}
              </select></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">FALLA DETECTADA</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={iCls}/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">DESCRIPCIÓN</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className={iCls+" resize-none"}/></div>
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">PRIORIDAD</label>
              <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className={sCls}>
                <option value="alta">Alta — Detiene operaciones</option>
                <option value="media">Media — Afecta rendimiento</option>
                <option value="baja">Baja — Sin impacto inmediato</option>
              </select></div>
          </div>
          <ModalActions onSave={createReq} onCancel={()=>setShowForm(false)} label="Enviar Solicitud"/>
        </Modal>
      )}
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
function Reports({data}) {
  const {wos,equip}=data;
  const completed=wos.filter(w=>w.status==="completada");
  const prev=wos.filter(w=>w.type==="preventivo"); const corr=wos.filter(w=>w.type==="correctivo");
  const totalHrs=completed.reduce((s,w)=>s+(w.actualHours||0),0);
  const byEquip=equip.map(e=>({...e,totalWOs:wos.filter(w=>w.equipId===e.id).length,completedWOs:completed.filter(w=>w.equipId===e.id).length,hrs:completed.filter(w=>w.equipId===e.id).reduce((s,w)=>s+(w.actualHours||0),0)})).sort((a,b)=>b.totalWOs-a.totalWOs);
  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-gray-900 font-bold text-xl">Informes y Análisis</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle}   label="OT Completadas" value={completed.length}         color="emerald"/>
        <StatCard icon={Wrench}        label="Preventivas"    value={prev.length}               color="blue"/>
        <StatCard icon={AlertTriangle} label="Correctivas"    value={corr.length}               color="red"/>
        <StatCard icon={Clock}         label="Horas Totales"  value={`${totalHrs.toFixed(1)}h`} color="amber"/>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="p-5 border-b border-gray-100"><h2 className="text-gray-800 font-semibold text-sm">OT por Equipo</h2></div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
            <th className="text-left px-4 py-3">Equipo</th><th className="text-left px-4 py-3">Criticidad</th>
            <th className="text-right px-4 py-3">Total OT</th><th className="text-right px-4 py-3">Completadas</th><th className="text-right px-4 py-3">Horas</th>
          </tr></thead>
          <tbody>{byEquip.map((e,i)=>(
            <tr key={e.id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${i%2===0?"bg-white":"bg-gray-50/40"}`}>
              <td className="px-4 py-3"><p className="text-gray-800 font-medium text-sm">{e.name}</p><p className="text-amber-600 font-mono text-xs">{e.code}</p></td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${CRIT_CLS[e.criticality]}`}>{CRIT_LABEL[e.criticality]}</span></td>
              <td className="px-4 py-3 text-right text-gray-700 font-medium">{e.totalWOs}</td>
              <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{e.completedWOs}</td>
              <td className="px-4 py-3 text-right text-gray-600">{e.hrs.toFixed(1)}h</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${card} p-5`}>
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Distribución OT</h2>
          {[{label:"Preventivas",value:prev.length,color:"bg-blue-500"},{label:"Correctivas",value:corr.length,color:"bg-red-400"}].map(item=>(
            <div key={item.label} className="mb-4">
              <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">{item.label}</span><span className="text-gray-700 font-semibold">{item.value} ({Math.round(item.value/(wos.length||1)*100)}%)</span></div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className={`h-full ${item.color} rounded-full`} style={{width:`${Math.round(item.value/(wos.length||1)*100)}%`}}/>
              </div>
            </div>
          ))}
        </div>
        <div className={`${card} p-5`}>
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Estado Actual OT</h2>
          {["pendiente","asignada","en_proceso","completada"].map(s=>(
            <div key={s} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <Badge s={s}/><span className="text-gray-800 font-bold text-sm">{wos.filter(w=>w.status===s).length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USERS ───────────────────────────────────────────────────────────────────
function UsersPage({data, setData}) {
  const {users}=data; const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",role:"mecanico"});
  const addUser=()=>{
    if(!form.name||!form.email||!form.password) return;
    const nu={id:uid(),...form,avatar:form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()};
    const updated=[...users,nu]; setData(d=>({...d,users:updated})); saveData(KEYS.users,updated);
    setShowForm(false); setForm({name:"",email:"",password:"",role:"mecanico"});
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-gray-900 font-bold text-xl">Gestión de Usuarios</h1><p className="text-gray-500 text-sm">{users.length} usuarios</p></div>
        <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"><Plus size={15}/>Nuevo Usuario</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map(u=>{const cfg=ROLE_CFG[u.role]; const RoleIcon=cfg.icon; return(
          <div key={u.id} className={`${card} p-5 flex items-center gap-4 hover:shadow-md transition`}>
            <div className={`w-12 h-12 rounded-full ${cfg.bg} flex items-center justify-center font-bold text-sm ${cfg.color}`}>{u.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-semibold text-sm">{u.name}</p>
              <p className="text-gray-400 text-xs">{u.email}</p>
              <p className={`flex items-center gap-1.5 mt-1 text-xs font-medium ${cfg.color}`}><RoleIcon size={11}/>{cfg.label}</p>
            </div>
            <span className="text-gray-300 font-mono text-xs">{u.password}</span>
          </div>
        );})}
      </div>
      {showForm&&(
        <Modal title="Nuevo Usuario" onClose={()=>setShowForm(false)}>
          <div className="space-y-3">
            {[["name","NOMBRE COMPLETO","text"],["email","CORREO","email"],["password","CONTRASEÑA","text"]].map(([k,l,t])=>(
              <div key={k}><label className="text-gray-500 text-xs font-medium mb-1 block">{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className={iCls}/></div>
            ))}
            <div><label className="text-gray-500 text-xs font-medium mb-1 block">ROL</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} className={sCls}>
                <option value="supervisor">Supervisor — Acceso completo</option>
                <option value="mecanico">Mecánico — Reportar trabajos</option>
                <option value="operaciones">Operaciones — Solicitudes</option>
              </select></div>
          </div>
          <ModalActions onSave={addUser} onCancel={()=>setShowForm(false)} label="Crear Usuario"/>
        </Modal>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
function Notifications({user, data}) {
  const {wos,equip,requests}=data;
  const fallas=equip.filter(e=>e.status==="falla");
  const myReqs=requests.filter(r=>r.requestedBy===user.id);
  const items=[
    ...fallas.map(e=>({icon:AlertTriangle,cls:"text-red-600",bg:"bg-red-50 border-red-200",title:`Equipo en falla: ${e.name}`,sub:`${e.location} · Criticidad ${e.criticality}`,time:"Activo"})),
    ...myReqs.map(r=>{const eq=equip.find(e=>e.id===r.equipId); const linkedOT=wos.find(w=>w.id===r.otId);
      return {icon:r.status==="aprobada"?CheckCircle:r.status==="rechazada"?X:Clock,cls:r.status==="aprobada"?"text-emerald-600":r.status==="rechazada"?"text-red-600":"text-amber-600",bg:"bg-white border-gray-200",title:`Solicitud: ${r.title}`,sub:`${eq?.name||"—"} · ${ST[r.status]?.label}${linkedOT?` · ${linkedOT.code}`:""}`,time:fmtDT(r.requestedAt)};
    }),
  ];
  return (
    <div className="p-6">
      <div className="mb-5"><h1 className="text-gray-900 font-bold text-xl">Notificaciones</h1></div>
      <div className="space-y-3">
        {items.length===0&&<div className="text-center py-12 text-gray-400 text-sm">Sin notificaciones</div>}
        {items.map((n,i)=>(
          <div key={i} className={`border rounded-xl p-4 flex items-start gap-3 shadow-sm ${n.bg}`}>
            <n.icon size={16} className={`${n.cls} flex-shrink-0 mt-0.5`}/>
            <div className="flex-1"><p className={`font-semibold text-sm ${n.cls}`}>{n.title}</p><p className="text-gray-500 text-xs mt-0.5">{n.sub}</p></div>
            <span className="text-gray-400 text-xs">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null); const [page,setPage]=useState("dashboard");
  const [data,setData]=useState(()=>({
    users:    loadData(KEYS.users,      SEED_USERS),
    equip:    loadData(KEYS.equipment,  SEED_EQUIPMENT),
    plans:    loadData(KEYS.plans,      SEED_PM_PLANS),
    requests: loadData(KEYS.requests,   SEED_REQUESTS),
    wos:      loadData(KEYS.workOrders, SEED_WORK_ORDERS),
  }));
  const pendingReqs=data.requests.filter(r=>r.status==="pendiente").length;
  if(!user) return <LoginPage users={data.users} onLogin={u=>{setUser(u);setPage("dashboard");}}/>;
  const PAGES={
    dashboard:     <Dashboard     user={user} data={data} onNav={setPage}/>,
    workorders:    <WorkOrders    user={user} data={data} setData={setData}/>,
    equipment:     <Equipment     user={user} data={data} setData={setData}/>,
    plans:         <Plans         user={user} data={data} setData={setData}/>,
    indicadores:   <Indicadores   data={data}/>,
    requests:      <Requests      user={user} data={data} setData={setData}/>,
    notifications: <Notifications user={user} data={data}/>,
    reports:       <Reports       data={data}/>,
    users:         <UsersPage     data={data} setData={setData}/>,
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} active={page} onNav={setPage} onLogout={()=>{setUser(null);setPage("dashboard");}} notifications={pendingReqs}/>
      <main className="flex-1 min-h-screen overflow-y-auto">{PAGES[page]||PAGES.dashboard}</main>
    </div>
  );
}
