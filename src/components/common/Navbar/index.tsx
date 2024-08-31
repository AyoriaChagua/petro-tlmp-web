import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { RiUserFill } from 'react-icons/ri';
import ModalLayout from '../../layouts/ModalLayout';
import { Cia } from '../../../types/cia';

interface DropdownItem {
    name: string;
    path: string;
}

interface NavItem {
    name: string;
    path: string;
    dropdown?: DropdownItem[];
}

export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navRef = useRef<HTMLDivElement | null>(null);
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const navItems: NavItem[] = [
        {
            name: 'Petroamerica',
            path: '/dashboard',
        },
        {
            name: 'Mantenimiento',
            path: '/maintanance',
            dropdown: [
                { name: 'Correlativos', path: '/maintanance/correlative-control' },
                { name: 'Proveedores', path: '/maintanance/providers' },
                { name: 'Destinos', path: '/maintanance/cost-center' },
                { name: 'Aprobadores', path: '/maintanance/approving-personnel' },
                { name: 'Área solicitante', path: '/maintanance/requesting-area' },
                { name: 'Documentos SUNAT', path: '/maintanance/sunat-documents' },
                { name: 'Usuarios', path: '/maintanance/users' },
            ],
        },
        {
            name: 'Crear orden',
            path: '/order-mp/create',
        },
        {
            name: 'Reportes',
            path: '/reports',
            dropdown: [
                { name: 'General', path: '/reports/order-document' },
                { name: 'Caja chica', path: '/reports/petty-cash' },
                { name: 'Compras', path: '/reports/purchasing' },
            ],
        },
    ];

    const { companySelected, logout, user, companies, setCompanySelected } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node) &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setActiveDropdown(null);
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMouseEnter = (index: number) => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
        }
        setActiveDropdown(index);
    };

    const handleMouseLeave = () => {
        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 300);
    };


    const selectCompany = (company: Cia) => {
        setCompanySelected({ label: company.description, value: company.companyId });
    }

    return (
        <>
            <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 text-lg z-50">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
                    <Link to="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/img/logo_little.png" className="h-12" alt="Petroamerica Logo" />
                    </Link>
                    <div className="flex lg:order-2 space-x-3 lg:space-x-0 rtl:space-x-reverse">
                        <div
                            ref={navRef}
                            className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${isOpen ? 'block' : 'hidden'} lg:block transition-all duration-300 ease-in-out`}
                            id="navbar-sticky"
                        >
                            {
                                !isOpen &&
                                <button
                                    type="button"
                                    className="text-white bg-[#055CBB] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                    onClick={openModal}
                                >
                                    {companySelected?.label}
                                </button>
                            }
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="ml-2 flex text-sm bg-white border border-[#055CBB] rounded-full lg:me-0 focus:ring-4 focus:ring-gray-300 p-1"
                                    id="user-menu-button"
                                    aria-expanded={userMenuOpen}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <span className="sr-only">Usuario</span>
                                    <RiUserFill color='#055CBB' className='text-2xl' />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <div className="px-4 py-3">
                                            <span className="block text-sm text-gray-900">{user?.description?.toUpperCase()}</span>
                                        </div>
                                        <ul className="py-2" aria-labelledby="user-menu-button">
                                            <li>
                                                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                            </li>
                                            <li>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi cuenta</Link>
                                            </li>
                                            <li>
                                                <div className="block px-4 py-2">
                                                    <button
                                                        type="button"
                                                        className=" text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                                        onClick={logout}
                                                    >
                                                        Cerrar sesión
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="navbar-sticky"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        ref={navRef}
                        className={`items-center justify-between w-full ${isOpen ? 'block' : 'hidden'} lg:flex lg:justify-between lg:w-auto lg:order-1 transition-all duration-300 ease-in-out`}
                        id="navbar-sticky"
                    >

                        <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0 lg:bg-white">
                            {navItems.map((item, index) => (
                                <li
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {!item.dropdown ?
                                        <Link
                                            to={item.path}
                                            className={`block py-2 px-3 rounded ${location.pathname === item.path
                                                ? 'text-white bg-[#055CBB]'
                                                : 'text-[#055CBB] hover:bg-gray-100'
                                                }`}
                                        >
                                            {item.name}
                                        </Link> :
                                        <span
                                            className={`block py-2 px-3 rounded ${location.pathname === item.path
                                                ? 'text-white bg-[#055CBB]'
                                                : 'text-[#055CBB] hover:bg-gray-100 cursor-default'
                                                }`}
                                        >
                                            {item.name}
                                        </span>}

                                    {item.dropdown && activeDropdown === index && (
                                        <ul
                                            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {item.dropdown.map((dropdownItem) => (
                                                <li key={dropdownItem.name}>
                                                    <Link
                                                        to={dropdownItem.path}
                                                        className={`block px-4 py-2 text-sm ${location.pathname === dropdownItem.path
                                                            ? 'text-white bg-[#055CBB]'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {dropdownItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {
                            isOpen &&
                            <div className='pl-6'>
                                <button
                                    type="button"
                                    className="text-white bg-[#055CBB] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                >
                                    {companySelected?.label}
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </nav>
            <ModalLayout isOpen={isModalOpen} onClose={closeModal} >
                <ul className="bg-white rounded-lg border border-gray-200 w-full text-gray-900 mt-5">
                    {companies.map((company) => (
                        <li
                            key={company.companyId}
                            className={`px-6 py-2 border-b border-gray-200 w-full  cursor-pointer ${companySelected?.label === company.description ? "bg-blue-500  text-white" : "hover:bg-gray-100"}`}
                            onClick={() => selectCompany(company)}
                        >
                            {company.description}
                        </li>
                    ))}
                </ul>
            </ModalLayout>
        </>
    );
}
