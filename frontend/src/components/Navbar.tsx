import api from '@/services/axiosConfig';
import Link from 'next/link';

// TODO: make sure logout and profile change based on whether user is logged in
const Navbar = () => {
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
				<button>Profile</button>
				<button>Log Out</button>
			</div>
		</nav>
	);
};

export default Navbar;
