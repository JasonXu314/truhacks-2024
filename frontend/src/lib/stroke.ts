export class Stroke {
	constructor(public pts: [number, number][]) {}

	public extend(ctx: CanvasRenderingContext2D, pt: [number, number], color: string): void {
        ctx.strokeStyle = color;
		ctx.moveTo(...this.pts.at(-1)!);
		ctx.lineTo(...pt);
		ctx.stroke();

		this.pts.push(pt);
	}
}

