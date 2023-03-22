export const isString = (string: string): boolean => {
  return typeof string === 'string'
}

export const parseName = (nameFromRequest: any): string => {
  if (!isString(nameFromRequest)) {
    throw Object.assign(new Error('Incorrect or missing name'), { status: 400 })
  }

  return nameFromRequest
}

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

export const parseDate = (dateFromRequest: any): string => {
  if (!isString(dateFromRequest) || !isDate(dateFromRequest)) {
    throw Object.assign(new Error('Incorrect or missing date'), { status: 400 })
  }

  return dateFromRequest
}
