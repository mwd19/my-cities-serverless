/**
 * Fields in a request to create a single Place.
 */
export interface CreatePlaceRequest {
  name: string
  latitude: number
  longitude: number
  city: string
  country: string
}
