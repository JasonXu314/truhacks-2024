import { Stroke } from './stroke';

const PEN = typeof window === 'undefined' ? ({} as any) : new Image(18, 18);
PEN.src = '/img/pen.png';

export class Engine {
	public readonly ctx: CanvasRenderingContext2D;

	private _af: number | null;
	private _strokes: Stroke[];
	private _cursorPos: [number, number] | null;

	public constructor(public readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d')!;
		this._af = null;
		this._strokes = [];
		this._cursorPos = null;

		canvas.addEventListener('mousedown', (evt) => {
			if (evt.target === canvas) {
				const newStroke = new Stroke([[evt.offsetX, evt.offsetY]]);

				this._strokes.push(newStroke);

				const moveListener = (evt: MouseEvent) => {
					newStroke.extend(this.ctx, [evt.offsetX, evt.offsetY]);
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

			// if (this._cursorPos !== null) {
			// 	this.ctx.drawImage(PEN, this._cursorPos[0], this._cursorPos[1] - 18, 18, 18);
			// }
		});
	}
}

