import { Stroke } from './stroke';

export class Engine {
	public readonly ctx: CanvasRenderingContext2D;

	private _af: number | null;
	private _strokes: Stroke[];
	private _cursorPos: [number, number] | null;
	private _color: string;
    private _eraser: boolean;

	public constructor(public readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d')!;
		this._af = null;
		this._strokes = [];
		this._cursorPos = null;
		this._color = 'black';
		this._eraser = true;

		canvas.addEventListener('mousedown', (evt) => {
			if (evt.target === canvas) {
				const newStroke = new Stroke([[evt.offsetX, evt.offsetY]]);

				this._strokes.push(newStroke);

				const moveListener = (evt: MouseEvent) => {
					newStroke.extend(this.ctx, [evt.offsetX, evt.offsetY], this._color, this._eraser);
				};

				canvas.addEventListener('mousemove', moveListener);
				canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', moveListener));
				canvas.addEventListener('mouseout', () => canvas.removeEventListener('mousemove', moveListener));

				if (evt.button === 2) {
					console.log(this._strokes);
				}
			}
		});
	}

	public start(): void {
		this._tick();
	}

	private _tick(): void {
		this._af = requestAnimationFrame(() => {
			this._tick();
		});
	}

	public updateColor(color: string): void {
		this._color = color;
	}

	public toggleEraser(): void {
        this._eraser = !this._eraser;
    };
}
