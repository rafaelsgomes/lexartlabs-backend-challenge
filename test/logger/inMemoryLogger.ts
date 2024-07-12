import { ILogger } from '@/domain/application/logger/ILogger'

export class InMemoryLogger implements ILogger {
  public total: number = 0
  async addDataToLogFile(_, data: any[]): Promise<void> {
    this.total = data.length
  }
}
