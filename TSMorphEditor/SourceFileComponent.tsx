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
  const [importDeclarations, setImportDeclarations] = useState(sourceFile.getImportDeclarations());
  const children = sourceFile.getChildren();

  return (
    <>
      <p>Imports:</p>
      {importDeclarations.length
        ? importDeclarations.map((importDeclaration, index) => <ImportDeclarationComponent key={index} importDeclaration={importDeclaration} onDelete={() => {
          setDirty();

          const newImportDeclarations = [...importDeclarations];
          newImportDeclarations.splice(index, 1);
          setImportDeclarations(newImportDeclarations);
          importDeclaration.remove();
        }} />)
        : <p>(empty)</p>
      }
      <p>Other nodes:</p>
      {children.every(child =>
        child.getKind() === SyntaxKind.ImportDeclaration
        || child.getKind() === SyntaxKind.EndOfFileToken
      )
        ? <p>(empty)</p>
        : children.map((child, index) => <NodeComponent key={index} node={child} isRoot />)
      }
    </>
  );
}

export function NodeComponent({ node, isRoot = false }: { node: Node, isRoot?: boolean }) {
  return (
    <NodeBox isRoot={isRoot}>
      {
        node.getKind() === SyntaxKind.SyntaxList ? <SyntaxListComponent node={node as SyntaxList} /> :
          node.getKind() === SyntaxKind.ImportDeclaration ? null :
            node.getKind() === SyntaxKind.VariableStatement ? <VariableStatementComponent variableStatement={node as VariableStatement} /> :
              node.getKind() === SyntaxKind.VariableDeclarationList ? <VariableDeclarationListComponent variableDeclarationList={node as VariableDeclarationList} /> :
                node.getKind() === SyntaxKind.VariableDeclaration ? <VariableDeclarationComponent variableDeclaration={node as VariableDeclaration} /> :
                  node.getKind() === SyntaxKind.EndOfFileToken ? null :
                    <UnknownNodeComponent node={node} />
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

export function UnknownNodeComponent({ node }: { node: Node }) {
  return (
    <>
      <NodeHeader node={node} title={`kind: ${node.getKindName()} (${node.getKind()})`} />
      {/*node.getChildren().map((child, index) => <NodeComponent key={index} node={child} />)*/}
    </>
  );
}

export function SyntaxListComponent({ node, isRoot = false }: { node: SyntaxList, isRoot?: boolean }) {
  const children = node.getChildren();

  return (
    <>
      <NodeHeader node={node} title='SyntaxList' isRoot={isRoot} />
      {children.every(child =>
        child.getKind() === SyntaxKind.ImportDeclaration
        || child.getKind() === SyntaxKind.EndOfFileToken
      )
        ? <p>(empty)</p>
        : children.map((child, index) => <NodeComponent key={index} node={child} isRoot />)
      }
    </>
  );
}

export function ImportDeclarationComponent({ importDeclaration, onDelete }: { importDeclaration: ImportDeclaration, onDelete: () => void }) {
  const structure = importDeclaration.getStructure();

  return (
    <>
      <NodeHeader node={importDeclaration} title={(structure.isTypeOnly ? '(type) ' : '') + structure.moduleSpecifier} onDelete={onDelete} />
    </>
  );
}

export function VariableStatementComponent({ variableStatement }: { variableStatement: VariableStatement }) {
  return (
    <VariableDeclarationListComponent variableDeclarationList={variableStatement.getDeclarationList()} />
  );
}

export function VariableDeclarationListComponent({ variableDeclarationList }: { variableDeclarationList: VariableDeclarationList }) {
  const declarationKind = variableDeclarationList.getDeclarationKind();

  return (
    <>
      <NodeHeader node={variableDeclarationList} title={declarationKind === VariableDeclarationKind.Const ? 'const' : declarationKind === VariableDeclarationKind.Let ? 'let' : 'var'} />
      {variableDeclarationList.getDeclarations().map((variableDeclaration, index) => <NodeComponent key={index} node={variableDeclaration} />)}
    </>
  );
}

export function VariableDeclarationComponent({ variableDeclaration }: { variableDeclaration: VariableDeclaration }) {
  const variableDeclarationStructure = variableDeclaration.getStructure();
  const initializer = variableDeclaration.getInitializer();

  return (
    <>
      <NodeHeader node={variableDeclaration} title={
        variableDeclarationStructure.name
        + (variableDeclarationStructure.type ? ': ' + variableDeclarationStructure.type : '')
      } />
      {initializer && <NodeComponent node={initializer} />}
    </>
  );
}
