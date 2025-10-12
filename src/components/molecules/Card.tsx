import PlusIcon from '@/assets/plus icon.png'
interface CardProps {
  total: number;
  label: string;
  onclick: () => void; // Callback function for click event
}
const Card = ({ label, total, onclick }: CardProps) => {
  return (
    <>
      <a
        href="#"
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="flex flex-row">
          <div className="w-2/3">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {total}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {label}
            </p>
          </div>
          <div className="w-1/3 flex justify-end">
            <button onClick={onclick} className=''>
                <img src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
      </a>
    </>
  );
};

export default Card;
