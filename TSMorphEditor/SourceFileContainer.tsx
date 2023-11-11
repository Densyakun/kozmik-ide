import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Project, SourceFile } from 'ts-morph';
import SaveButton from '@/components/CodeEditor/SaveButton';
import SourceFileComponent from './SourceFileComponent';

export default function SourceFileContainer({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(true);
  const [sourceFile, setSourceFile] = useState<SourceFile>();
  const [dirty, setDirty] = useState(false);

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

        const project = new Project({
          useInMemoryFileSystem: true,
        });

        const sourceFile = project.createSourceFile(filePath, sourceFileText);
        setSourceFile(sourceFile);
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
        {loading && <CircularProgress />}
        {sourceFile && <SourceFileComponent sourceFile={sourceFile} />}
      </Container>
    </>
  );
}
