import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

function baseUrl() {
  return `${getConfig().LMS_BASE_URL}/api/course_resume_path`;
}

export const fetchCourseResumeUrl = async (courseCode, courseLocation = "") => {
  // subfix là phần
  const url = `${baseUrl()}/${courseCode}/${courseLocation}`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};
