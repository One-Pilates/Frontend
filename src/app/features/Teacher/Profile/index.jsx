import React from "react";
import { useProfileUserModel } from "./model";
import ProfileUserView from "./view";

const ProfileUser = () => {
  const model = (useProfileUserModel());
  return <ProfileUserView {...model} />;
};

export default ProfileUser;
