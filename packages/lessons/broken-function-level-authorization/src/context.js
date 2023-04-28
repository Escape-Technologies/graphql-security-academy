import { getUser } from './database.js';

/**
 * Produces a context object for the GraphQL server.
 *
 * @param {import('express').Request} req
 */
export const getContext = (req) => {
  if (req.headers.authorization) {
    const [type, credentials] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      // Simple authorization: the user is identified their id
      return { user: getUser(credentials) };
    }
  }
  return {};
};
