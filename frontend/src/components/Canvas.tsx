import { Engine } from '@/lib/engine';
import { MutableRefObject, useEffect, useRef } from 'react';

interface Props {
	color: string;
	eraserEquipped: boolean;
	socketRef: MutableRefObject<WebSocket | null>;
}

const Canvas: React.FC<Props> = ({ color, eraserEquipped, socketRef }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine | null>(null);

	useEffect(() => {
		if (canvasRef.current !== null && socketRef.current !== null) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;
			const engine = new Engine(canvasRef.current, socketRef);
			engine.start();

			engineRef.current = engine;
		}
	}, [socketRef]);

	useEffect(() => {
		engineRef.current?.updateColor(color);
	}, [color]);

	useEffect(() => {
		engineRef.current?.toggleEraser();
	}, [eraserEquipped]);

	return (
		<canvas
			ref={(elem) => {
				canvasRef.current = elem;
			}}
			width={800}
			height={600}
			className={`bg-white w-full h-full ${eraserEquipped ? "cursor-eraser" : "cursor-pen"}`}
		/>
	);
};

export default Canvas;

