import { Request, Response } from 'express'
import pool from '../database'
import StatusError from '../types/status-error'
import { successResponse, successItemsResponse, errorResponse } from '../utils/responses'

const INTERNAL_SERVER_ERROR = 'Ha ocurrido un error interno del servidor.'

export const getUsers = async (_: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms')
    return successItemsResponse(res, 200, rows)
  } catch (error: unknown) {
    if (error instanceof StatusError) {
      return errorResponse(res, error.getStatus(), error.message)
    }

    return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
  }
}

export const addUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newRoom = {}

    const [rows] = await pool.query('INSERT INTO rooms SET ?', newRoom)
    const insertedId: string = rows.insertId
    const [roomItem] = await pool.query(
      `SELECT * FROM rooms WHERE id = ${insertedId}`
    )

    return successResponse(
      res,
      200,
      roomItem
    )
  } catch (error: unknown) {
    if (error instanceof StatusError) {
      return errorResponse(res, error.getStatus(), error.message)
    }

    return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
  }
}
