import { getUsers } from './database.js';

export const Query = {
  users: getUsers,
  me: (_, args, context) => context.user,
};

export const User = {
  id: (user) => user.id,
  name: (user) => user.name,
  location: (user) => {
    return user.location;
  },
};
