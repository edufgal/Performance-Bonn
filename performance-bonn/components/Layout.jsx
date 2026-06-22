import Head from 'next/head';

const LOGO_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABKVBMVEX///8GBgYAAADgHYMABQDx8fGHh4dqamoAAwAGAADc3NwABgD8/Pzu7u7jHYXm5uY6CyN9goaPFlT39/dYWFjAwMA0NDSvr6/Hx8ekpKRhYWHT09O4uLjh4eEtLS2qqqp1dXUfHx+AgIB6E0hsET+/HHMcChFNTU20GmxCDiPeHYEVFRWPj4+ZmZlRUVHOzs5BQUFNDirRHHubF1slJSURERFyeX0Jvc8MjZtjaWwwMzYOa3QMXGtrcnVERUldZWcjKyctDBwMFxsJOD4HSk8MWV4KNzgLQ0cOfYgNl6sMpbcLhYsPb3oJVVgKoK6rGmhIDCwkCBFmETgyChxZEzdxEUCQFlm7GmeGFEvuHYcNJCYNLDYGISEJjp8Ml58OVGILsroKbW4PIy7mdpa2AAAfQklEQVR4nNVd';

export default function Layout({ children, activeTab, onTabChange }) {
  const tabs = [
    { id: 'home',    icon: '🏠', label: 'Home' },
    { id: 'roster',  icon: '👥', label: 'Roster' },
    { id: 'sc',      icon: '🏋️', label: 'S&C Coach' },
    { id: 'perf',    icon: '📊', label: 'Performance' },
    { id: 'coach',   icon: '📋', label: 'Coaching Staff' },
    { id: 'reports', icon: '📄', label: 'Reports' },
  ];

  return (
    <>
      <Head>
        <title>SPIP · Telekom Baskets Bonn</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />
      </Head>

      <div className="topbar">
        <div className="logo-area">
          <div className="logo-badge" style={{ background: '#000', padding: '2px' }}>
            <img
              src="/logo.png"
              alt="Telekom Baskets Bonn"
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="logo-text">
            <div className="logo-top">Baskets Bonn</div>
            <div className="logo-bot">SPIP · Performance Platform</div>
          </div>
        </div>

        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="topbar-right">
          <div className="av">SC</div>
        </div>
      </div>

      <main>{children}</main>
    </>
  );
}
