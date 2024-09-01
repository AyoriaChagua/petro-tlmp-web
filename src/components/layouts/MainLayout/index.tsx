import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../common/Navbar'



export default function MainLayout({}) {
    const location = useLocation();
    return (
        <div className='flex flex-col '>
            <Navbar />
            <div className={`${location.pathname !== "/dashboard" && " "} ${(location.pathname.includes("reports") )? "mt-20 min-[1500px]:px-40 lg:px-20 md:px-16 px-2" : location.pathname !== "/dashboard"  && "mt-28 min-[1500px]:px-80 lg:px-40 md:px-16 px-2"}`}>
                <Outlet />
            </div>
        </div>

    )
}
