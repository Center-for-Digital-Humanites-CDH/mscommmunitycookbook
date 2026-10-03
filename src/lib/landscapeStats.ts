// Counting used by the Culinary Landscapes charts. Shared by the public page and the
// admin chart editor so both always show the same numbers.

export interface CookbookRow {
  date: string | null;
  organization: string | null;
  county: string | null;
}

export const ORG_TYPES = [
  { key: 'Civic/Club', variant: 'civic', labelKey: 'orgs.civic' },
  { key: 'Church', variant: 'church', labelKey: 'orgs.church' },
  { key: 'Business/Professional', variant: 'business', labelKey: 'orgs.business' },
  { key: 'Extension', variant: 'extension', labelKey: 'orgs.extension' },
] as const;

export const MS_COUNTIES = [
  'Adams','Alcorn','Amite','Attala','Benton','Bolivar','Calhoun','Carroll',
  'Chickasaw','Choctaw','Claiborne','Clarke','Clay','Coahoma','Copiah',
  'Covington','DeSoto','Forrest','Franklin','George','Greene','Grenada',
  'Hancock','Harrison','Hinds','Holmes','Humphreys','Issaquena','Itawamba',
  'Jackson','Jasper','Jefferson','Jefferson Davis','Jones','Kemper','Lafayette',
  'Lamar','Lauderdale','Lawrence','Leake','Lee','Leflore','Lincoln','Lowndes',
  'Madison','Marion','Marshall','Monroe','Montgomery','Neshoba','Newton',
  'Noxubee','Oktibbeha','Panola','Pearl River','Perry','Pike','Pontotoc',
  'Prentiss','Quitman','Rankin','Scott','Sharkey','Simpson','Smith','Stone',
  'Sunflower','Tallahatchie','Tate','Tippah','Tishomingo','Tunica','Union',
  'Walthall','Warren','Washington','Wayne','Webster','Wilkinson','Winston',
  'Yalobusha','Yazoo',
];

export function toNumber(value: string | undefined, fallback: number) {
  const n = parseInt(value || '');
  return isNaN(n) ? fallback : n;
}

// ── Typed-in numbers ──
// A chart either counts from the cookbook list ("auto") or uses numbers typed in the admin ("manual").
export interface ChartNumbers {
  mode: 'auto' | 'manual';
  values: Record<string, number>;
  rows: { name: string; count: number }[];
}

export function parseChartNumbers(json: string | undefined): ChartNumbers {
  try {
    const parsed = JSON.parse(json || '{}');
    return {
      mode: parsed.mode === 'manual' ? 'manual' : 'auto',
      values: parsed.values && typeof parsed.values === 'object' ? parsed.values : {},
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
    };
  } catch {
    return { mode: 'auto', values: {}, rows: [] };
  }
}

// ── Decades ──
export function decadeRange(first: string | undefined, last: string | undefined) {
  const start = Math.floor(toNumber(first, 1890) / 10) * 10;
  const end = Math.max(start, Math.floor(toNumber(last, 1960) / 10) * 10);
  const decades: string[] = [];
  for (let d = start; d <= end && decades.length < 30; d += 10) decades.push(`${d}s`);
  return decades;
}

export function countDecades(rows: CookbookRow[], decades: string[]) {
  const counts: Record<string, number> = Object.fromEntries(decades.map((d) => [d, 0]));
  for (const row of rows) {
    const year = parseInt(row.date || '');
    if (isNaN(year)) continue;
    const decade = `${Math.floor(year / 10) * 10}s`;
    if (decade in counts) counts[decade]++;
  }
  return counts;
}

// ── Organizations ──
export function countOrgs(rows: CookbookRow[]) {
  const counts: Record<string, number> = Object.fromEntries(ORG_TYPES.map((o) => [o.variant, 0]));
  for (const row of rows) {
    const type = ORG_TYPES.find((o) => o.key === row.organization);
    if (type) counts[type.variant]++;
  }
  return counts;
}

// ── Counties ──
export function countCounties(rows: CookbookRow[]) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const raw = row.county?.trim();
    if (!raw) continue;
    const name = raw.replace(/\s+county$/i, '');
    counts[name] = (counts[name] || 0) + 1;
  }
  return counts;
}

export function topCounties(counts: Record<string, number>, n = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name: `${name} County`, count }));
}
