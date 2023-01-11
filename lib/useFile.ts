import useSWR, { BareFetcher } from "swr"
import errorMap from "serverfailsoft/errorMap.json"

const fetcher: BareFetcher<string> = url => fetch(url)
  .then(async (response: Response) => {
    const json = await response.json()

    if (!response.ok) {
      throw response.status === errorMap["ENOENT"]
        ? new Error("ENOENT")
        : json && json.error
        || new Error('Network response was not OK')
    }

    return json && json.data
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
