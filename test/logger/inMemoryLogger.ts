import { ILogger } from '@/domain/application/logger/ILogger'

export class InMemoryLogger implements ILogger {
  public items: any[] = []
  async addDataToLogFile(_, data: any[]): Promise<void> {
    this.items = data
  }

  async getDataFile(nameFile: string): Promise<any[]> {
    const userId = nameFile.replace('-deleted-products', '')
    const data = this.items.filter((item) => item.userId === userId)

    return data
  }
}
