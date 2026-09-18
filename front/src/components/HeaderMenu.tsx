import "./HeaderMenu.css";
import SideMenu from "./SideMenu";

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowArtists: () => void;
  onHome: () => void;
  onLogout: () => void;
}

export default function HeaderMenu({
  isOpen,
  onClose,
  onShowArtists,
  onHome,
  onLogout,
}: HeaderMenuProps) {
  
  return (
    <SideMenu onClose={onClose} title="Menu" isOpen={isOpen}>
      <div className="button-container">
        <button
          className="menu-item"
          onClick={onHome}
        >
          Home
        </button>

        <button
          className="menu-item"
          onClick={onShowArtists}
        >
          Artists
        </button>

        <button
          className="menu-item"
          onClick={onLogout}
        >
          Log out
        </button>

      </div>

    </SideMenu>



  );
}