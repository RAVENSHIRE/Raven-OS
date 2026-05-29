import React, { useEffect, useState } from "react";

const silverRavenAscii = [
  "  /                        _.--._ _.---.__",
  " /                       .'  .-.'__.-----.\\",
  "J                       /    `-'(__--'",
  "|                     .'       `. _ `--._",
  "|                    /            .`--'''`",
  "|                   /           .'   d88bd db od8",
  "|                _.'-.         J    dP'`Y8 YP  88",
  "L               /    J         F    88         88",
  "J             .'     F        J     Y8b.  od8  88 Y88P Y88P d8b dbd88b",
  " L           /      /         /-.    Y88b  88  88  Y8   8P d8 8b 88P '",
  "J           /      /         /   \\    `Y8b 88  88  `8. .8' 88d88 88",
  "|          /      /         J    |      88 88  88   Yb dP  88    88",
  "|         /      /          /   /   8b..8P 88  88    8.8   Y8b d 88",
  "|        /   /  /          J   /    PY88P o88oo88o   `8'    Y88Po88o",
  "|       /   /  /           /-'/",
  "|      /   / -'           /  /    Y8888b",
  "|     J   / /            / .'      88  8b",
  "|     / -'-'   /        /-'        88  8P",
  "L    (/|      |        /           88 dP    d8b Y88P Y88P d8b od8.db",
  "J     /.'   ) | _.--  /            8888    8P 8b Y8   8P d8 8b 888P8b",
  " L   //     < \\/   (  |            88 8b    d888 `8. .8' 88d88 88  88",
  " J  //       `.\\    `.`.           88 88   dP 88  Yb dP  88    88  88",
  "  \\//     ___/_\\ `-.__`.`._.----'' 88  8b  8b 88   8.8   Y8b d 88  88",
  "   `.----'      )|`.\\)  `-))\\-')  o88o o8boY8888o  `8'    Y88Po88o 88o",
  "                '   )     ')/",
  "VK                         '    ",
].join("\n");

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
