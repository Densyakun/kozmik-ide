import { Editor, JSONType } from 'material-jsoneditor';
import { getFromSourceFile } from './json';
import { Stack, TextField } from '@mui/material';

export function JSONEditor({ value, setValue }: { value: JSONType, setValue: (newValue: JSONType) => void }) {
  return (
    <Editor value={value} onChange={newValue => {
      if (!newValue || value === newValue) return;

      setValue(newValue);
    }} />
  );
}

export default function SourceFileEditor({ json, setJSON }: { json: ReturnType<typeof getFromSourceFile>, setJSON: (newValue: ReturnType<typeof getFromSourceFile>) => void }) {
  // TODO EOFコメント範囲の配列CRUD操作

  // TODO SyntaxListのCRUD操作

  return (
    <>
      <p>Syntaxes:</p>
      <JSONEditor value={json.syntaxList as any} setValue={newSyntaxListJson => {
        if (typeof newSyntaxListJson !== "object") return;

        let newJSON = json;
        newJSON.syntaxList = newSyntaxListJson as any;
        setJSON(newJSON);
      }} />
      <p>Comment ranges at end of file:</p>
      <Stack spacing={1}>
        {json.commentRangesAtEndOfFile.map((commentRange, index) =>
          <CommentRangeEditor key={index} value={commentRange} setValue={newValue => {
            let newJSON = json;
            newJSON.commentRangesAtEndOfFile[index] = newValue;
            setJSON(newJSON);
          }} />
        )}
      </Stack>
    </>
  );
}

export function CommentRangeEditor({ value, setValue }: { value: string, setValue: (newValue: string) => void }) {
  return (
    <StringEditor
      value={value}
      setValue={newValue => setValue(newValue)}
      isError={!(value.startsWith("//") || value.startsWith("/*") && value.endsWith("*/"))}
    />
  );
}

export function StringEditor({ value, setValue, isError, label }: { value: string, setValue: (newValue: string) => void, isError: boolean, label?: string }) {
  return (
    <TextField
      label={label}
      value={value}
      multiline
      error={isError}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
    />
  )
}
