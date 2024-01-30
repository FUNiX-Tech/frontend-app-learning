import { getConfig } from "@edx/frontend-platform";

export function loadFavicon() {
  const linkTag = document.createElement("link");
  linkTag.rel = "shortcut icon";
  linkTag.href = getConfig().FAVICON_URL;
  linkTag.type = "image/x-icon";
  document.head.appendChild(linkTag);
}

export function appendPreconnectLinkTag() {
  const linkTag = document.createElement("link");
  linkTag.rel = "preconnect";
  linkTag.href = process.env.LMS_BASE_URL;
  document.head.appendChild(linkTag);
}
