import { MutableRefObject } from 'react';
import { Stroke } from './stroke';
import { waitUntil } from './utils';

export class Engine {
	public readonly ctx: CanvasRenderingContext2D;

	private _af: number | null;
	private _strokes: Stroke[];
	private _color: string;
	private _eraser: boolean;
	private _peerStroke: Stroke | null;
	private _dirty: boolean;

	public constructor(public readonly canvas: HTMLCanvasElement, public readonly socketRef: MutableRefObject<WebSocket | null>) {
		this.ctx = canvas.getContext('2d')!;
		this._af = null;
		this._strokes = [];
		this._color = 'black';
		this._eraser = true;
		this._peerStroke = null;
		this._dirty = false;

		canvas.addEventListener('mousedown', (evt) => {
			if (evt.target === canvas) {
				if (this._eraser) {
					const moveListener = (evt: MouseEvent) => {
						const [x, y]: [number, number] = [evt.offsetX, evt.offsetY];

						let deleted = false;

						for (let i = 0; i < this._strokes.length; i++) {
							const stroke = this._strokes[i];
							const path = new Path2D();

							path.moveTo(...stroke.pts[0]);
							stroke.pts.slice(1).forEach((pt) => path.lineTo(...pt));
							this.ctx.lineWidth = 5;

							if (this.ctx.isPointInStroke(path, x, y)) {
								deleted = true;
								this._strokes.splice(i, 1);
								i--;
								socketRef.current?.send(JSON.stringify({ event: 'DELETE_STROKE', data: stroke.id }));
							}

							this.ctx.lineWidth = 1;
						}

						if (deleted) {
							this._dirty = true;
						}
					};

					const stopListener = () => {
						canvas.removeEventListener('mousemove', moveListener);
					};

					canvas.addEventListener('mousemove', moveListener);
					canvas.addEventListener('mouseup', stopListener);
					canvas.addEventListener('mouseout', stopListener);
				} else {
					const newStroke = new Stroke([[evt.offsetX, evt.offsetY]], this._color);

					this._strokes.push(newStroke);
					socketRef.current?.send(JSON.stringify({ event: 'NEW_STROKE', data: newStroke.toPlain() }));

					const moveListener = (evt: MouseEvent) => {
						const pt: [number, number] = [evt.offsetX, evt.offsetY];

						newStroke.extend(this.ctx, pt);
						socketRef.current?.send(JSON.stringify({ event: 'EXTEND', data: pt }));
					};

					const stopListener = () => {
						canvas.removeEventListener('mousemove', moveListener);
						socketRef.current?.send(JSON.stringify({ event: 'END_STROKE' }));
					};

					canvas.addEventListener('mousemove', moveListener);
					canvas.addEventListener('mouseup', stopListener);
					canvas.addEventListener('mouseout', stopListener);

					if (evt.button === 2) {
						console.log(this._strokes);
					}
				}
			}
		});

		waitUntil(() => socketRef.current !== null).then(() => {
			const socket = socketRef.current!;

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
		this._af = requestAnimationFrame(() => {
			this._tick();

			if (this._dirty) {
				this._dirty = false;
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this._strokes.forEach((stroke) => stroke.render(this.ctx));
			}
		});
	}
}

