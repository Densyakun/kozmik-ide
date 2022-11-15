import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  loginPasswordIsExist: boolean;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (!process.env.LOGIN_PASSWORD) {
    res.json({
      isLoggedIn: true,
      loginPasswordIsExist: false,
    });
  } else if (req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
      loginPasswordIsExist: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      loginPasswordIsExist: true,
    });
  }
}
