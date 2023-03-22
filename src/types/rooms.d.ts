export interface Rooms {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type RoomsPostRequest = Pick<Rooms, 'name'>
