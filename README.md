# GitLab to GitHub Transferer

Just transfer GitLab repository to GitHub.

**This command won't transfer issues, merge requests, wiki and so on. Just repository data.**

If you want to transfer issues and merge requests, maybe you can use [node-gitlab-2-github](https://github.com/piceaTech/node-gitlab-2-github).

## Usage

### 1. Setup

Install dependencies

```bash
$ npm install
```

Copy `.env.sample` to `.env`, and update values except for `GITHUB_ORG_ID`.

```dotenv
GITLAB_HOST=https://gitlab.com
GITLAB_TOKEN=(GITLAB TOKEN)
GITLAB_TARGET_NAMESPACE=(GITLAB NAMESPACE)

GITHUB_HOST=https://api.github.com
GITHUB_TOKEN=(GITHUB TOKEN)
GITHUB_ORG=(GIT HUB ORGANIZATION SLUG)
GITHUB_ORG_ID=
```

Get GitHub organization detail information.

```bash
$ npm run start -- organization

{ organization: { id: '****', name: 'Group Name' } }
```

then, copy id to `GITHUB_ORG_ID`.

### 2. Prepare transfer list

When you run the following command, it will make `project-list.csv`.

```bash
$ npm run start -- list
```

If you want to change the repository name and url slut, you can change the above csv's `Name` and `ID` columns.

### 3. Transfer GitLab to GitHub

When you run the following command, transfer will start according to `project-list.csv`.

```bash
$ npm run start -- transfer
```