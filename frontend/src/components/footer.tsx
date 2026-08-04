import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-[var(--color-navy-deep)] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-[oklch(0.55_0.18_260)]">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">DoctorFind AI</span>
          </div>
          <p className="mt-4 text-sm text-white/60">Healthcare reimagined through intelligence. Trusted by millions of patients and providers.</p>
        </div>
        {[
          { h: "Platform", l: ["Find Doctors", "Hospitals", "Pharmacies", "AI Checker"] },
          { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
          { h: "Legal", l: ["Privacy", "Terms", "HIPAA", "Security"] },
        ].map((c) => (
          <div key={c.h}>
            <h4 className="text-sm font-semibold tracking-wide text-white/90">{c.h}</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {c.l.map((i) => <li key={i} className="hover:text-white transition cursor-pointer">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © 2025 DoctorFind AI. All rights reserved.
      </div>
    </footer>
  );
}