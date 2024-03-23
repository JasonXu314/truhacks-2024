import Navbar from "./Navbar";

const Layout = ({ children } : {children : JSX.Element}) => {
    return (
        <div className="bg-[#F1F1FD]">
        <Navbar/>
        {children}
        </div>
    );
}
 
export default Layout;