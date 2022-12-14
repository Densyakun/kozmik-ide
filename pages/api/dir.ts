import { mkdir, readdir, remove, rename } from 'fs-extra';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type Dir = {
  name: string;
  isDirectory: boolean;
  isSymbolicLink: boolean;
}[];

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<Dir | string>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    if (req.method === 'GET') {
      const path = decodeURIComponent(req.query.path as string);

      const files = await readdir(path, { withFileTypes: true });

      res.json(files.map(file => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        isSymbolicLink: file.isSymbolicLink()
      })));
    } else if (req.method === 'POST') {
      const path = decodeURIComponent(req.body.path as string);

      await mkdir(path);

      res.end();
    } else if (req.method === 'PUT') {
      const oldPath = decodeURIComponent(req.query.path as string);
      const newPath = decodeURIComponent(req.body.path as string);

      await rename(oldPath, newPath);

      res.end();
    } else if (req.method === 'DELETE') {
      const path = decodeURIComponent(req.body.path as string);

      await remove(path);

      res.end();
    }
  } catch (err) {
    res.status(400);

    if (err instanceof Error)
      return res.send(err.message);
    else if (typeof err === 'string')
      return res.send(err);

    console.error(err);
    return res.end();
  }
}
