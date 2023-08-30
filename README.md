# GraphQL Security Academy by Escape.tech

## What is it?

GraphQL Security Academy provides hands-on, interactive lessons that teach various vulnerabilities and best practices in GraphQL security directly in your browser. Each lesson features a WebContainer with a live GraphQL application, demonstrating not just the risks but also how to exploit and fix them.


> 💡 The GraphQL Security Academy is accessible for free on https://escape.tech/academy


## Why Use GraphQL Security Academy?

- 📚 Comprehensive Lessons: Covering everything from basic to advanced GraphQL security topics.
- 💻 Interactive: Each lesson includes a WebContainer for a real-world experience.
- 🧑‍💻 For Developers and Security Engineers: Whether you're building or securing GraphQL apps, there's something to learn.
- 🆓 Free and Open Source: Learn at your own pace, and even contribute to make it better!

## Features

- 🌐 Browser-Based Learning: No downloads, no installs. Start learning immediately right within your browser.
- 🛠 Hands-On Experience: Apply what you've learned in real-world GraphQL app scenarios.


## How to Contribute

We're thrilled that you're interested in contributing to the GraphQL Security Academy! Contributions are essential for keeping this project informative, up-to-date, and most importantly, beneficial for everyone interested in GraphQL security. 

This project consists of two main components:

- [`app`](./packages/app/): A Svelte-based IDE that operates directly in your web browser.
- [`lessons`](./packages/lessons/): This directory houses all the tutorial content.

### What is a Lesson?

A lesson in GraphQL Security Academy is structured as a regular `npm` package, containing at least a `package.json` file and a `README.md` file. The README is Svelte-enhanced markdown that drives the lesson content.

### Quick Start Guide

If you're eager to contribute, here's how you can get started:

```bash
# Clone the GitHub repository
git clone https://github.com/Escape-Technologies/academy.git
cd academy
# Use yarn to install all necessary dependencies
yarn install
# Launch the development environment
yarn dev
```

Now, you should have a local instance of GraphQL Security Academy running. Feel free to make changes and test them out.


### Contribution Ideas
- Writing new lessons or updating existing ones.
- Enhancing the UI/UX of the `app` component.
- Reporting bugs and suggesting new features.

Feel free to submit a pull request or create an issue to discuss any changes you have in mind.

Thank you for contributing to making GraphQL more secure!
