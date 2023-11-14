import { Backspace, TextFields } from '@mui/icons-material';
import { Box, Dialog, IconButton, TextField, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { ImportDeclaration, Node, SourceFile, SyntaxKind, SyntaxList, VariableDeclaration, VariableDeclarationKind, VariableDeclarationList, VariableStatement } from 'ts-morph';

export function NodeBox({ children, isRoot = false }: { children: ReactNode, isRoot?: boolean }) {
  return (
    <Box sx={{ px: isRoot ? 0 : 1 }}>
      {children}
    </Box>
  );
}

export default function SourceFileComponent({ sourceFile, setDirty }: { sourceFile: SourceFile, setDirty: () => void }) {
  const children = sourceFile.getChildren();

  return (
    <>
      {children.map((child, index) => <NodeComponent key={index} node={child} setDirty={setDirty} isRoot />)}
    </>
  );
}

export function NodeComponent({ node, setDirty, isRoot = false }: { node: Node, setDirty: () => void, isRoot?: boolean }) {
  return (
    <NodeBox isRoot={isRoot}>
      {
        node.getKind() === SyntaxKind.SyntaxList ? <SyntaxListComponent node={node as SyntaxList} setDirty={setDirty} /> :
          node.getKind() === SyntaxKind.ImportDeclaration ? <ImportDeclarationComponent importDeclaration={node as ImportDeclaration} onDelete={() => {
            setDirty();

            (node as ImportDeclaration).remove();
          }} /> :
            node.getKind() === SyntaxKind.VariableStatement ? <VariableStatementComponent variableStatement={node as VariableStatement} setDirty={setDirty} /> :
              node.getKind() === SyntaxKind.VariableDeclarationList ? <VariableDeclarationListComponent variableDeclarationList={node as VariableDeclarationList} setDirty={setDirty} /> :
                node.getKind() === SyntaxKind.VariableDeclaration ? <VariableDeclarationComponent variableDeclaration={node as VariableDeclaration} setDirty={setDirty} /> :
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
    <Dialog onClose={onClose} open={open}>
      <TextField
        id="outlined-disabled"
        defaultValue={text}
        multiline
        InputProps={{
          readOnly: true,
        }}
      />
    </Dialog>
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
    </Typography>
  );
}

export function UnknownNodeComponent({ node, setDirty }: { node: Node, setDirty: () => void }) {
  return (
    <>
      <NodeHeader node={node} title={`kind: ${node.getKindName()} (${node.getKind()})`} />
      {node.getChildren().map((child, index) => <NodeComponent key={index} node={child} setDirty={setDirty} />)}
    </>
  );
}

export function SyntaxListComponent({ node, setDirty }: { node: SyntaxList, setDirty: () => void }) {
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

export function ImportDeclarationComponent({ importDeclaration, onDelete }: { importDeclaration: ImportDeclaration, onDelete: () => void }) {
  const structure = importDeclaration.getStructure();

  return (
    <>
      <NodeHeader node={importDeclaration} title={'import ' + (structure.isTypeOnly ? '(type) ' : '') + structure.moduleSpecifier} onDelete={onDelete} />
    </>
  );
}

export function VariableStatementComponent({ variableStatement, setDirty }: { variableStatement: VariableStatement, setDirty: () => void }) {
  return (
    <VariableDeclarationListComponent variableDeclarationList={variableStatement.getDeclarationList()} setDirty={setDirty} />
  );
}

export function VariableDeclarationListComponent({ variableDeclarationList, setDirty }: { variableDeclarationList: VariableDeclarationList, setDirty: () => void }) {
  const declarationKind = variableDeclarationList.getDeclarationKind();

  return (
    <>
      <NodeHeader node={variableDeclarationList} title={declarationKind === VariableDeclarationKind.Const ? 'const' : declarationKind === VariableDeclarationKind.Let ? 'let' : 'var'} />
      {variableDeclarationList.getDeclarations().map((variableDeclaration, index) => <NodeComponent key={index} node={variableDeclaration} setDirty={setDirty} />)}
    </>
  );
}

export function VariableDeclarationComponent({ variableDeclaration, setDirty }: { variableDeclaration: VariableDeclaration, setDirty: () => void }) {
  const variableDeclarationStructure = variableDeclaration.getStructure();
  const initializer = variableDeclaration.getInitializer();

  return (
    <>
      <NodeHeader node={variableDeclaration} title={
        variableDeclarationStructure.name
        + (variableDeclarationStructure.type ? ': ' + variableDeclarationStructure.type : '')
      } />
      {initializer && <NodeComponent node={initializer} setDirty={setDirty} />}
    </>
  );
}
