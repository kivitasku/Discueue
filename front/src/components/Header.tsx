import "./Header.css";
import HeaderMenu from "./HeaderMenu";

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onShowArtists: () => void;
  onHome: () => void;
  onLogout: () => void;
  onOpen: () => void;
  onClose: () => void;
  menuOpen: boolean;
  userName: string;
}

export default function Header({
  searchQuery,
  onSearch,
  onShowArtists,
  onHome,
  onLogout,
  onOpen,
  onClose,
  menuOpen,
  userName
}: HeaderProps) {
  

  return (
    <header className="header">
      <div className="name-area">
        <h1>Discueue</h1>
          <p> Hello, {userName}! </p>

      </div>


      <input
        className="search-bar"
        type="search"
        placeholder="Search..."
        aria-label="Search music"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
      />

      <div className="side-menu-container">
      <button
        className="menu-button"
        onClick={onOpen}
        aria-label="Open menu"
      >
        ☰
      </button>

      <HeaderMenu 
        isOpen={menuOpen} 
        onClose={onClose}
        onHome={onHome}
        onLogout={onLogout}
        onShowArtists={onShowArtists}
        >

      </HeaderMenu>

      </div>

      



    </header>
  );
}

