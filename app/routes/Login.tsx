import React from "react";
import LoginPage from "../components/pages/LoginPage";
import { supabase } from "../data/supabaseClient";
import { json, redirect } from "@remix-run/node";

export default function login() {
  return (
    <>
      <LoginPage />
    </>
  );
}
