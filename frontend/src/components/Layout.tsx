import Navbar from "./Navbar";
import { Open_Sans } from 'next/font/google';

const sans = Open_Sans({ subsets: ['latin'] });

const Layout = ({ children } : {children : JSX.Element}) => {

    return (
        <div className={`bg-[#F1F1FD] min-h-screen ${sans.className}`}>
        <Navbar/>
        {children}
        </div>
    );
}
 
export default Layout;