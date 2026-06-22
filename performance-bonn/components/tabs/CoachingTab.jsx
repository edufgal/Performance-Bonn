import { useEffect, useRef } from 'react';
import { PLAYERS } from '../../data/players';

const mn  = a => a.reduce((x, y) => x + y, 0) / a.length;
const pc  = (a, b) => (a - b) / b * 100;
const ps  = v => (v >= 0 ? '+' : '') + v.toFixed(0) + '%';
const ac  = v => v > 1.5 ? '#C0001F' : v > 1.3 ? '#B85C00' : '#0A7A56';
const an  = v => Math.min(Math.max(((v - .5) / 1.5) * 100, 0), 100).toFixed(1);

export default function CoachingTab() {
  const charts = useRef({});
  const av = PLAYERS.filter(p => p.avail === 'Available').length;
  const mg = PLAYERS.filter(p => p.avail === 'Manage').length;
  const nr = PLAYERS.filter(p => p.avail === 'Not recommended').length;

  useEffect(() => {
    setTimeout(() => {
      const names = PLAYERS.map(p => p.nm.split(' ')[1]);
      if (charts.current['co-cmj'])  { charts.current['co-cmj'].destroy(); }
      if (charts.current['co-acwr']) { charts.current['co-acwr'].destroy(); }
      if (!window.Chart) return;

      charts.current['co-cmj'] = new window.Chart(document.getElementById('co-cmj'), {
        type: 'bar',
        data: { labels: names, datasets: [
          { label: 'Today', data: PLAYERS.map(p => +(p.cmj[p.cmj.length - 1] * 100).toFixed(1)), backgroundColor: '#E2007499' },
          { label: '21d',   data: PLAYERS.map(p => +(mn(p.cmj.slice(-22, -1)) * 100).toFixed(1)), backgroundColor: '#444444' },
        ] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { font: { size: 10 }, color: '#AAA' }, grid: { display: false } }, y: { ticks: { font: { size: 9 }, color: '#AAA', callback: v => (v / 100).toFixed(2) + 'm' }, grid: { color: 'rgba(255,255,255,0.06)' }, min: 30, max: 45 } } },
      });

      charts.current['co-acwr'] = new window.Chart(document.getElementById('co-acwr'), {
        type: 'bar',
        data: { labels: names, datasets: [{ label: 'ACWR', data: PLAYERS.map(p => p.am), backgroundColor: PLAYERS.map(p => p.am > 1.5 ? '#C0001F' : p.am > 1.3 ? '#B85C00' : '#00A0B4') }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { font: { size: 10 }, color: '#AAA' }, grid: { display: false } }, y: { ticks: { font: { size: 10 }, color: '#AAA' }, grid: { color: 'rgba(255,255,255,0.06)' }, min: 0.8, max: 1.8 } } },
      });
    }, 60);
  }, []);

  return (
    <div className="content">
      <div className="sec-hd">
        <div><div className="sec-title">Squad overview</div><div className="sec-sub">Availability · Load vs personal averages</div></div>
        <span className="pill pa">⚠️ Game Tue 24 Jun</span>
      </div>

      <div className="avail-block">
        <div className="avail-card" style={{ background: '#E6F4F0' }}><div className="avail-n" style={{ color: '#0A7A56' }}>{av}</div><div className="avail-l" style={{ color: '#0A7A56' }}>Available</div></div>
        <div className="avail-card" style={{ background: '#FFF3E0' }}><div className="avail-n" style={{ color: '#B85C00' }}>{mg}</div><div className="avail-l" style={{ color: '#B85C00' }}>Manage / restrict</div></div>
        <div className="avail-card" style={{ background: '#FDECEA' }}><div className="avail-n" style={{ color: '#C0001F' }}>{nr}</div><div className="avail-l" style={{ color: '#C0001F' }}>Not recommended</div></div>
      </div>

      <div className="card">
        <div className="card-hd" style={{ marginBottom: '10px' }}>Player availability — Tue 24 Jun</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="squad-table">
            <thead><tr><th>Player</th><th>Status</th><th>Restriction</th><th style={{ textAlign: 'center' }}>ACWR</th><th style={{ textAlign: 'center' }}>Mov. load</th><th style={{ textAlign: 'center' }}>TRIMP</th></tr></thead>
            <tbody>
              {PLAYERS.map(p => {
                const mld = pc(p.ml, p.ml21), trd = pc(p.tr, p.tr21);
                return (
                  <tr key={p.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="init" style={{ width: '28px', height: '28px', fontSize: '10px', background: p.sb, color: p.sc }}>{p.fn.split(' ').map(x => x[0]).join('')}</div>
                      <div><div style={{ fontWeight: 700, color: '#E0E0E0' }}>{p.fn}</div><div style={{ fontSize: '10px', color: '#888' }}>#{p.no} · {p.po}</div></div>
                    </div></td>
                    <td><span className={`pill ${p.availp}`}>{p.avail}</span></td>
                    <td style={{ fontSize: '11px', color: '#666' }}>{p.rs}</td>
                    <td style={{ fontSize: '14px', fontWeight: 700, color: ac(p.am), textAlign: 'center' }}>{p.am.toFixed(2)}<div style={{ fontSize: '10px', color: '#AAA', fontWeight: 400 }}>21d: {p.am21.toFixed(2)}</div></td>
                    <td style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', fontWeight: 700, color: '#E0E0E0' }}>{p.ml.toLocaleString()}</div><div style={{ fontSize: '10px', color: mld > 0 ? '#0A7A56' : '#C0001F' }}>{mld > 0 ? '+' : ''}{mld.toFixed(0)}% vs 21d</div></td>
                    <td style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', fontWeight: 700, color: '#E0E0E0' }}>{p.tr}</div><div style={{ fontSize: '10px', color: trd > 0 ? '#0A7A56' : '#C0001F' }}>{trd > 0 ? '+' : ''}{trd.toFixed(0)}% vs 21d</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2" style={{ marginTop: '10px' }}>
        <div className="card"><div className="card-hd" style={{ marginBottom: '10px' }}>CMJ today vs 21d personal average</div><div style={{ position: 'relative', height: '140px' }}><canvas id="co-cmj" /></div></div>
        <div className="card"><div className="card-hd" style={{ marginBottom: '10px' }}>ACWR — movement load</div><div style={{ position: 'relative', height: '140px' }}><canvas id="co-acwr" /></div></div>
      </div>
    </div>
  );
}
