import { GraphQLError } from 'graphql';
import { getPost, getUser, getUserPosts, getUsers } from './database.js';

export const Query = {
  users: getUsers,
  user: (_, args) => {
    const user = getUser(args.id);
    if (!user) throw new GraphQLError('User not found');
    return user;
  },
  post: (_, args, context) => {
    const post = getPost(args.id);
    if (!post) throw new GraphQLError('Post not found');
    if (!post.published && post.authorId !== context.user?.id)
      throw new GraphQLError('Unauthorized');
    return post;
  },
  me: (_, args, context) => context.user,
};

export const User = {
  id: (user) => user.id,
  name: (user) => user.name,
  // Only return published posts
  posts: (user) => getUserPosts(user).filter((post) => post.published),
};

export const Post = {
  id: (post) => post.id,
  authorId: (post) => post.authorId,
  title: (post) => post.title,
  published: (post) => post.published,
};
