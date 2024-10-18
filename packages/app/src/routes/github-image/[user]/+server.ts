import { redirect } from '@sveltejs/kit';

/**
 * Redirects to a GitHub user image. It is not possible to do it client side
 * because of `Cross-Origin-Embedder-Policy`.
 */
export const GET = async ({ params, fetch }) => {
  const response = await fetch(`https://github.com/${params.user}.png`);
  redirect(302, response.url);
};
