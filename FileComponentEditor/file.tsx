import { useEffect, useState } from "react";
import ts, { factory } from "typescript";

export function TSXStatement({
  nodes,
  index
}: {
  nodes: ts.NodeArray<ts.Node>,
  index: number
}) {
  const node = nodes[index];

  return <p>{node.kind} ({ts.SyntaxKind[node.kind]})</p>;
}

export function TSX({ sourceText }: { sourceText: string }) {
  const [sourceFile, setSourceFile] = useState<ts.SourceFile>();

  useEffect(() => {
    setSourceFile(ts.createSourceFile('someFileName.tsx', sourceText, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX));
  }, [sourceText]);

  return sourceFile && sourceFile.statements
    ? <>
      {"Statements: " + sourceFile.statements.length}
      {sourceFile.statements.map((node, index) => <TSXStatement
        key={index}
        nodes={sourceFile.statements}
        index={index}
      />)}
    </>
    : null;
}

export function File({ data }: { data: string }) {
  return <TSX sourceText={data} />
    ?? <>
      (Empty file components)
    </>;
}
