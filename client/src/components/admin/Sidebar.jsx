import {useState} from "react";
import mainLogo from "../../assets/main-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboardIcon, PlusCircleIcon, UsersIcon } from 'lucide-react'
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const userName = user?.name || "Admin User";
    const userInitial = userName.charAt(0).toUpperCase();

    let adminLinks = [
        {name: 'Dashboard', pathname : '/admin', icon : LayoutDashboardIcon},
    ];

    if (user?.role === 'superadmin') {
        adminLinks.push({name: 'Add TMDB Movies' , pathname : '/admin/add-movies', icon: PlusCircleIcon});
        adminLinks.push({name: 'Admin Requests' , pathname : '/admin/requests', icon: UsersIcon});
    } else if (user?.role === 'admin') {
        adminLinks.push({name: 'Add Shows' , pathname : '/admin/add-shows', icon: PlusCircleIcon});
    }
    return (
        <>
        <div className="sticky top-0 h-screen shrink-0 z-50">
            <div className={`flex flex-col bg-[#00abf0] h-full items-center pt-8 max-md:bg-primary/20 max-md:backdrop-blur-xl max-w-55 w-full border-r border-gray-300/30 text-lg max-md:text-md max-md:absolute transition-[width] overflow-hidden duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                <img
                    onClick={() => navigate("/")}
                    src={mainLogo}
                    alt="bookMovies"
                    className="h-6 md:h-14 object-contain cursor-pointer mb-4 ml-4 mr-6"
                />
                <button onClick={() => navigate("/profile")}
                
                className="bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600"
                >
                    {userInitial}
                </button>
                <p className='py-2 text-base font-medium max-md:hidden mb-8'>{userName}</p>
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