import express from 'express'
import {
  getRooms,
  getRoomById,
  addRoom,
  deleteRoom,
  updateRoom
} from '../../controllers/rooms.controller'

const router = express.Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getRooms)
router.get('/:roomId', getRoomById)
router.post('/', addRoom)
router.delete('/:roomId', deleteRoom)
router.put('/:roomId', updateRoom)

export default router
