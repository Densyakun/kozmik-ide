import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const initCurrentPath = '.';

export default function useFileExplorer() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('.');

  useEffect(() => {
    setCurrentPath(decodeURIComponent(router.query.currentPath as string || initCurrentPath));
  }, [router.query.currentPath]);

  return {
    currentPath, setCurrentPath: (newCurrentPath: string) => {
      setCurrentPath(newCurrentPath)
      router.push(newCurrentPath === initCurrentPath ? {} : { query: { currentPath: encodeURIComponent(newCurrentPath) } }, undefined, { scroll: false })
    }
  };
}
