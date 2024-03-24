import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

export const CountUpStats = () => {
	return (
		<div className="mx-auto w-full py-10 md:py-10 px-full bg-paleBlue rounded-lg  ">
			<h2 className="mb-4 text-center text-base text-indigo-900  text-xxl sm:text-lg md:mb-6">Without community efforts, by 2030</h2>

			<div className="flex flex-col items-center justify-center sm:flex-row">
				<Stat num={84} suffix=" mil" subheading="Children and youth will be out of school" />
				<div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
				<Stat num={300} decimals={0} suffix=" mil" subheading="Students will lack basic numeracy/literacy skills" />
				<div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
				<Stat num={100} suffix="B$" subheading="Annual finance gap to reach education goals" />
			</div>
		</div>
	);
};

interface Props {
	num: number;
	suffix: string;
	decimals?: number;
	subheading: string;
}

const Stat = ({ num, suffix, decimals = 0, subheading }: Props) => {
	const ref = useRef<HTMLSpanElement | null>(null);
	const isInView = useInView(ref);

	useEffect(() => {
		if (!isInView) return;

		animate(0, num, {
			duration: 2.5,
			onUpdate(value) {
				if (!ref.current) return;

				ref.current.textContent = value.toFixed(decimals);
			},
		});
	}, [num, decimals, isInView]);

	return (
		<div className="flex w-72 flex-col items-center py-8 sm:py-0">
			<p className="mb-2 text-center text-7xl font-semibold sm:text-6xl text-text">
				<span ref={ref}></span>
				{suffix}
			</p>
			<p className="max-w-48 text-center text-neutral-600">{subheading}</p>
		</div>
	);
};
