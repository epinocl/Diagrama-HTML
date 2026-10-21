import React from 'react';
import { useCadStore } from '../store/useCadStore';
import { X, Plus, Cpu } from 'lucide-react';

interface SymbolDef {
  id: string;
  name: string;
  category: 'fuerza' | 'control' | 'plc' | 'sensores' | 'neumatica' | 'bornas';
  desc: string;
}

const IEC_CATALOG: SymbolDef[] = [
  { id: 'disyuntor_diferencial', name: 'Disyuntor con Diferencial', category: 'fuerza', desc: 'Interruptor termomagnético bifásico/trifásico' },
  { id: 'contactor_potencia', name: 'Contactor de Potencia', category: 'fuerza', desc: 'Contactor tripular para arranque de motores' },
  { id: 'fuente_poder_24v', name: 'Fuente Switching 24VDC', category: 'fuerza', desc: 'Alimentación primaria para control y sensores' },
  { id: 'motor_trifasico_pe', name: 'Motor Asíncrono Trifásico', category: 'fuerza', desc: 'Motor 380V con terminal de tierra PE' },
  { id: 'variador_frecuencia_vdf', name: 'Variador de Frecuencia (VDF)', category: 'fuerza', desc: 'Convertidor de frecuencia para control de velocidad' },
  { id: 'optocupla_bobina', name: 'Relé / Optoacoplador', category: 'control', desc: 'Bobina de interfase galvánica 24VDC' },
  { id: 'in_out_modulo_plc', name: 'Módulo PLC E/S', category: 'plc', desc: 'Entradas/Salidas digitales Siemens S7 / Phoenix' },
  { id: 'bornera_paso', name: 'Bornera de Interconexión', category: 'bornas', desc: 'Regleta de paso en riel DIN' },
  { id: 'encoder_electrico', name: 'Sensor Encoder Incremental', category: 'sensores', desc: 'Sensor de posición y conteo de alta velocidad' },
  { id: 'bobina_electrovalvula', name: 'Electroválvula Neumática', category: 'neumatica', desc: 'Actuador solenoide 24VDC para cilindros' }
];

export const SymbolPalette: React.FC = () => {
  const { isPaletteOpen, togglePalette, insertIecSymbol, theme } = useCadStore();

  if (!isPaletteOpen) return null;

  const isDark = theme === 'dark_autocad';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e2f50' : '#e2e8f0';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: '64px',
      width: '360px',
      maxHeight: '80vh',
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="#38bdf8" />
          <span style={{ fontWeight: 700, fontSize: '13px', color: textColor }}>
            Biblioteca de Simbología IEC 60617
          </span>
        </div>
        <button
          onClick={togglePalette}
          style={{ background: 'transparent', border: 'none', color: mutedColor, cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Lista de Símbolos */}
      <div style={{ padding: '12px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {IEC_CATALOG.map((sym) => (
          <div
            key={sym.id}
            onClick={() => insertIecSymbol(sym.id, sym.name, sym.category)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#38bdf8';
              e.currentTarget.style.backgroundColor = isDark ? '#1a2942' : '#f0f9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = borderColor;
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc';
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '13px', color: textColor }}>
                {sym.name}
              </strong>
              <span style={{ fontSize: '11px', color: mutedColor, display: 'block', marginTop: '2px' }}>
                {sym.desc}
              </span>
            </div>
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Insertar en el plano"
            >
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
