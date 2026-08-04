import Navbar from "../commonComponents/Navbar";

const CommonLayout = ({ children }:{children: React.ReactNode}) => {
  return (
    <section className="min-h-screen ">
      <Navbar />
      {children}
    </section>
  );
};

export default CommonLayout;
