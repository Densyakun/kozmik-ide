import { NextApiRequest, NextApiResponse } from "next";
import { pathExists } from 'fs-extra';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import errorMap from "../../../lib/errorMap";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<{ exists: boolean } | { error: string }>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    if (req.method === 'GET') {
      const path = decodeURIComponent(req.query.path as string);

      const result = await pathExists(path);

      res.status(200).json({
        exists: result
      });
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
