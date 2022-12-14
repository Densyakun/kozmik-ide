import { resolve } from 'path';
import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, readdir, remove, rename } from 'fs-extra';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

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
    const path = decodeURIComponent(req.query.path as string);

    if (req.method === 'GET') {
      const files = await readdir(path, { withFileTypes: true });

      res.json(files.map(file => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        isSymbolicLink: file.isSymbolicLink()
      })));
    } else if (req.method === 'POST') {
      const filePath = decodeURIComponent(req.body.filePath as string);

      await mkdir(resolve(path, filePath));

      res.end();
    } else if (req.method === 'PUT') {
      const newPath = decodeURIComponent(req.body.newPath as string);

      await rename(path, newPath);

      res.end();
    } else if (req.method === 'DELETE') {
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
