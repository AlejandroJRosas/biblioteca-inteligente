import express from 'express'

import testRouter from './api/test'

const router = express.Router()

router.use('/ping', testRouter)

export default router
