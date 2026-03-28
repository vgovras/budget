type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL: LogLevel = 'info';

function shouldLog(level: LogLevel): boolean {
	return LEVELS[level] >= LEVELS[MIN_LEVEL];
}

function format(level: LogLevel, msg: string, data?: Record<string, unknown>): string {
	const ts = new Date().toISOString();
	const base = `${ts} [${level.toUpperCase()}] ${msg}`;
	if (!data) return base;
	const extras = Object.entries(data)
		.map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
		.join(' ');
	return `${base} ${extras}`;
}

export const log = {
	debug(msg: string, data?: Record<string, unknown>) {
		if (shouldLog('debug')) console.debug(format('debug', msg, data));
	},
	info(msg: string, data?: Record<string, unknown>) {
		if (shouldLog('info')) console.log(format('info', msg, data));
	},
	warn(msg: string, data?: Record<string, unknown>) {
		if (shouldLog('warn')) console.warn(format('warn', msg, data));
	},
	error(msg: string, data?: Record<string, unknown>) {
		if (shouldLog('error')) console.error(format('error', msg, data));
	}
};
