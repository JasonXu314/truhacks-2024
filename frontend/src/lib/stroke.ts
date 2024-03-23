export class Stroke {
	constructor(public pts: [number, number][]) {}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.moveTo(...this.pts[0]);

		this.pts.slice(1).forEach((pt) => ctx.lineTo(...pt));

		ctx.stroke();
	}
}

