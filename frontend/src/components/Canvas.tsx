import { Engine } from '@/lib/engine';
import { useEffect, useRef, useState } from 'react';

interface Props {
    color: string
}

const Canvas: React.FC<Props> = ({ color }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [engineState, setEngineState] = useState<Engine>();

	useEffect(() => {
		if (canvasRef.current !== null) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;
			const engine = new Engine(canvasRef.current);
            setEngineState(engine);
			engine.start();
		}
	}, []);

    useEffect(() => {
        engineState?.updateColor(color)
    }, [color])

	return (
		<canvas
			ref={(elem) => {
				canvasRef.current = elem;
			}}
			width={800}
			height={600}
			className='bg-white w-full h-full cursor-pen'
		/>
	);
};

export default Canvas;