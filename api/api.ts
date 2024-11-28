const baseUrl = 'https://otobusum.metkm.win'

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${url}`, init)
  const parsed: T = await response.json()

  return parsed
}
