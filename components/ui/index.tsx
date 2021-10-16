import Image from "next/image";
import Link from "next/link";
import ControlPoint from "@mui/icons-material/ControlPoint";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Session } from "@supabase/gotrue-js";
import { useSupabaseSession } from "../hooks";
import { CircularProgress } from "@mui/material";
import {
  CloseOutlined,
  FacebookOutlined,
  Google,
  Twitter,
} from "@mui/icons-material";

export const UserPic: React.FC<{ src?: string }> = (props) => {
  return (
    <div className="flex items-center">
      <img
        src={props.src || "/img/supapace-logo.png"}
        alt="user-pic"
        width={32}
        height={32}
        className="rounded-full mr-2"
      />
    </div>
  );
};

export const MenuItem: React.FC<{
  title: React.ReactNode;
  selected?: boolean;
  left?: boolean;
  onClick?: () => void;
}> = (props) => {
  return (
    <div
      className={`px-2.5 h-full flex items-center gap-1 hover:text-primary hover:cursor-pointer border border-white ${
        props.children
          ? "hover:border hover:border-gray-200 group relative"
          : ""
      } ${
        props.selected
          ? "border-b-2 border-b-primary hover:border-b-2 hover:border-b-primary"
          : "text-gray-500"
      }`}
      onClick={props.onClick}
    >
      <div>{props.title}</div>
      {props.children && (
        <>
          <div>
            <KeyboardArrowDownIcon height="15" />
          </div>
          <div
            className={`w-full h-[10px] bg-white absolute bottom-[-1px] z-20 hidden group-hover:block ${
              props.left ? "right-0" : "left-0"
            }`}
          ></div>
          <div
            className={`hidden group-hover:block absolute top-full bg-white min-w-[150px] border border-gray-200 z-10 ${
              props.left ? "right-[-1px]" : "left-[-1px]"
            }`}
          >
            {props.children}
          </div>
        </>
      )}
    </div>
  );
};

export const MenuSubItem: React.FC<{
  title: React.ReactNode;
  selected?: boolean;
  href?: string;
  onClick?: () => void;
}> = (props) => {
  const div = (
    <div
      className={`p-3.5 w-full hover:bg-gray-200 text-gray-700 ${
        props.selected ? "font-bold" : ""
      }`}
      onClick={props.onClick}
    >
      <div>{props.title}</div>
    </div>
  );
  return props.href ? <Link href={props.href}>{div}</Link> : div;
};

export const MapTopBar: React.FC = () => {
  const { session, loading, signIn, signOut, signUp } = useSupabaseSession();
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);

  const signup = useCallback(() => {
    // TODO show signup modal
    signUp({ email: "jperelli@gmail.com", password: "juli123" });
  }, [signUp]);

  const logout = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <div className="bg-white px-2 fixed shadow-sm border-b border-gray-100 h-14 w-full flex justify-between text-sm z-10">
      {/* TopBar LEFT */}
      <div className="flex items-center gap-2">
        <Link href="/supapace">
          <a className="leading-none">
            <Image
              src="/img/supapace-logo.png"
              height="20"
              width="140"
              alt="supapace logo"
            />
          </a>
        </Link>
      </div>

      {/* TopBar RIGHT */}
      <div className="flex items-center gap-2">
        {loading ? (
          <CircularProgress />
        ) : session ? (
          <MenuItem
            title={
              <UserPic src="https://randomuser.me/api/portraits/thumb/men/75.jpg" />
            }
            left
          >
            <MenuSubItem title="Find Friends" />
            <MenuSubItem title="My Profile" />
            <MenuSubItem title="Settings" />
            <MenuSubItem title="Log Out" onClick={logout} />
          </MenuItem>
        ) : (
          <MenuItem title={<UserPic src="" />} left>
            <SignupModal
              visible={signupVisible}
              onClose={() => setSignupVisible(false)}
            />
            <MenuSubItem
              title="Signup"
              onClick={() => setSignupVisible(true)}
            />
            <LoginModal
              visible={loginVisible}
              onClose={() => setLoginVisible(false)}
            />
            <MenuSubItem title="Login" onClick={() => setLoginVisible(true)} />
          </MenuItem>
        )}
      </div>
    </div>
  );
};

export const MainTopBar: React.FC = () => (
  <div className="bg-white px-2 fixed shadow-sm border-b border-gray-100 h-14 w-full flex justify-between text-sm z-10">
    {/* TopBar LEFT */}
    <div className="flex items-center gap-2">
      <Link href="/supapace">
        <a className="leading-none">
          <Image
            src="/img/supapace-logo.png"
            height="20"
            width="140"
            alt="supapace logo"
          />
        </a>
      </Link>
      <MenuItem title={<SearchOutlinedIcon height="24" />} />
      <MenuItem title="Dashboard" selected>
        <MenuSubItem title="Activity Feed" selected />
        <MenuSubItem title="My Segments" />
        <MenuSubItem title="My Routes" />
      </MenuItem>
      <MenuItem title="Training">
        <MenuSubItem title="Training Calendar" />
        <MenuSubItem title="My Activities" />
      </MenuItem>
      <MenuItem title="Training">
        <MenuSubItem title="Segment Explore" />
        <MenuSubItem title="Segment Search" />
        <MenuSubItem title="Athlete Search" />
        <MenuSubItem title="Clubs" />
        <MenuSubItem title="Apps" />
        <MenuSubItem title="Local" />
      </MenuItem>
      <MenuItem title="Challenges"></MenuItem>
    </div>

    {/* TopBar RIGHT */}
    <div className="flex items-center gap-2">
      <MenuItem title={<NotificationsOutlined />} />
      <MenuItem title={<UserPic />} left>
        <MenuSubItem title="Find Friends" />
        <MenuSubItem title="My Profile" />
        <MenuSubItem title="Settings" />
        <MenuSubItem title="Log Out" />
      </MenuItem>
      <MenuItem title={<ControlPoint className="text-primary" />} left>
        <MenuSubItem title="Track" href="/supapace/track" />
      </MenuItem>
    </div>
  </div>
);

export const EntryData: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}> = (props) => (
  <div className={`flex flex-col ${props.className || ""}`}>
    <div className="text-xs text-gray-500">{props.label}</div>
    <div className="text-xl text-gray-600">{props.value}</div>
  </div>
);

export const Entry: React.FC = () => {
  return (
    <div className="bg-white py-4 px-6 w-full rounded-sm flex flex-col gap-3">
      <div className="flex items-center gap-6">
        <div>
          <UserPic />
        </div>
        <div>
          <div className="text-sm font-bold">Santiago Valdovinos</div>
          <div className="text-xs text-gray-500">
            Today at 8:12 AM - Manuel B. Gonnet, Argentina
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-8 flex justify-around">
          <DirectionsRunOutlinedIcon />
        </div>
        <div>
          <div className="text-xl font-bold">Carrera por la manana</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-8"></div>
        <div className="flex justify-between w-full">
          <div className="flex divide-gray-400">
            <EntryData label="Distance" value="6.98 km" className="pr-4" />
            <EntryData
              label="Pace"
              value="5:23 /km"
              className="px-4 border-r border-l border-gray-300"
            />
            <EntryData label="Time" value="37m 33s" className="pl-4" />
          </div>
          <div>
            <EntryData
              label="Achievements"
              value={
                <div className="flex items-center">
                  <EmojiEventsOutlinedIcon /> 1
                </div>
              }
              className="items-end"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-56 bg-gray-400 flex items-center justify-around">
        <div className="text-gray-100">map placeholder</div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="text-xs">be the first to give kudos!</div>
        <div className="flex gap-1">
          <div className="py-1 px-3 bg-gray-100 text-xs text-gray-800 border-2 border-gray-100 rounded-sm hover:bg-white cursor-pointer">
            <ThumbUpOutlinedIcon fontSize="small" />
          </div>
          <div className="py-1 px-3 bg-gray-100 text-xs text-gray-800 border-2 border-gray-100 rounded-sm hover:bg-white cursor-pointer">
            <ChatOutlinedIcon fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  title: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}> = (props) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center ${
        !props.visible ? "hidden" : ""
      }`}
    >
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div className="fixed inset-0 bg-white z-10 flex flex-col justify-center items-center">
        <div className="bg-white rounded-sm p-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">{props.title}</div>
            <div onClick={props.onClose}>
              <CloseOutlined />
            </div>
          </div>
          <div className="flex flex-col gap-2">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export const LoginModal: React.FC<{ visible: boolean; onClose: () => void }> = (
  props
) => {
  const { signIn } = useSupabaseSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Modal title="Login" visible={props.visible} onClose={props.onClose}>
      <div className="flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn({ email, password });
          }}
        >
          <div>
            <div className="text-sm font-bold">Email</div>
            <input
              className="w-full border-2 border-gray-300 rounded-sm p-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="text-sm font-bold">Password</div>
            <input
              className="w-full border-2 border-gray-300 rounded-sm p-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded-sm"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const SignupModal: React.FC<{ visible: boolean; onClose: () => void }> =
  (props) => {
    const { signUp } = useSupabaseSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
      <Modal title="Signup" visible={props.visible} onClose={props.onClose}>
        <div className="flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signUp({ email, password });
            }}
          >
            <div>
              <div className="text-sm font-bold">Email</div>
              <input
                className="w-full border-2 border-gray-300 rounded-sm p-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold">Password</div>
              <input
                className="w-full border-2 border-gray-300 rounded-sm p-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-sm"
                type="submit"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  };
