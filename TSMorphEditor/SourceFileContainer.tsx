import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { createContext, useEffect, useRef, useState } from 'react';
import { Project, SourceFile } from 'ts-morph';
import SaveButton from '@/components/CodeEditor/SaveButton';
import SourceFileEditor from './common/Editor';
import { getFromSourceFile, setToSourceFile } from './common/json';
import { proxy } from 'valtio';

export const SourceFileContext = createContext<{ value?: ReturnType<typeof getFromSourceFile> }>({});

export function SourceFileContainerLoaded({ sourceFile, filePath }: { sourceFile: SourceFile, filePath: string }) {
  const state = useRef(proxy({ value: getFromSourceFile(sourceFile) })).current;

  // TODO Breadcrumbs

  return <SourceFileContext.Provider value={state}>
    <Stack spacing={1} sx={{ overflow: 'auto' }}>
      <Box>
        <SaveButton onClick={async () => {
          setToSourceFile(sourceFile, state.value);

          fetch(`/api/fs/file?path=${encodeURIComponent(filePath)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: sourceFile.getFullText() })
          })
            .then((response: Response) => {
              if (!response.ok) throw new Error('Network response was not OK');
            })
            .catch(error => {
              console.error(error);
            });
        }} />
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <SourceFileEditor />
      </Box>
    </Stack>
  </SourceFileContext.Provider>;
}

export default function SourceFileContainer({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(true);
  const [sourceFile, setSourceFile] = useState<SourceFile>();

  function loadSourceFile(sourceFileText: string) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });

    const sourceFile = project.createSourceFile(filePath, sourceFileText);
    setSourceFile(sourceFile);
  }

  function fetchSourceFile() {
    fetch(`/api/fs/file?path=${encodeURIComponent(filePath as string)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
      method: 'GET'
    })
      .then(async (response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        return response.json();
      })
      .then(json => {
        setLoading(false);

        const sourceFileText = json.data as string;

        loadSourceFile(sourceFileText);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchSourceFile()
  }, [filePath])

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
    }}>
      <Container fixed sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1">
          {filePath}
        </Typography>
        <Stack spacing={1} sx={{ overflow: 'auto' }}>
          {loading && <CircularProgress />}
          {!loading && sourceFile && <SourceFileContainerLoaded sourceFile={sourceFile} filePath={filePath} />}
        </Stack>
      </Container>
    </div>
  );
}
