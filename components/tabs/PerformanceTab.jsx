import { useState } from 'react';
import { PLAYERS } from '../../data/players';

const mn  = a => a.reduce((x, y) => x + y, 0) / a.length;
const pc  = (a, b) => (a - b) / b * 100;
const ps  = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
const pc2 = v => v > 0 ? '#0A7A56' : v < -8 ? '#C0001F' : '#B85C00';
const ac  = v => v > 1.5 ? '#C0001F' : v > 1.3 ? '#B85C00' : '#0A7A56';
const an  = v => Math.min(Math.max(((v - .5) / 1.5) * 100, 0), 100).toFixed(1);
const wc  = v => v >= 7 ? { bg: '#E6F4F0', fg: '#0A7A56' } : v >= 5 ? { bg: '#FFF3E0', fg: '#B85C00' } : { bg: '#FDECEA', fg: '#C0001F' };

export default function PerformanceTab() {
  const [player, setPlayer] = useState(PLAYERS[0]);
  const p = player;
  const wk = ['sleep', 'fatigue', 'stress', 'mood'];
  const wl = ['Sleeping', 'Physical fatigue', 'Mental stress', 'Mood'];
  const lp = (p.lean / p.bw * 100);

  return (
    <div className="content">
      <div className="sec-hd">
        <div><div className="sec-title">Holistic player profile</div><div className="sec-sub">Workload · Neuromuscular · Wellness · Physiotherapy · Body composition</div></div>
        <span className="pill pa">⚠️ Game Tue 24 Jun</span>
      </div>

      <div className="player-strip">
        {PLAYERS.map(pl => (
          <button key={pl.id} className={`pb${pl.id === p.id ? ' on' : ''}`} onClick={() => setPlayer(pl)}>
            <span className="pd" style={{ background: pl.sc }} />#{pl.no} {pl.nm} <span style={{ fontSize: '10px', opacity: .6 }}>{pl.po}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ borderLeft: `4px solid ${p.sc}`, marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="init" style={{ width: '44px', height: '44px', fontSize: '14px', background: p.sb, color: p.sc }}>{p.fn.split(' ').map(x => x[0]).join('')}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#F0F0F0' }}>{p.fn} · #{p.no} · {p.po}</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{p.rs}</div></div>
          <span className={`pill ${p.pi}`}>{p.st}</span>
        </div>
      </div>

      <div className="rl">Workload</div>
      <div className="g3">
        <div className="card" style={{ borderTop: '3px solid #00A0B4' }}>
          <div className="card-hd"><span>Workload</span><span className="src-tag tag-tq">Firstbeat</span></div>
          <div className="kl">Movement load</div><div className="kv">{p.ml.toLocaleString()}</div>
          <div style={{ marginTop: '5px', marginBottom: '8px' }}>
            <div className="cr"><span className="cl">vs 21d avg</span><span className="cf">{p.ml21.toLocaleString()}</span><span className="cd" style={{ color: pc2(pc(p.ml, p.ml21)) }}>{ps(pc(p.ml, p.ml21))}</span></div>
            <div className="cr"><span className="cl">vs 28d avg</span><span className="cf">{p.ml28.toLocaleString()}</span><span className="cd" style={{ color: pc2(pc(p.ml, p.ml28)) }}>{ps(pc(p.ml, p.ml28))}</span></div>
          </div>
          <div className="dv" />
          <div className="kl">TRIMP</div><div className="kv">{p.tr}</div>
          <div style={{ marginTop: '5px' }}>
            <div className="cr"><span className="cl">vs 21d avg</span><span className="cf">{p.tr21}</span><span className="cd" style={{ color: pc2(pc(p.tr, p.tr21)) }}>{ps(pc(p.tr, p.tr21))}</span></div>
            <div className="cr"><span className="cl">vs 28d avg</span><span className="cf">{p.tr28}</span><span className="cd" style={{ color: pc2(pc(p.tr, p.tr28)) }}>{ps(pc(p.tr, p.tr28))}</span></div>
          </div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #00A0B4' }}>
          <div className="card-hd"><span>ACWR</span><span className="src-tag tag-tq">Firstbeat</span></div>
          <div className="kl">Movement load ACWR</div><div className="kv" style={{ color: ac(p.am) }}>{p.am.toFixed(2)}</div>
          <div style={{ fontSize: '10px', color: '#AAA', marginTop: '3px', marginBottom: '6px' }}>21d avg: {p.am21.toFixed(2)}</div>
          <div className="acwr-zone"><div style={{ flex: 15, background: '#E6F4F0' }} /><div style={{ flex: 25, background: '#A8DDD5' }} /><div style={{ flex: 10, background: '#FFF3E0' }} /><div style={{ flex: 10, background: '#FDECEA' }} /><div className="acwr-needle" style={{ left: `${an(p.am)}%` }} /></div>
          <div className="dv" />
          <div className="kl">TRIMP ACWR</div><div className="kv" style={{ color: ac(p.at) }}>{p.at.toFixed(2)}</div>
          <div className="acwr-zone"><div style={{ flex: 15, background: '#E6F4F0' }} /><div style={{ flex: 25, background: '#A8DDD5' }} /><div style={{ flex: 10, background: '#FFF3E0' }} /><div style={{ flex: 10, background: '#FDECEA' }} /><div className="acwr-needle" style={{ left: `${an(p.at)}%` }} /></div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #1A1A1A' }}>
          <div className="card-hd"><span>Neuromuscular</span><span className="src-tag tag-mg">Hawkin</span></div>
          <div className="kl">CMJ jump height</div>
          <div className="kv">{p.cmj[p.cmj.length - 1].toFixed(3)}<span className="ku">m</span></div>
          <div className="cr"><span className="cl">vs 21d avg</span><span className="cf">{mn(p.cmj.slice(-22, -1)).toFixed(3)} m</span><span className="cd" style={{ color: pc2(pc(p.cmj[p.cmj.length - 1], mn(p.cmj.slice(-22, -1)))) }}>{ps(pc(p.cmj[p.cmj.length - 1], mn(p.cmj.slice(-22, -1))))}</span></div>
          <div className="dv" />
          <div className="kl">CMJ mRSI</div>
          <div className="kv">{p.mr[p.mr.length - 1].toFixed(2)}</div>
          <div className="cr"><span className="cl">vs 21d avg</span><span className="cf">{mn(p.mr.slice(-22, -1)).toFixed(2)}</span><span className="cd" style={{ color: pc2(pc(p.mr[p.mr.length - 1], mn(p.mr.slice(-22, -1)))) }}>{ps(pc(p.mr[p.mr.length - 1], mn(p.mr.slice(-22, -1))))}</span></div>
        </div>
      </div>

      <div className="rl">Holistic</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr)', gap: '10px', marginBottom: '10px' }}>
        <div className="card" style={{ borderTop: '3px solid #E20074' }}>
          <div className="card-hd"><span>Wellness questionnaire</span><span className="src-tag tag-bk">Daily</span></div>
          <div className="well-block">
            {wk.map((k, i) => { const c = wc(p.well[k]); return (
              <div key={k} className="well-item">
                <div className="well-circle" style={{ background: c.bg, color: c.fg }}>{p.well[k]}</div>
                <div className="well-label">{wl[i]}</div>
                <div className="well-avg">21d: {p.well21[k].toFixed(1)}</div>
              </div>
            ); })}
          </div>
          <div style={{ fontSize: '10px', color: '#AAA', marginBottom: '8px' }}>Scale 1 (very poor) — 10 (excellent)</div>
          <div className="dv" />
          {p.alerts.length > 0
            ? <><div style={{ fontSize: '11px', fontWeight: 700, color: '#888', marginBottom: '6px', marginTop: '8px' }}>Active alerts</div>{p.alerts.map((a, i) => <div key={i} className="alert-row"><div className="alert-icon" style={{ background: a.s === 'r' ? '#FDECEA' : '#FFF3E0', color: a.s === 'r' ? '#C0001F' : '#B85C00' }}>{a.s === 'r' ? '⚠' : 'ℹ'}</div><div style={{ fontSize: '11px', color: '#E0E0E0', lineHeight: 1.5 }}>{a.m}</div></div>)}</>
            : <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}><span style={{ color: '#0A7A56', fontSize: '16px' }}>✓</span><span style={{ fontSize: '12px', color: '#0A7A56', fontWeight: 700 }}>No active alerts</span></div>
          }
        </div>
        <div className="card" style={{ borderTop: '3px solid #00A0B4' }}>
          <div className="card-hd"><span>Body composition</span><span className="src-tag tag-bk">TeamBuildr</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div><div className="kl">Body weight</div><div style={{ fontSize: '22px', fontWeight: 700, color: '#F0F0F0' }}>{p.bw}<span style={{ fontSize: '11px', color: '#999' }}> kg</span></div><div style={{ fontSize: '11px', marginTop: '3px', color: pc2(pc(p.bw, p.bwp)) }}>{ps(pc(p.bw, p.bwp))} vs prev</div></div>
            <div><div className="kl">Lean mass</div><div style={{ fontSize: '22px', fontWeight: 700, color: '#F0F0F0' }}>{p.lean}<span style={{ fontSize: '11px', color: '#999' }}> kg</span></div><div style={{ fontSize: '11px', marginTop: '3px', color: '#AAA' }}>{lp.toFixed(1)}% of BW</div></div>
          </div>
          <div className="kl">Body fat</div><div style={{ fontSize: '22px', fontWeight: 700, color: '#F0F0F0' }}>{p.fat}<span style={{ fontSize: '11px', color: '#999' }}> %</span></div>
          <div className="bcomp-bar" style={{ marginTop: '10px' }}>
            <div style={{ width: `${lp.toFixed(1)}%`, background: '#00A0B4', borderRadius: '6px 0 0 6px' }} />
            <div style={{ flex: 1, background: '#E20074', borderRadius: '0 6px 6px 0' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#888', marginTop: '4px' }}>
            <span>🟦 Lean {lp.toFixed(1)}%</span><span>🟥 Fat {p.fat}%</span>
          </div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #1A1A1A' }}>
          <div className="card-hd"><span>Physiotherapy</span><span className="src-tag tag-bk">Clinical</span></div>
          {p.physio.map((tx, i) => (
            <div key={i} className="physio-row">
              <div className="physio-dot" style={{ background: tx.d }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#E0E0E0', lineHeight: 1.5 }}>{tx.t}</div>
                <div style={{ fontSize: '10px', color: '#AAA', marginTop: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px' }}>{tx.ty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
