import { Editor, JSONType } from 'material-jsoneditor';
import { getFromSourceFile } from './json';
import { Box, Button, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export function JSONEditor({ value, setValue }: { value: JSONType, setValue: (newValue: JSONType) => void }) {
  return (
    <Editor value={value} onChange={newValue => {
      if (!newValue || value === newValue) return;

      setValue(newValue);
    }} />
  );
}

export default function SourceFileEditor({ json, setJSON }: { json: ReturnType<typeof getFromSourceFile>, setJSON: (newValue: ReturnType<typeof getFromSourceFile>) => void }) {
  // TODO SyntaxListのCRUD操作

  return (
    <>
      <Typography variant="h6">
        Syntaxes:
      </Typography>
      <Box sx={{ px: 2 }}>
        <JSONEditor value={json.syntaxList.children as any} setValue={newSyntaxListChildrenJson => {
          if (typeof newSyntaxListChildrenJson !== "object") return;

          let newJSON = json;
          newJSON.syntaxList.children = newSyntaxListChildrenJson as any;
          setJSON(newJSON);
        }} />
      </Box>
      <Typography variant="h6">
        Comment ranges at end of file:
      </Typography>
      <CommentRangesEditor commentRanges={json.commentRangesAtEndOfFile} setCommentRanges={newValue => {
        let newJSON = json;
        newJSON.commentRangesAtEndOfFile = newValue;
        setJSON(newJSON);
      }} />
    </>
  );
}

export function CommentRangesEditor({ commentRanges, setCommentRanges }: { commentRanges: string[], setCommentRanges: (newValue: string[]) => void }) {
  return (
    <List dense>
      {commentRanges.map((commentRange, index) =>
        <ListItem
          key={index}
          secondaryAction={
            <IconButton edge="end" onClick={() => {
              const newJSON = commentRanges;
              newJSON.splice(index, 1);
              setCommentRanges(newJSON);
            }}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <StringEditor
            value={commentRange}
            setValue={newValue => {
              const newJSON = commentRanges;
              newJSON[index] = newValue;
              setCommentRanges(newJSON);
            }}
            isError={!(commentRange.startsWith("//") || commentRange.startsWith("/*") && commentRange.endsWith("*/"))}
          />
        </ListItem>
      )}
      <ListItem>
        <Button variant='outlined' endIcon={<AddIcon />} onClick={() => {
          let newJSON = commentRanges;
          newJSON.push('');
          setCommentRanges(newJSON);
        }}>
          Add new
        </Button>
      </ListItem>
    </List>
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
