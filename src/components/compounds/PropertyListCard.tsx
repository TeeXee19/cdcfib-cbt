import Image from "../atoms/Image";
import SidewayArrowIcon from '@/assets/sideway arrow icon.png'

interface PropertyListCardProps{
    label:string
    logo:string
}
const PropertyListCard = ({label, logo}:PropertyListCardProps) => {
  return (
    <>
      <div className="rounded overflow-hidden shadow-lg">
       <Image url={logo} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex gap-32">{label} <Image url={SidewayArrowIcon} /></div>
        </div>
      </div>
    </>
  );
};

export default PropertyListCard;
