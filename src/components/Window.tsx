import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, PropsWithChildren } from "react";
import { useOS } from "../context/OSContext";
import type { WindowId, WindowPosition } from "../context/OSContext";

type DragState = {
  pointerOffsetX: number;
  pointerOffsetY: number;
} | null;

type WindowProps = PropsWithChildren<{
  id: WindowId;
  title: string;
  position: WindowPosition;
  zIndex: number;
  className?: string;
  statusText?: string;
  onClose?: () => void;
}>;

export default function Window({
  id,
  title,
  position,
  zIndex,
  className,
  statusText,
  onClose,
  children,
}: WindowProps) {
  const { focusWindow, moveWindow } = useOS();
  const [dragState, setDragState] = useState<DragState>(null);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const nextX = Math.max(132, event.clientX - dragState.pointerOffsetX);
      const nextY = Math.max(8, event.clientY - dragState.pointerOffsetY);
      moveWindow(id, { x: nextX, y: nextY });
    };

    const onPointerUp = () => {
      setDragState(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState, id, moveWindow]);

  const onTitleBarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const controls = event.target instanceof Element ? event.target.closest(".title-bar-controls") : null;
    if (controls) {
      return;
    }

    setDragState({
      pointerOffsetX: event.clientX - position.x,
      pointerOffsetY: event.clientY - position.y,
    });

    focusWindow(id);
  };

  return (
    <section
      className={`window desktop-window ${className ?? ""}`.trim()}
      style={{ left: position.x, top: position.y, zIndex }}
      onPointerDown={() => focusWindow(id)}
    >
      <div className="title-bar desktop-window-title" onPointerDown={onTitleBarPointerDown}>
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button type="button" aria-label={`Minimize ${title}`} title="Minimize">
            _
          </button>
          <button type="button" aria-label={`Maximize ${title}`} title="Maximize">
            □
          </button>
          <button type="button" aria-label={`Close ${title}`} title="Close" onClick={onClose} disabled={!onClose}>
            X
          </button>
        </div>
      </div>

      <div className="window-body desktop-window-body">{children}</div>
      <div className="window-status-bar" role="status" aria-label={`${title} status`}>
        <span>{statusText ?? "Ready"}</span>
      </div>
    </section>
  );
}
