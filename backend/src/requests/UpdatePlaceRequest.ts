/**
 * Fields in a request to update a single Place item.
 */
export interface UpdatePlaceRequest {
  name: string
  latitude: number
  longitude: number
  country: string
}