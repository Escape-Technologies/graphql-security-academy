# learn.escape.tech

Learn GraphQL security directly in your browser.

## How to contribute?

This project is open source and we welcome contributions.

This project is made of two separate parts:

- [app](./packages/app/) is a Svelte IDE that runs in the browser.
- [lessons](./packages/lessons/) contains all the tutorials.

A lesson is a regular npm package that contains at least a `package.json` file and a `README.md` (Svelte-enhanced markdown) file.

```bash
# Clone the repository
git clone https://github.com/Escape-Technologies/learn.escape.tech.git
cd learn.escape.tech

# Install the dependencies
yarn install

# Start the stack
yarn dev
```
