import {
  RiCopperCoinLine,
  RiSecurePaymentLine,
  RiCouponLine
} from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { FaRegHeart, FaRegFile } from "react-icons/fa";

const ProfileMenu = () => {
  return (
    <div  className='border rounded-md shadow-2xl'>
      {/* MAIN MENU */}
      <div className="py-4 border-b border-gray-200">
        <ul className="flex flex-col gap-3 px-6 text-gray-700">
          <li
            className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200"
          >
            <FaRegFile className="text-red-500 text-lg" />
            My Orders
          </li>
          <li className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200">
            <RiCopperCoinLine className="text-yellow-500 text-lg" />
            My Coins
          </li>
          <li className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200">
            <MdOutlineMessage className="text-blue-500 text-lg" />
            Message Center
          </li>
          <li className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200">
            <RiSecurePaymentLine className="text-green-500 text-lg" />
            Payment
          </li>
          <li className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200">
            <FaRegHeart className="text-pink-500 text-lg" />
            Wish List
          </li>
          <li className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-2 cursor-pointer transition-all duration-200">
            <RiCouponLine className="text-purple-500 text-lg" />
            My Coupons
          </li>
        </ul>
      </div>

      {/* SETTINGS SECTION */}
      <div className="py-4 px-6 text-gray-600 flex flex-col gap-3">
        <div className="hover:text-red-500 hover:underline cursor-pointer transition-colors">
          Settings
        </div>
        <div className="hover:text-red-500 hover:underline cursor-pointer transition-colors">
          EMK-Xpress Business
        </div>
        <div className="hover:text-red-500 hover:underline cursor-pointer transition-colors">
          DS Center
        </div>
        <div onClick={() => {localStorage.removeItem('refresh'); localStorage.removeItem('access'); window.location.href = "/zentro"; }} className="pt-2 mt-2 border-t border-gray-200 text-red-500 font-medium hover:text-red-600 cursor-pointer transition-colors">Logout</div>
      </div>
    </div>
  );
};

export default ProfileMenu;
