import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { readdir } from 'fs/promises';

export type Dir = {
  name: string;
  isDirectory: boolean;
}[] | string;

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<Dir>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  const path = req.query.path as string;

  try {
    const files = await readdir(path, { withFileTypes: true });

    res.json(files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory()
    })));
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
