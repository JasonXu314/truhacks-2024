import { Engine } from '@/lib/engine';
import { useEffect, useRef, useState } from 'react';

interface Props {}

const PEN = 'url(/img/pen.png) 0 512, auto';

const Canvas: React.FC<Props> = ({}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [cursor, setCursor] = useState<import('csstype').Property.Cursor>(PEN);

	useEffect(() => {
		if (canvasRef.current !== null) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;
			const engine = new Engine(canvasRef.current);

			engine.start();
		}
	}, []);

	return (
		<canvas
			ref={(elem) => {
				canvasRef.current = elem;
			}}
			width={800}
			height={600}
			style={{ cursor }}
			className="bg-white w-full h-full"
		/>
	);
};

export default Canvas;

