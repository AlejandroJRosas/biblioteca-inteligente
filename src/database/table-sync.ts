import pool from './index'
import fs from 'fs'

const TABLE_NOT_FOUND = 1146
const TABLES = [
  'rooms',
  'users',
  'clients',
  'reservations',
  'reservations_clients'
]

export const synchronizeTables = async (): Promise<void> => {
  for (const element of TABLES) {
    await verify(element)
  }
}

const verify = async (element: string): Promise<void> => {
  try {
    await pool.query(`DESCRIBE ${element}`)
    console.log(`🟢 Tabla [${element}] existe`)
  } catch (error: any) {
    if (error.errno === TABLE_NOT_FOUND) {
      console.log(`🟠 No existe la tabla [${element}]`)
      await create(element)
      return
    }
    console.log(`Error del servidor al intentar validar la tabla [${element}]`)
  }
}

const create = async (element: string): Promise<void> => {
  try {
    const tableQuery = fs.readFileSync(`./sql/tables/${element}.sql`, 'utf-8')
    await pool.query(tableQuery)
    console.log(`🔵 Tabla [${element}] creada exitosamente`)
  } catch (error: any) {
    console.log(`Error del servidor al intentar crear la tabla [${element}]`)
    throw error
  }
}
