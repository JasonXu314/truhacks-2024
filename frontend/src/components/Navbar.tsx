import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
		<nav className='flex justify-between bg-transparent px-10 py-4 text-lg'>
			<p className=''>EducateAll</p>
			<div className='flex gap-4'>
				<Link className='text-[#222124] opacity-90 font-semibold' href='/#'>
					Home
				</Link>
				<Link className='text-[#222124] opacity-90 font-semibold' href='/#about'>
					About
				</Link>
				<Link className='text-[#222124] opacity-90 font-semibold' href='/#resources'>
					Resources
				</Link>
			</div>
			<div className='flex gap-4'>
				{token && (
					<>
						<button>Profile</button>
						<button onClick={() => logout()}>Log Out</button>
					</>
				)}
				{!token && (
					<>
						<Link href='/sigin'>Sign In</Link>
						<Link href='/signup'>Get Started</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
