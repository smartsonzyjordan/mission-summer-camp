import { planner } from "@/data/content";

export function PlannerScreen() {
  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel rounded-[1.8rem] p-4 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Mission Timeline</p>
        <h1 className="text-3xl font-black uppercase text-amber-300">Today&apos;s Flight Plan</h1>
      </section>
      <section className="panel rounded-[1.8rem] p-4">
        <div className="space-y-1">
          {planner.map((item, index) => (
            <div key={`${item.time}-${item.title}`} className="grid grid-cols-[4.8rem_1.5rem_1fr] gap-3">
              <div className="pt-3 text-right text-sm font-black text-cyan-300">{item.time}</div>
              <div className="flex flex-col items-center">
                <div className={`mt-4 h-4 w-4 rounded-full ${item.mode === "sleep" ? "bg-blue-400" : "bg-violet-400"}`} />
                {index < planner.length - 1 ? <div className="min-h-12 w-px flex-1 bg-violet-400/30" /> : null}
              </div>
              <div className={`mb-3 rounded-2xl border p-3 ${item.mode === "sleep" ? "border-blue-300/30 bg-blue-500/10" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center gap-3 text-sm font-black text-white">
                  <i className={`ti ${item.icon} text-xl text-amber-300`} />
                  {item.title}
                </div>
                <div className="mt-1 text-xs font-bold text-slate-400">{item.purpose}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
