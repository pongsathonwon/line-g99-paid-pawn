import React from "react";
import { Outlet } from "react-router-dom";

function Protected() {
  return <Outlet></Outlet>;
}

export default Protected;
