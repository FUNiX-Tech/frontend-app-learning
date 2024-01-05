import Skeleton from "react-loading-skeleton";

export default function SkeletonOutline() {
  const titleSkeleton = (
    <div
      style={{ marginBottom: "2rem" }}
      className="d-flex align-items-center justify-content-between w-100"
    >
      <div
        style={{
          width: "70%",
          height: "1.25rem",
        }}
      >
        <Skeleton width="100%" height="100%" />
      </div>
      <Skeleton width="1.5rem" height="1rem" />
    </div>
  );
  return (
    <div
      style={{
        width: "700px",
        maxWidth: "calc(100vw - 3rem)",
        margin: "0 auto",
      }}
    >
      <div
        className="d-flex justify-content-between"
        style={{ marginBottom: "2rem" }}
      >
        <Skeleton height="2rem" width={170} />
        <Skeleton height="2rem" width={170} />
      </div>

      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
      {titleSkeleton}
    </div>
  );
}
