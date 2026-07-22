import { Logo } from "../../../commonComponents/Logo";

const BrandHeader = () => {
  return (
    <div className="flex flex-col items-center mb-7 gap-3">
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-4">
        <Logo size={"5 md:7.5 lg:10"} />
        <div className="text-center">
          <h2 className="text-sm sm:text-lg md:text-xl text-text font-bold tracking-[0.2em] uppercase">
            Snitch
          </h2>
          <p className="text-sm mt-0.5 text-text-muted">
            Fast fashion for the fearless
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandHeader;
