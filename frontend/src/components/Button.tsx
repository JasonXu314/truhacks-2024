import { useEffect, useRef } from 'react';
import styles from '../styles/complexButton.module.css';
import { useRouter } from 'next/router';

export const ComplexButton = ({ text, link }: { text: string; link: string }) => {
	const parentRef = useRef<HTMLDivElement | null>(null);
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		btnRef?.current?.addEventListener('mouseover', () => {
			parentRef.current?.style.setProperty('--size', '250px');
			parentRef.current?.style.setProperty('--shineColor', 'rgba(255, 255, 255, 0.3)');
		});

		btnRef?.current?.addEventListener('mouseleave', () => {
			parentRef.current?.style.setProperty('--size', '0px');
			parentRef.current?.style.setProperty('--shineColor', 'rgba(255, 255, 255, 0.0)');
		});

		btnRef?.current?.addEventListener('mousemove', (e) => {
			parentRef.current?.style.setProperty('--x', e.offsetX + 'px');
			parentRef.current?.style.setProperty('--y', e.offsetY + 'px');
		});
	}, []);

	return (
		<div ref={parentRef} className={styles.skeuParent}>
			<button
				ref={btnRef}
				onClick={() => router.push(link)}
				className={`overflow-hidden cursor-pointer  text-white rounded px-5 py-2 bg-blue transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_0px_3px_7px_#6903f6] ${styles.skeu}`}
			>
				{text}
			</button>
		</div>
	);
};
