export default function ReportsTab() {
  const reports = [
    { icon: '📋', title: 'Daily readiness report — S&C coach', desc: 'CMJ · mRSI · RSI · Strength vs baseline · Active alerts', tag: 'S&C', tagClass: '', tagStyle: { background: '#FDF0F7', color: '#B3005A' }, freq: 'Daily' },
    { icon: '📊', title: 'Weekly workload report — performance staff', desc: 'ACWR · TRIMP · Movement load · HRV · Injury risk matrix', tag: 'Perf', tagClass: 'pg', freq: 'Weekly' },
    { icon: '📝', title: 'Pre-game readiness — coaching staff', desc: 'Availability RAG · Minutes recommendations · Risk flags', tag: 'Coaching', tagClass: 'pa', freq: 'Game day −1' },
    { icon: '👤', title: 'Individual athlete deep-dive', desc: 'All three sources · 4-week trend · Load, jump, strength, body comp', tag: 'All', tagClass: '', tagStyle: { background: '#F4F4F4', color: '#444' }, freq: 'On demand' },
  ];

  return (
    <div className="content">
      <div className="sec-hd">
        <div><div className="sec-title">Reports & communications</div><div className="sec-sub">Generate audience-specific performance reports</div></div>
      </div>
      <p style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: '12px' }}>Ready to generate</p>
      {reports.map((r, i) => (
        <div key={i} className="report-card" onClick={() => alert('PDF report generation connects to the backend. API endpoint: /api/reports')}>
          <div className="report-icon" style={{ background: r.tagStyle?.background || '#2A1020' }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0F0F0' }}>{r.title}</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '3px' }}>{r.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span className={`pill ${r.tagClass}`} style={r.tagStyle}>{r.tag}</span>
            <span style={{ fontSize: '11px', color: '#AAA' }}>{r.freq}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
