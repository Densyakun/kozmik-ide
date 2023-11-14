import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Project, SourceFile } from 'ts-morph';
import SaveButton from '@/components/CodeEditor/SaveButton';
import SourceFileComponent from './SourceFileComponent';
import { getReplacedText } from './manipulate';

export default function SourceFileContainer({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(true);
  const [sourceFile, setSourceFile] = useState<SourceFile>();
  const [oldProgramAndComments, setOldProgramAndComments] = useState('');
  const [oldProgram, setOldProgram] = useState('');
  const [dirty, setDirty] = useState(false);

  function loadSourceFile(sourceFileText: string) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });

    const sourceFile = project.createSourceFile(filePath, sourceFileText);
    setSourceFile(sourceFile);

    setOldProgramAndComments(sourceFileText);

    const sourceFileStructure = sourceFile.getStructure();
    sourceFile.set(sourceFileStructure);
    setOldProgram(sourceFile.getText());

    sourceFile.replaceWithText(sourceFileText);
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
        {loading && <CircularProgress />}
        {!loading && sourceFile && <SaveButton onClick={async () => {
          const sourceFileStructure = sourceFile.getStructure();
          sourceFile.set(sourceFileStructure);
          const newProgram = sourceFile.getText();

          const replacedText = getReplacedText(
            oldProgram,
            oldProgramAndComments,
            newProgram
          );
          //alert(oldProgram);
          //alert(oldProgramAndComments);
          //alert(newProgram);
          sourceFile.replaceWithText(replacedText);

          loadSourceFile(replacedText);

          fetch(`/api/fs/file?path=${encodeURIComponent(filePath)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: replacedText })
          })
            .then((response: Response) => {
              if (!response.ok) throw new Error('Network response was not OK');

              setDirty(false);
            })
            .catch(error => {
              console.error(error);
            });
        }} />}
        {sourceFile && <SourceFileComponent sourceFile={sourceFile} setDirty={() => setDirty(true)} />}
      </Container>
    </>
  );
}
