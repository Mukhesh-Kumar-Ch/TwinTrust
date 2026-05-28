function MetricCard({ label, value, helperText, className = "", valueClassName = "text-white" }) {
  return (
    <div className={`rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/20 ${className}`}>
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${valueClassName}`}>{value}</p>
      {helperText ? <p className="mt-2 text-sm text-slate-400">{helperText}</p> : null}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Dashboard({ trustScore = 0, riskLevel = "LOW", behavioralData, onBackToLogin }) {
  const keyboardMetrics = behavioralData?.keyboardMetrics || {};
  const deviationAnalysis = behavioralData?.deviationAnalysis;
  const trustMetrics = behavioralData?.trustMetrics || {};

  const riskStyles = {
    LOW: {
      trustBorder: "border-emerald-500/40",
      trustGlow: "shadow-emerald-500/10",
      trustValue: "text-emerald-300",
      badge: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    },
    MEDIUM: {
      trustBorder: "border-amber-500/40",
      trustGlow: "shadow-amber-500/10",
      trustValue: "text-amber-300",
      badge: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    },
    HIGH: {
      trustBorder: "border-rose-500/40",
      trustGlow: "shadow-rose-500/10",
      trustValue: "text-rose-300",
      badge: "border-rose-500/30 bg-rose-500/15 text-rose-300",
    },
  };

  const activeRiskStyle = riskStyles[riskLevel] || riskStyles.LOW;
  const securityMessages = {
    LOW: ["Behavior verified", "Access secure"],
    MEDIUM: ["Suspicious behavioral deviation detected"],
    HIGH: ["Potential account takeover risk"],
  };

  const activeSecurityMessages = securityMessages[riskLevel] || securityMessages.LOW;

  const mockDeviationAnalysis = {
    totalTypingTime: 120,
    averageKeyLatency: 18,
    backspaceCount: 1,
    hesitationTime: 65,
  };

  const activeDeviationAnalysis = deviationAnalysis || mockDeviationAnalysis;
  const securityAlerts = [];

  if (riskLevel === "HIGH") {
    securityAlerts.push("High risk detected. Require step-up verification.");
  } else if (riskLevel === "MEDIUM") {
    securityAlerts.push("Moderate risk detected. Monitor session closely.");
  } else {
    securityAlerts.push("Behavior matches the stored digital twin profile.");
  }

  if ((keyboardMetrics.backspaceCount || 0) > 3) {
    securityAlerts.push("Multiple backspaces detected during password entry.");
  }

  const showAdaptiveAuthenticationBanner = trustScore < 40;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#020617_100%)] px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {showAdaptiveAuthenticationBanner ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100 shadow-lg shadow-amber-500/10">
            Adaptive Authentication Recommended
          </div>
        ) : null}

        <header className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">TwinTrust Security Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Behavioral Digital Twin Overview</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Prototype trust monitoring for password behavior, session risk, and behavioral deviation analysis.
              </p>
            </div>

            {onBackToLogin ? (
              <button
                type="button"
                onClick={onBackToLogin}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-500 hover:text-cyan-300"
              >
                Back to Login
              </button>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] ${activeRiskStyle.badge}`}>
              Security Status: {riskLevel}
            </span>
            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              {activeSecurityMessages.map((message) => (
                <span key={message} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                  {message}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Trust Score"
            value={`${trustScore}/100`}
            helperText={trustMetrics?.explanation || "Dynamic trust generated from behavior metrics."}
            className={`${activeRiskStyle.trustBorder} ${activeRiskStyle.trustGlow}`}
            valueClassName={activeRiskStyle.trustValue}
          />
          <MetricCard
            label="Risk Level"
            value={riskLevel}
            helperText="Low, medium, or high confidence based on deviation analysis."
          />
          <MetricCard
            label="Login Timestamp"
            value={behavioralData?.sessionMetrics?.loginTimestamp ? new Date(behavioralData.sessionMetrics.loginTimestamp).toLocaleString() : "Not available"}
            helperText="Most recent behavioral session capture."
          />
          <MetricCard
            label="Failed Attempts"
            value={behavioralData?.sessionMetrics?.failedLoginAttempts ?? 0}
            helperText="Prototype session counter."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Behavioral Metrics">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Typing Time"
                value={`${keyboardMetrics.totalTypingTime ?? 0} ms`}
                helperText="Time spent typing the password."
              />
              <MetricCard
                label="Key Latency"
                value={`${keyboardMetrics.averageKeyLatency ?? 0} ms`}
                helperText="Average delay between key presses."
              />
              <MetricCard
                label="Backspace Count"
                value={keyboardMetrics.backspaceCount ?? 0}
                helperText="How often backspace was used."
              />
              <MetricCard
                label="Hesitation Time"
                value={`${keyboardMetrics.hesitationTime ?? 0} ms`}
                helperText="Delay before typing started."
              />
            </div>
          </SectionCard>

          <SectionCard title="Deviation Analysis">
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                <span>Typing Time Deviation</span>
                <span className="font-semibold text-cyan-300">{activeDeviationAnalysis.totalTypingTime} ms</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                <span>Average Key Latency Deviation</span>
                <span className="font-semibold text-cyan-300">{activeDeviationAnalysis.averageKeyLatency} ms</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                <span>Backspace Count Deviation</span>
                <span className="font-semibold text-cyan-300">{activeDeviationAnalysis.backspaceCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                <span>Hesitation Time Deviation</span>
                <span className="font-semibold text-cyan-300">{activeDeviationAnalysis.hesitationTime} ms</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Security Alerts">
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {alert}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default Dashboard;