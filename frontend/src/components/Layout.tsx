import { Open_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import { UserProvider } from '@/contexts/UserContext';

const sans = Open_Sans({ subsets: ['latin'] });

const Layout = ({ children }: { children: JSX.Element }) => {
	const router = useRouter();

	return (
		<UserProvider>
			<div className="bg-[#6567D6] opacity-[5%] fixed top-[-40%] left-[-5%]aspect-square w-[40%] rounded-full blur-lg"></div>
			<div className="bg-[#D9D9D9] opacity-[18%] fixed top-[20%] right-[-5%] aspect-square w-[40%] rounded-full blur-lg"></div>
			<div className={`h-full ${sans.className} flex flex-col z-50`}>
				<div className="z-50 h-full flex flex-col">
					{!router.pathname.startsWith('/session') && !router.pathname.startsWith('/signin') && !router.pathname.startsWith('/signup') && <Navbar />}
					{children}
				</div>
			</div>
		</UserProvider>
	);
};

export default Layout;
