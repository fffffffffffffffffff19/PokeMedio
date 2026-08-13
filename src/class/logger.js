import 'winston-daily-rotate-file';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize, uncolorize } = format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Logger {
    constructor() {
        this.createLogger = new createLogger({
            format: combine(
                label({ label: '(º～º)' }),
                timestamp({
                    format: (new Date(), '[on] DD/MM/YYYY [at] HH:mm:ss'),
                }),
                colorize({ timestamp: true, level: true }),
                printf(({ level, label, timestamp, stack, message }) => {
                    if (!stack) return `${timestamp} ${label} ${level}: ${message}`;

                    return `${timestamp} ${label} ${level}: ${stack}`;
                }),
            ),
            transports: [
                new transports.Console({ level: 'error' }),
                new transports.DailyRotateFile({
                    format: uncolorize(),
                    level: 'error',
                    filename: resolve(__dirname, '../', 'utils', 'logs', 'error-%DATE%.log'),
                    datePattern: 'DD-MM-YYYY',
                    maxSize: '5m',
                }),
                new transports.DailyRotateFile({
                    format: uncolorize(),
                    level: 'warn',
                    filename: resolve(__dirname, '../', 'utils', 'logs', 'warn-%DATE%.log'),
                    datePattern: 'DD-MM-YYYY',
                    maxSize: '5m',
                }),
            ],
        });

        this.fileName = (path) => `[${path.split(/[\\/]/).find((file) => file.endsWith('.js'))}] -`;
    }
}

export default new Logger();
