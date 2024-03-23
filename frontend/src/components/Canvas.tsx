import { Engine } from '@/lib/engine';
import { useEffect, useRef } from 'react';

interface Props {
	color: string;
}

const Canvas: React.FC<Props> = ({ color }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine | null>(null);

	useEffect(() => {
		if (canvasRef.current !== null) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;
			const engine = new Engine(canvasRef.current);
			engine.start();

			engineRef.current = engine;
		}
	}, []);

	useEffect(() => {
		engineRef.current?.updateColor(color);
	}, [color]);

	return (
		<canvas
			ref={(elem) => {
				canvasRef.current = elem;
			}}
			width={800}
			height={600}
			className="bg-white w-full h-full cursor-pen"
		/>
	);
};

export default Canvas;

