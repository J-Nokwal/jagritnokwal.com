"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

function getVisitorId() {
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID().substring(0, 8); // create a new one
    localStorage.setItem("visitorId", id);
  }
  return id;
}

export default function ClarityInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_CLARITY_ID) {
      Clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID);
      const visitorId = getVisitorId();
      Clarity.identify(visitorId); // use your own stable visitor id
    }
  }, []);

  return null;
}