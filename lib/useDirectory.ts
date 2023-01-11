import useSWR, { BareFetcher } from "swr";
import { DirItem } from "../pages/api/fs/dir";

const fetcher: BareFetcher<DirItem[]> = url => fetch(url)
  .then(async (response: Response) => {
    const json = await response.json()

    if (!response.ok)
      throw new Error(json && json.error || 'Network response was not OK')

    return json && json.items
  })

export default function useDirectory(path: string) {
  const { data, error, mutate } = useSWR<DirItem[]>(`/api/fs/dir?path=${encodeURIComponent(path)}`, fetcher)

  return {
    items: data ?? [],
    isLoading: !error && data === undefined,
    error,
    mutate
  }
}
