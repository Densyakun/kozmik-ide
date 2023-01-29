import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ts, { factory } from "typescript";
import NodePropTable from "./NodePropTable";

export function UnknownSyntaxKind({ kind }: { kind: ts.SyntaxKind }) {
  const theme = useTheme();
  const backgroundColor = theme.palette.warning.main;

  return <Paper component="span" sx={{ m: 0.5, p: 0.5, backgroundColor, color: theme.palette.getContrastText(backgroundColor) }}>
    {ts.SyntaxKind[kind]}
  </Paper>;
}

export function StringLiteral({
  stringLiteral,
  setStringLiteral
}: {
  stringLiteral: ts.StringLiteral,
  setStringLiteral: (newStringLiteral: ts.StringLiteral) => void
}) {
  const [value, setValue] = useState(stringLiteral.text);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    stringLiteral.text = event.target.value;
    setStringLiteral(stringLiteral);
  };

  return <TextField
    fullWidth
    hiddenLabel
    //label="StringLiteral"
    value={value}
    onChange={handleChange}
    variant="filled"
    size="small"
  />;
}

export function Expression({
  expression,
  setExpression
}: {
  expression: ts.Expression,
  setExpression: (newExpression: ts.Expression) => void
}) {
  switch (expression.kind) {
    case ts.SyntaxKind.StringLiteral:
      const stringLiteral = expression as ts.StringLiteral;

      return <StringLiteral stringLiteral={stringLiteral} setStringLiteral={setExpression} />;
    default:
      return <UnknownSyntaxKind kind={expression.kind} />;
  }
}

export function Statement({
  statement,
  setStatement
}: {
  statement: ts.Statement,
  setStatement: (newStatement: ts.Statement) => void
}) {
  switch (statement.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      const importDeclaration = statement as ts.ImportDeclaration;

      // TODO
      //importDeclaration.decorators
      //importDeclaration.modifiers

      let rows: [string, JSX.Element, boolean?][] = [
        ['moduleSpecifier', <Expression expression={importDeclaration.moduleSpecifier} setExpression={newModuleSpecifier => setStatement(factory.createImportDeclaration(
          importDeclaration.decorators,
          importDeclaration.modifiers,
          importDeclaration.importClause,
          newModuleSpecifier,
          importDeclaration.assertClause
        ))} />, true],
      ];
      if (importDeclaration.importClause)
        rows.push(['importClause', <UnknownSyntaxKind kind={importDeclaration.importClause.kind} />]);
      if (importDeclaration.assertClause)
        rows.push(['assertClause', <UnknownSyntaxKind kind={importDeclaration.assertClause.kind} />]);

      return <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6">
          Import
        </Typography>
        <NodePropTable rows={rows} />
      </Paper>
    default:
      return <UnknownSyntaxKind kind={statement.kind} />;
  }
}

export function TSX({
  sourceText,
  onChange
}: {
  sourceText: string,
  onChange: (newValue: string) => void
}) {
  const [statements, setStatements] = useState<ts.NodeArray<ts.Statement>>(factory.createNodeArray());
  const [sourceFile, setSourceFile] = useState<ts.SourceFile>();

  useEffect(() => {
    setSourceFile(ts.createSourceFile('someFileName.tsx', sourceText, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX));
  }, [sourceText]);

  useEffect(() => {
    if (sourceFile) setStatements(sourceFile.statements);
  }, [sourceFile]);

  return statements
    ? <Stack spacing={2}>
      {statements.map((statement, statementIndex) => {
        function handleSetStatement(newStatement: typeof statement, newStatementIndex: number) {
          if (!sourceFile) return;

          const newStatements = factory.createNodeArray(statements.map((oldStatement, index) => index === newStatementIndex ? newStatement : oldStatement));

          const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

          const result = printer.printList(
            ts.ListFormat.MultiLine,
            newStatements,
            sourceFile
          );
          onChange(result);
        }

        return <Statement
          statement={statement}
          setStatement={newStatement => handleSetStatement(newStatement, statementIndex)}
        />;
      })}
    </Stack>
    : null;
}
