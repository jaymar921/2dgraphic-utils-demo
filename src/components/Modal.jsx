const Modal = ({ handleCallback = () => {}, display = "" }) => {
  function showDisplay(display) {
    if (display === "Documentation" || display === "JayMar's portfolio")
      return "View";
    return "Pickup";
  }
  return (
    <>
      <div className="z-[99999] absolute p-4 bg-white rounded-md shadow-sm text-center left-[50%] translate-x-[-50%] top-[200px]">
        <p className="text-lg font-bold">{display}</p>
        <button
          className="mt-2 border-2 border-slate-400 px-2 bg-slate-800 font-bold text-white focus:bg-slate-300 cursor-pointer"
          onClick={handleCallback}
        >
          {showDisplay(display)}
        </button>
      </div>
    </>
  );
};

export default Modal;
