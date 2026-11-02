/**
 * Turns a path taken from the URL (`liff.state`, `?redirect=`) into an
 * in-app path. Returns null for anything that could leave the app, such as
 * `//evil.com` or `https://evil.com`.
 */
export const toSafeAppPath = (raw: string | null | undefined) => {
  const value = raw?.trim();
  if (!value) return null;
  const path = value.startsWith("/") ? value : `/${value}`;
  if (path.startsWith("//") || path.includes("\\") || path.includes(":/")) {
    return null;
  }
  return path;
};
