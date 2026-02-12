

export default function StartconfigButton({onClick, disabled}) {

   
    return(
        <button
        onClick={onClick}
        disabled={disabled}
          className={`px-4 py-2 rounded-full font-bold text-white
        ${disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-green-500"}
      `}>
            Start 
        </button>
    )
}
