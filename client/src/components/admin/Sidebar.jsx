import {useState} from "react";
import mainLogo from "../../assets/main-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboardIcon, PlusCircleIcon } from 'lucide-react'


function Sidebar() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const user = {
        firstName: 'Admin',
        lastName: 'User',
    }

    const adminLinks = [
        {name: 'Dashboard', pathname : '/admin', icon : LayoutDashboardIcon},
        {name:'Add Movies' , pathname : '/admin/add-movies', icon: PlusCircleIcon},
    ]
    return (
        <>
        <div>
            <div className={`flex flex-col bg-[#00abf0] h-[100vh] items-center pt-8 max-md:bg-primary/20 max-md:backdrop-blur-xl max-w-55 w-full border-r border-gray-300/30 text-lg max-md:text-md max-md:absolute z-50 transition-[width] overflow-hidden duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                <img
                    onClick={() => navigate("/")}
                    src={mainLogo}
                    alt="bookMovies"
                    className="h-6 md:h-14 object-contain cursor-pointer mb-4 ml-4 mr-6"
                />
                <button onClick={() => navigate("/profile")}
                
                className="bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600"
                >
                    {user.firstName.charAt(0).toUpperCase()}
                </button>
                <p className='py-2 text-base font-medium max-md:hidden mb-8'>{user.firstName} {user.lastName}</p>
                <ul className="w-full flex flex-col">
                {adminLinks.map((link, index) => (
                    <li key={index} className="w-full">
                    <Link
                        to={link.pathname}
                        className="flex items-center w-full px-8 py-3 text-gray-700 hover:bg-gray-200"
                    >
                        <link.icon className="h-5 w-5 mr-3" />
                        {link.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        </>
    );
}

export default Sidebar;