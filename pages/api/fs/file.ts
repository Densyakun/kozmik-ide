import { NextApiRequest, NextApiResponse } from "next";
import { readFile, writeFile } from "fs-extra";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import errorMap from "serverfailsoft/errorMap.json";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<{ data: string } | { error: any }>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    const path = decodeURIComponent(req.query.path as string);
    const options = (typeof req.query.options === 'string'
      ? JSON.parse(req.query.options as string)
      : {}
    ) as { flag?: string | undefined } | { encoding: string, flag?: string | undefined };

    if (req.method === 'GET') {
      const data = await readFile(path, options);

      // Return data in JSON format so that file data and errors can be detected
      res.json({ data });
    } else if (req.method === 'POST') {
      const data = req.body.data as string | undefined;

      await writeFile(path, data || "", options);

      res.end();
    }
  } catch (err) {
    try {
      res.status((errorMap as any)[(err as any).code as string] || 500);
    } catch (e) {
      res.status(500);
    }

    if (err instanceof Error)
      return res.json({ error: err.message });
    else if (typeof err === 'string')
      return res.json({ error: err });

    console.error(err);
    res.end();
  }
}
