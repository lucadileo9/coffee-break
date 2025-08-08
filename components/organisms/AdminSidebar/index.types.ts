import { IconName } from '@/components/atoms/MyIcon/index.types';

/**
 * Configurazione per un elemento di navigazione dell'admin sidebar
 */
export interface AdminNavigationItem {
    href: string; // URL di destinazione
    label: string; // Etichetta da visualizzare
    icon: IconName; // Nome dell'icona MyIcon
    description: string; // Descrizione breve per il tooltip/sottotitolo
}

/**
 * Props per il componente AdminSidebar
 */
export interface AdminSidebarProps {
    className?: string; // Classe CSS personalizzata per il wrapper
    isOpen?: boolean; // Se il sidebar è aperto (per controllo esterno)
    onOpenChange?: (open: boolean) => void; // Callback quando lo stato open cambia
}
