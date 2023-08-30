export const categories = [
  { label: 'Access Control', icon: '🛡️', color: '#6ab46a', bg: '#dbeddb' },
  { label: 'HTTP', icon: '📡', color: '#76ccbb', bg: '#e3fcf8' },
  {
    label: 'Information Disclosure',
    icon: '📢',
    color: '#569bc2',
    bg: '#d3e5ef',
  },
  { label: 'Complexity', icon: '🚂', color: '#d18bdc', bg: '#f0d9f4' },
  { label: 'Injection', icon: '💉', color: '#f98', bg: '#ffe2dd' },
  { label: 'DoS', icon: '🚦', color: '#f7b324', bg: '#fdecc8' },
];

export const categoryMap = new Map(
  categories.map((category) => [category.label, category])
);
