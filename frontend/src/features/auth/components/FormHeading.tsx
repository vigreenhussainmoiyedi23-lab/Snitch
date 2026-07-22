const FormHeading = ({ title = "", subtitle = "" }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1 text-center">{title}</h1>
      <p className="text-sm mb-7 text-text text-center">{subtitle}</p>
    </div>
  );
};

export default FormHeading;
