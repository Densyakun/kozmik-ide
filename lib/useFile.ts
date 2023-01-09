import useSWR, { BareFetcher } from "swr"

const fetcher: BareFetcher<string> = url => fetch(url)
  .then(async (response: Response) => {
    const json = await response.json()

    let jsonData = undefined
    try {
      jsonData = JSON.parse(json)
    } catch (e) {
    }

    if (!response.ok) {
      throw jsonData && jsonData.error
        ? JSON.stringify(jsonData.error)
        : new Error('Network response was not OK')
    }

    return jsonData && jsonData.data
  })

export default function useDirectory(path: string) {
  const { data, error, mutate } = useSWR<string>(`/api/fs/file?path=${encodeURIComponent(path)}&options=${JSON.stringify({ encoding: "utf8" })}`, fetcher)

  return {
    data: data || "",
    isLoading: !error && data === undefined,
    error,
    mutate
  }
}
