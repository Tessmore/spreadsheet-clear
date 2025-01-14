# PLACEHOLDER_TITLE

Create a minimal React app that makes use of TypeScript, Vite, Prettier et cetera.

## Usage

```bash
git clone --depth 1 git@github.com:Tessmore/react-ts-minimal-template my-app

cd my-app

# Start your own history
rm -rf .git
git init
git branch -M main

yarn install

yarn dev
```

## Available commands

Run in development mode

```bash
  yarn dev
```

Create production build

```bash
  yarn build
```

Run ESLint linting

```bash
  yarn lint
```

Run Prettier formatting

```bash
  yarn format
```

Deploy using GitHub pages

```bash
  yarn run deploy
```

Set app title

```
git ls-files | xargs sed -i 's/PLACEHOLDER_TITLE/TITLE/g'
```

Set app author

```
git ls-files | xargs sed -i 's/PLACEHOLDER_AUTHOR/AUTHOR/g'
```

Change `<repository>` references

```
git ls-files | xargs sed -i 's/react-ts-minimal-template/YOUR_REPOSITORY/g'
```

## Publish code

Once you cloned this repository and made the repository yours, you can host it yourself:

```
git commit -am "Initial commit"
```

- Create new repository (but do *not* initialize it with a README, .gitignore, or license)

```
git remote add origin git@github.com:<username>/<your-repo-name>.git

# Alternatively, update the remote
git remote set-url origin git@github.com:<username>/<your-repo-name>.git
```

- Push your changes

```
git push -u origin main
```

## Resources

A minimal Vite + React + TypeScript template with pre-configured ESLint (with Airbnb JS/React rules), Prettier and Git hooks powered by Husky out of the box 📦, based on https://github.com/alessandropisu/vite-react-ts-minimal-template

![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)


## License

[MIT](https://choosealicense.com/licenses/mit/)
