import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createApp, VNode } from "vue";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function vnodeToString(vnode: VNode) {
  const div = document.createElement("div");

  const tempApp = createApp({
    render: () => vnode,
  });
  tempApp.mount(div);

  // await nextTick();
  const html = div.innerHTML;
  // tempApp.unmount();
  div.remove();
  return html;
}
