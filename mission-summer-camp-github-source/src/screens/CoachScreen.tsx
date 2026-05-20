"use client";

import { useRef, useState } from "react";
import { useAppState } from "@/context/AppState";
import { timeLabel } from "@/utils/format";
import { VisualAsset } from "@/components/VisualAsset";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function coachReply(input: string, stars: number, nextMission?: string) {
  const text = input.toLowerCase();
  if (text.includes("plan") || text.includes("next")) {
    return `Your best next move is ${nextMission ?? "a short reading quest"}. Finish one mission, drink water, then launch the next one.`;
  }
  if (text.includes("star")) {
    return `You have ${stars} stars. That is real progress, Cadet. Keep stacking small wins.`;
  }
  if (text.includes("tired") || text.includes("sleep")) {
    return "Astronauts recharge on purpose. Take the rest seriously, then come back stronger.";
  }
  if (text.includes("math")) {
    return "Maths is navigation training. Try three problems first, then the rest feels much easier.";
  }
  const replies = [
    "I am proud of your launch energy. Pick one mission and make it tiny enough to start right now.",
    "Space heroes do not need a perfect day. They need one brave next step.",
    "You are closer than you think. Complete the next mission and I will be ready with a celebration.",
    "Try the two-minute launch: open the mission, start the first piece, and momentum will help."
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

export function CoachScreen() {
  const { state, dispatch } = useAppState();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextMission = state.missions.find((mission) => !mission.completed)?.title;

  const send = (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_CHAT", message: { id: uid(), role: "child", text: trimmed, createdAt: new Date().toISOString() } });
    setMessage("");
    window.setTimeout(() => {
      dispatch({
        type: "ADD_CHAT",
        message: { id: uid(), role: "coach", text: coachReply(trimmed, state.stars, nextMission), createdAt: new Date().toISOString() }
      });
    }, 450);
  };

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col px-4 pb-28 pt-5">
      <section className="mb-3 flex items-center gap-3 rounded-[1.8rem] border border-cyan-300/30 bg-cyan-300/10 p-3">
        <VisualAsset src="/assets/astronaut.svg" alt="Cosmo coach" className="h-20 w-20 rounded-3xl" />
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-cyan-300">AI Space Coach</p>
          <h1 className="text-2xl font-black uppercase text-white">Cosmo is online</h1>
        </div>
      </section>

      <section className="panel min-h-0 flex-1 overflow-y-auto rounded-[1.8rem] p-3">
        <div className="space-y-3">
          {state.chatHistory.map((chat) => (
            <div key={chat.id} className={`flex ${chat.role === "child" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-lg ${chat.role === "child" ? "bg-violet-600 text-white" : "bg-slate-900/90 text-white ring-1 ring-white/10"}`}>
                <div>{chat.text}</div>
                <div className="mt-1 text-right text-[0.65rem] text-slate-300">{timeLabel(chat.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3 flex flex-wrap gap-2">
        {["What's my plan?", "Motivate me", "How many stars?", "What is next?"].map((reply) => (
          <button key={reply} type="button" className="rounded-full border border-violet-300/40 bg-violet-500/20 px-3 py-2 text-xs font-black text-violet-100" onClick={() => send(reply)}>
            {reply}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          className="h-14 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:border-cyan-300"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          placeholder="Ask Coach anything..."
        />
        <button type="button" className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-2xl shadow-glow" onClick={() => send()} aria-label="Send">
          <i className="ti ti-send" />
        </button>
      </div>
    </div>
  );
}
