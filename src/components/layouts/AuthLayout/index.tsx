import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
    return (
        <div className='flex h-screen flex-row justify-center items-center '>
            <div className='flex w-1/3 justify-center items-center bg-[#055CBB] h-screen p-10'>
                <img src="/img/logo_login.png" alt="logo-login" />
            </div>
            <div className='flex w-2/3 justify-center items-center'>
                <Outlet />
            </div>
        </div>
    )
}
