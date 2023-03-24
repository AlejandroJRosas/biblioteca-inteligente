/* eslint-disable @typescript-eslint/no-misused-promises */
import pool from './index'
import fs from 'fs'

const TABLE_NOT_FOUND = 1146
const TABLES = [
  'rooms',
  'users',
  'clients',
  'reservations',
  'reservations_users'
]

export const synchronizeTables = (): void => {
  TABLES.forEach(async (element) => {
    await verify(element)
  })
}

const verify = async (element: string): Promise<void> => {
  try {
    await pool.query(`DESCRIBE ${element}`)
  } catch (error: any) {
    if (error.errno === TABLE_NOT_FOUND) {
      console.log(`🟠 No existe la tabla [${element}]`)
      await create(element)
      return
    }
    console.log(`Error del servidor al intentar validar la tabla [${element}]`)
    return
  }
  console.log(`🟢 Tabla [${element}] existe`)
}

const create = async (element: string): Promise<void> => {
  try {
    const tableQuery = fs.readFileSync(`./sql/tables/${element}.sql`, 'utf-8')
    await pool.query(tableQuery)
  } catch (error: any) {
    console.log(`Error del servidor al intentar crear la tabla [${element}]`)
    return
  }
  console.log(`🔵 Tabla [${element}] ha sido creada`)
}
