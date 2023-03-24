import express from 'express'
import pool from '../../database'

const router = express.Router()

export const getProducts = async (): Promise<void> => {
  const [rows] = await pool.query('DESCRIBE rooms')
  return rows
}

router.get('/', (_req, res) => {
  void (async () => {
    try {
      const r = await getProducts()
      res.send(r)
    } catch (e) {
      console.error(e)
    }
  })()
})

export default router
