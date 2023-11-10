import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { Node, Project, StructureKind, VariableStatementStructure, ts } from "ts-morph";
import { getReplacedText } from "@/TSMorphEditor/manipulate";

export type NodeJson = {
  kind: ts.SyntaxKind,
  kindName: string,
  children: NodeJson[],
};

function nodeToJson(node: Node<ts.Node>): NodeJson {
  return {
    kind: node.getKind(),
    kindName: node.getKindName(),
    children: node.getChildren().map(child => nodeToJson(child)),
  };
}

export default withIronSessionApiRoute(route, sessionOptions);

async function route(req: NextApiRequest, res: NextApiResponse<NodeJson | string>) {
  if (process.env.LOGIN_PASSWORD && !req.session.user)
    return res.status(401).end();

  try {
    if (req.method === 'GET') {
      const filePath = req.query.path as string;

      /*const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
      });*/
      const project = new Project();

      const sourceFile = project.addSourceFileAtPath(filePath);

      const oldProgramAndComments = sourceFile.getFullText();

      const sourceFileStructure = sourceFile.getStructure();
      sourceFile.set(sourceFileStructure);
      const oldProgram = sourceFile.getText();

      if (Array.isArray(sourceFileStructure.statements)) {
        sourceFileStructure.statements.forEach(statement => {
          if (typeof statement === 'object' && 'kind' in statement) {
            if (statement.kind === StructureKind.VariableStatement) {
              (statement as VariableStatementStructure).declarations.forEach(declaration => {
                declaration.name += '_';
              });
            } else
              console.log(StructureKind[statement.kind]);
          }
        });
      }
      sourceFile.set(sourceFileStructure);
      const newProgram = sourceFile.getText();

      const replacedText = getReplacedText(
        oldProgram,
        oldProgramAndComments,
        newProgram
      );
      sourceFile.replaceWithText(replacedText);

      await sourceFile.save();

      const nodeJson: NodeJson = nodeToJson(sourceFile);

      res.status(200).json(nodeJson);
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
