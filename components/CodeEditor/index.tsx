import { useContext, useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SaveButton from './SaveButton';
import { codeEditorPathContext } from '../../pages';

export default function CodeEditor() {
  const path = useContext(codeEditorPathContext);

  const [loading, setLoading] = useState(!!path);
  const [value, setValue] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!path) return;

    setLoading(!!path);

    fetch(`/api/fs/file?path=${encodeURIComponent(path)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
      method: 'GET'
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        return response.text();
      })
      .then(data => {
        setLoading(false);
        setValue(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [path]);

  function onChange(newValue: string) {
    setValue(newValue);
    setDirty(true);
  }

  if (typeof window !== "undefined" && path) {
    const AceEditor = require("react-ace").default;
    //require("ace-builds/src-noconflict/mode-typescript");
    //require("ace-builds/src-noconflict/theme-chrome");

    return <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6">
          Code editor
        </Typography>
        <Typography variant="subtitle1">
          {path}
          {dirty && "*"}
        </Typography>
        {!loading && <SaveButton onClick={async () => {
          fetch(`/api/fs/file?path=${encodeURIComponent(path)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: value })
          })
            .then((response: Response) => {
              if (!response.ok) throw new Error('Network response was not OK');

              setDirty(false);
            })
            .catch(error => {
              console.error(error);
            });
        }} />}
      </Stack>
      {loading
        ? <Skeleton
          width={'100%'}
          height={400}
        />
        : <AceEditor
          //mode="typescript"
          //theme="chrome"
          value={value}
          onChange={onChange}
          editorProps={{ $blockScrolling: true }}
        />
      }
    </>;
  }

  return null;
}