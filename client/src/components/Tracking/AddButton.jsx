const AddButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-lime-400 hover:bg-lime-300 text-black font-bold py-2 px-6 rounded-full mb-6">
      Add
    </button>
  );
};

export default AddButton;
