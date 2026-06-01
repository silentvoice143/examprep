"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Clock,
  Calendar,
  UsersRound,
  ArrowLeftRight,
  Plus,
} from "lucide-react";

import DateHelper from "@/utils/date-helper";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectActiveUser } from "@/store/auth/selectors";
import { useDispatch } from "react-redux";
import { setExpand } from "@/store/sidebar";
import { getInitials } from "@/utils/common";
import { logout, setLoader, switchUser } from "@/store/auth";
import { showToast } from "../common/toast";

import { useLogout } from "@/hooks/use-logout";
import { RootState } from "@/store/store";

const NavHeader = () => {
  const activeUser = useAppSelector(selectActiveUser);
  const user = activeUser?.user;
  const pathName = usePathname();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { handleLogout } = useLogout();
  const { users } = useAppSelector((state: RootState) => state.auth);
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);

  const handleSwitchAccount = (user: any) => {
    dispatch(switchUser(user?.id));
    route.push(`/account-switch/${user.id}`);
  };

  // Time update effect
  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const currentMinute = currentTime.getMinutes();
      const newMinute = now.getMinutes();

      if (currentMinute !== newMinute) {
        setCurrentTime(now);
      }
    };

    const timer = setInterval(updateTime, 5000);
    setCurrentTime(new Date());

    return () => clearInterval(timer);
  }, [currentTime.getMinutes()]);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch(setExpand());
            }}
            className="sm:hidden h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-neutral-100"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </Button>

          {/* Desktop Greeting - Keep original */}

          {/* Mobile Compact Greeting - Much smaller */}
        </div>

        {/* Right */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="child:outline-none" asChild>
            <Button
              variant="ghost"
              className="h-10 sm:h-12 pl-2 sm:pl-3 pr-1 sm:pr-2 
             hover:bg-neutral-100 rounded-lg sm:rounded-xl 
             outline-none focus:outline-none 
             focus:ring-0 focus:ring-offset-0 
             focus:border-none active:outline-none"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage
                    src={user?.profileImage as string}
                    alt={user?.fullName || "User avatar"}
                  />
                  <AvatarFallback className="bg-brand-primary text-white text-xs sm:text-sm font-medium">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-wrap flex-col text-left ">
                  <div className="text-sm font-medium text-neutral-900">
                    {user?.fullName || "User"}
                  </div>
                  <div className="flex flex-wrap text-xs text-neutral-600 capitalize text-wrap flex-col">
                    {user?.role}
                  </div>
                </div>
                <ChevronDown
                  size={12}
                  className="text-neutral-400 sm:w-3.5 sm:h-3.5"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 sm:w-56 shadow-2xl">
            {/* Mobile: Show user info in dropdown */}
            <div className="sm:hidden">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 p-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.profileImage as string}
                      alt={user?.fullName || "User avatar"}
                    />
                    <AvatarFallback className="bg-blue-theme text-white text-sm">
                      {getInitials(user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 truncate">
                      {user?.fullName || "User"}
                    </div>
                    <div className="text-xs text-neutral-600 capitalize text-wrap">
                      {user?.role}
                    </div>
                  </div>
                </div>
                <DropdownMenu
                  open={switchAccountOpen}
                  onOpenChange={setSwitchAccountOpen}
                >
                  <DropdownMenuTrigger>
                    <div className="flex items-center gap-2">
                      <UsersRound size={18} />
                      <ArrowLeftRight size={16} />
                    </div>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </div>

            {/* Desktop: Show user info in dropdown */}
            <div className="hidden sm:block">
              <DropdownMenuLabel>
                <div className="flex gap-4 justify-between items-center">
                  <div className="flex items-center gap-3 p-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user?.profileImage as string}
                        alt={user?.fullName || "User avatar"}
                      />
                      <AvatarFallback className="bg-blue-theme text-white text-sm">
                        {getInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-neutral-900 truncate line-clamp-1 ">
                        {(user?.fullName?.length ?? 0) > 6
                          ? user?.fullName?.slice(0, 6) + "..."
                          : user?.fullName || "User"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-600 capitalize text-wrap">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu
                    modal={false}
                    open={switchAccountOpen}
                    onOpenChange={setSwitchAccountOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10! w-10! shrink-0"
                      >
                        <ArrowLeftRight size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {users.map((user) => (
                        <DropdownMenuItem
                          key={user.id}
                          onClick={() => {
                            handleSwitchAccount(user);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user?.user?.profileImage ?? ""}
                              />
                              <AvatarFallback>
                                {user?.user?.fullName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user?.user?.fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user?.user?.email}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => {
                          setSwitchAccountOpen(false);
                          setOpen(false);
                          router.push(
                            `/login?addAccount=true&returnTo=${encodeURIComponent("/dashboard")}`,
                          );
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DropdownMenuLabel>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <User size={16} className="mr-2" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavHeader;
