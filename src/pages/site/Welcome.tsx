import PropertyListCard from "../../components/compounds/PropertyListCard";
import RequestDemo from "../../components/compounds/RequestDemo";
import Banner from "@/assets/banner.png";
import ProperIcon from "@/assets/white stairs.png";
import EstateIcon from "@/assets/estate.png";
import FacilityIcon from "@/assets/facility.png";
import PropertyOwnerIcon from "@/assets/property owner.png";
const Welcome = () => {
  const PropertyList = [
    {
      title: "Property Managers",
      logo: ProperIcon,
    },
    {
      title: "Estate Managers",
      logo: EstateIcon,
    },
    {
      title: "Facility Managers",
      logo: FacilityIcon,
    },
    {
      title: "Property Owners",
      logo: PropertyOwnerIcon,
    },
  ];
  return (
    <>
      <div className="flex flex-row mt-[60px] w-[90%]">
        <div className="w-[724.04px] flex flex-col h-[222px] text-[64px] text-[Helvetica] font-[700]">
          <div className="leading-[73.59px]">
            Manage your rental real estate properties with ease.
          </div>
          <div>
            <div>
              <RequestDemo />
            </div>
          </div>
        </div>
        <div className="leading-[32.68px] ml-48 w-[360.78px] h-[198px] font-[300] text-[24px]">
          Your all-in-one platform to automate property management, streamline
          facility maintenance, and simplify the onboarding process. Experience
          smarter tenant management today.
        </div>
      </div>
      <div
        style={{ backgroundImage: `url(${Banner})` }}
        className={` w-[90%] mt-[150.11px] h-[524.76px]`}
      ></div>
      <div className="mt-16 w-full flex justify-center bg-[#FFEFCC]">
        <div className="mt-[76.87px] w-[90%]">
          <div className=" ">
            <span className="text-[Open Sans] text-[20px] font-[300]">
              ONE-STOP SOLUTION
            </span>
          </div>
          <div className="">
            <div className="w-[439.66px] my-8 text-[Helvetica] text-[40px] font-[700] leading-[46px]">
              We are set to help you digitize the real estate services.
            </div>

            <RequestDemo />
          </div>
          <div className="my-8 grid grid-cols-2 gap-8">
            {PropertyList.map((property, index) => (
              <PropertyListCard
                label={property.title}
                logo={property.logo}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center bg-[#DEE1E3]">
        <div className="mt-[30.87px] w-[90%]">
            <h1 className="font-[700] text-[Helvetica] text-[64px] text-center">The Future of Property Management.</h1>
        </div>
      </div>
    </>
  );
};

export default Welcome;
