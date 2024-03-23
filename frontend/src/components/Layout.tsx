import { Open_Sans } from 'next/font/google';
import Navbar from './Navbar';

const sans = Open_Sans({ subsets: ['latin'] });

const Layout = ({ children }: { children: JSX.Element }) => {
	return (
		<div className={`h-full ${sans.className} flex flex-col`}>
			<Navbar />
			{children}
		</div>
	);
};

export default Layout;
