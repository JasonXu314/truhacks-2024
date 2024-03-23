import { ComplexButton } from '@/components/Button';
import { EmptyComplexButton } from '@/components/ButtonEmpty';
import { CountUpStats } from '@/components/CountUpStats';
import Footer from '@/components/Footer';

import Image from 'next/image';

export default function Home() {
	return (
		<div>
			<main className={`flex min-h-screen flex-col items-center w-full justify-between px-24 gap-10`}>
				<div className="flex flex-row gap-1 align-baseline pl-3">
					<div className="pt-28 flex flex-col min-h-96 gap-4 min-w-64 mb-12 justify-items-start ">
						<h1 className="text-5xl font-bold">Ensuring inclusive</h1>
						<h1 className="text-5xl text-blue font-bold">Free Quality Education</h1>
						<p className="pt-3">
							Our live interactive platform connects students worldwide with passionate tutors. No matter your location, time zone, or budget,
							you can now access expert guidance and conquer any academic challenge. Try it out today!
						</p>
						<div className="flex flex-row gap-10 pt-3">
							{/* <button className="rounded-lg bg-blue text-stone-200 py-2 px-5">Get Started</button> */}
							<ComplexButton text="Getting started" link=""></ComplexButton>
							<EmptyComplexButton text="Watch" link=""></EmptyComplexButton>
						</div>
					</div>
					<img src="img/stocks.png" alt="Boy teaching" width="550" height="700"></img>
				</div>

				<CountUpStats></CountUpStats>

				<div className="flex flex-row gap-6 align-baseline pl-3" id="about">
					<img src="img/earth.png" alt="Girl holdign a globe" width="550" height="700"></img>
					<div className="pt-28 flex flex-col min-h-96 gap-4 min-w-64 justify-itmes-start ">
						<h1 className="text-5xl font-bold">Our mission is to</h1>
						<h1 className="text-5xl text-blue font-bold">Bring Positive Change</h1>
						<p className="pt-3">
							We are driven by the belief that education is <span className="italic">a fundamental human right</span>, not a privilege. Inspired
							from our own struggles as immigrants and international students, we are dedicated to breaking down barriers and empowering
							individuals worldwide.
						</p>
					</div>
				</div>
				<h2 className="text-2xl text-textSimple" id="resources">
					Explore Additional Recources
				</h2>

				<div className="flex flex-row gap-12">
					<div className="hover:scale-105  shadow-lg shadow-indigo-500/30 flex flex-col bg-paleBlue border-2 border-blue h-42 w-72 items-center justify-center rounded-lg">
						<a href="https://www.khanacademy.org/" target="_blank">
							<img src="img/khan.png" alt="Khan Academy" width="170" height="170"></img>
						</a>
					</div>
					<div className="hover:scale-105  shadow-lg shadow-indigo-500/30 flex flex-col align-middle bg-paleBlue border-2 border-blue h-42 w-72 items-center justify-center rounded-lg">
						<a href="https://oercommons.org/" target="_blank">
							<img src="img/oer.png" alt="Open Educational Recourses" width="170" height="170"></img>
						</a>
					</div>
					<div className="hover:scale-105  shadow-lg shadow-indigo-500/30 flex flex-col bg-paleBlue border-2 border-blue px-14 py-12 rounded-lg">
						<a href="https://ocw.mit.edu/" target="_blank">
							<img src="img/mit.png" alt="MIT OpenCourseWhare" width="170" height="170"></img>
						</a>
					</div>
				</div>
			</main>
			<Footer></Footer>
		</div>
	);
}
