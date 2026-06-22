import { useState, useEffect, useRef } from 'react';
import { PLAYERS, HK_METRICS } from '../../data/players';

const mn  = a => a.reduce((x, y) => x + y, 0) / a.length;
const sd  = a => { const m = mn(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); };
const lr  = (xs, ys) => { const mx = mn(xs), my = mn(ys), n = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0), d = xs.reduce((a, x) => a + (x - mx) ** 2, 0), mv = n / d, b = my - mv * mx; return x => mv * x + b; };
const pc  = (a, b) => (a - b) / b * 100;
const ps  = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
const pc2 = v => v > 0 ? '#0A7A56' : v < -8 ? '#C0001F' : '#B85C00';
const ac  = v => v > 1.5 ? '#C0001F' : v > 1.3 ? '#B85C00' : '#0A7A56';
const an  = v => Math.min(Math.max(((v - .5) / 1.5) * 100, 0), 100).toFixed(1);
const fm  = (v, d) => d === 0 ? Math.round(v).toLocaleString() : v.toFixed(d);

export default function SCTab() {
  const [player, setPlayer] = useState(PLAYERS[0]);
  const [trend,  setTrend]  = useState(null); // metric key or null
  const [range,  setRange]  = useState(21);
  const charts = useRef({});

  useEffect(() => { renderCharts(player); }, [player]);

  function destroyChart(id) {
    if (charts.current[id]) { charts.current[id].destroy(); delete charts.current[id]; }
  }

  function renderCharts(p) {
    setTimeout(() => {
      // Load chart
      const lc = document.getElementById('sc-load-chart');
      if (lc && window.Chart) {
        destroyChart('lc');
        charts.current['lc'] = new window.Chart(lc, {
          type: 'bar',
          data: {
            labels: Array.from({ length: 14 }, (_, i) => `D${i + 1}`),
            datasets: [
              { label: 'TRIMP', data: p.ls, backgroundColor: '#00A0B499', borderRadius: 3, order: 2 },
              { label: '21d',   data: Array(14).fill(p.tr21), type: 'line', borderColor: '#E20074', borderWidth: 2, borderDash: [4, 3], pointRadius: 0, fill: false, order: 1 },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { font: { size: 9 }, color: '#AAA' }, grid: { display: false } }, y: { ticks: { font: { size: 9 }, color: '#AAA' }, grid: { color: 'rgba(255,255,255,0.06)' }, min: 0 } } },
        });
      }
    }, 60);
  }

  function renderTrendChart(p, metric, r) {
    setTimeout(() => {
      const m = HK_METRICS.find(x => x.k === metric);
      const data = p[m.k].slice(-r);
      const n = data.length;
      const xs = Array.from({ length: n }, (_, i) => i + 1);
      const avg = mn(data), s = sd(data), reg = lr(xs, data), yp = s * 1.8;
      const tc = document.getElementById('trend-chart');
      if (!tc || !window.Chart) return;
      destroyChart('tc');
      charts.current['tc'] = new window.Chart(tc, {
        type: 'scatter',
        data: { datasets: [
          { type: 'line', data: xs.map(x => ({ x, y: avg + s })), borderColor: 'transparent', backgroundColor: 'transparent', pointRadius: 0, fill: '+1', order: 5 },
          { type: 'line', data: xs.map(x => ({ x, y: avg - s })), borderColor: 'transparent', backgroundColor: m.bn, pointRadius: 0, fill: false, order: 6 },
          { type: 'line', data: xs.map(x => ({ x, y: reg(x) })), borderColor: '#CCC', borderWidth: 1.5, pointRadius: 0, fill: false, borderDash: [5, 4], tension: 0, order: 3 },
          { type: 'scatter', data: data.slice(0, -1).map((y, i) => ({ x: i + 1, y })), backgroundColor: m.co + 'AA', pointRadius: 4.5, pointBorderWidth: 0, order: 2 },
          { type: 'scatter', data: [{ x: n, y: data[n - 1] }], backgroundColor: 'transparent', pointRadius: 7, pointBorderColor: m.co, pointBorderWidth: 2.5, order: 1 },
        ] },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 250 }, plugins: { legend: { display: false } }, scales: { x: { type: 'linear', min: 1, max: n, ticks: { font: { size: 10 }, color: '#AAA' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { ticks: { font: { size: 10 }, color: '#AAA', callback: v => fm(v, m.dc) }, grid: { color: 'rgba(255,255,255,0.06)' }, min: +(Math.min(...data) - yp).toFixed(m.dc === 0 ? 0 : 3), max: +(Math.max(...data) + yp).toFixed(m.dc === 0 ? 0 : 3) } } },
      });
    }, 60);
  }

  useEffect(() => {
    if (trend) renderTrendChart(player, trend, range);
  }, [trend, range, player]);

  const p = player;

  if (trend) {
    const m = HK_METRICS.find(x => x.k === trend);
    const data = p[m.k].slice(-range);
    const td = data[data.length - 1], avg = mn(data);
    return (
      <div className="content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <button className="back-btn" onClick={() => setTrend(null)}>← Back</button>
          <span style={{ fontSize: '12px', color: '#888' }}>{p.fn} · {m.lb}</span>
        </div>
        <div className="card" style={{ marginBottom: '10px', borderTop: `3px solid ${m.co}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0F0F0' }}>{m.lb} — individual trend</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{p.fn} · #{p.no} · {p.po} · Hawkin Dynamics</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Sessions</span>
              {[10, 21, 28].map(n => (
                <button key={n} className={`rb${range === n ? ' on' : ''}`} onClick={() => setRange(n)}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: '200px' }}><canvas id="trend-chart" /></div>
        </div>
        <div className="g4">
          {[['Today', `${fm(td, m.dc)} ${m.un}`, 'current session', m.co], [`${range}-session avg`, `${fm(avg, m.dc)} ${m.un}`, 'period mean', '#1A1A1A'], ['Period max', `${fm(Math.max(...data), m.dc)} ${m.un}`, 'best value', '#0A7A56'], ['Period min', `${fm(Math.min(...data), m.dc)} ${m.un}`, 'lowest value', '#C0001F']].map(([lb, vl, sb, co]) => (
            <div key={lb} className="card">
              <div className="kl">{lb}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: co, lineHeight: 1 }}>{vl}</div>
              <div style={{ fontSize: '11px', color: '#AAA', marginTop: '4px' }}>{sb}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="sec-hd">
        <div>
          <div className="sec-title">Individual neuromuscular status</div>
          <div className="sec-sub">Today vs 21-day & 28-day personal baselines · Click any Hawkin card to open trend report</div>
        </div>
        <span className="pill pa">⚠️ Game −2d</span>
      </div>

      {/* Player selector */}
      <div className="player-strip">
        {PLAYERS.map(pl => (
          <button key={pl.id} className={`pb${pl.id === p.id ? ' on' : ''}`} onClick={() => setPlayer(pl)}>
            <span className="pd" style={{ background: pl.sc }} />#{pl.no} {pl.nm} <span style={{ fontSize: '10px', opacity: .6 }}>{pl.po}</span>
          </button>
        ))}
      </div>

      {/* Identity bar */}
      <div className="card" style={{ borderLeft: `4px solid ${p.sc}`, marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="init" style={{ width: '44px', height: '44px', fontSize: '14px', background: p.sb, color: p.sc }}>{p.fn.split(' ').map(x => x[0]).join('')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0F0F0' }}>{p.fn} · #{p.no} · {p.po}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{p.rs}</div>
          </div>
          <span className={`pill ${p.pi}`}>{p.st}</span>
        </div>
      </div>

      {/* Hawkin metrics */}
      <div className="rl">Hawkin Dynamics — force plate</div>
      <div className="g4">
        {HK_METRICS.map(m => {
          const d = p[m.k], td = d[d.length - 1], a21 = mn(d.slice(-22, -1)), a28 = mn(d.slice(0, -1));
          const d21 = pc(td, a21), d28 = pc(td, a28);
          return (
            <div key={m.k} className="card" style={{ cursor: 'pointer', borderTop: `3px solid ${m.co}` }} onClick={() => setTrend(m.k)}>
              <div className="card-hd"><span>{m.lb}</span><span className="src-tag tag-mg">Hawkin</span></div>
              <div className="kv">{fm(td, m.dc)}<span className="ku">{m.un}</span></div>
              <div style={{ height: '3px', borderRadius: '2px', background: m.co, opacity: .18, margin: '6px 0' }} />
              <div className="cr"><span className="cl">vs 21d avg</span><span className="cf">{fm(a21, m.dc)}</span><span className="cd" style={{ color: pc2(d21) }}>{ps(d21)}</span></div>
              <div className="cr"><span className="cl">vs 28d avg</span><span className="cf">{fm(a28, m.dc)}</span><span className="cd" style={{ color: pc2(d28) }}>{ps(d28)}</span></div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: m.co, marginTop: '8px' }}>📈 Open trend report</div>
            </div>
          );
        })}
      </div>

      {/* Firstbeat */}
      <div className="rl">Firstbeat — internal & external load</div>
      <div className="g3">
        <div className="card" style={{ borderTop: `3px solid #00A0B4` }}>
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
        <div className="card" style={{ borderTop: `3px solid #00A0B4` }}>
          <div className="card-hd"><span>ACWR</span><span className="src-tag tag-tq">Firstbeat</span></div>
          <div className="kl">Movement load ACWR</div>
          <div className="kv" style={{ color: ac(p.am) }}>{p.am.toFixed(2)}</div>
          <div style={{ fontSize: '10px', color: '#AAA', marginTop: '3px', marginBottom: '6px' }}>21d avg: {p.am21.toFixed(2)}</div>
          <div className="acwr-zone">
            <div style={{ flex: 15, background: '#E6F4F0' }} /><div style={{ flex: 25, background: '#A8DDD5' }} /><div style={{ flex: 10, background: '#FFF3E0' }} /><div style={{ flex: 10, background: '#FDECEA' }} />
            <div className="acwr-needle" style={{ left: `${an(p.am)}%` }} />
          </div>
          <div className="dv" />
          <div className="kl">TRIMP ACWR</div>
          <div className="kv" style={{ color: ac(p.at) }}>{p.at.toFixed(2)}</div>
          <div style={{ fontSize: '10px', color: '#AAA', marginTop: '3px', marginBottom: '6px' }}>21d avg: {p.at21.toFixed(2)}</div>
          <div className="acwr-zone">
            <div style={{ flex: 15, background: '#E6F4F0' }} /><div style={{ flex: 25, background: '#A8DDD5' }} /><div style={{ flex: 10, background: '#FFF3E0' }} /><div style={{ flex: 10, background: '#FDECEA' }} />
            <div className="acwr-needle" style={{ left: `${an(p.at)}%` }} />
          </div>
          <div className="dv" /><div style={{ fontSize: '10px', color: '#AAA' }}>Optimal zone: 0.80–1.30</div>
        </div>
        <div className="card" style={{ borderTop: `3px solid #00A0B4` }}>
          <div className="card-hd"><span>14-day TRIMP trend</span><span className="src-tag tag-tq">Firstbeat</span></div>
          <div style={{ position: 'relative', height: '160px' }}><canvas id="sc-load-chart" /></div>
        </div>
      </div>

      {/* TeamBuildr */}
      <div className="rl">TeamBuildr — strength</div>
      <div className="card" style={{ borderTop: `3px solid #1A1A1A` }}>
        <div className="card-hd"><span>Trap bar deadlift — current 1RM</span><span className="src-tag tag-bk">TeamBuildr</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <div className="kv" style={{ fontSize: '28px' }}>{p.dl}<span className="ku">kg</span></div>
            <div className="cr" style={{ marginTop: '8px' }}><span className="cl">vs 21d avg</span><span className="cf">{p.dl21} kg</span><span className="cd" style={{ color: pc2(pc(p.dl, p.dl21)) }}>{ps(pc(p.dl, p.dl21))}</span></div>
            <div className="cr"><span className="cl">vs 28d avg</span><span className="cf">{p.dl28} kg</span><span className="cd" style={{ color: pc2(pc(p.dl, p.dl28)) }}>{ps(pc(p.dl, p.dl28))}</span></div>
          </div>
          <div style={{ borderLeft: '1px solid #2A2A2A', paddingLeft: '16px' }}>
            <div className="kl">Season peak</div><div className="kv" style={{ fontSize: '22px' }}>{p.dl + 5}<span className="ku">kg</span></div>
            <div style={{ fontSize: '11px', marginTop: '4px', color: pc2(pc(p.dl, p.dl + 5)) }}>{ps(pc(p.dl, p.dl + 5))} from peak</div>
          </div>
          <div style={{ borderLeft: '1px solid #2A2A2A', paddingLeft: '16px' }}>
            <div className="kl">Strength trend</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: pc2(pc(p.dl, p.dl21)) }}>{pc(p.dl, p.dl21) >= 0 ? 'Progressing' : 'Declining'}</div>
            <div style={{ fontSize: '11px', color: '#AAA', marginTop: '4px' }}>Based on 21-day window</div>
          </div>
        </div>
      </div>
    </div>
  );
}
