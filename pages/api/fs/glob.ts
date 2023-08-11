import { NextApiRequest, NextApiResponse } from "next";
import fastGlob from "fast-glob";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import errorMap from "../../../lib/errorMap";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<{ paths: string[] } | { error: string }>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    const currentDirectory = typeof req.query.cd === 'string'
      ? decodeURIComponent(req.query.cd as string)
      : undefined;
    const patterns = JSON.parse(decodeURIComponent(req.query.patterns as string));

    if (req.method === 'GET') {
      const paths = await fastGlob(patterns as string[], {
        cwd: currentDirectory,
        absolute: true,
      });

      res.status(200).json({ paths });
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
