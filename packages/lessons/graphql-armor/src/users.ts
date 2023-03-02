/** A mock database table of users. */
const users = [
  { name: 'Alice', friends: [1, 3, 4] },
  { name: 'Bob', friends: [0, 2, 3] },
  { name: 'Charlie', friends: [1, 3, 4] },
  { name: 'Dan', friends: [0, 1, 2, 4] },
  { name: 'Eve', friends: [0, 2, 3] },
];

/** Our user type, as resolved in GraphQL. */
export type User = { id: number; name: string };

/** `SELECT id, name FROM users WHERE id=:id` */
export const getUser = (id: number): User => ({ id, name: users[id].name });

/** Performs a one-to-many lookup for friends. */
export const getFriends = (id: number): User[] =>
  users[id].friends.map(getUser);
