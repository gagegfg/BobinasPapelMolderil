/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell,
  User,
  History,
  Minus,
  Plus,
  Printer,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Icons to match the UI exactly
const Icons = {
  Inventory: () => <span className="material-symbols-outlined">inventory_2</span>,
  Production: () => <span className="material-symbols-outlined">precision_manufacturing</span>,
  Scanner: () => <span className="material-symbols-outlined">barcode_scanner</span>,
  Analytics: () => <span className="material-symbols-outlined">monitoring</span>,
  Settings: () => <span className="material-symbols-outlined">settings</span>,
  Upload: () => <span className="material-symbols-outlined">upload_file</span>,
  Support: () => <span className="material-symbols-outlined">help</span>,
  SignOut: () => <span className="material-symbols-outlined">logout</span>,
};

interface LabelData {
  sku: string;
  paperType: string;
  grammage: string;
  width: string;
  batch: string;
  units: number;
  weight: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'production' | 'scanner' | 'analytics' | 'settings'>('inventory');
  const [isMobileScannerOpen, setIsMobileScannerOpen] = useState(false);
  
  const [labelData, setLabelData] = useState<LabelData>({
    sku: 'SKU-99238-A (Couché Semi-Brillante)',
    paperType: 'Couché Mate',
    grammage: '120',
    width: '1050',
    batch: 'LOTE-2024-XJ',
    units: 4,
    weight: '840.50'
  });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('es-ES').slice(0, 16));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('es-ES').slice(0, 16));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: keyof LabelData, value: string | number) => {
    setLabelData(prev => ({ ...prev, [field]: value }));
  };

  if (isMobileScannerOpen) {
    return (
      <div className="fixed inset-0 bg-surface z-[100] flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 border-b border-outline-variant/20 bg-surface">
          <button 
            onClick={() => setIsMobileScannerOpen(false)}
            className="p-2 hover:bg-surface-container-low rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="font-bold text-lg">Escáner de Depósito</h2>
          <div className="w-10"></div> {/* Spacer */}
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
          {/* Simulated Camera Viewfinder */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/seed/warehouse/800/1200')] bg-cover bg-center"></div>
          
          {/* Scanner Overlay */}
          <div className="relative z-10 w-full max-w-sm aspect-square border-2 border-tertiary-fixed rounded-xl flex items-center justify-center">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-tertiary-fixed rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-tertiary-fixed rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-tertiary-fixed rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-tertiary-fixed rounded-br-xl"></div>
            
            {/* Scanning Line Animation */}
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-full h-1 bg-tertiary-fixed shadow-[0_0_15px_rgba(111,251,190,0.8)]"
            />
          </div>
          
          <p className="relative z-10 text-white mt-8 font-bold text-center bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            Alinee el código de barras o QR
          </p>
        </div>
        
        <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/20">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-4">Ingreso Manual</h3>
          <div className="flex gap-2">
            <Input 
              value="" 
              onChange={() => {}} 
              placeholder="Ej: SKU-99238-A" 
              className="flex-1"
            />
            <button className="h-14 px-6 bg-primary text-on-primary rounded-lg font-bold active:scale-95 transition-transform">
              Buscar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface custom-scrollbar">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex w-64 bg-surface-container-low flex-col p-6 fixed h-full z-20 print-hidden">
        <div className="mb-10">
          <h1 className="text-xl font-black tracking-tighter text-primary">Digital Foreman</h1>
          <div className="mt-4">
            <h2 className="text-sm font-bold text-on-surface">Foreman OS</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Gestión de Bobinas</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<Icons.Inventory />} label="Inventario" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Icons.Production />} label="Producción" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />
          <NavItem icon={<Icons.Scanner />} label="Escáner" active={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')} />
          <NavItem icon={<Icons.Analytics />} label="Análisis" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<Icons.Settings />} label="Ajustes" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto space-y-4">
          <button className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <Icons.Upload />
            Subir Excel
          </button>
          
          <div className="pt-4 border-t border-outline-variant/20 space-y-1">
            <NavItem icon={<Icons.Support />} label="Soporte" small />
            <NavItem icon={<Icons.SignOut />} label="Cerrar Sesión" small />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0">
        {/* Top Bar */}
        <header className="h-16 bg-surface flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 print-hidden">
          <div className="flex gap-4 md:gap-8 overflow-x-auto custom-scrollbar">
            <TopNavLink label="Inventario" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
            <TopNavLink label="Producción" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />
            <TopNavLink label="Escáner" active={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')} />
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button aria-label="Notificaciones" className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <Bell size={20} className="text-on-surface" />
            </button>
            <button aria-label="Perfil de Usuario" className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <User size={20} className="text-on-surface" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-10 gap-4 print-hidden">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Generación de Etiquetas</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Crea e imprime etiquetas industriales para bobinas recién llegadas.</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface font-bold rounded-lg hover:bg-surface-container-highest transition-colors w-full md:w-auto">
              <History size={18} />
              Impresiones Recientes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-7 space-y-8 print-hidden">
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">description</span>
                  Información de la Bobina
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label>SKU / Nombre del Producto</Label>
                    <select 
                      value={labelData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className="w-full h-14 bg-surface-container-low border-none rounded-lg px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                    >
                      <option>SKU-99238-A (Couché Semi-Brillante)</option>
                      <option>SKU-10294-B (Bond No Estucado 80g)</option>
                      <option>SKU-44582-X (Kraft Reciclado)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Tipo (Tipo de Papel)</Label>
                    <Input 
                      value={labelData.paperType} 
                      onChange={(v) => handleInputChange('paperType', v)}
                    />
                  </div>
                  
                  <div>
                    <Label>Gramaje (g/m²)</Label>
                    <Input 
                      type="number" 
                      value={labelData.grammage} 
                      onChange={(v) => handleInputChange('grammage', v)}
                    />
                  </div>
                  
                  <div>
                    <Label>Ancho (mm)</Label>
                    <Input 
                      type="number" 
                      value={labelData.width} 
                      onChange={(v) => handleInputChange('width', v)}
                    />
                  </div>
                  
                  <div>
                    <Label>Lote del Proveedor</Label>
                    <Input 
                      value={labelData.batch} 
                      onChange={(v) => handleInputChange('batch', v)}
                      placeholder="LOTE-2024-XJ"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm status-pillar">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">print</span>
                  Configuración de Impresión por Lote
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Cantidad de Bobinas (Unidades)</Label>
                    <div className="flex items-center bg-surface-container-low rounded-lg overflow-hidden">
                      <button 
                        aria-label="Disminuir cantidad"
                        onClick={() => handleInputChange('units', Math.max(1, labelData.units - 1))}
                        className="w-14 h-14 flex items-center justify-center hover:bg-surface-container-high transition-colors text-xl font-bold"
                      >
                        <Minus size={20} />
                      </button>
                      <input 
                        type="number" 
                        min="1"
                        value={labelData.units}
                        onChange={(e) => handleInputChange('units', Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 bg-transparent border-none text-center font-black text-xl h-14 focus:ring-0"
                      />
                      <button 
                        aria-label="Aumentar cantidad"
                        onClick={() => handleInputChange('units', labelData.units + 1)}
                        className="w-14 h-14 flex items-center justify-center hover:bg-surface-container-high transition-colors text-xl font-bold"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Peso por Unidad (kg)</Label>
                    <Input 
                      type="number" 
                      value={labelData.weight} 
                      onChange={(v) => handleInputChange('weight', v)}
                      className="text-xl font-black"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => window.print()}
                    className="w-full h-16 primary-gradient text-on-primary rounded-lg font-black text-lg flex items-center justify-center gap-3 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <Printer size={24} />
                    GENERAR E IMPRIMIR ETIQUETAS
                  </button>
                  <p className="text-center text-[10px] mt-4 text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                    Impresión Directa a Zebra ZT411 • En Línea
                  </p>
                </div>
              </section>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-5 print-area">
              <div className="sticky top-24">
                <div className="flex justify-between items-center mb-4 px-2 print-hidden">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Vista Previa en Vivo (10x15cm)</h3>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-black uppercase">Diseño Estándar</span>
                </div>

                {/* Label Preview Card */}
                <div className="label-sticker bg-white aspect-[10/15] rounded-sm shadow-2xl p-6 md:p-8 text-black flex flex-col border border-outline-variant/20">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-tighter mb-1">Digital Foreman</div>
                      <div className="text-2xl font-black tracking-tighter leading-none">FOREMAN OS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-bold uppercase">Fecha / Hora</div>
                      <div className="text-xs font-bold">{currentTime}</div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="mb-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1">SKU / ID DEL PRODUCTO</div>
                    <div className="text-4xl font-black tracking-tighter leading-none break-all">
                      {labelData.sku.split(' ')[0]}
                    </div>
                    <div className="text-lg font-bold text-gray-700 mt-1">
                      {labelData.paperType} {labelData.grammage}g • {labelData.width}mm
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="flex-1 flex flex-col justify-center border-y-2 border-black/10 py-6 my-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1">PESO NETO TOTAL</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black tracking-tighter">{labelData.weight}</span>
                      <span className="text-2xl font-bold">KG</span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 items-end mt-auto">
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 text-gray-500">Lote Proveedor</div>
                        <div className="text-sm font-black">{labelData.batch || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 text-gray-500">Secuencia Bobina</div>
                        <div className="text-sm font-black">01 / {String(labelData.units).padStart(2, '0')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 text-gray-500">Zona Almacén</div>
                        <div className="text-sm font-black">A-LEVEL-2</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="w-32 h-32 bg-gray-50 border border-gray-200 flex items-center justify-center relative overflow-hidden">
                        <QrCode size={48} className="text-gray-300" />
                        {/* QR Simulation Pattern */}
                        <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-px opacity-40">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-[8px] font-bold mt-2 uppercase tracking-widest text-center w-full">Escanear para Verificar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-md rounded-t-2xl z-50 border-t border-outline-variant/20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] print-hidden">
        <MobileNavItem icon={<span className="material-symbols-outlined">warehouse</span>} label="Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        <MobileNavItem icon={<span className="material-symbols-outlined">precision_manufacturing</span>} label="Prod" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />
        <MobileNavItem icon={<span className="material-symbols-outlined">qr_code_scanner</span>} label="Escanear" active={activeTab === 'scanner'} onClick={() => setIsMobileScannerOpen(true)} />
        <MobileNavItem icon={<span className="material-symbols-outlined">person</span>} label="Perfil" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* Mobile FAB Scanner (Only show when not on scanner tab) */}
      {!isMobileScannerOpen && (
        <button 
          aria-label="Abrir Escáner"
          onClick={() => setIsMobileScannerOpen(true)}
          className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-all print-hidden"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>barcode_scanner</span>
        </button>
      )}

      {/* Material Symbols Link */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
    </div>
  );
}

function NavItem({ icon, label, active = false, small = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, small?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
      w-full flex items-center gap-3 px-4 rounded-lg transition-all active:scale-95
      ${small ? 'py-2' : 'py-3'}
      ${active 
        ? 'bg-white text-primary font-bold shadow-sm' 
        : 'text-on-surface-variant hover:bg-surface-container-high'}
    `}>
      <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>
      <span className={`text-sm font-medium tracking-wide uppercase ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
    </button>
  );
}

function MobileNavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
      flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-all active:scale-90
      ${active ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'text-on-surface-variant hover:bg-surface-container-high'}
    `}>
      {icon}
      <span className="font-inter text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}

function TopNavLink({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
      h-16 flex items-center px-1 font-bold tracking-tight transition-all relative whitespace-nowrap
      ${active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}
    `}>
      {label}
      {active && <motion.div layoutId="topNav" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
      {children}
    </label>
  );
}

function Input({ value, onChange, type = "text", className = "", placeholder = "" }: { value: string | number, onChange: (v: string) => void, type?: string, className?: string, placeholder?: string }) {
  return (
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-14 bg-surface-container-low border-none rounded-lg px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  );
}
