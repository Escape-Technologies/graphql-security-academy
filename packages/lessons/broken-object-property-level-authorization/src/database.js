/** The `users` table. */
const users = new Map([
  ['1', { name: 'Alice', location: 'Tokyo, Japan' }],
  ['2', { name: 'Bob', location: 'San Francisco, US' }],
  ['3', { name: 'Eve', location: 'Toulouse, France' }],
]);

export const getUser = (id) => {
  const user = users.get(id);
  if (user) return { id, ...user };
};
export const getUsers = () => [...users].map(([id, user]) => ({ id, ...user }));
