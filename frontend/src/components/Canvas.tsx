import { Engine } from '@/lib/engine';
import { useEffect, useRef, useState } from 'react';

interface Props {}

const Canvas: React.FC<Props> = ({}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [cursor, setCursor] = useState<import('csstype').Property.Cursor>('none');

	useEffect(() => {
		if (canvasRef.current !== null) {
			const engine = new Engine(canvasRef.current);

			engine.start();
		}
	}, []);

	return (
		<canvas
			ref={(elem) => {
				canvasRef.current = elem;
			}}
			width={1200}
			height={800}
			style={{ cursor }}
		/>
	);
};

export default Canvas;

