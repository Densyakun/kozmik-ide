import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TSX } from "./tsx";
import SaveButton from "../components/SaveButton";
import useFile from "../lib/useFile";

const pathContext = createContext("");
export const setPathContext = createContext<Dispatch<SetStateAction<string>>>(() => undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState("");

  return <pathContext.Provider value={path}>
    <setPathContext.Provider value={setPath}>
      {children}
    </setPathContext.Provider>
  </pathContext.Provider>;
};

export function File({
  data,
  onChange
}: {
  data: string,
  onChange: (newValue: string) => void
}) {
  return <TSX sourceText={data} onChange={onChange} />
    ?? <>
      (Empty file components)
    </>;
}

function Component() {
  const path = useContext(pathContext);

  const [loading, setLoading] = useState(true);
  let { data: defaultData, isLoading, error, mutate: mutateDefaultValue } = useFile(path);
  const [data, setData] = useState(defaultData);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLoading(!!path && isLoading);
  }, [path, isLoading]);

  useEffect(() => {
    setData(defaultData);
    setDirty(false);
  }, [defaultData]);

  function onChange(newValue: string) {
    setData(newValue);
    setDirty(true);
  }

  if (!path) return null;

  let body = <></>;

  if (loading)
    body = <Skeleton
      width={'100%'}
      height={400}
    />;
  else if (error)
    body = <Alert severity="error">failed to load: {error.toString()}</Alert>;
  else
    body = <File data={defaultData} onChange={onChange} />;

  return <>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h6">
        File component editor
      </Typography>
      <Typography variant="subtitle1">
        {path}
        {dirty && "*"}
      </Typography>
      <SaveButton onClick={async () => {
        fetch(`/api/fs/file?path=${encodeURIComponent(path)}&options=${JSON.stringify({ encoding: "utf8" })}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data })
        })
          .then((response: Response) => {
            if (!response.ok) throw new Error('Network response was not OK');

            //mutateDefaultValue(data);
            setDirty(false);
          })
          .catch(error => {
            console.error(error);
          });
      }} />
    </Stack>

    {body}
  </>;
}

const addon = {
  Component
};

export default addon;
