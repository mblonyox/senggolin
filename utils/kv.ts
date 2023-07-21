const kv = await Deno.openKv();

export type Link = {
  url: string;
  path: string;
  createdAt: Date;
  clicks: number;
  sessionId: string;
};

export const insertLink = async (link: Link) => {
  const pathKey = ["link", link.path];
  const sessionKey = ["session", link.sessionId, link.createdAt.getTime()];
  const res = await kv.atomic()
    .check({ key: pathKey, versionstamp: null })
    .check({ key: sessionKey, versionstamp: null })
    .set(pathKey, link)
    .set(sessionKey, link)
    .commit();
  if (!res.ok) throw new Error("Link already exists.");
};

export const getLinkByPath = async (path: string): Promise<Link | null> => {
  const res = await kv.get<Link>(["link", path]);
  return res.value;
};

export const linkClicks = async (link: Link) => {
  const pathKey = ["link", link.path];
  const sessionKey = ["session", link.sessionId, link.createdAt.getTime()];
  let res = { ok: false };
  while (!res.ok) {
    const entry1 = await kv.get<Link>(pathKey);
    const entry2 = await kv.get<Link>(sessionKey);
    if (entry1.value === null || entry2.value === null) {
      throw new Error("Link already deleted.");
    }
    const clicks = Math.max(
      entry1.value?.clicks,
      entry2.value?.clicks,
    ) + 1;
    const updatedLink = { ...link, clicks };
    res = await kv.atomic()
      .check(entry1)
      .check(entry2)
      .set(pathKey, updatedLink)
      .set(sessionKey, updatedLink)
      .commit();
  }
};

export const getLinksBySessionId = async (
  sessionId: string,
): Promise<Link[]> => {
  const list = await kv.list<Link>({ prefix: ["session", sessionId] });
  const res = [];
  for await (const link of list) {
    res.push(link.value);
  }
  return res;
};

export const deleteLink = async (link: Link) => {
  const pathKey = ["link", link.path];
  const sessionKey = ["session", link.sessionId, link.createdAt.getTime()];
  let res = { ok: false };
  while (!res.ok) {
    const entry1 = await kv.get<Link>(pathKey);
    const entry2 = await kv.get<Link>(sessionKey);
    res = await kv.atomic()
      .check(entry1)
      .check(entry2)
      .delete(pathKey)
      .delete(sessionKey)
      .commit();
  }
};
