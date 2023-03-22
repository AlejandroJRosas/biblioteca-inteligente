import express from 'express'
import { methods as roomsMethods } from '../../controllers/rooms.controller'

const router = express.Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', roomsMethods.getRooms)
router.get('/:id', roomsMethods.getRoomById)
router.post('/', roomsMethods.addRoom)
router.delete('/:id', roomsMethods.deleteRoom)
router.put('/:id', roomsMethods.updateRoom)

export default router
