import { NextApiRequest, NextApiResponse } from "next";
import { rename, unlink, writeFile } from "fs-extra";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { resolve } from "path";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<string>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    const path = decodeURIComponent(req.query.path as string);

    if (req.method === 'POST') {
      const filePath = decodeURIComponent(req.body.filePath as string);

      await writeFile(resolve(path, filePath), "");

      res.end();
    } else if (req.method === 'PUT') {
      const newPath = decodeURIComponent(req.body.newPath as string);

      await rename(path, newPath);

      res.end();
    } else if (req.method === 'DELETE') {
      await unlink(path);

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
