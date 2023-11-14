import { ArrowFunction, BinaryExpression, Block, ExportAssignment, ExpressionStatement, FunctionDeclaration, Identifier, ReturnStatement, SyntaxKind } from 'ts-morph';
import { NodeComponent, NodePropsType } from './SourceFileComponent';

export function NextJSPageReplaceComponent({ node, setDirty }: NodePropsType) {
  const children = node.getChildren();

  return (
    <>
      {children.map((child, index) => {
        const kind = child.getKind();

        if (kind === SyntaxKind.FunctionDeclaration) {
          if ((child as FunctionDeclaration).isDefaultExport()) {
            const body = (child as FunctionDeclaration).getBody();

            if (body) {
              const statements = (body as Block).getStatements();

              for (let i = 0; i < statements.length; i++) {
                if (statements[i].getKind() === SyntaxKind.ReturnStatement) {
                  const expression = (statements[i] as ReturnStatement).getExpression();

                  if (expression) {
                    if (expression.getKind() === SyntaxKind.JsxElement) {
                      // TODO
                    } else {
                      // TODO
                    }
                  }

                  break;
                }
              }
            }
          }
        } else if (kind === SyntaxKind.ExportAssignment) {
          const expression = (child as ExportAssignment).getExpression();

          if (expression.getKind() === SyntaxKind.Identifier) {
            const sourceFile = node.getSourceFile();
            const variableDeclaration = sourceFile.getVariableDeclaration((expression as Identifier).getText());

            if (variableDeclaration) {
              const initializer = variableDeclaration.getInitializer();

              if (initializer) {
                if (initializer.getKind() === SyntaxKind.FunctionExpression) {
                  // TODO
                }
              } else {
                const statement = sourceFile.getStatement(statement => {
                  if (statement.getKind() === SyntaxKind.ExpressionStatement) {
                    const expression = (statement as ExpressionStatement).getExpression();

                    if (expression.getKind() === SyntaxKind.BinaryExpression && (expression as BinaryExpression).getOperatorToken().getKind() === SyntaxKind.EqualsToken) {
                      const leftKind = (expression as BinaryExpression).getLeft().getKind();

                      if (leftKind === SyntaxKind.Identifier) {
                        const rightKind = (expression as BinaryExpression).getRight().getKind();

                        if (rightKind === SyntaxKind.FunctionExpression) {
                          // TODO
                        } else {
                          // TODO
                        }
                      } else {
                        // TODO
                      }
                    }
                  }

                  return false;
                });

                if (statement) {
                  // TODO
                }
              }
            }
          } else if (expression.getKind() === SyntaxKind.ArrowFunction) {
            const body = (expression as ArrowFunction).getBody();

            if (body.getKind() === SyntaxKind.Block) {
              // TODO
            } else if (body.getKind() === SyntaxKind.Identifier) {
              // TODO
            }
          }
          // TODO
        }

        return <NodeComponent key={index} node={child} setDirty={setDirty} isRoot />;
      })}
    </>
  );
}

export function NextJSPageComponent({ node, setDirty }: NodePropsType) {
  return (
    <>
      <NodeComponent node={node} setDirty={setDirty} />
    </>
  );
}
