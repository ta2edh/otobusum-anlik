export const extractInnerContentXml = (key: string, content: string) => {
  return content.split(`${key}>`).at(1)?.split(`</`).at(0)
}
