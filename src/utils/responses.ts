import { Response } from 'express'

export const errorResponse = (
  res: Response,
  status: number,
  message: string
): Response => {
  return res.status(status).json({
    success: false,
    message
  })
}

export const successResponse = (
  res: Response,
  status: number,
  message: string
): Response => {
  return res.status(status).json({
    success: true,
    message
  })
}

export const successItemResponse = (
  res: Response,
  status: number,
  message: string,
  items: any
): Response => {
  return res.status(status).json({
    success: true,
    message,
    items
  })
}
