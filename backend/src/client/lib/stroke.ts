export class Stroke {
	public readonly id: string;

	constructor(public pts: [number, number][], public readonly color: string, id?: string) {
		if (id) {
			this.id = id;
		} else {
			const buf = new Uint8Array(16);
			crypto.getRandomValues(buf);

			this.id = Array.from(buf)
				.map((byte) => byte.toString(16))
				.join('');
		}
	}

	public extend(ctx: CanvasRenderingContext2D, pt: [number, number]): void {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.moveTo(...this.pts.at(-1)!);
		ctx.lineTo(...pt);
		ctx.stroke();

		this.pts.push(pt);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.moveTo(...this.pts[0]);

		this.pts.slice(1).forEach((pt) => ctx.lineTo(...pt));

		ctx.stroke();
	}

	public toPlain(): { id: string; pts: [number, number][]; color: string } {
		const { id, pts, color } = this;

		return { id, pts, color };
	}
}

