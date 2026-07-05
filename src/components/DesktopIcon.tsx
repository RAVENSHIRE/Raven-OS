import { useMemo, useState } from "react";

type DesktopIconProps = {
  label: string;
  iconSrc: string;
  iconAlt: string;
  onOpen: () => void;
  disabled?: boolean;
  highlight?: boolean;
};

export default function DesktopIcon({ label, iconSrc, iconAlt, onOpen, disabled, highlight }: DesktopIconProps) {
  const [iconFailed, setIconFailed] = useState(false);
  const fallbackGlyph = useMemo(() => label.trim().charAt(0).toUpperCase(), [label]);

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
        {iconFailed ? (
          <span className="desktop-icon-fallback">{fallbackGlyph || "?"}</span>
        ) : (
          <img
            className="desktop-icon-image"
            src={iconSrc}
            alt={iconAlt}
            width={32}
            height={32}
            draggable={false}
            onError={() => setIconFailed(true)}
          />
        )}
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
