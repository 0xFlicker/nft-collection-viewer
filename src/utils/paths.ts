export function host(path: string) {
  return `${process.env.NEXT_GITHUB_PAGES_HOST}/${process.env.NEXT_GITHUB_PAGES_REPO}/${path}`;
}
