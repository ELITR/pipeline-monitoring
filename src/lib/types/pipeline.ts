export type Pipeline = {
	pids: PidStatus[];
	logs: LogStatus[];
};

export type PidStatus = {
	name: string;
	alive: boolean;
};

export type LogStatus = {
	name: string;
	modified: Date;
	size: number;
};
