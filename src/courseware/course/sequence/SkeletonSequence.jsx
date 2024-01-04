import Skeleton from "react-loading-skeleton";
import "./SkeletonContent.scss";

export default function SkeletonSequence({ withSidebar }) {
  return (
    <div className="skeleton_content">
      {withSidebar && (
        <div className="skeleton_content_sidebar skeleton_content_leftbar">
          <Skeleton height="100%" width="100%" />
        </div>
      )}
      <div className="skeleton_content_inner">
        <div className="d-flex justify-content-between w-100 mb-3">
          <Skeleton height="2rem" width={70} />
          <Skeleton height="2rem" width={70} />
        </div>

        <Skeleton height="2rem" width={250} />

        <br />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
        <Skeleton width="80%" />
        <br />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
        <Skeleton width="80%" />
        <br />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
        <Skeleton width="80%" />
        <br />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
        <Skeleton width="80%" />
        <br />
      </div>
      {withSidebar && (
        <div className="skeleton_content_sidebar skeleton_content_rightbar">
          <Skeleton height="100%" width="100%" />
        </div>
      )}
    </div>
  );
}
