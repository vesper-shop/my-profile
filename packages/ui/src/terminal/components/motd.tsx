import { startTransition, useEffect, useState } from "react";
import type { TerminalConfig } from "../core/config";
import { MC_ARTS } from "../data/mc-arts";

const BROWSER_VERSIONS: [name: string, pattern: RegExp][] = [
  ["Edge", /Edg\/([\d.]+)/],
  ["Opera", /OPR\/([\d.]+)/],
  ["Chrome", /Chrome\/([\d.]+)/],
  ["Firefox", /Firefox\/([\d.]+)/],
  ["Safari", /Version\/([\d.]+).*Safari\//],
];

const WINDOWS_VERSIONS: Record<string, string> = {
  "10.0": "Windows 10/11",
  "6.3": "Windows 8.1",
  "6.2": "Windows 8",
  "6.1": "Windows 7",
};

function parseBrowser(ua: string): string {
  for (const [name, pattern] of BROWSER_VERSIONS) {
    const version = pattern.exec(ua)?.[1];
    if (version) return `${name} ${version}`;
  }
  return "Unknown";
}

function parsePlatform(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  const android = /Android ([\d.]+)/.exec(ua)?.[1];
  if (android) return `Android ${android}`;
  const windows = /Windows NT ([\d.]+)/.exec(ua)?.[1];
  if (windows) return WINDOWS_VERSIONS[windows] ?? `Windows NT ${windows}`;
  const mac = /Mac OS X ([\d_]+)/.exec(ua)?.[1];
  if (mac) return `macOS ${mac.replaceAll("_", ".")}`;
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

function McArt() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    startTransition(() => {
      const art = MC_ARTS[Math.floor(Math.random() * MC_ARTS.length)];
      if (art) setLines(art);
    });
  }, []);

  const lineCounts = new Map<string, number>();

  return (
    <div className="my-2 leading-none text-base select-none ml-8">
      {lines.map((row) => {
        const nextCount = (lineCounts.get(row) ?? 0) + 1;
        lineCounts.set(row, nextCount);
        return <div key={`${row}:${nextCount}`}>{row}</div>;
      })}
    </div>
  );
}

interface MOTDProps {
  profile: TerminalConfig["profile"];
}

export function MOTD({ profile }: MOTDProps) {
  const [info, setInfo] = useState({
    dateStr: "",
    browser: "",
    platform: "",
    resolution: "",
    language: "",
    ip: "loading...",
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    startTransition(() => {
      setInfo((prev) => ({
        ...prev,
        dateStr: new Date().toUTCString().replace("GMT", "UTC"),
        browser: parseBrowser(ua),
        platform: parsePlatform(ua),
        resolution: `${screen.width} x ${screen.height}`,
        language: navigator.language,
      }));
    });
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json() as Promise<{ ip: string }>)
      .then((d) => setInfo((prev) => ({ ...prev, ip: d.ip })))
      .catch(() => setInfo((prev) => ({ ...prev, ip: "unavailable" })));
  }, []);

  const { dateStr, browser, platform, resolution, language, ip } = info;

  const link = (href: string, text: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="text-cyan-400 hover:underline"
    >
      {text}
    </a>
  );

  const { founded, contributions } = profile;

  return (
    <div className="mb-2 font-mono text-sm leading-relaxed">
      <p className="text-white">
        Welcome to{" "}
        <span className="text-green-400 font-bold">{profile.displayName}&apos;s Website</span>{" "}
        (React / Cloudflare Workers)
      </p>
      <McArt />

      <p className="text-white mb-1">
        <span className="text-green-400">$</span> /whoami
      </p>
      <div className="mb-3 ml-2 space-y-1.5 text-zinc-300">
        <p>
          <span className="text-yellow-400">👋</span> Hi! I&apos;m{" "}
          <span className="text-green-400 font-bold">{profile.displayName}</span>{" "}
          <span className="text-zinc-400">({profile.username})</span>
        </p>
        {profile.bio && <p className="text-zinc-400">{profile.bio}</p>}
        {profile.university && (
          <>
            <p>
              Junior undergrad @ <span className="text-white">{profile.university}</span>,
            </p>
            {profile.degree && (
              <p>
                studying <span className="text-cyan-400">{profile.degree}</span>.
              </p>
            )}
          </>
        )}
        {(founded.length > 0 || contributions.length > 0) && (
          <p>
            {founded.length > 0 && (
              <>
                Founded{" "}
                {founded.map((f, i) => (
                  <span key={f.url}>
                    {link(f.url, f.label)}
                    {i < founded.length - 1 ? " · " : ""}
                  </span>
                ))}
              </>
            )}
            {founded.length > 0 && contributions.length > 0 && " · contributed to "}
            {founded.length === 0 && contributions.length > 0 && "Contributed to "}
            {contributions.map((c, i) => (
              <span key={c.url}>
                {link(c.url, c.label)}
                {i < contributions.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        )}
        <p className="text-zinc-400">
          {profile.location && `📍 ${profile.location}`}
          {profile.graduationYear && ` · 🎓 ${profile.graduationYear}`}
        </p>
      </div>

      <p className="text-white mb-2">
        Visitor system information as of <span className="text-zinc-300">{dateStr}</span>
      </p>
      <div className="ml-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0.5 text-zinc-300">
        <p>
          <span className="text-zinc-400">Browser:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {browser}
        </p>
        <p>
          <span className="text-zinc-400">Platform:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {platform}
        </p>
        <p>
          <span className="text-zinc-400">Resolution:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {resolution}
        </p>
        <p>
          <span className="text-zinc-400">Language:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {language}
        </p>
        <p>
          <span className="text-zinc-400">IP Address:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {ip}
        </p>
      </div>

      <p className="mt-3 text-zinc-400">
        Type <span className="text-yellow-400">/help</span> to see available commands.
      </p>
      {profile.founded.length > 0 && (
        <p className="mt-3 text-zinc-400">
          Recommend to visit <span className="text-yellow-400">/go social</span>.
        </p>
      )}
    </div>
  );
}
