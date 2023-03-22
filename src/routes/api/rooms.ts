import express from 'express'
import { methods as roomsMethods } from '../../controllers/rooms.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', roomsMethods.getRooms)
router.post('/', roomsMethods.addRoom)

export default router
