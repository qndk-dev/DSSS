import chalk from 'chalk';

export class Logger {
    private getTimeStamp(): string {
        return new Date().toLocaleString('ru-RU', {
            hour12: false,
            timeZone: 'Europe/Moscow'
        });
    }

    public info(message: string): void {
        console.log(
            chalk.blue(`[${this.getTimeStamp()}] [INFO]: ${message}`)
        );
    }

    public warn(message: string): void {
        console.log(
            chalk.yellow(`[${this.getTimeStamp()}] [WARN]: ${message}`)
        );
    }

    public error(message: string): void {
        console.log(
            chalk.red(`[${this.getTimeStamp()}] [ERROR]: ${message}`)
        );
    }

    public debug(message: string): void {
        console.log(
            chalk.magenta(`[${this.getTimeStamp()}] [DEBUG]: ${message}`)
        );
    }

    public command(message: string): void {
        console.log(
            chalk.green(`[${this.getTimeStamp()}] [COMMAND]: ${message}`)
        );
    }
}
