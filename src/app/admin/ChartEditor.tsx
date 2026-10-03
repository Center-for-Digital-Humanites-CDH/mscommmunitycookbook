'use client';

import type { ChartKind } from '@/content/pages';
import {
  ORG_TYPES,
  countCounties,
  countDecades,
  countOrgs,
  decadeRange,
  parseChartNumbers,
  toNumber,
  topCounties,
  type ChartNumbers,
  type CookbookRow,
} from '@/lib/landscapeStats';
import styles from './ChartEditor.module.css';

interface Props {
  kind: ChartKind;
  numbersKey: string;
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  // Cookbook list used for automatic counts; null while loading
  rows: CookbookRow[] | null;
}

function NumberBox({ value, onChange, readOnly }: { value: number; onChange: (n: number) => void; readOnly: boolean }) {
  return (
    <input
      type="number"
      min={0}
      className={styles.numberBox}
      value={value}
      readOnly={readOnly}
      tabIndex={readOnly ? -1 : 0}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
    />
  );
}

function ModeSwitch({ numbers, onAuto, onManual }: { numbers: ChartNumbers; onAuto: () => void; onManual: () => void }) {
  return (
    <div className={styles.modeSwitch}>
      <button type="button" className={numbers.mode === 'auto' ? styles.modeActive : ''} onClick={onAuto}>
        Count automatically from the Cookbook Inventory
      </button>
      <button type="button" className={numbers.mode === 'manual' ? styles.modeActive : ''} onClick={onManual}>
        Type my own numbers
      </button>
    </div>
  );
}

function ModeHint({ mode }: { mode: 'auto' | 'manual' }) {
  return (
    <p className={styles.hint}>
      {mode === 'auto'
        ? 'These numbers are counted from the Cookbook Inventory and update by themselves when cookbooks are added. To change them, choose "Type my own numbers".'
        : 'Type a number in any box and the chart updates right away. Switch back to automatic counting at any time.'}
    </p>
  );
}

export default function ChartEditor({ kind, numbersKey, values, set, rows }: Props) {
  const numbers = parseChartNumbers(values[numbersKey]);
  const saveNumbers = (next: Partial<ChartNumbers>) => set(numbersKey, JSON.stringify({ ...numbers, ...next }));
  const loading = rows === null && kind !== 'publishers';

  const titleKey = {
    decades: 'decades.chartTitle',
    publishers: 'publishers.chartTitle',
    orgs: 'orgs.chartTitle',
    topCounties: 'counties.topTitle',
  }[kind];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <input
          className={styles.titleInput}
          value={values[titleKey] ?? ''}
          onChange={(e) => set(titleKey, e.target.value)}
          aria-label="Chart title"
        />
        <span className={styles.titleHint}>← chart title</span>
      </div>
      {loading ? <p className={styles.hint}>Loading the cookbook counts…</p> : (
        <>
          {kind === 'decades' && <DecadesChart numbers={numbers} saveNumbers={saveNumbers} values={values} set={set} rows={rows!} />}
          {kind === 'orgs' && <OrgsChart numbers={numbers} saveNumbers={saveNumbers} values={values} set={set} rows={rows!} />}
          {kind === 'topCounties' && <TopCountiesChart numbers={numbers} saveNumbers={saveNumbers} rows={rows!} />}
          {kind === 'publishers' && <PublishersChart values={values} set={set} />}
        </>
      )}
    </div>
  );
}

interface ChartProps {
  numbers: ChartNumbers;
  saveNumbers: (next: Partial<ChartNumbers>) => void;
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  rows: CookbookRow[];
}

// ── Cookbooks by Decade: vertical bars with a box under each ──
function DecadesChart({ numbers, saveNumbers, values, set, rows }: ChartProps) {
  const decades = decadeRange(values['decades.first'], values['decades.last']);
  const auto = countDecades(rows, decades);
  const manual = numbers.mode === 'manual';
  const shown = decades.map((d) => ({ decade: d, count: manual ? (numbers.values[d] ?? auto[d]) : auto[d] }));
  const max = Math.max(1, ...shown.map((d) => d.count));
  const total = shown.reduce((s, d) => s + d.count, 0);

  return (
    <>
      <ModeSwitch
        numbers={numbers}
        onAuto={() => saveNumbers({ mode: 'auto' })}
        onManual={() => saveNumbers({ mode: 'manual', values: { ...auto, ...numbers.values } })}
      />
      <ModeHint mode={numbers.mode} />
      <div className={styles.rangeRow}>
        Show decades from
        <input type="number" step={10} value={values['decades.first'] ?? ''} onChange={(e) => set('decades.first', e.target.value)} />
        to
        <input type="number" step={10} value={values['decades.last'] ?? ''} onChange={(e) => set('decades.last', e.target.value)} />
        <span className={styles.total}>Total: {total} cookbooks</span>
      </div>
      <div className={styles.columns}>
        {shown.map((d) => (
          <div key={d.decade} className={styles.column}>
            <div className={styles.columnTrack}>
              <div className={styles.columnBar} style={{ height: `${(d.count / max) * 100}%` }} />
            </div>
            <span className={styles.columnLabel}>{d.decade}</span>
            <NumberBox
              value={d.count}
              readOnly={!manual}
              onChange={(n) => saveNumbers({ values: { ...numbers.values, [d.decade]: n } })}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// ── Organizations: one row per type with its name, bar and number ──
function OrgsChart({ numbers, saveNumbers, values, set, rows }: ChartProps) {
  const auto = countOrgs(rows);
  const manual = numbers.mode === 'manual';
  const shown = ORG_TYPES.map((o) => ({ ...o, count: manual ? (numbers.values[o.variant] ?? auto[o.variant]) : auto[o.variant] }));
  const max = Math.max(1, ...shown.map((o) => o.count));
  const total = shown.reduce((s, o) => s + o.count, 0);

  return (
    <>
      <ModeSwitch
        numbers={numbers}
        onAuto={() => saveNumbers({ mode: 'auto' })}
        onManual={() => saveNumbers({ mode: 'manual', values: { ...auto, ...numbers.values } })}
      />
      <ModeHint mode={numbers.mode} />
      <div className={styles.rows}>
        <div className={styles.rowHead}>
          <span>Name shown on the chart</span>
          <span />
          <span>Cookbooks</span>
        </div>
        {shown.map((o) => (
          <div key={o.variant} className={styles.row}>
            <input className={styles.nameBox} value={values[o.labelKey] ?? ''} onChange={(e) => set(o.labelKey, e.target.value)} />
            <div className={styles.rowTrack}>
              <div className={`${styles.rowBar} ${styles[`bar_${o.variant}`]}`} style={{ width: `${(o.count / max) * 100}%` }} />
            </div>
            <NumberBox
              value={o.count}
              readOnly={!manual}
              onChange={(n) => saveNumbers({ values: { ...numbers.values, [o.variant]: n } })}
            />
          </div>
        ))}
        <span className={styles.total}>{total} classified cookbooks · groups with 0 are hidden on the site</span>
      </div>
    </>
  );
}

// ── Top counties: ranked rows, editable names when typing own numbers ──
function TopCountiesChart({ numbers, saveNumbers, rows }: Omit<ChartProps, 'values' | 'set'>) {
  const auto = topCounties(countCounties(rows));
  const manual = numbers.mode === 'manual';
  const shown = manual ? numbers.rows : auto;
  const max = Math.max(1, ...shown.map((r) => r.count));

  function updateRow(i: number, change: Partial<{ name: string; count: number }>) {
    saveNumbers({ rows: shown.map((r, j) => (j === i ? { ...r, ...change } : r)) });
  }

  return (
    <>
      <ModeSwitch
        numbers={numbers}
        onAuto={() => saveNumbers({ mode: 'auto' })}
        onManual={() => saveNumbers({ mode: 'manual', rows: numbers.rows.length ? numbers.rows : auto })}
      />
      <ModeHint mode={numbers.mode} />
      <div className={styles.rows}>
        {shown.map((r, i) => (
          <div key={i} className={`${styles.row} ${styles.rankedRow}`}>
            <span className={styles.rank}>{i + 1}</span>
            <input
              className={styles.nameBox}
              value={r.name}
              readOnly={!manual}
              tabIndex={manual ? 0 : -1}
              onChange={(e) => updateRow(i, { name: e.target.value })}
            />
            <div className={styles.rowTrack}>
              <div className={styles.rowBar} style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
            <NumberBox value={r.count} readOnly={!manual} onChange={(n) => updateRow(i, { count: n })} />
            {manual && (
              <button type="button" className={styles.removeRow} title="Remove this row" onClick={() => saveNumbers({ rows: shown.filter((_, j) => j !== i) })}>
                ✕
              </button>
            )}
          </div>
        ))}
        {manual && shown.length < 15 && (
          <button type="button" className={styles.addRow} onClick={() => saveNumbers({ rows: [...shown, { name: 'New County', count: 0 }] })}>
            + Add a county
          </button>
        )}
      </div>
    </>
  );
}

// ── Publishers: circle chart with two named groups ──
function PublishersChart({ values, set }: { values: Record<string, string>; set: (key: string, value: string) => void }) {
  const local = toNumber(values['publishers.local'], 0);
  const national = toNumber(values['publishers.national'], 0);
  const total = local + national;
  const localPct = total > 0 ? (local / total) * 100 : 0;
  const groups = [
    { labelKey: 'publishers.localLabel', numberKey: 'publishers.local', count: local, pct: localPct, color: 'var(--primary-color)' },
    { labelKey: 'publishers.nationalLabel', numberKey: 'publishers.national', count: national, pct: total > 0 ? 100 - localPct : 0, color: '#3d5a8a' },
  ];

  return (
    <>
      <p className={styles.hint}>These two numbers are typed in by hand. Change a number and the circle updates right away.</p>
      <div className={styles.pieLayout}>
        <div className={styles.donut} style={{ background: `conic-gradient(var(--primary-color) 0% ${localPct}%, #3d5a8a ${localPct}% 100%)` }}>
          <div className={styles.donutCenter}>
            <strong>{total}</strong>
            <span>cookbooks</span>
          </div>
        </div>
        <div className={styles.rows}>
          <div className={`${styles.pieRow} ${styles.rowHead}`}>
            <span />
            <span>Name shown on the chart</span>
            <span>Cookbooks</span>
            <span />
          </div>
          {groups.map((g) => (
            <div key={g.numberKey} className={styles.pieRow}>
              <span className={styles.swatch} style={{ background: g.color }} />
              <input className={styles.nameBox} value={values[g.labelKey] ?? ''} onChange={(e) => set(g.labelKey, e.target.value)} />
              <NumberBox value={g.count} readOnly={false} onChange={(n) => set(g.numberKey, String(n))} />
              <span className={styles.pct}>{g.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
