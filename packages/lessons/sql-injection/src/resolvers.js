import argon2 from 'argon2-browser';
import { GraphQLError } from 'graphql';
import { webcrypto as crypto } from 'node:crypto';
import { createUser, getUserByEmail, getUsers } from './database.js';

export const Query = {
  users: getUsers,
};

export const Mutation = {
  login: async (_, args) => {
    try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error('No user found');
      // argon2.verify() throws on invalid password
      await argon2.verify({ encoded: user.password, pass: args.password });
      return user;
    } catch {
      throw new GraphQLError('Invalid credentials');
    }
  },
  register: async (_, args) => {
    if (args.password.length < 8) {
      throw new GraphQLError('Password must be at least 8 characters');
    }
    const { encoded } = await argon2.hash({
      pass: args.password,
      salt: crypto.getRandomValues(new Uint8Array(16)),
    });
    await createUser(args.email, encoded);
    return true;
  },
};

export const User = {
  id: (user) => user.id,
  email: (user) => user.email,
  admin: (user) => Boolean(user.admin),
};
