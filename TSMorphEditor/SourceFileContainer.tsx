import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Project, SourceFile } from 'ts-morph';
import SaveButton from '@/components/CodeEditor/SaveButton';
import SourceFileEditor from './common/Editor';
import { getFromSourceFile, setToSourceFile } from './common/json';

export function SourceFileContainerLoaded({ sourceFile, filePath, setDirty }: { sourceFile: SourceFile, filePath: string, setDirty: (newValue: boolean) => void }) {
  const [json, setJSON] = useState(getFromSourceFile(sourceFile));

  // TODO Breadcrumbs

  return (
    <Stack spacing={1}>
      <Box>
        <SaveButton onClick={async () => {
          setToSourceFile(sourceFile, json);
          setDirty(true);

          fetch(`/api/fs/file?path=${encodeURIComponent(filePath)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: sourceFile.getFullText() })
          })
            .then((response: Response) => {
              if (!response.ok) throw new Error('Network response was not OK');

              setDirty(false);
            })
            .catch(error => {
              console.error(error);
            });
        }} />
      </Box>
      <Container sx={{ overflow: 'auto' }}>
        <SourceFileEditor json={json} setJSON={newJSON => {
          setJSON({ ...newJSON });
        }} />
      </Container>
    </Stack>
  );
}

export default function SourceFileContainer({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(true);
  const [sourceFile, setSourceFile] = useState<SourceFile>();
  const [dirty, setDirty] = useState(false);

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
    <>
      <Container fixed>
        <Typography variant="subtitle1">
          {filePath}
          {dirty && "*"}
        </Typography>
        <Stack spacing={1}>
          {loading && <CircularProgress />}
          {!loading && sourceFile && <SourceFileContainerLoaded sourceFile={sourceFile} filePath={filePath} setDirty={setDirty} />}
        </Stack>
      </Container>
    </>
  );
}
