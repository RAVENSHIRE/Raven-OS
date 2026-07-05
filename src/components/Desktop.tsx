import DesktopIcon from "./DesktopIcon";
import { useOS } from "../context/OSContext";
import type { WindowId } from "../context/OSContext";
import windowsExplorerIcon from "../assets/icons/WindowsExplorer_32x32_4.png";
import joyIcon from "../assets/icons/Joy102_32x32_4.png";
import globeIcon from "../assets/icons/Globe_32x32_4.png";
import notepadIcon from "../assets/icons/Notepad_32x32_4.png";
import infoIcon from "../assets/icons/InfoBubble_32x32_4.png";
import floppyIcon from "../assets/icons/ReaderDisket_32x32_4.png";
import gameIcon from "../assets/icons/Winmine1_32x32_4.png";

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
