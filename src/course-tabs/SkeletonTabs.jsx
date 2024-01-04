export default function SkeletonTabs() {
  const DEFAULT_TABS = ["outline", "dates", "discussions"];

  return (
    <>
      {DEFAULT_TABS.map((item) => (
        <span
          key={item}
          className="opacity-0"
          style={{
            pointerEvents: "none !important",
            opacity: "0 !important",
            color: "transparent",
            color: "red",
          }}
        >
          <Link className="nav-item flex-shrink-0 nav-link" to="/">
            {item}
          </Link>
        </span>
      ))}
    </>
  );
}
