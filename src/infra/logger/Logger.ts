import { ILogger } from '@/domain/application/logger/ILogger'
import fs from 'node:fs'
import * as path from 'path'

export class Logger implements ILogger {
  private readFile(filePath: string, nameFile: string): Promise<any[]> {
    const data = fs.readFileSync(path.resolve(filePath, `${nameFile}`), {
      encoding: 'utf-8',
    })

    return JSON.parse(data)
  }

  private async writeJsonFile(filePath: string, data: any): Promise<void> {
    try {
      return fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {
        encoding: 'utf-8',
      })
    } catch (error) {
      console.error('Error writing file:', error)
    }
  }

  async addDataToLogFile(nameFile: string, data: any): Promise<void> {
    try {
      const filePath = path.resolve(
        __dirname,
        '../',
        '../',
        '../',
        'logs',
        'deleted-products',
      )

      if (!fs.existsSync(path.resolve(filePath, `${nameFile}.json`))) {
        fs.mkdirSync(filePath, { recursive: true })
        return this.writeJsonFile(
          path.resolve(filePath, `${nameFile}.json`),
          data,
        )
      }

      const existingRecords = await this.readFile(filePath, `${nameFile}.json`)
      const records = [...existingRecords, ...data]
      return this.writeJsonFile(
        path.resolve(filePath, `${nameFile}.json`),
        records,
      )
    } catch (error) {
      console.error('Error reading file:', error)
      throw new Error(error)
    }
  }

  async getDataFile(nameFile: string): Promise<any[]> {
    const filePath = path.resolve(
      __dirname,
      '../',
      '../',
      '../',
      'logs',
      'deleted-products',
    )

    if (!fs.existsSync(path.resolve(filePath, `${nameFile}.json`))) {
      return []
    }

    return this.readFile(filePath, `${nameFile}.json`)
  }
}
