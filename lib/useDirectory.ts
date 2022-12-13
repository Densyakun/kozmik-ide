import useSWR, { BareFetcher } from "swr";
import { Dir } from "../pages/api/dir";

const fetcher: BareFetcher<Dir> = url => fetch(url).then(r => r.json())

export default function useDirectory(path: string) {
  const { data, error, mutate } = useSWR<Dir>(`/api/dir?path=${encodeURIComponent(path)}`, fetcher)

  return {
    items: data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
