import { Backspace, TextFields } from '@mui/icons-material';
import { Box, Card, Dialog, IconButton, TextField, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { BigIntLiteral, ImportDeclaration, JsxText, NoSubstitutionTemplateLiteral, Node, NumericLiteral, RegularExpressionLiteral, SourceFile, StringLiteral, SyntaxKind, SyntaxList, VariableDeclaration, VariableDeclarationKind, VariableDeclarationList, VariableStatement } from 'ts-morph';

export function NodeBox({ children, isRoot = false }: { children: ReactNode, isRoot?: boolean }) {
  return (
    <Box sx={{ px: isRoot ? 0 : 1 }}>
      {children}
    </Box>
  );
}

export type NodePropsType = { node: Node, setDirty: () => void };

export default function SourceFileComponent({ node, setDirty }: NodePropsType & { node: SourceFile, setDirty: () => void }) {
  const children = node.getChildren();

  return (
    <>
      {children.map((child, index) => <NodeComponent key={index} node={child} setDirty={setDirty} isRoot />)}
    </>
  );
}

export function NodeComponent({ node, setDirty, isRoot = false }: NodePropsType & { isRoot?: boolean }) {
  return (
    <NodeBox isRoot={isRoot}>
      {
        node.getKind() === SyntaxKind.SyntaxList ? <SyntaxListComponent node={node as SyntaxList} setDirty={setDirty} /> :
          node.getKind() === SyntaxKind.ImportDeclaration ? <ImportDeclarationComponent importDeclaration={node as ImportDeclaration} onDelete={() => {
            setDirty();

            (node as ImportDeclaration).remove();
          }} /> :
            node.getKind() === SyntaxKind.SingleLineCommentTrivia
              || node.getKind() === SyntaxKind.MultiLineCommentTrivia ? null :
              node.getKind() === SyntaxKind.NumericLiteral ? <NumericLiteralComponent node={node as NumericLiteral} /> :
                node.getKind() === SyntaxKind.BigIntLiteral ? <BigIntLiteralComponent node={node as BigIntLiteral} /> :
                  node.getKind() === SyntaxKind.StringLiteral ? <StringLiteralComponent node={node as StringLiteral} /> :
                    node.getKind() === SyntaxKind.JsxText ? <JsxTextComponent node={node as JsxText} /> :
                      node.getKind() === SyntaxKind.RegularExpressionLiteral ? <RegularExpressionLiteralComponent node={node as RegularExpressionLiteral} /> :
                        node.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral ? <NoSubstitutionTemplateLiteralComponent node={node as NoSubstitutionTemplateLiteral} /> :
                          node.getKind() === SyntaxKind.VariableStatement ? <VariableStatementComponent node={node as VariableStatement} setDirty={setDirty} /> :
                            node.getKind() === SyntaxKind.VariableDeclarationList ? <VariableDeclarationListComponent node={node as VariableDeclarationList} setDirty={setDirty} /> :
                              node.getKind() === SyntaxKind.VariableDeclaration ? <VariableDeclarationComponent node={node as VariableDeclaration} setDirty={setDirty} /> :
                                node.getKind() === SyntaxKind.EndOfFileToken ? <EndOfFileTokenComponent node={node} /> :
                                  <UnknownNodeComponent node={node} setDirty={setDirty} />
      }
    </NodeBox>
  );
}

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  text: string;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, text } = props;

  return (
    <Dialog
      fullWidth={true}
      onClose={onClose}
      open={open}
    >
      <TextField
        defaultValue={text}
        multiline
        rows={0}
        InputProps={{
          readOnly: true,
        }}
      />
    </Dialog>
  );
}

export function ActionButtons({ node, isRoot = false, onDelete }: { node: Node, isRoot?: boolean, onDelete?: () => void }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <>
      {<IconButton aria-label="show text" size="small" onClick={handleClickOpen}>
        <TextFields fontSize="small" />
      </IconButton>}
      {!isRoot && onDelete !== undefined && <IconButton aria-label="delete" size="small" onClick={onDelete}>
        <Backspace fontSize="small" />
      </IconButton>}
      <SimpleDialog
        open={open}
        onClose={handleClose}
        text={node.getFullText()}
      />
    </>
  );
}

export function NodeHeader({ node, title, isRoot = false, onDelete }: { node: Node, title: string, isRoot?: boolean, onDelete?: () => void }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      {title}
      <ActionButtons node={node} isRoot={isRoot} onDelete={onDelete} />
      <SimpleDialog
        open={open}
        onClose={handleClose}
        text={node.getFullText()}
      />
    </Typography>
  );
}

export function UnknownNodeComponent({ node, setDirty }: NodePropsType) {
  return (
    <>
      <NodeHeader node={node} title={`kind: ${node.getKindName()} (${node.getKind()})`} />
      {node.getChildren().map((child, index) => <NodeComponent key={index} node={child} setDirty={setDirty} />)}
    </>
  );
}

export function SyntaxListComponent({ node, setDirty }: NodePropsType & { node: SyntaxList }) {
  const children = node.getChildren();

  return (
    <>
      {children.map((child, index) => <NodeComponent key={index} node={child} setDirty={setDirty} isRoot />)}
    </>
  );
}

export function EndOfFileTokenComponent({ node }: { node: Node }) {
  return (
    <>
      <NodeHeader node={node} title='(EOF)' />
    </>
  );
}

export function NumericLiteralComponent({ node }: { node: NumericLiteral }) {
  return (
    <>
      <NodeHeader node={node} title={node.getLiteralText()} />
    </>
  );
}

export function BigIntLiteralComponent({ node }: { node: BigIntLiteral }) {
  return (
    <>
      <NodeHeader node={node} title={node.getLiteralText()} />
    </>
  );
}

export function StringLiteralComponent({ node }: { node: StringLiteral }) {
  return (
    <>
      <NodeHeader node={node} title={node.getLiteralText()} />
    </>
  );
}

export function JsxTextComponent({ node }: { node: JsxText }) {
  const literalText = node.getLiteralText();
  return (
    <>
      <NodeHeader node={node} title={literalText.trim() ? literalText : '(Empty literal text)'} />
    </>
  );
}

export function RegularExpressionLiteralComponent({ node }: { node: RegularExpressionLiteral }) {
  return (
    <>
      <NodeHeader node={node} title={node.getLiteralText()} />
    </>
  );
}

export function NoSubstitutionTemplateLiteralComponent({ node }: { node: NoSubstitutionTemplateLiteral }) {
  return (
    <Card>
      <pre>`{node.getLiteralText()}`</pre>
    </Card>
  );
}

export function ImportDeclarationComponent({ importDeclaration, onDelete }: { importDeclaration: ImportDeclaration, onDelete: () => void }) {
  const structure = importDeclaration.getStructure();

  return (
    <>
      <NodeHeader node={importDeclaration} title={'import ' + (structure.isTypeOnly ? '(type) ' : '') + structure.moduleSpecifier} onDelete={onDelete} />
    </>
  );
}

export function VariableStatementComponent({ node, setDirty }: NodePropsType & { node: VariableStatement }) {
  return (
    <VariableDeclarationListComponent node={node.getDeclarationList()} setDirty={setDirty} />
  );
}

export function VariableDeclarationListComponent({ node, setDirty }: NodePropsType & { node: VariableDeclarationList }) {
  const declarationKind = node.getDeclarationKind();

  return (
    <>
      <NodeHeader node={node} title={declarationKind === VariableDeclarationKind.Const ? 'const' : declarationKind === VariableDeclarationKind.Let ? 'let' : 'var'} />
      {node.getDeclarations().map((variableDeclaration, index) => <NodeComponent key={index} node={variableDeclaration} setDirty={setDirty} />)}
    </>
  );
}

export function VariableDeclarationComponent({ node, setDirty }: NodePropsType & { node: VariableDeclaration }) {
  const variableDeclarationStructure = node.getStructure();
  const initializer = node.getInitializer();

  return (
    <>
      <NodeHeader node={node} title={
        variableDeclarationStructure.name
        + (variableDeclarationStructure.type ? ': ' + variableDeclarationStructure.type : '')
        + ' ='
      } />
      {initializer && <NodeComponent node={initializer} setDirty={setDirty} />}
    </>
  );
}
