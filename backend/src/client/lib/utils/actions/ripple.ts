import type { Action } from 'svelte/action';

export const ripple: Action<HTMLElement, boolean> = (node, activateOnChildren?: boolean) => {
	const listener = (evt: MouseEvent) => {
		if (activateOnChildren || evt.target === node) {
			const ripple = document.createElement('span');
			ripple.className = 'ripple';

			const diameter = Math.max(node.clientWidth, node.clientHeight);
			const radius = diameter / 2;
			ripple.style.width = ripple.style.height = `${diameter}px`;
			ripple.style.left = `${evt.offsetX - radius}px`;
			ripple.style.top = `${evt.offsetY - radius}px`;

			node.appendChild(ripple);

			ripple.addEventListener(
				'animationend',
				() => {
					ripple.remove();
				},
				{ once: true }
			);
		}
	};

	node.addEventListener('click', listener);

	return {
		destroy: () => node.removeEventListener('click', listener)
	};
};

