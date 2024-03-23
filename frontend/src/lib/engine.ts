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

	public constructor(public readonly canvas: HTMLCanvasElement, public readonly socketRef: MutableRefObject<WebSocket | null>) {
		this.ctx = canvas.getContext('2d')!;
		this._af = null;
		this._strokes = [];
		this._color = 'black';
		this._eraser = true;
		this._peerStroke = null;

		canvas.addEventListener('mousedown', (evt) => {
			if (evt.target === canvas) {
				const newStroke = new Stroke([[evt.offsetX, evt.offsetY]]);

				this._strokes.push(newStroke);
				socketRef.current?.send(JSON.stringify({ event: 'NEW_STROKE', data: newStroke.toPlain() }));

				const moveListener = (evt: MouseEvent) => {
					const pt: [number, number] = [evt.offsetX, evt.offsetY];

					newStroke.extend(this.ctx, pt, this._color);
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
		});

		waitUntil(() => socketRef.current !== null).then(() => {
			const socket = socketRef.current!;

			socket.addEventListener('message', (evt) => {
				const msg = JSON.parse(evt.data);

				switch (msg.type) {
					case 'NEW_STROKE':
						this._peerStroke = new Stroke(msg.pts, msg.id);
						break;
					case 'EXTEND':
						this._peerStroke?.extend(this.ctx, msg.pt, this._color);
						break;
					case 'END_STROKE':
						this._peerStroke = null;
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
		});
	}
}

