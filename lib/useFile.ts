import useSWR, { BareFetcher } from "swr"

const fetcher: BareFetcher<string> = url => fetch(url)
  .then(async (response: Response) => {
    const json = await response.json()

    if (!response.ok)
      throw new Error(json && json.error || 'Network response was not OK')

    return json && json.data
  })

export default function useFile(path: string) {
  const { data, error, mutate } = useSWR<string>(path && `/api/fs/file?path=${encodeURIComponent(path)}&options=${JSON.stringify({ encoding: "utf8" })}`, fetcher)

  return {
    data: data || "",
    isLoading: !error && data === undefined,
    error,
    mutate
  }
}
