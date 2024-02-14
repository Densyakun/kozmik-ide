import { NodeJson, getFromNode } from './json';
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SyntaxKind } from 'ts-morph';
import { useContext, useState } from 'react';
import { useSnapshot } from 'valtio';
import { SourceFileContext } from '../SourceFileContainer';

export const kindCount = 363;

export function getKindHue(kind: number) {
  return kind * 360 / kindCount;
}

export default function SourceFileEditor() {
  const state = useContext(SourceFileContext);
  //useSnapshot(state, { sync: true });

  if (!state.value)
    return null;

  return (
    <>
      <Typography variant="h6">
        Syntaxes:
      </Typography>
      {state.value.syntaxList.children.map((child, index) =>
        <NodeEditor key={index} node={child} />
      )}
      <Typography variant="h6">
        Comment ranges at end of file:
      </Typography>
      <CommentRangesEditor commentRanges={state.value.commentRangesAtEndOfFile} />
    </>
  );
}

export function CommentRangesEditor({ commentRanges }: { commentRanges: string[] }) {
  const commentRanges_ = useSnapshot(commentRanges, { sync: true });

  return (
    <List dense>
      {commentRanges_.map((commentRange, index) =>
        <ListItem
          key={index}
          secondaryAction={
            <IconButton edge="end" onClick={() => {
              commentRanges.splice(index, 1);
            }}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <StringEditor
            value={commentRange}
            setValue={newValue => {
              commentRanges[index] = newValue;
            }}
            isError={!(commentRange.startsWith("//") || commentRange.startsWith("/*") && commentRange.endsWith("*/"))}
          />
        </ListItem>
      )}
      <ListItem>
        <Button variant='outlined' endIcon={<AddIcon />} onClick={() => {
          commentRanges.push('');
        }}>
          Add new
        </Button>
      </ListItem>
    </List>
  );
}

export function NodeEditor({ node }: { node: ReturnType<typeof getFromNode> }) {
  // TODO テキストの編集

  return (
    <>
      {node.children && node.children.length
        ? <Accordion
          //defaultExpanded
          disableGutters
          elevation={4}
          TransitionProps={{ timeout: 0 }}
          sx={{
            backgroundColor: `hsl(${getKindHue(node.kind)}, 50%, 75%)`,
            px: 1,
            py: 0.5,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: 0,
              ".MuiAccordionSummary-content": {
                my: 0,
              },
            }}
          >
            {SyntaxKind[node.kind]}
          </AccordionSummary>
          <AccordionDetails>
            {node.children.map((child, index) =>
              <NodeEditor key={index} node={child} />
            )}
          </AccordionDetails>
        </Accordion>
        : <Paper
          elevation={4}
          sx={{
            backgroundColor: `hsl(${getKindHue(node.kind)}, 50%, 75%)`,
            px: 1,
          }}
        >
          {SyntaxKind[node.kind]}
          {node.leadingCommentRanges && <CommentRangesButton
            commentRanges={node.leadingCommentRanges}
            setCommentRanges={newValue => { node.leadingCommentRanges = newValue }}
            isLeading
          />}
          {<NodeTextButton
            node={node}
            setText={newValue => { node.text = newValue }}
          />}
          {node.trailingCommentRanges && <CommentRangesButton
            commentRanges={node.trailingCommentRanges}
            setCommentRanges={newValue => { node.trailingCommentRanges = newValue }}
          />}
        </Paper>
      }
    </>
  );
}

export interface CommentRangesDialogProps {
  open: boolean;
  commentRanges: string[];
  onClose: (value: string[]) => void;
}

function CommentRangesDialog(props: CommentRangesDialogProps) {
  const { onClose, commentRanges, open } = props;

  const handleClose = () => {
    onClose(commentRanges);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set comment ranges</DialogTitle>
      <DialogContent>
        <CommentRangesEditor commentRanges={commentRanges} />
      </DialogContent>
    </Dialog>
  );
}

export function CommentRangesButton({ commentRanges, setCommentRanges, isLeading }: { commentRanges: string[], setCommentRanges: (newValue: string[]) => void, isLeading?: boolean }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string[]) => {
    setOpen(false);
    setCommentRanges(value);
  };

  const str = commentRanges.join('\n');

  return <>
    <Button size='small' onClick={handleClickOpen} sx={{ textTransform: 'none' }}>
      {commentRanges.length ? str.length <= 8 ? str : str.substring(0, 5) + '...' : isLeading ? 'leading' : 'trailing'}
    </Button>
    <CommentRangesDialog
      commentRanges={commentRanges}
      open={open}
      onClose={handleClose}
    />
  </>;
}

export interface NodeTextDialogProps {
  open: boolean;
  node: NodeJson;
  onClose: (value?: string) => void;
}

function NodeTextDialog(props: NodeTextDialogProps) {
  const { onClose, node, open } = props;

  const { text } = useSnapshot(node, { sync: true });

  const handleClose = () => {
    onClose(text);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set node text</DialogTitle>
      <DialogContent>
        <StringEditor
          value={text || ''}
          setValue={newValue => node.text = newValue}
        />
      </DialogContent>
    </Dialog>
  );
}

export function NodeTextButton({ node, setText }: { node: NodeJson, setText: (newValue?: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value?: string) => {
    setOpen(false);
    setText(value);
  };

  return <>
    <Button size='small' onClick={handleClickOpen} sx={{ textTransform: 'none' }}>
      {node.text || 'text'}
    </Button>
    <NodeTextDialog
      node={node}
      open={open}
      onClose={handleClose}
    />
  </>;
}

export function StringEditor({ value, setValue, isError, label }: { value: string, setValue: (newValue: string) => void, isError?: boolean, label?: string }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      multiline
      size="small"
      error={isError}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
    />
  )
}
