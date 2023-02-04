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

Copy `.env.sample` to `.env`, and update values except for `GROUP_RELATION`.

```dotenv
GITLAB_HOST=https://gitlab.com
GITLAB_TOKEN=(GITLAB TOKEN)
GITLAB_TARGET_NAMESPACE=(GITLAB NAMESPACE)

GITHUB_HOST=https://api.github.com
GITHUB_TOKEN=(GITHUB TOKEN)

GROUP_RELATION=""
```

Get GitHub organization detail information.

```bash
$ npm run start -- organization (GIT HUB ORGANIZATION SLUG)

{ organization: { id: '****', name: 'Group Name' } }
```

then, copy id to `GROUP_RELATION` like this.  
(Actually it's complicated syntax...)

```dotenv
GROUP_RELATION="(GITLAB NAMESPACE):(GITHUB ORGANIZATION NAME):(GITHUB ORGANIZATION ID)"
```

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