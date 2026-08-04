import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Brain, Activity } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/symptom-checker")({
  head: () => ({ meta: [{ title: "AI Symptom Checker — DoctorFind AI" }] }),
  component: SymptomCheckerPage,
});

type Msg = { role: "user" | "ai"; text: string; suggestions?: string[]; specialist?: string };

const suggestions = ["Headache & fever", "Chest pain", "Skin rash", "Stomach ache", "Persistent cough"];

const replies: Record<string, { text: string; specialist: string }> = {
  "headache": { text: "Your symptoms suggest possible viral infection or migraine. Monitor for 24h, hydrate, rest. If fever persists above 102°F, consult immediately.", specialist: "General Physician" },
  "chest": { text: "Chest pain may indicate cardiac stress. Please consult a cardiologist urgently if accompanied by shortness of breath, sweating, or arm pain.", specialist: "Cardiologist" },
  "skin": { text: "Could be contact dermatitis or allergic reaction. Avoid known triggers, apply cool compress. Persistent rashes warrant dermatologist review.", specialist: "Dermatologist" },
  "stomach": { text: "Likely indigestion or mild gastritis. Try light meals, avoid spicy food. Persistent pain >48h needs gastroenterologist consultation.", specialist: "Gastroenterologist" },
  "cough": { text: "Persistent cough may indicate respiratory infection or asthma. Stay hydrated, avoid irritants. Consult a pulmonologist if it lasts >2 weeks.", specialist: "Pulmonologist" },
};

function reply(input: string): { text: string; specialist: string } {
  const key = Object.keys(replies).find((k) => input.toLowerCase().includes(k));
  return key ? replies[key] : { text: "Thanks for sharing. Based on initial input, I recommend booking with a general physician for proper evaluation.", specialist: "General Physician" };
}

function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hello! I'm your AI health assistant. Describe your symptoms and I'll help suggest the right specialist.", suggestions },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const r = reply(text);
      setMessages((m) => [...m, { role: "ai", text: r.text, specialist: r.specialist }]);
      setTyping(false);
    }, 1400);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-4xl px-6 pt-32 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 text-xs font-semibold text-teal">
            <Sparkles className="h-3.5 w-3.5" /> AI POWERED
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">AI <span className="text-gradient">Symptom Checker</span></h1>
          <p className="mt-3 text-muted-foreground">Describe your symptoms — get instant insights and specialist recommendations.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass mt-10 flex h-[600px] flex-col rounded-3xl">
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal to-[oklch(0.55_0.18_260)] text-white"><Brain className="h-5 w-5" /></div>
            <div>
              <div className="font-display font-bold">AI Assistant</div>
              <div className="flex items-center gap-1 text-xs text-teal"><span className="h-1.5 w-1.5 rounded-full bg-teal" />Online</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-to-br from-teal to-[oklch(0.55_0.18_260)] text-white" : "bg-card border"}`}>
                    {m.text}
                    {m.specialist && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border bg-background p-3 text-foreground">
                        <Activity className="h-4 w-4 text-teal" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Recommended specialist</div>
                          <div className="font-semibold">{m.specialist}</div>
                        </div>
                        <button className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">Find</button>
                      </div>
                    )}
                    {m.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.suggestions.map((s) => (
                          <button key={s} onClick={() => send(s)} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs hover:bg-white/10">
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="rounded-2xl border bg-card px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="h-2 w-2 rounded-full bg-teal" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your symptoms..." className="flex-1 rounded-full border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal/40" />
              <button type="submit" className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] text-white shadow"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
