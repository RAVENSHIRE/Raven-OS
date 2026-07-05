import React, { useEffect, useState } from "react";

const silverRavenAscii = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣷⣄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠋⠀⠀⠙⢿⣿⣆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡏⠀⢀⣤⣤⡀⠀⢹⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⢰⣿⣿⣿⣿⡆⢸⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣆⠀⠙⠿⠿⠋⢀⣾⡿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣤⣤⣶⡿⠋
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉

██████╗  █████╗ ██╗   ██╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██║   ██║██╔════╝████╗  ██║
██████╔╝███████║██║   ██║█████╗  ██╔██╗ ██║
██╔══██╗██╔══██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
██║  ██║██║  ██║ ╚████╔╝ ███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝

               ██████╗ ███████╗
               ██╔═══██╗██╔════╝
               ██║   ██║███████╗
               ██║   ██║╚════██║
               ╚██████╔╝███████║
                ╚═════╝ ╚══════╝
`.trim();

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootSequence = [
    "RAVEN OS v1.0",
    "Initializing...",
    "Loading kernel... OK",
    "Mounting filesystem... OK",
    "Starting desktop...",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines((prev) => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-start justify-start overflow-auto bg-black p-6 font-mono text-lg text-[#00FF00] selection:bg-transparent">
      <pre className="mb-5 whitespace-pre leading-[1.05] text-[0.8rem] sm:text-[0.9rem]">{silverRavenAscii}</pre>

      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      {lines.length < bootSequence.length && <div className="animate-pulse">_</div>}
    </div>
  );
}
