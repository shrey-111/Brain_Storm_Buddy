import React, { useState } from "react";
import Navbar from "./Navbar";
import ProfilePage from "./ProfilePage";

function Avatar() {
  const [name, setName] = useState("John Doe");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  return (
    <div>
      <Navbar avatar={avatar} name={name} />
      <ProfilePage name={name} setName={setName} avatar={avatar} setAvatar={setAvatar} />
    </div>
  );
}

export default Avatar;
