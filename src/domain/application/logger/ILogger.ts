export interface ILogger {
  addDataToLogFile(nameFile: string, data: any[]): Promise<void>
}
