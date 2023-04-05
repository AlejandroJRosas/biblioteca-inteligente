import express from 'express'

import roomsRouter from './api/rooms'

const router = express.Router()

router.use('/rooms', roomsRouter)

export default router
