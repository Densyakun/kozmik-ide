import { getFromNode } from './json';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SyntaxKind } from 'ts-morph';
import { useContext } from 'react';
import { useSnapshot } from 'valtio';
import { SourceFileContext } from '../SourceFileContainer';

export const kindCount = 363;

export function getKindHue(kind: number) {
  return kind * 360 / kindCount;
}

export default function SourceFileEditor() {
  const state = useContext(SourceFileContext);
  useSnapshot(state);

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
  const commentRanges_ = useSnapshot(commentRanges);

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
  // TODO コメント範囲

  return (
    <>
      {node.children && node.children.length
        ? <Accordion
          defaultExpanded
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
            py: 0.5,
          }}
        >
          {node.leadingCommentRanges?.join('\n')}
          {SyntaxKind[node.kind]}
          {node.trailingCommentRanges?.join('\n')}
        </Paper>
      }
    </>
  );
}

export function StringEditor({ value, setValue, isError, label }: { value: string, setValue: (newValue: string) => void, isError: boolean, label?: string }) {
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
