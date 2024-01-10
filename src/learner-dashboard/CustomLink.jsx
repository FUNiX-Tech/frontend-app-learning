import { Link } from "react-router-dom";

function CustomLink(props) {
  const { path, children, ...rest } = props;

  const Comp = path.startsWith("http") ? "a" : Link;

  return (
    <Comp
      to={path.startsWith("http") ? undefined : path}
      href={path.startsWith("http") ? path : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default CustomLink;
