export default function HomeTab({ onNavigate }) {
  const cards = [
    { id: 'roster',  icon: '👥', title: 'Roster',        desc: 'Player profiles, physical data, medical & supplementation' },
    { id: 'sc',      icon: '🏋️', title: 'S&C Coach',     desc: 'Neuromuscular status, Hawkin trends, workload & strength' },
    { id: 'perf',    icon: '📊', title: 'Performance',   desc: 'Holistic profiles, wellness, physio & body composition' },
    { id: 'coach',   icon: '📋', title: 'Coaching Staff', desc: 'Squad availability, load comparison & game readiness' },
    { id: 'reports', icon: '📄', title: 'Reports',       desc: 'Generate daily, weekly & preseason performance reports' },
  ];

  return (
    <div style={{ background: '#0D0D0D', minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="home-logo-ring">
        <img src="/logo.png" alt="Telekom Baskets Bonn" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '50%' }} />
      </div>

      <div className="home-title">
        Telekom Baskets Bonn<br />
        <span style={{ fontSize: '19px', letterSpacing: '.5px', fontWeight: 500, opacity: .8 }}>Performance Platform</span>
      </div>
      <div className="home-subtitle">Sports Performance Intelligence Platform · 2025–26 Season</div>
      <div className="home-divider" />

      <div className="home-nav-grid">
        {cards.map(card => (
          <div key={card.id} className="home-card" onClick={() => onNavigate(card.id)}>
            <div className="home-card-icon">{card.icon}</div>
            <div className="home-card-title">{card.title}</div>
            <div className="home-card-desc">{card.desc}</div>
          </div>
        ))}
      </div>

      <div className="home-footer">Telekom Baskets Bonn · SPIP · Confidential — internal use only</div>
    </div>
  );
}
