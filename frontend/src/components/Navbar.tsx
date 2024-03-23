import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ComplexButton } from './Button';

// TODO: make sure logout and profile change based on whether user is logged in
const Navbar = () => {
	const [token, setToken] = useState<string | null>(null);

	const router = useRouter();

	useEffect(() => {
		setToken(localStorage.getItem('token'));
	});

	const logout = () => {
		localStorage.removeItem('token');
		router.push('/');
	};

	return (
		<nav className="flex justify-between bg-transparent px-24 py-4 text-lg">
			<div className="flex items-center flex-row gap-2">
				<img src="img/logo.png" alt="Logo EducateAll" width="36" height="36"></img>
				<p className="font-bold text-xl text-blue">EducateAll</p>
			</div>

			<div className="flex gap-12 items-center">
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
			<div className="flex gap-4">
				{token && (
					<>
						<button className="hover:-translate-y-px ">Profile</button>
						<button onClick={() => logout()} className="text-blue border rounded border-blue py-1 px-2 shadow hover:-translate-y-px">
							Log Out
						</button>
					</>
				)}
				{!token && (
					<>
						<Link className="text-blue border rounded border-blue py-1.5 px-3 shadow hover:-translate-y-px" href="/signin">
							Sign In
						</Link>
						<ComplexButton text="Getting Started" link=""></ComplexButton>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
