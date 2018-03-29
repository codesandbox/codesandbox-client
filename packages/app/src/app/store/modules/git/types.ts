export type Git = {
  branch: string
  commitSha: string
  path: string
  repo: string
  username: string
}

export type GitChanges = {
  added: string[]
  deleted: string[]
  modified: string[]
  rights: 'none' | 'read' | 'write' | 'admin'
}

export type Commit = {
  git: Git,
  merge: boolean
  newBranch: string
  sha: string
  url: string
}

export type Pr = {
  git: Git,
  newBranch: string
  sha: string
  url: string
}

export type State = {
  repoTitle: string
  error: string
  isExported: string
  showExportedModal: boolean
  isFetching: boolean
  message: string
  originalGitChanges: GitChanges
  commit: Commit
  pr: Pr
  isCommiting: boolean
  isCreatingPr: boolean
}
