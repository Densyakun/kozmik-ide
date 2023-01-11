import useSWR, { BareFetcher } from "swr";
import { DirItem } from "../pages/api/fs/dir";

const fetcher: BareFetcher<DirItem[]> = url => fetch(url).then(r => r.json())

export default function useDirectory(path: string) {
  const { data, error, mutate } = useSWR<DirItem[]>(`/api/fs/dir?path=${encodeURIComponent(path)}`, fetcher)

  return {
    items: data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
