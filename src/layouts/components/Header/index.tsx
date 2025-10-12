/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
// import DropdownMessage from './DropdownMessage';
// import DropdownNotification from './DropdownNotification';
// import DropdownUser from './DropdownUser';
// import LogoIcon from '../../images/logo/logo-icon.svg';
// import DarkModeSwitcher from './DarkModeSwitcher';
import Logo from "@/assets/logo.png";
import Button from "../../../components/atoms/Button";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const navigate = useNavigate()
  console.log(props)
  return (
    <header className="w-[90%] sticky h-[81px] top-0 z-999 flex bg-black drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <Link className="block flex-shrink-0" to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
          <Button
            type="button"
            label="Sign In"
            onclick={() => {navigate('login')}}
            color="text-white"
            bgColor="bg-transparent"
            width="w-[162px]"
            border="border-white"
          />
          <Button
            type="button"
            label="Create Account"
            onclick={() => {navigate('register')}}
            color="text-black"
            bgColor="bg-white"
            width="w-[194px]"
            border="border-white"
          />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
