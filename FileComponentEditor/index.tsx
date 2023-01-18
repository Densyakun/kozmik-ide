import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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

function Component() {
  const path = useContext(pathContext);

  const [loading, setLoading] = useState(true);
  let { data, isLoading, error } = useFile(path);

  useEffect(() => {
    setLoading(!!path && isLoading);
  }, [path, isLoading]);

  let body = <></>;

  if (loading)
    body = <Skeleton
      width={'100%'}
      height={400}
    />;
  else if (error)
    body = <Alert severity="error">failed to load: {error.toString()}</Alert>;
  else
    body = <>{data}</>;

  if (!path) return null;

  return <>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h6">
        File component editor
      </Typography>
      <Typography variant="subtitle1">
        {path}
      </Typography>
    </Stack>
    {body}
  </>;
}

const addon = {
  Component
};

export default addon;
