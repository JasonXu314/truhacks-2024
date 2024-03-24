import { Stroke } from './stroke';

export class Engine {
	public readonly ctx: CanvasRenderingContext2D;

	private _strokes: Stroke[];
	private _color: string;
	private _eraser: boolean;
	private _peerStroke: Stroke | null;
	private _dirty: boolean;

	public constructor(public readonly canvas: HTMLCanvasElement, public readonly socket: WebSocket) {
		this.ctx = canvas.getContext('2d')!;
		this._strokes = [];
		this._color = 'black';
		this._eraser = true;
		this._peerStroke = null;
		this._dirty = false;

		socket.addEventListener('message', (evt) => {
			const msg = JSON.parse(evt.data);

			switch (msg.type) {
				case 'NEW_STROKE':
					this._peerStroke = new Stroke(msg.pts, msg.color, msg.id);
					this._strokes.push(this._peerStroke);
					break;
				case 'EXTEND':
					this._peerStroke?.extend(this.ctx, msg.pt);
					break;
				case 'END_STROKE':
					this._peerStroke = null;
					break;
				case 'DELETE_STROKE':
					this._strokes.splice(
						this._strokes.findIndex((s) => s.id === msg.id),
						1
					);
					this._dirty = true;
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

			if (this._dirty) {
				this._dirty = false;
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this._strokes.forEach((stroke) => stroke.render(this.ctx));
			}
		});
	}
}

