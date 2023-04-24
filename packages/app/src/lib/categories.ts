export const categories = [
  { label: 'Authorization', icon: '🛡️', color: '#6ab46a', bg: '#dbeddb' },
  { label: 'Configuration', icon: '🪛', color: '#569bc2', bg: '#d3e5ef' },
  { label: 'DoS', icon: '🚦', color: '#f7b324', bg: '#fdecc8' },
  { label: 'Injection', icon: '💉', color: '#f98', bg: '#ffe2dd' },
];

export const categoryMap = new Map(
  categories.map((category) => [category.label, category])
);
