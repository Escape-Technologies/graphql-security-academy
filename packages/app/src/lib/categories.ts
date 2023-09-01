export const categories = [
  {
    label: 'Access Control',
    component: 'AccessControl',
    color: '#ff9b7f',
    bg: '#f5d7d7',
  },
  { label: 'HTTP', component: 'Http', color: '#e3fcf8', bg: '#76ccbb' },
  {
    label: 'Information Disclosure',
    component: 'InformationDiclosure',
    color: '#fff184',
    bg: '#b7e0e6',
  },
  {
    label: 'Complexity',
    component: 'Complexity',
    color: '#E0D1EF',
    bg: '#f7aba7',
  },
  {
    label: 'Injection',
    component: 'Injection',
    color: '#ff9797',
    bg: '#ffefbe',
  },
  { label: 'DoS', component: 'Dos', color: '#ffc3ff', bg: '#aee8ff' },
];

export const categoryMap = new Map(
  categories.map((category) => [category.label, category]),
);
