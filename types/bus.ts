export interface BusStop {
  id: number
  stop_code: string
  stop_name: string
  x_coord: number
  y_coord: number
  province?: string
  smart?: string
  physical?: string
  stop_type?: string
  disabled_can_use?: string
}

export interface BusLine {
  id: number
  code: string
  title: string
  city: string
}
