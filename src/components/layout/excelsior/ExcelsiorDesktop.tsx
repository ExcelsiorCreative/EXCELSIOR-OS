import { useEffect, useState, type FormEvent } from "react";
import { ArrowUp, ArrowUpRight, Books, CalendarBlank, Camera, ChatCircle, Code, Folder, GearSix, Globe, House, MagnifyingGlass, MusicNotes, Note, PaintBrush, Plus, SquaresFour, Terminal, VideoCamera } from "@phosphor-icons/react";
import { appNames, type AppId } from "@/config/appRegistryData";
import { useLaunchApp } from "@/hooks/useLaunchApp";
import { useAppStore } from "@/stores/useAppStore";
import { toggleSpotlightSearch } from "@/utils/appEventBus";
import "./excelsior-desktop.css";

const shortcuts = [
  { id: "finder", Icon: Folder }, { id: "textedit", Icon: Note },
  { id: "chats", Icon: ChatCircle }, { id: "ipod", Icon: MusicNotes },
  { id: "terminal", Icon: Terminal }, { id: "paint", Icon: PaintBrush },
  { id: "internet-explorer", Icon: Globe }, { id: "calendar", Icon: CalendarBlank },
  { id: "videos", Icon: VideoCamera }, { id: "preview", Icon: SquaresFour },
  { id: "photo-booth", Icon: Camera }, { id: "synth", Icon: MusicNotes },
  { id: "applet-viewer", Icon: Code }, { id: "books", Icon: Books },
] satisfies { id: AppId; Icon: typeof Folder }[];

/** Native app launchers arranged around the user's outline desktop concept. */
export function ExcelsiorDesktop({ onClassic }: { onClassic: () => void }) {
  const launch = useLaunchApp();
  const instances = useAppStore((state) => state.instances);
  const [message, setMessage] = useState("");
  const [panel, setPanel] = useState<"workspace" | "apps">("workspace");
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (Object.values(useAppStore.getState().instances).some((instance) => instance.isOpen && !instance.isMinimized)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleSpotlightSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const open = Object.values(instances).filter((instance) => instance.isOpen);
  const showDesktop = () => {
    const store = useAppStore.getState();
    Object.values(store.instances).filter((instance) => instance.isOpen && !instance.isMinimized)
      .forEach((instance) => store.minimizeInstance(instance.instanceId));
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    launch("chats", { initialData: { prefillMessage: message.trim(), prefillRequestId: crypto.randomUUID(), autoSend: false } });
    setMessage("");
  };
  const rail = (side: "left" | "right", start: number) => (
    <nav className={`ex-rail ex-rail--${side}`} aria-label={side === "left" ? "Everyday apps" : "Creative apps"}>
      {shortcuts.slice(start, start + 7).map(({ id, Icon }) => (
        <button key={id} type="button" className="ex-app" title={appNames[id]} aria-label={`Open ${appNames[id]}`} onClick={() => launch(id)}>
          <Icon size={30} weight="light" aria-hidden="true" />
          {open.some((instance) => instance.appId === id) && <span className="ex-running" />}
          <span className="ex-tooltip">{appNames[id]}</span>
        </button>
      ))}
    </nav>
  );
  return (
    <section className="ex-desktop" aria-label="EXCELSIOR OS desktop">
      <div className="ex-canvas" />
      <div className="ex-brand">EXCELSIOR <span>OS</span></div>
      {rail("left", 0)}
      {rail("right", 7)}
      <div className="ex-workspace">
        <header className="ex-searchbar">
          <button type="button" title="Settings" aria-label="Open settings" onClick={() => launch("control-panels")}><GearSix size={23} weight="light" /></button>
          <button type="button" className="ex-search" onClick={() => toggleSpotlightSearch()}><MagnifyingGlass size={20} weight="light" /><span>Search apps, files, and more</span><kbd>Ctrl / ⌘ K</kbd></button>
          <button type="button" title="Show desktop" aria-label="Minimize windows and show desktop" onClick={showDesktop}><House size={22} weight="light" /></button>
        </header>
        <div className="ex-panels">
          <aside className="ex-wing ex-wing--left">
            <div className="ex-window-title"><Folder size={14} /> workspace / files</div><div className="ex-panel-label">YOUR SPACE <ArrowUpRight size={16} /></div>
            <button type="button" className="ex-folder" onClick={() => launch("finder", { initialPath: "/Documents" })}><Folder size={54} weight="thin" /><span>Documents</span><ArrowUpRight size={17} /></button>
            <div className="ex-wing-divider">MAKE SOMETHING</div>
            <button type="button" className="ex-row" onClick={() => launch("textedit")}><Note size={20} /> New document <Plus size={17} /></button>
            <button type="button" className="ex-row" onClick={() => launch("paint")}><PaintBrush size={20} /> Open canvas <ArrowUpRight size={17} /></button>
          </aside>
          <main className="ex-center"><div className="ex-window-title"><SquaresFour size={14} /> EXCELSIOR / studio <span>Personal workspace</span></div>
            <div className="ex-toolbar">
              <span className="ex-small-mark">✳</span><h1>Your workspace</h1>
              <div className="ex-segment" aria-label="Workspace view">
                <button type="button" aria-pressed={panel === "workspace"} onClick={() => setPanel("workspace")}>Studio</button>
                <button type="button" aria-pressed={panel === "apps"} onClick={() => setPanel("apps")}>Apps</button>
              </div>
            </div>
            <div className="ex-art-panel">
              {panel === "workspace" ? <>
                <svg className="ex-art" viewBox="0 0 560 360" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                  <g stroke="currentColor" strokeWidth="1.4">
                    {[0, 15, 30, 45].map((offset) => <path key={offset} transform={`translate(${offset} ${offset})`} d="M-90 310 205 15H350L480 145 337 288H235L160 360" />)}
                    {[0, 16, 32, 48].map((offset) => <path key={offset} transform={`translate(${offset} ${offset})`} d="M60 360V156H210L315 51 413 149 315 247 217 149 119 247 232 360" />)}
                    <path d="m280 131 65 65-65 65-65-65zM0 40h24m-12-12v24M480 290h45m-23-23v46M86 82l7-20 7 20 20 7-20 7-7 20-7-20-20-7zM466 57l4-14 4 14 14 4-14 4-4 14-4-14-14-4zM83 291l3-10 3 10 10 3-10 3-3 10-3-10-10-3z" />
                  </g>
                </svg>
                <div className="ex-art-caption"><span>A little space for a big idea.</span><button type="button" onClick={() => launch("applet-viewer")} aria-label="Explore apps"><ArrowUpRight size={23} weight="light" /></button></div>
              </> : <div className="ex-app-grid">{Object.entries(appNames).filter(([id]) => id !== "admin").map(([id, name]) => <button key={id} type="button" onClick={() => launch(id as AppId)}>{name}<ArrowUpRight size={15} /></button>)}</div>}
            </div>
          </main>
          <aside className="ex-wing ex-wing--right">
            <div className="ex-window-title"><MusicNotes size={14} /> system / media</div><div className="ex-panel-label">IN YOUR ORBIT <span>{String(open.length).padStart(2, "0")}</span></div>
            <div className="ex-session-list">{open.length ? open.map((instance) => <button type="button" key={instance.instanceId} onClick={() => { const store = useAppStore.getState(); store.restoreInstance(instance.instanceId); store.bringInstanceToForeground(instance.instanceId); }}><span>{instance.title || appNames[instance.appId as AppId] || instance.appId}</span><ArrowUpRight size={17} /></button>) : <div className="ex-empty"><SquaresFour size={46} weight="thin" /><p>A fresh start.</p><span>Your open apps appear here.</span></div>}</div>
            <div className="ex-wing-divider">A CHANGE OF PACE</div>
            <button type="button" className="ex-row" onClick={() => launch("ipod")}><MusicNotes size={20} /> Listen to music <ArrowUpRight size={17} /></button>
          </aside>
        </div>
      </div>
      <form className="ex-composer" onSubmit={submit}>
        <label className="ex-sr-only" htmlFor="ex-message">Message your assistant</label>
        <textarea id="ex-message" rows={2} placeholder="Message your assistant…" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
        <div className="ex-composer-bottom"><button type="button" className="ex-round" title="Open files" aria-label="Open files" onClick={() => launch("finder")}><Plus size={23} weight="light" /></button><span className="ex-chip">Continue in Chats <ArrowUpRight size={14} /></span><button type="submit" className="ex-round ex-send" disabled={!message.trim()} title="Continue in Chats" aria-label="Continue with this message in Chats"><ArrowUp size={23} weight="light" /></button></div>
      </form>
      <button type="button" className="ex-classic" onClick={onClassic}>Classic desktop ↗</button>
    </section>
  );
}
