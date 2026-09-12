const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toIndex = (token, now) => {
  if (token.toLowerCase() === "present") return now.getFullYear() * 12 + now.getMonth();
  const [year, month] = token.split("-").map(Number);
  return year * 12 + (month - 1);
};

const toLabel = (token) => {
  if (token.toLowerCase() === "present") return "present";
  const [year, month] = token.split("-").map(Number);
  return `${MONTH_ABBR[month - 1]} ${year}`;
};

const formatDuration = (months) => {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years && rem) return `${years} yr ${rem} mo`;
  if (years) return `${years} yr`;
  return `${rem} mo`;
};

export const parsePeriod = (period, now = new Date()) => {
  const [startToken, endToken] = period.split("→").map((s) => s.trim());
  const startIdx = toIndex(startToken, now);
  const endIdx = toIndex(endToken, now);
  return {
    startIdx,
    endIdx,
    startLabel: toLabel(startToken),
    endLabel: toLabel(endToken),
    durationLabel: formatDuration(endIdx - startIdx + 1),
  };
};

// Parses every entry and orders them most-recent-first, mixing employment
// and education so they share a single chronological sequence.
export const sortChronological = (entries, now = new Date()) =>
  entries
    .map((entry) => ({ ...entry, ...parsePeriod(entry.period, now) }))
    .sort((a, b) => b.startIdx - a.startIdx);

export const TYPE_DOT = {
  employment: "bg-accent",
  education: "border-2 border-link bg-bg",
};
