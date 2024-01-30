import "core-js/stable";
import "regenerator-runtime/runtime";

import {
  APP_INIT_ERROR,
  APP_READY,
  subscribe,
  initialize,
  mergeConfig,
  getConfig,
} from "@edx/frontend-platform";
import {
  AppProvider,
  ErrorPage,
  PageRoute,
} from "@edx/frontend-platform/react";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Switch } from "react-router-dom";

import { messages as footerMessages } from "@edx/frontend-component-footer";
import { Helmet } from "react-helmet";
import {
  fetchAboutCourse,
  fetchDiscussionTab,
  fetchLiveTab,
} from "./course-home/data/thunks";
import DiscussionTab from "./course-home/discussion-tab/DiscussionTab";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import appMessages from "./i18n";
import { UserMessagesProvider } from "./generic/user-messages";

import "./index.scss";
// import OutlineTab from "./course-home/outline-tab";
// import { CourseExit } from "./courseware/course/course-exit";
// import CoursewareContainer from "./courseware";
// import CoursewareRedirectLandingPage from "./courseware/CoursewareRedirectLandingPage";
// import DatesTab from "./course-home/dates-tab";
// import GoalUnsubscribe from "./course-home/goal-unsubscribe";
// import ProgressTab from "./course-home/progress-tab/ProgressTab";
// import { TabContainer } from "./tab-page";

import {
  fetchDatesTab,
  fetchOutlineTab,
  fetchProgressTab,
  fetchStaticTab,
} from "./course-home/data";
import { fetchCourse } from "./courseware/data";
import initializeStore from "./store";
import NoticesProvider from "./generic/notices";
import PathFixesProvider from "./generic/path-fixes";

// import LiveTab from './course-home/live-tab/LiveTab';
// import CourseAccessErrorPage from "./generic/CourseAccessErrorPage";

// import StaticPage from "./static-page/StaticPage";
import Dashboard from "./learner-dashboard/Dashboard";
// import CourseAbout from "./course-about/CourseAbout";

// lazy
const CourseAbout = React.lazy(() => import("./course-about/CourseAbout"));
const GoalUnsubscribe = React.lazy(() =>
  import("./course-home/goal-unsubscribe")
);
const CoursewareRedirectLandingPage = React.lazy(() =>
  import("./courseware/CoursewareRedirectLandingPage")
);
const CourseAccessErrorPage = React.lazy(() =>
  import("./generic/CourseAccessErrorPage")
);
const OutlineTab = React.lazy(() => import("./course-home/outline-tab"));
const DatesTab = React.lazy(() => import("./course-home/dates-tab"));
const ProgressTab = React.lazy(() =>
  import("./course-home/progress-tab/ProgressTab")
);
const CourseExit = React.lazy(() => import("./courseware/course/course-exit"));
const CoursewareContainer = React.lazy(() => import("./courseware"));
const TabContainer = React.lazy(() => import("./tab-page"));
const StaticPage = React.lazy(() => import("./static-page/StaticPage"));

subscribe(APP_READY, () => {
  // Init chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ReactDOM.render(
    <AppProvider store={initializeStore()}>
      <Helmet>
        {/* <link
          rel="shortcut icon"
          href={getConfig().FAVICON_URL}
          type="image/x-icon"
        /> */}
      </Helmet>
      <PathFixesProvider>
        <NoticesProvider>
          <UserMessagesProvider>
            <Switch>
              <PageRoute
                path="/dashboard"
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Dashboard {...props} />
                  </Suspense>
                )}
              />

              <PageRoute
                path="/:courseId/about"
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <CourseAbout fetch={fetchAboutCourse} {...props} />
                  </Suspense>
                )}
              />

              <PageRoute
                exact
                path="/goal-unsubscribe/:token"
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <GoalUnsubscribe {...props} />
                  </Suspense>
                )}
              />
              <PageRoute
                path="/redirect"
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <CoursewareRedirectLandingPage {...props} />
                  </Suspense>
                )}
              />

              <PageRoute
                path="/course/:courseId/access-denied"
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <CourseAccessErrorPage {...props} />
                  </Suspense>
                )}
              />

              <PageRoute path="/course/:courseId/home">
                <Suspense fallback={<div>Loading...</div>}>
                  <TabContainer
                    tab="outline"
                    fetch={fetchOutlineTab}
                    slice="courseHome"
                  >
                    <OutlineTab />
                  </TabContainer>
                </Suspense>
              </PageRoute>
              {/* <PageRoute path="/course/:courseId/dates">
                <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
                  <DatesTab />
                </TabContainer>
              </PageRoute> */}
              <PageRoute
                path={[
                  "/course/:courseId/dates/:targetUserId/",
                  "/course/:courseId/dates",
                ]}
                render={({ match }) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <TabContainer
                      tab="dates"
                      fetch={(courseId) => {
                        return fetchDatesTab(
                          courseId,
                          match.params.targetUserId
                        );
                      }}
                      slice="courseHome"
                    >
                      <DatesTab />
                    </TabContainer>
                  </Suspense>
                )}
              />
              <PageRoute
                path={[
                  "/course/:courseId/progress/:targetUserId/",
                  "/course/:courseId/progress",
                ]}
                render={({ match }) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <TabContainer
                      tab="progress"
                      fetch={(courseId) => {
                        return fetchProgressTab(
                          courseId,
                          match.params.targetUserId
                        );
                      }}
                      slice="courseHome"
                    >
                      <ProgressTab />
                    </TabContainer>
                  </Suspense>
                )}
              />

              <PageRoute path="/course/:courseId/course-end">
                <Suspense fallback={<div>Loading...</div>}>
                  <TabContainer
                    tab="courseware"
                    fetch={fetchCourse}
                    slice="courseware"
                  >
                    <CourseExit />
                  </TabContainer>
                </Suspense>
              </PageRoute>

              <PageRoute
                path={["/course/:courseId/static/:staticId"]}
                render={({ match }) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <TabContainer
                      tab={`static_tab_${match.params.staticId}`}
                      fetch={(courseId) => fetchStaticTab(courseId)}
                      slice="courseHome"
                    >
                      <StaticPage
                        courseId={match.params.courseId}
                        staticId={match.params.staticId}
                      />
                    </TabContainer>
                  </Suspense>
                )}
              />

              <PageRoute
                path={[
                  "/course/:courseId/:sequenceId/:unitId",
                  "/course/:courseId/:sequenceId",
                  "/course/:courseId",
                ]}
                render={(props) => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <CoursewareContainer {...props} />
                  </Suspense>
                )}
              />
            </Switch>
          </UserMessagesProvider>
        </NoticesProvider>
      </PathFixesProvider>
    </AppProvider>,
    document.getElementById("root")
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage message={error.message} />,
    document.getElementById("root")
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig(
        {
          CONTACT_URL: process.env.CONTACT_URL || null,
          CREDENTIALS_BASE_URL: process.env.CREDENTIALS_BASE_URL || null,
          CREDIT_HELP_LINK_URL: process.env.CREDIT_HELP_LINK_URL || null,
          DISCUSSIONS_MFE_BASE_URL:
            process.env.DISCUSSIONS_MFE_BASE_URL || null,
          ENTERPRISE_LEARNER_PORTAL_HOSTNAME:
            process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME || null,
          ENABLE_JUMPNAV: process.env.ENABLE_JUMPNAV || null,
          ENABLE_NOTICES: process.env.ENABLE_NOTICES || null,
          INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
          SEARCH_CATALOG_URL: process.env.SEARCH_CATALOG_URL || null,
          SOCIAL_UTM_MILESTONE_CAMPAIGN:
            process.env.SOCIAL_UTM_MILESTONE_CAMPAIGN || null,
          STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
          SUPPORT_URL: process.env.SUPPORT_URL || null,
          SUPPORT_URL_CALCULATOR_MATH:
            process.env.SUPPORT_URL_CALCULATOR_MATH || null,
          SUPPORT_URL_ID_VERIFICATION:
            process.env.SUPPORT_URL_ID_VERIFICATION || null,
          SUPPORT_URL_VERIFIED_CERTIFICATE:
            process.env.SUPPORT_URL_VERIFIED_CERTIFICATE || null,
          TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL || null,
          TWITTER_HASHTAG: process.env.TWITTER_HASHTAG || null,
          TWITTER_URL: process.env.TWITTER_URL || null,
          LEGACY_THEME_NAME: process.env.LEGACY_THEME_NAME || null,
        },
        "LearnerAppConfig"
      );
    },
  },
  messages: [appMessages, footerMessages],
});
