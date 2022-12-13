import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, readdir } from 'fs/promises';

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
    if (req.method === 'POST') {
      const path = decodeURIComponent(req.body.path as string);

      await mkdir(path);

      res.end();
    } else {
      const path = decodeURIComponent(req.query.path as string);

      const files = await readdir(path, { withFileTypes: true });

      res.json(files.map(file => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        isSymbolicLink: file.isSymbolicLink()
      })));
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
