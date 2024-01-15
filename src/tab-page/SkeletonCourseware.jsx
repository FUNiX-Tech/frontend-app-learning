import Skeleton from "react-loading-skeleton";

export default function SkeletonCourseware() {
  return (
    <div>
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Skeleton width="300px" height="2.5rem" className="mb-2" />
        <Skeleton width="100%" height={300} />
      </div>

      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Skeleton width="200px" height="1.5rem" className="mb-2" />
        <Skeleton width="100%" height="300px" />
      </div>
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Skeleton width="200px" height="1.5rem" className="mb-2" />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
        <br />
        <Skeleton width="300px" />
      </div>

      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Skeleton width="200px" height="2rem" className="mb-2" />
        <Skeleton width="100%" height="600px" />
      </div>
    </div>
  );
}
