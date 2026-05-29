import type { MouseEvent } from "react";

type StartMenuProps = {
  onShutdown: () => void;
  onReboot: () => void;
  onClose: () => void;
};

const computerIcon = new URL("../../node_modules/@react95/icons/png/Computer3_16x16_4.png", import.meta.url).href;
const oldComputerIcon = new URL("../../node_modules/@react95/icons/png/Computer_16x16_4.png", import.meta.url).href;

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
      className="absolute bottom-[44px] left-0 z-[1001] flex min-w-[240px] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#C0C0C0] shadow-[2px_2px_0_#000]"
      onClick={handleContainerClick}
      role="menu"
      aria-label="Start menu"
    >
      <div className="relative w-10 bg-[#808080]">
        <span className="absolute bottom-2 left-1 -rotate-90 origin-bottom-left whitespace-nowrap text-sm font-bold tracking-wider text-[#f1f1f1]">
          RavenOS
        </span>
      </div>

      <div className="flex w-full flex-col bg-[#C0C0C0]">
        <button
          type="button"
          className="mt-1 flex h-9 items-center gap-2 px-3 text-left text-[15px] text-black hover:bg-[#0000A8] hover:text-white"
          onClick={handleShutdown}
          role="menuitem"
        >
          <img src={computerIcon} alt="Computer icon" className="h-4 w-4" draggable={false} />
          <span>
            Sh<u>u</u>t down...
          </span>
        </button>

        <button
          type="button"
          className="mb-1 flex h-9 items-center gap-2 px-3 text-left text-[15px] text-black hover:bg-[#0000A8] hover:text-white"
          onClick={handleReboot}
          role="menuitem"
        >
          <img src={oldComputerIcon} alt="Old computer icon" className="h-4 w-4" draggable={false} />
          <span>
            Reboot
          </span>
        </button>
      </div>
    </div>
  );
}
