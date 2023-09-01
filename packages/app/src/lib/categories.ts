export const categories = [
  { label: 'Access Control', icon: '🛡️', color: '#ff9b7f', bg: '#f5d7d7' },
  { label: 'HTTP', icon: '📡', color: '#e3fcf8', bg: '#76ccbb' },
  {
    label: 'Information Disclosure',
    icon: '📢',
    color: '#fff184',
    bg: '#b7e0e6',
  },
  { label: 'Complexity', icon: '🚂', color: '#E0D1EF', bg: '#f7aba7' },
  { label: 'Injection', icon: '💉', color: '#ff9797', bg: '#ffefbe' },
  { label: 'DoS', icon: '🚦', color: '#ffc3ff', bg: '#aee8ff' },
];

export const categoryMap = new Map(
  categories.map((category) => [category.label, category]),
);
