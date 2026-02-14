import { FaBars } from 'react-icons/fa';
import Account from './Account';

export default function Navbar({ navAberta, setNavAberta }) {
  return (
    <div
      className="flex justify-between items-center px-4 md:px-6 py-3 z-30 relative"
      style={{
        backgroundColor: 'var(--bg-claro)',
      }}
    >
      <button
        onClick={() => setNavAberta(!navAberta)}
        className="p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-dark-component active:scale-95"
        style={{ color: 'var(--text-escuro)' }}
        aria-label="Toggle menu"
      >
        <FaBars size={24} className="md:w-7 md:h-7" />
      </button>
      <Account />
    </div>
  );
}
