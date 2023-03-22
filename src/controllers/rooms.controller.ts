import { Request, Response } from 'express'

import pool from '../database'
import { errorResponse, successItemResponse } from '../utils/responses'

const getRooms = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms')
    return successItemResponse(res, 200, 'GET Operation Successful', rows)
  } catch (error: any) {
    console.log(error)
    return errorResponse(res, 500, error.message)
  }
}

const addRoom = (_req: Request, _res: Response): number => {
  return 1
}

export const methods = {
  getRooms,
  addRoom
}
