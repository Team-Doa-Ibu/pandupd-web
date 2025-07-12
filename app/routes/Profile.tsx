import React from 'react';
import ProfilePage from '../components/pages/ProfilePage';
import { Navbar } from "~/components/ui/Navbar";
import { Footer } from "~/components/ui/footer";

export default function profile() {
    return (
      <>
        <Navbar />
        <ProfilePage />
        <Footer />
      </>
    );
  } 

