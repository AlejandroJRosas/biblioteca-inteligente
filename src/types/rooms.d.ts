export interface Rooms {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type RoomsRequestBody = Pick<Rooms, 'name'>
