import { bash } from '$lib/utils';
import path from 'path';
import type { Pipeline, PidStatus, LogStatus } from '$lib/types/pipeline';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (request) => {
	const dir = request.query.get('dir');
	const pidFileList = await bash(`find ${dir} -maxdepth 1 -name "*.pid"`);
	const pids = await bash(`ps -ef | awk '{print $2}'`);

	const pidStatuses = pidFileList.map(async (pidfile) => {
		const pid = await bash(`cat ${pidfile}`)[0];
		return {
			name: path.basename(pidfile),
			alive: pids.includes(pid)
		} as PidStatus;
	});

	const logFileList = await bash(`find ${dir} -maxdepth 1 -name "*.log" -o -name "*.data"`);
	const logFileStatuses = await logFileList.map(async (logFile) => {
		const modified = await bash(`date -r ${logFile} +"%Y-%m-%dT%H:%M:%S"`);
		const size = await bash(`du -s ${logFile} | cut -f1`);
		return {
			name: path.basename(logFile),
			modified: new Date(modified[0]),
			size: Number(size[0])
		} as LogStatus;
	});

	return {
		body: {
			pids: await Promise.all(pidStatuses),
			logs: await Promise.all(logFileStatuses)
		} as Pipeline
	};
};
