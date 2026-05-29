type DesktopIconProps = {
  label: string;
  iconSrc: string;
  iconAlt: string;
  onOpen: () => void;
  disabled?: boolean;
  highlight?: boolean;
};

export default function DesktopIcon({ label, iconSrc, iconAlt, onOpen, disabled, highlight }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`desktop-icon ${disabled ? "is-locked" : ""} ${highlight ? "is-unlocked" : ""}`.trim()}
      onClick={() => {
        if (!disabled) {
          onOpen();
        }
      }}
      onDoubleClick={() => {
        if (!disabled) {
          onOpen();
        }
      }}
      disabled={disabled}
      title={disabled ? "Locked: Beat all games" : label}
    >
      <span className="desktop-icon-glyph" aria-hidden="true">
        <img className="desktop-icon-image" src={iconSrc} alt={iconAlt} width={32} height={32} draggable={false} />
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
