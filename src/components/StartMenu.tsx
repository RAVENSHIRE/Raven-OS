import type { MouseEvent } from "react";
import powerOffIcon from "../../node_modules/@react95/icons/png/PowerOff_16x16_4.png";
import refreshIcon from "../../node_modules/@react95/icons/png/Refresh_16x16_4.png";

type StartMenuProps = {
  onShutdown: () => void;
  onReboot: () => void;
  onClose: () => void;
};

export default function StartMenu({ onShutdown, onReboot, onClose }: StartMenuProps) {
  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleShutdown = () => {
    onShutdown();
    onClose();
  };

  const handleReboot = () => {
    onReboot();
    onClose();
  };

  return (
    <div
      className="window start-menu"
      onClick={handleContainerClick}
      role="menu"
      aria-label="Start menu"
    >
      <div className="start-menu-brand" aria-hidden="true">
        <span className="start-menu-brand-text">
          RavenOS
        </span>
      </div>

      <div className="start-menu-actions">
        <button
          type="button"
          className="start-menu-item"
          onClick={handleShutdown}
          role="menuitem"
        >
          <img src={powerOffIcon} alt="Power icon" className="start-menu-item-icon" draggable={false} />
          <span>
            Sh<u>u</u>t down...
          </span>
        </button>

        <button
          type="button"
          className="start-menu-item"
          onClick={handleReboot}
          role="menuitem"
        >
          <img src={refreshIcon} alt="Refresh icon" className="start-menu-item-icon" draggable={false} />
          <span>
            Reboot
          </span>
        </button>
      </div>
    </div>
  );
}
