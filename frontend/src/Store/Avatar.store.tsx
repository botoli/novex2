import { makeAutoObservable } from "mobx";

const AvatarStore = {
  avatar: null,
  setAvatar(newAvatar: string | null) {
    this.avatar = newAvatar;
  },
};
makeAutoObservable(AvatarStore);
export default AvatarStore;
