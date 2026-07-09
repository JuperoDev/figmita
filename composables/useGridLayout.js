// CSS-grid geometry for screen layout grids (cssgridgenerator.io-style).
// Tracks are stored as arrays of CSS sizes ('1fr', '2fr', '120px'); these
// helpers resolve them to pixel rects so drawn boxes can snap to cells.
import { SCREEN_W, SCREEN_H } from './useConstants.js'

function parseTrack(t) {
  const fr = String(t).match(/^(\d*\.?\d+)fr$/)
  if (fr) return { fr: parseFloat(fr[1]) }
  const px = String(t).match(/^(\d*\.?\d+)px$/)
  if (px) return { px: parseFloat(px[1]) }
  return { fr: 1 }
}

// Resolves one axis of tracks into [{ start, size }] within `total` px
function resolveTracks(tracks, gap, total) {
  const parsed = tracks.map(parseTrack)
  const gaps = gap * Math.max(0, tracks.length - 1)
  const pxTotal = parsed.reduce((n, t) => n + (t.px || 0), 0)
  const frTotal = parsed.reduce((n, t) => n + (t.fr || 0), 0)
  const frUnit = frTotal > 0 ? Math.max(0, total - gaps - pxTotal) / frTotal : 0
  const out = []
  let cursor = 0
  for (const t of parsed) {
    const size = t.px ?? t.fr * frUnit
    out.push({ start: cursor, size })
    cursor += size + gap
  }
  return out
}

export function gridCells(sc) {
  const g = sc.grid
  if (!g || !Array.isArray(g.cols)) return null
  return {
    cols: resolveTracks(g.cols, g.colGap ?? 0, SCREEN_W),
    rows: resolveTracks(g.rows, g.rowGap ?? 0, sc.height ?? SCREEN_H),
  }
}

function spanOn(tracks, lo, hi) {
  let first = tracks.findIndex(t => t.start + t.size > lo)
  if (first === -1) first = tracks.length - 1
  let last = first
  for (let i = tracks.length - 1; i >= first; i--) {
    if (tracks[i].start < hi) { last = i; break }
  }
  return [first, last]
}

// Snaps a drawn rect { x, y, w, h } to the union of grid cells it covers
export function snapRectToGrid(sc, rect) {
  const cells = gridCells(sc)
  if (!cells) return rect
  const [c0, c1] = spanOn(cells.cols, rect.x, rect.x + rect.w)
  const [r0, r1] = spanOn(cells.rows, rect.y, rect.y + rect.h)
  const x = cells.cols[c0].start
  const y = cells.rows[r0].start
  return {
    ...rect,
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(cells.cols[c1].start + cells.cols[c1].size - x),
    h: Math.round(cells.rows[r1].start + cells.rows[r1].size - y),
  }
}

// The CSS this grid represents, for copy/paste into real code
export function gridCss(sc) {
  const g = sc.grid
  return [
    '.parent {',
    '  display: grid;',
    `  grid-template-columns: ${g.cols.join(' ')};`,
    `  grid-template-rows: ${g.rows.join(' ')};`,
    `  column-gap: ${g.colGap ?? 0}px;`,
    `  row-gap: ${g.rowGap ?? 0}px;`,
    '}',
  ].join('\n')
}
