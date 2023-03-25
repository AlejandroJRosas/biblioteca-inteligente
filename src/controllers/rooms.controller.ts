import { Request, Response } from 'express'
import pool from '../database'
import {
  PaginateSettings,
  paginatedItemsResponse,
  successItemsResponse,
  successResponse
} from '../utils/responses'
import { RoomsRequestBody } from '../types/rooms'
import { parseName } from '../utils/parsers'
import StatusError from '../types/status-error'
import { handleControllerError } from '../utils/handleControllerError'

const STATUS_OK = 200
const STATUS_CREATED = 201
const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404

const DEFAULT_PAGE = 0
const DEFAULT_SIZE = 10

const validatePageAndSize = (
  page: any,
  size: any
): [number, number] | string => {
  let pageAsNumber: number
  let sizeAsNumber: number

  if (!isNaN(Number(page)) && Number.isInteger(Number(page))) {
    pageAsNumber = Number.parseInt(page)
  } else {
    return 'La página debe ser un número entero'
  }

  if (!isNaN(Number(size)) && Number.isInteger(Number(size))) {
    sizeAsNumber = Number.parseInt(size)
  } else {
    return 'La tamaño debe ser un número entero'
  }

  return [pageAsNumber, sizeAsNumber]
}

export const getRooms = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { page = DEFAULT_PAGE, size = DEFAULT_SIZE } = req.query
  const validatedParams = validatePageAndSize(page, size)

  try {
    if (typeof validatedParams === 'string') {
      throw new StatusError(validatedParams, STATUS_BAD_REQUEST)
    }

    const [pageAsNumber, sizeAsNumber] = validatedParams

    let offset = (pageAsNumber - 1) * sizeAsNumber

    if (pageAsNumber < 1) {
      offset = 0
    }

    const [rows] = await pool.query('SELECT * FROM rooms')
    if (rows.length === 0) {
      throw new StatusError('La tabla está vacía', STATUS_NOT_FOUND)
    }
    const [result] = await pool.query('SELECT * FROM rooms LIMIT ?, ?', [
      offset,
      sizeAsNumber
    ])
    const pagination: PaginateSettings = {
      total: rows.length,
      currentPage: pageAsNumber,
      perPage: sizeAsNumber
    }
    return paginatedItemsResponse(res, STATUS_OK, result, pagination)
  } catch (error: unknown) {
    return handleControllerError(error, res)
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
      throw new StatusError(
        `No se pudo encontrar el registro de id: ${req.params.roomId}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, rows[0])
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}

const getRoomDataFromRequestBody = (requestBody: any): RoomsRequestBody => {
  const newRoom: RoomsRequestBody = {
    name: parseName(requestBody.name)
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
    return successItemsResponse(res, STATUS_CREATED, roomItem[0])
  } catch (error: unknown) {
    return handleControllerError(error, res)
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
      throw new StatusError(
        `No se pudo encontrar el registro de id: ${req.params.roomId}`,
        STATUS_NOT_FOUND
      )
    }
    if (rows.changedRows === 0) {
      return successResponse(
        res,
        STATUS_OK,
        'Operación PUT exitosa pero el contenido del registro no cambió'
      )
    }
    return successResponse(res, STATUS_OK, 'Sala modificada exitosamente')
  } catch (error: unknown) {
    return handleControllerError(error, res)
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
      throw new StatusError(
        `No se pudo encontrar el registro de id: ${req.params.roomId}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, 'Sala eliminada')
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
