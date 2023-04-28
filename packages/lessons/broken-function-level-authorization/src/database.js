/** The `users` table. */
const users = new Map([
  ['1', { name: 'Alice' }],
  ['2', { name: 'Bob' }],
  ['3', { name: 'Eve' }],
]);

/** The `posts` table. Each post has an author referenced by `authorId`. */
const posts = new Map([
  ['1', { authorId: '1', title: 'Hello World!' }],
  ['2', { authorId: '2', title: 'Welcome to my feed' }],
]);
let postIndex = 2;

export const getUser = (id) => {
  const user = users.get(id);
  if (user) return { id, ...user };
};
export const getUsers = () => [...users].map(([id, user]) => ({ id, ...user }));

export const getPost = (id) => {
  const post = posts.get(id);
  if (post) return { id, ...post };
};
export const getUserPosts = (user) =>
  [...posts]
    .filter(([, { authorId }]) => authorId === user.id)
    .map(([id, post]) => ({ id, ...post }));

export const createPost = (title, authorId) => {
  const id = String(++postIndex);
  const post = { authorId, title };
  posts.set(id, post);
  return { id, ...post };
};
export const deletePost = (id) => posts.delete(id);
