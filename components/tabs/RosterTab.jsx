import { useState } from 'react';
import { ROSTER } from '../../data/players';

const POS_ALL = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];

export default function RosterTab() {
  const [query, setQuery]       = useState('');
  const [selPos, setSelPos]     = useState('All');
  const [profile, setProfile]   = useState(null); // selected player for full view

  const filtered = ROSTER.filter(p => {
    const mPos = selPos === 'All' || p.pos === selPos;
    const q    = query.toLowerCase();
    const mQ   = p.name.toLowerCase().includes(q) || String(p.no).includes(q) ||
                 p.pos.toLowerCase().includes(q) || (p.nat || '').toLowerCase().includes(q);
    return mPos && mQ;
  });

  if (profile) return <PlayerProfile player={profile} onBack={() => setProfile(null)} />;

  return (
    <div className="content">
      <div className="sec-hd">
        <div>
          <div className="sec-title">Team roster</div>
          <div className="sec-sub">Telekom Baskets Bonn · 2025–26 season · {ROSTER.length} players</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, number or position..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {POS_ALL.map(pos => (
            <button
              key={pos}
              className={`filter-btn${selPos === pos ? ' on' : ''}`}
              onClick={() => setSelPos(pos)}
            >{pos}</button>
          ))}
        </div>
      </div>

      <div className="roster-grid-new">
        {filtered.length === 0
          ? <div style={{ color: '#555', fontSize: '13px', padding: '32px', gridColumn: '1/-1' }}>No players found</div>
          : filtered.map(p => <PlayerCard key={p.id} player={p} onClick={() => setProfile(p)} />)
        }
      </div>
    </div>
  );
}

function PlayerCard({ player: p, onClick }) {
  const dob    = new Date(p.dob);
  const dobStr = dob.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const initials = `${p.fn[0]}${p.ln[0]}`;

  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-top">
        <span className="rc-no">#{p.no}</span>
        <span className="rc-pos">{p.pos}</span>
        <div className="rc-photo">{initials}</div>
        <div className="rc-name">{p.name}</div>
        <div className="rc-nat">{p.nat} · {p.age} yrs</div>
      </div>
      <div className="rc-body">
        <div className="rc-row"><span className="rc-lbl">Height</span><span className="rc-val">{p.ht} cm</span></div>
        <div className="rc-row"><span className="rc-lbl">Weight</span><span className="rc-val">{p.wt} kg</span></div>
        <div className="rc-bday">🎂 {dobStr}</div>
      </div>
    </div>
  );
}

function PlayerProfile({ player: p, onBack }) {
  const bmi    = (p.wt / ((p.ht / 100) ** 2)).toFixed(1);
  const dob    = new Date(p.dob);
  const dobStr = dob.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="content">
      <div className="rp-back">
        <button className="rp-back-btn" onClick={onBack}>← Back to roster</button>
        <span style={{ fontSize: '12px', color: '#555' }}>{p.name} · Full profile</span>
      </div>

      <div className="rp-hero">
        <div className="rp-hero-inner">
          <div className="rp-photo">{p.fn[0]}{p.ln[0]}</div>
          <div className="rp-info">
            <div className="rp-name">{p.name}</div>
            <div className="rp-meta">
              {[['Position', p.pos], ['Nationality', p.nat], ['Age', `${p.age} years`], ['Date of birth', dobStr]].map(([lbl, val]) => (
                <div key={lbl} className="rp-meta-item">
                  <span className="rp-meta-lbl">{lbl}</span>
                  <span className="rp-meta-val">{val}</span>
                </div>
              ))}
            </div>
            <span style={{ display: 'inline-block', background: '#E20074', color: '#FFF', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px' }}>{p.pos}</span>
          </div>
          <div className="rp-no">#{p.no}</div>
        </div>
      </div>

      {/* Physical */}
      <div className="rp-card-full">
        <div className="rp-section-title">📏 Physical profile</div>
        <div className="rp-phys-grid">
          {[['Height', p.ht, 'cm'], ['Weight', p.wt, 'kg'], ['Wingspan', p.ws, 'cm'], ['Body fat', p.fat, '%'], ['BMI', bmi, 'auto-calc'], ['Height:Wingspan', (p.ws / p.ht).toFixed(2), 'ratio']].map(([lbl, val, unit]) => (
            <div key={lbl} className="rp-stat">
              <div className="rp-stat-lbl">{lbl}</div>
              <div className="rp-stat-val">{val}</div>
              <div className="rp-stat-unit">{unit}</div>
            </div>
          ))}
          <div className="rp-stat" style={{ gridColumn: 'span 2' }}>
            <div className="rp-stat-lbl">Birthday</div>
            <div className="rp-stat-val" style={{ fontSize: '15px', marginTop: '3px' }}>🎂 {dobStr}</div>
          </div>
        </div>
      </div>

      <div className="rp-grid">
        {/* Injuries */}
        <div className="rp-card">
          <div className="rp-section-title">🩹 Injury history</div>
          {p.injuries && p.injuries.length > 0
            ? p.injuries.map((inj, i) => (
                <div key={i} className="injury-entry">
                  <div className="injury-dot" style={{ background: inj.color }} />
                  <div className="injury-body">
                    <div className="injury-name">{inj.name}</div>
                    <div className="injury-detail">{inj.date}</div>
                    <span className="injury-status" style={{ background: inj.color + '22', color: inj.color, border: `1px solid ${inj.color}44` }}>{inj.status}</span>
                  </div>
                </div>
              ))
            : <div style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', padding: '8px 0' }}>No injury history recorded</div>
          }
        </div>

        {/* Medical */}
        <div className="rp-card">
          <div className="rp-section-title">⚠️ Allergies & medical notes</div>
          <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap' }}>
            {p.allergies && p.allergies.length > 0
              ? p.allergies.map((a, i) => <span key={i} className="al-pill">⚠ {a}</span>)
              : <span className="none-pill-dk">No known allergies</span>
            }
          </div>
          <div className="med-note-box">{p.med || 'No medical notes recorded.'}</div>
        </div>
      </div>

      {/* Supplements */}
      <div className="rp-card-full">
        <div className="rp-section-title">💊 Supplementation protocol</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {p.supplements && p.supplements.length > 0
            ? p.supplements.map((s, i) => <span key={i} className="supp-pill-dk">💊 {s}</span>)
            : <span className="none-pill-dk">No supplements recorded</span>
          }
        </div>
      </div>
    </div>
  );
}
