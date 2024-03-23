import type { Action } from 'svelte/action';

export const debounce: Action<HTMLElement> = (node) => {
	const original = node.addEventListener;
	let working: boolean = false;

	node.addEventListener = <K extends keyof HTMLElementEventMap>(
		evt: K,
		listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => Promise<any>,
		options?: boolean | AddEventListenerOptions
	) =>
		original.bind(node)(
			evt,
			(evt: HTMLElementEventMap[K]) => {
				if (!working) {
					const result = listener.bind(node)(evt);

					if (result instanceof Promise) {
						working = true;
						if ('disabled' in node) {
							node.ariaDisabled = 'true';
							node.ariaBusy = 'true';
						}

						result.then(() => {
							if ('disabled' in node) {
								node.ariaDisabled = null;
								node.ariaBusy = null;
							}
							working = false;
						});
					}
				}
			},
			options
		);

	return {};
};

