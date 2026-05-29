import DesktopIcon from "./DesktopIcon";
import { useOS } from "../context/OSContext";
import type { WindowId } from "../context/OSContext";

const windowsExplorerIcon = new URL("../../node_modules/@react95/icons/png/WindowsExplorer_32x32_4.png", import.meta.url).href;
const joyIcon = new URL("../../node_modules/@react95/icons/png/Joy102_32x32_4.png", import.meta.url).href;
const globeIcon = new URL("../../node_modules/@react95/icons/png/Globe_32x32_4.png", import.meta.url).href;
const notepadIcon = new URL("../../node_modules/@react95/icons/png/Notepad_32x32_4.png", import.meta.url).href;
const infoIcon = new URL("../../node_modules/@react95/icons/png/InfoBubble_32x32_4.png", import.meta.url).href;
const floppyIcon = new URL("../../node_modules/@react95/icons/png/ReaderDisket_32x32_4.png", import.meta.url).href;
const gameIcon = new URL("../../node_modules/@react95/icons/png/Freecell1_32x32_4.png", import.meta.url).href;

type IconDef = {
  id: WindowId;
  label: string;
  iconSrc: string;
  iconAlt: string;
};

const ICONS: IconDef[] = [
  { id: "showroom", label: "Showroom", iconSrc: windowsExplorerIcon, iconAlt: "Windows Explorer" },
  { id: "tictactoe", label: "Tic-Tac-Toe", iconSrc: gameIcon, iconAlt: "Game" },
  { id: "stadtlandfluss", label: "Stadt-Land-Fluss", iconSrc: globeIcon, iconAlt: "Globe" },
  { id: "spacefighter", label: "Space Fighter", iconSrc: joyIcon, iconAlt: "Joystick" },
  { id: "hangman", label: "Hangman", iconSrc: notepadIcon, iconAlt: "Notepad" },
  { id: "credits", label: "Credits", iconSrc: infoIcon, iconAlt: "Info" },
];

export default function Desktop() {
  const { openWindow, floppyUnlocked } = useOS();

  return (
    <aside className="desktop-sidebar" aria-label="Desktop icons">
      {ICONS.map((item) => (
        <DesktopIcon
          key={item.id}
          label={item.label}
          iconSrc={item.iconSrc}
          iconAlt={item.iconAlt}
          onOpen={() => openWindow(item.id)}
        />
      ))}

      <DesktopIcon
        label={floppyUnlocked ? "Floppy Disk" : "Floppy Disk (Locked)"}
        iconSrc={floppyIcon}
        iconAlt="Floppy disk"
        disabled={!floppyUnlocked}
        highlight={floppyUnlocked}
        onOpen={() => openWindow("floppy")}
      />
    </aside>
  );
}
