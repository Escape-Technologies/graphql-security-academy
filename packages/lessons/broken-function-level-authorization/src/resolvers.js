import { GraphQLError } from 'graphql';
import { createPost, deletePost, getUserPosts, getUsers } from './database.js';

export const Query = {
  users: getUsers,
  me: (_, args, context) => context.user,
};

export const Mutation = {
  createPost: (_, args, context) => {
    if (!context.user) throw new GraphQLError('Not authorized');
    return createPost(args.title, context.user.id);
  },
  deletePost: (_, args) => {
    return deletePost(args.id);
  },
};

export const User = {
  id: (user) => user.id,
  name: (user) => user.name,
  posts: (user) => getUserPosts(user),
};

export const Post = {
  id: (post) => post.id,
  authorId: (post) => post.authorId,
  title: (post) => post.title,
};
