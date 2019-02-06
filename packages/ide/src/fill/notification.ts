import { logger, field } from "@coder/logger";

export interface INotificationHandle {
	close(): void;
	updateMessage(message: string): void;
	updateButtons(buttons: INotificationButton[]): void;
}

export enum Severity {
	Ignore = 0,
	Info = 1,
	Warning = 2,
	Error = 3,
}

export interface INotificationButton {
	label: string;
	run(): void;
}

/**
 * Optional notification service.
 */
export interface INotificationService {
	error(error: Error): void;
	prompt(severity: Severity, message: string, buttons: INotificationButton[], onCancel: () => void): INotificationHandle;
}

export interface IProgress {
	/**
	 * Report progress, which should be the completed percentage from 0 to 100.
	 */
	report(progress: number): void;
}

export interface IProgressService {
	/**
	 * Start a new progress bar that resolves & disappears when the task finishes.
	 */
	start<T>(title: string, task: (progress: IProgress) => Promise<T>, onCancel: () => void): Promise<T>;
}

/**
 * Temporary notification service.
 */
export class NotificationService implements INotificationService {
	public error(error: Error): void {
		logger.error(error.message, field("error", error));
	}

	public prompt(_severity: Severity, message: string, _buttons: INotificationButton[], _onCancel: () => void): INotificationHandle {
		throw new Error(`cannot prompt using the console: ${message}`);
	}
}

/**
 * Temporary progress service.
 */
export class ProgressService implements IProgressService {
	public start<T>(title: string, task: (progress: IProgress) => Promise<T>): Promise<T> {
		logger.info(title);

		return task({
			report: (progress): void => {
				logger.info(`${title} progress: ${progress}`);
			},
		});
	}
}