import api from '@/services/axiosConfig';
import Link from 'next/link';
import { ComplexButton } from './Button';
import { EmptyComplexButton } from './ButtonEmpty';
// TODO: make sure logout and profile change based on whether user is logged in
const Navbar = () => {
	return (
		<nav className="flex justify-between bg-transparent px-10 py-4 text-lg">
			<div className="flex items-center flex-row gap-2">
				<img src="img/logo.png" alt="Logo EducateAll" width="36" height="36"></img>
				<p className="font-bold text-xl text-blue">EducateAll</p>
			</div>

			<div className="flex gap-4 items-center">
				<Link className="hover:scale-105 text-[#222124] opacity-90 font-semibold" href="/#">
					Home
				</Link>
				<Link className=" hover:scale-105 text-[#222124] opacity-90 font-semibold" href="/#about">
					About
				</Link>
				<Link className=" hover:scale-105 text-[#222124] opacity-90 font-semibold" href="/#resources">
					Resources
				</Link>
			</div>
			<div className="flex gap-4 items-center">
				<Link className="text-blue border rounded border-blue py-1.5 px-3 shadow hover:-translate-y-px" href="/#">
					Log In
				</Link>
				<ComplexButton text="Getting Started" link=""></ComplexButton>
			</div>
		</nav>
	);
};

export default Navbar;
