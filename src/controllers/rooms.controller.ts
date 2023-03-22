import { Request, Response } from 'express'
import pool from '../database'
import * as responses from '../utils/responses'
import { RoomsPostRequest } from '../types/rooms'

const MARIADB_STATUSCODES = 1000

const getRooms = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms')
    return responses.successItemResponse(
      res,
      200,
      'GET Operation Successful',
      rows
    )
  } catch (error: any) {
    return responses.errorResponse(res, 500, error.message)
  }
}

// Falta 💀💀💀
const getRoomById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE id = ?',
      req.params.id
    )
    return responses.successItemResponse(
      res,
      200,
      'GET Operation Successful',
      rows[0]
    )
  } catch (error: any) {
    return responses.errorResponse(res, 500, error.message)
  }
}

const getPostRoomDataFromRequestBody = (req: Request): RoomsPostRequest => {
  const { name } = req.body
  const newRoom: RoomsPostRequest = { name }
  if (newRoom.name === undefined || newRoom.name === null) {
    throw Object.assign(new Error('Error en el Body'), { status: 400 })
  }
  console.log(typeof newRoom)
  return newRoom
}

const addRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newRoom = getPostRoomDataFromRequestBody(req)

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

// Falta 💀💀💀
const deleteRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query(
      'DELETE FROM rooms WHERE id = ?',
      req.params.id
    )
    return responses.successItemResponse(
      res,
      200,
      'DELETE Operation Successful',
      rows[0]
    )
  } catch (error: any) {
    return responses.errorResponse(res, 500, error.message)
  }
}

// Falta 💀💀💀
const updateRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedRoom = getPostRoomDataFromRequestBody(req)
    const [rows] = await pool.query('UPDATE rooms SET ? WHERE id = ?', [
      updatedRoom,
      req.params.id
    ])
    console.log(rows)
    return responses.successItemResponse(
      res,
      200,
      'PUT Operation Successful',
      rows
    )
  } catch (error: any) {
    return responses.errorResponse(res, 500, error.message)
  }
}

export const methods = {
  getRooms,
  getRoomById,
  addRoom,
  deleteRoom,
  updateRoom
}
