import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function waitUntil(cb: () => boolean): Promise<void> {
	return new Promise((resolve) => {
		const waiter = () => {
			if (cb()) {
				resolve();
			} else {
				requestAnimationFrame(waiter);
			}
		};

		waiter();
	});
}
