import Navbar from "../../commonComponents/Navbar";

const CommonLayout = ({ children }:{children: React.ReactNode}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default CommonLayout;
