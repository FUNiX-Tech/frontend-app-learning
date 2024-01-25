import { configureStore } from "@reduxjs/toolkit";
import { reducer as courseHomeReducer } from "./course-home/data";
import { reducer as coursewareReducer } from "./courseware/data/slice";
import { reducer as recommendationsReducer } from "./courseware/course/course-exit/data/slice";
import { reducer as toursReducer } from "./product-tours/data";
import { reducer as modelsReducer } from "./generic/model-store";
import { reducer as headerReducer } from "./header/data/index";
import chatbotReducer from "./courseware/course/AIChatbot/slice";

export default function initializeStore() {
  return configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseHome: courseHomeReducer,
      recommendations: recommendationsReducer,
      tours: toursReducer,
      header: headerReducer,
      chatbot: chatbotReducer,
    },
  });
}
