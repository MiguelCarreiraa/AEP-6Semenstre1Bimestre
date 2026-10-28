import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { useStore, type Sheet } from './store';
import { TabBar, type Tab } from './components/TabBar';
import { Scrim } from './components/Sheet';
import { Button, EmptyState } from './components/ui';
import { WifiOffIcon } from './components/Icons';
import { HojeScreen } from './screens/HojeScreen';
import { PacientesScreen } from './screens/PacientesScreen';
import { NovoPacienteSheet } from './sheets/NovoPacienteSheet';
import { NovoMedicamentoSheet } from './sheets/NovoMedicamentoSheet';
import { MedicamentoSheet } from './sheets/MedicamentoSheet';
import { PacienteSheet } from './sheets/PacienteSheet';

const sheetKey = (s: NonNullable<Sheet>) => s.type + ('id' in s ? s.id : '');

export default function App() {
  const status = useStore((s) => s.status);
  const load = useStore((s) => s.load);
  const sheet = useStore((s) => s.sheet);
  const openSheet = useStore((s) => s.openSheet);
  const [tab, setTab] = useState<Tab>('hoje');

  useEffect(() => {
    load();
    // Atualiza ao voltar para o app (outro cuidador pode ter registrado uma dose).
    const onFocus = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onFocus);
    return () => document.removeEventListener('visibilitychange', onFocus);
  }, [load]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && openSheet(null);
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('sheet-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('sheet-open');
    };
  }, [sheet, openSheet]);

  const close = () => openSheet(null);

  return (
    <>
      <main className="app" inert={sheet ? true : undefined}>
        {status === 'loading' ? (
          <Skeleton />
        ) : status === 'error' ? (
          <EmptyState
            icon={<WifiOffIcon width={40} height={40} />}
            title="Sem conexão com a API"
            message="Verifique se o backend Spring está rodando em localhost:8080 e o MongoDB está ativo."
            action={<Button onClick={load}>Tentar novamente</Button>}
          />
        ) : tab === 'hoje' ? (
          <HojeScreen />
        ) : (
          <PacientesScreen />
        )}
      </main>

      {status === 'ready' && <TabBar value={tab} onChange={setTab} />}

      <AnimatePresence>{sheet && <Scrim key="scrim" onClick={close} />}</AnimatePresence>
      <AnimatePresence>
        {sheet && (
          <SheetHost key={sheetKey(sheet)} sheet={sheet} onClose={close} />
        )}
      </AnimatePresence>

      <Toaster position="top-center" theme="system" offset={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }} />
    </>
  );
}

function SheetHost({ sheet, onClose }: { sheet: NonNullable<Sheet>; onClose: () => void }) {
  switch (sheet.type) {
    case 'novo-paciente':
      return <NovoPacienteSheet onClose={onClose} />;
    case 'novo-medicamento':
      return <NovoMedicamentoSheet pacienteId={sheet.pacienteId} onClose={onClose} />;
    case 'medicamento':
      return <MedicamentoSheet id={sheet.id} onClose={onClose} />;
    case 'paciente':
      return <PacienteSheet id={sheet.id} onClose={onClose} />;
  }
}

function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Carregando">
      <div className="sk sk-title" />
      <div className="sk sk-card" />
      <div className="sk sk-list" />
    </div>
  );
}
