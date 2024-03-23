<script lang="ts">
	import { params } from '$meta';
	import { onMount } from 'svelte';
	import { Engine } from '../../../lib/engine';

	let canvas: HTMLCanvasElement | null = null;

	onMount(() => {
		const ws = new WebSocket('ws://localhost:5000/gateway');

		ws.addEventListener('open', () => {
			ws.send(JSON.stringify({ event: 'EAVESDROP', data: { id: $params.id } }));
			const engine = new Engine(canvas!, ws);

			engine.start();
		});
	});
</script>

<canvas bind:this={canvas} height={800} width={1200} style="cursor: none;" />
