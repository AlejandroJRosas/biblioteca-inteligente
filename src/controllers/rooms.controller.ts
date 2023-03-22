import { Request, Response } from 'express'
import pool from '../database'
import * as responses from '../utils/responses'
import { RoomsRequestBody } from '../types/rooms'
import { parseName } from '../utils/parsers'

const MARIADB_STATUSCODES = 1000

const getRooms = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms')
    if (rows.length === 0) {
      throw Object.assign(new Error('The table is empty'), {
        status: 404
      })
    }
    return responses.successItemResponse(
      res,
      200,
      'GET Operation Successful',
      rows
    )
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return responses.errorResponse(res, 500, 'Internal Server Error')
    }
    return responses.errorResponse(res, error.status, error.message)
  }
}

const getRoomById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE id = ?',
      req.params.id
    )
    if (rows.length === 0) {
      throw Object.assign(
        new Error('Could not find the element by id:' + req.params.id),
        {
          status: 404
        }
      )
    }
    return responses.successItemResponse(
      res,
      200,
      'GET Operation Successful',
      rows[0]
    )
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return responses.errorResponse(res, 500, 'Internal Server Error')
    }
    return responses.errorResponse(res, error.status, error.message)
  }
}

const getRoomDataFromRequestBody = (object: any): RoomsRequestBody => {
  const newRoom: RoomsRequestBody = {
    name: parseName(object.name)
  }
  return newRoom
}

const addRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newRoom = getRoomDataFromRequestBody(req.body)

    const [rows] = await pool.query('INSERT INTO rooms SET ?', newRoom)
    const insertedId: string = rows.insertId
    const [roomItem] = await pool.query(
      `SELECT * FROM rooms WHERE id = ${insertedId}`
    )
    return responses.successItemResponse(
      res,
      200,
      'POST Operation Successful',
      roomItem[0]
    )
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return responses.errorResponse(res, 500, 'Internal Server Error')
    }
    return responses.errorResponse(res, error.status, error.message)
  }
}

const updateRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedRoom = getRoomDataFromRequestBody(req.body)
    const [rows] = await pool.query('UPDATE rooms SET ? WHERE id = ?', [
      updatedRoom,
      req.params.id
    ])
    console.log(rows)
    if (rows.affectedRows === 0) {
      throw Object.assign(
        new Error('Could not find the element by id:' + req.params.id),
        {
          status: 404
        }
      )
    }
    if (rows.changedRows === 0) {
      return responses.successResponse(
        res,
        200,
        'PUT Operation Successful but the content did not change'
      )
    }
    return responses.successResponse(res, 200, 'PUT Operation Successful')
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return responses.errorResponse(res, 500, 'Internal Server Error')
    }
    return responses.errorResponse(res, error.status, error.message)
  }
}

const deleteRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'DELETE FROM rooms WHERE id = ?',
      req.params.id
    )
    console.log(rows)
    if (rows.affectedRows === 0) {
      throw Object.assign(
        new Error('Could not find the element by id:' + req.params.id),
        {
          status: 404
        }
      )
    }
    return responses.successItemResponse(
      res,
      200,
      'DELETE Operation Successful on the element by id:' + req.params.id,
      rows[0]
    )
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return responses.errorResponse(res, 500, 'Internal Server Error')
    }
    return responses.errorResponse(res, error.status, error.message)
  }
}

export const methods = {
  getRooms,
  getRoomById,
  addRoom,
  deleteRoom,
  updateRoom
}
