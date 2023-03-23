import { Request, Response } from 'express'
import pool from '../database'
import {
  PaginateSettings,
  errorResponse,
  paginatedItemsResponse,
  successItemsResponse,
  successResponse
} from '../utils/responses'
import { RoomsRequestBody } from '../types/rooms'
import { parseName } from '../utils/parsers'

const MARIADB_STATUSCODES = 1000
const INTERNAL_SERVER_ERROR = 'Ha ocurrido un error interno del servidor.'
const PER_PAGE = 10

export const getRooms = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { page = 0, size = PER_PAGE } = req.query
  let [pageAsNumber, sizeAsNumber] = [
    Number.parseInt(page as string),
    Number.parseInt(size as string)
  ]
  if (pageAsNumber < 1) {
    pageAsNumber = 1
  }
  const offset = (pageAsNumber - 1) * sizeAsNumber
  try {
    const [rows] = await pool.query('SELECT * FROM rooms')
    if (rows.length === 0) {
      throw Object.assign(new Error('La tabla está vacía'), {
        status: 404
      })
    }
    console.log('SELECT * FROM rooms LIMIT ?, ?', offset, sizeAsNumber)
    const [result] = await pool.query('SELECT * FROM rooms LIMIT ?, ?', [
      offset,
      sizeAsNumber
    ])
    const pagination: PaginateSettings = {
      total: rows.length,
      currentPage: pageAsNumber,
      perPage: sizeAsNumber
    }
    return paginatedItemsResponse(res, 200, result, pagination)
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
    }
    return errorResponse(res, error.status, error.message)
  }
}

export const getRoomById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE id = ?',
      req.params.roomId
    )
    if (rows.length === 0) {
      throw Object.assign(
        new Error(
          'No se pudo encontrar el registro de id:' + req.params.roomId
        ),
        {
          status: 404
        }
      )
    }
    return successResponse(res, 200, rows[0])
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return errorResponse(res, 500, 'Internal Server Error')
    }
    return errorResponse(res, error.status, error.message)
  }
}

const getRoomDataFromRequestBody = (object: any): RoomsRequestBody => {
  const newRoom: RoomsRequestBody = {
    name: parseName(object.name)
  }
  return newRoom
}

export const addRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newRoom = getRoomDataFromRequestBody(req.body)

    const [rows] = await pool.query('INSERT INTO rooms SET ?', newRoom)
    const insertedId: string = rows.insertId
    const [roomItem] = await pool.query(
      `SELECT * FROM rooms WHERE id = ${insertedId}`
    )
    return successItemsResponse(res, 201, roomItem[0])
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
    }
    return errorResponse(res, error.status, error.message)
  }
}

export const updateRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedRoom = getRoomDataFromRequestBody(req.body)
    const [rows] = await pool.query('UPDATE rooms SET ? WHERE id = ?', [
      updatedRoom,
      req.params.roomId
    ])
    if (rows.affectedRows === 0) {
      throw Object.assign(
        new Error(
          'No se pudo encontrar el registro de id:' + req.params.roomId
        ),
        {
          status: 404
        }
      )
    }
    if (rows.changedRows === 0) {
      return successResponse(
        res,
        200,
        'Operación PUT exitosa pero el contenido del registro no cambió'
      )
    }
    return successResponse(res, 200, 'Room modified')
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
    }
    return errorResponse(res, error.status, error.message)
  }
}

export const deleteRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'DELETE FROM rooms WHERE id = ?',
      req.params.roomId
    )
    if (rows.affectedRows === 0) {
      throw Object.assign(
        new Error(
          'No se pudo encontrar el registro de id:' + req.params.roomId
        ),
        {
          status: 404
        }
      )
    }
    return successResponse(res, 200, 'Sala eliminada')
  } catch (error: any) {
    if (error.status >= MARIADB_STATUSCODES) {
      return errorResponse(res, 500, INTERNAL_SERVER_ERROR)
    }
    return errorResponse(res, error.status, error.message)
  }
}
