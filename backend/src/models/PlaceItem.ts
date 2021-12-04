export interface PlaceItem {
  userId: string
  placeId: string
  createdAt: string
  name: string
  latitude: number
  longitude: number
  city: string
  country: string
  attachmentUrl?: string
}
