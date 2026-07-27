import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2b2b2b] text-gray-400 text-sm">
      <div className="border-t border-gray-600 w-full" />

      <div className="flex flex-col items-center py-6">
        {/* Logo */}
        <h2 className="text-3xl font-bold text-white mb-4">
          BookMovies
        </h2>

        {/* Social Icons */}
        <div className="flex space-x-4 mb-4">
          <FaFacebookF className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
          <FaTwitter className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
          <FaInstagram className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
          <FaYoutube className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
          <FaPinterestP className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
          <FaLinkedinIn className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-500 transition" />
        </div>

        {/* Copyright */}
        <p className="text-center text-xs px-4 max-w-4xl">
          Copyright © 2025 BookMovies Pvt. Ltd. All Rights Reserved.
        </p>

        <p className="text-center text-xs mt-2 px-4 max-w-4xl">
          The content and images used on this site are copyright protected and
          belong to their respective owners. Their use on this website is for
          promotional purposes only and does not imply endorsement.
        </p>
      </div>
    </footer>
  );
};

export default Footer;