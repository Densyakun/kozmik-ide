import { NextApiRequest, NextApiResponse } from "next";
import { runtime } from "@ts-morph/common";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<{ isCaseSensitive: boolean }>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  if (req.method === 'GET') {
    const fs = runtime.fs;

    res.status(200).json({
      isCaseSensitive: fs.isCaseSensitive()
    });
  }
}
