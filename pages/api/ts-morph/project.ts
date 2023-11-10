import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { Project } from "ts-morph";
import path from "path";

export type ProjectJson = {
  sourceFiles: string[];
  //diagnosticMessages: string[];
  formatDiagnosticsWithColorAndContext: string;
};

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<ProjectJson | string>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    if (req.method === 'GET') {
      const projectPath = req.query.path as string;

      const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
      });

      const sourceFiles = project.getSourceFiles();

      const diagnostics = project.getPreEmitDiagnostics();

      const projectJson: ProjectJson = {
        sourceFiles: sourceFiles.map(sourceFile => sourceFile.getFilePath()),
        //diagnosticMessages: diagnostics.map(diagnostic => diagnostic.getMessageText()),
        formatDiagnosticsWithColorAndContext: project.formatDiagnosticsWithColorAndContext(diagnostics),
      };

      res.status(200).json(projectJson);
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
