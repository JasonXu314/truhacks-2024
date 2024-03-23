import { Stroke } from './stroke';

export class Engine {
	public readonly ctx: CanvasRenderingContext2D;

	private _strokes: Stroke[];
	private _color: string;
	private _eraser: boolean;
	private _peerStroke: Stroke | null;

	public constructor(public readonly canvas: HTMLCanvasElement, public readonly socket: WebSocket) {
		this.ctx = canvas.getContext('2d')!;
		this._strokes = [];
		this._color = 'black';
		this._eraser = true;
		this._peerStroke = null;

		socket.addEventListener('message', (evt) => {
			const msg = JSON.parse(evt.data);

			switch (msg.type) {
				case 'NEW_STROKE':
					this._peerStroke = new Stroke(msg.pts, msg.id);
					this._strokes.push(this._peerStroke);
					break;
				case 'EXTEND':
					this._peerStroke?.extend(this.ctx, msg.pt, this._color);
					break;
				case 'END_STROKE':
					this._peerStroke = null;
					break;
			}
		});
	}

	public start(): void {
		this._tick();
	}

	public updateColor(color: string): void {
		this._color = color;
	}

	public toggleEraser(): void {
		this._eraser = !this._eraser;
	}

	private _tick(): void {
		requestAnimationFrame(() => {
			this._tick();
		});
	}
}

