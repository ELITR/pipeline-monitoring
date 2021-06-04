import { exec } from 'child_process';
import { promisify } from 'util';

const async_exec = promisify(exec);

export async function bash(cmd: string): Promise<string[]> {
	const { stdout, stderr } = await async_exec(cmd);
	if (stderr.length > 0) {
		throw Error(`Command ${cmd} failed: ${stderr}`);
	}
	return stdout.split('\n').filter((l) => l); // remove empty entries
}
