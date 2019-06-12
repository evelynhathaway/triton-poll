workflow "ESLint" {
  on = "push"
  resolves = ["ESLint checks"]
}

action "ESLint checks" {
  uses = "gimenete/eslint-action@1.0"
  secrets = ["GITHUB_TOKEN"]
}
