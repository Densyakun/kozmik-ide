import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, readdir } from 'fs-extra';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import errorMap from "../../../lib/errorMap";

export type DirItem = {
  name: string;
  isDirectory: boolean;
  isSymbolicLink: boolean;
};

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<{ items: DirItem[] } | { error: string }>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    const path = decodeURIComponent(req.query.path as string);

    if (req.method === 'GET') {
      const dirents = await readdir(path, { withFileTypes: true });

      res.json({
        items: dirents.map(file => ({
          name: file.name,
          isDirectory: file.isDirectory(),
          isSymbolicLink: file.isSymbolicLink()
        }))
      });
    } else if (req.method === 'POST') {
      await mkdir(path);

      res.end();
    }
  } catch (err) {
    res.status(500);

    if (err instanceof Error) {
      res.status(errorMap[(err as any).code as string] ?? 500);

      return res.json({ error: (err as any).code || err.message });
    } else if (typeof err === 'string')
      return res.json({ error: err });

    console.error(err);
    res.end();
  }
}
