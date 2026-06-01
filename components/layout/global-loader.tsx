"use client";

import React, { ReactNode } from "react";
import { Spinner } from "./spinner";
import { useStore } from "@/libs/store";


const GlobalLoader = ({ children }: { children: ReactNode }) => {
  const { globalLoading } = useStore(state => state);
  return globalLoading ? <Spinner /> : children;
};

export default GlobalLoader;
