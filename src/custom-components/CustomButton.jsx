import "./CustomButton.scss";
const CustomButton = ({ className, children, ...rest }) => {
  return (
    <button className={`${className} custom-btn-default`} {...rest}>
      {children}
    </button>
  );
};

export default CustomButton;
