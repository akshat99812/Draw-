// A reusable Icon Button component
function IconButton({ onClick, activated, icon }: { onClick: () => void, activated?: boolean, icon: React.ReactNode }) {
    return (
        <button
          onClick={onClick}
          className={`p-2 rounded-md transition-colors ${
            activated ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          {icon}
        </button>
    );
}

export default IconButton;