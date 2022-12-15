import { resolve } from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { readFile, writeFile } from "fs-extra";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<string>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    const path = decodeURIComponent(req.query.path as string);

    if (req.method === 'GET') {
      const options = JSON.parse(req.query.options as string);

      const data = await readFile(path, options as { flag?: string | undefined } | { encoding: string, flag?: string | undefined });

      res.send(data);
    } else if (req.method === 'POST') {
      const filePath = req.body.filePath as string;

      await writeFile(resolve(path, filePath), "");

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
