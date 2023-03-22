import express from 'express'
import pool from '../../database'

const router = express.Router()

export const getProducts = async (): Promise<void> => {
  const [rows] = await pool.query(
    'CREATE TABLE roles(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,role VARCHAR(31) NOT NULL)'
  )
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
