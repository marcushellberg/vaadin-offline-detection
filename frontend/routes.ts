import { Route } from "@vaadin/router";
import "./views/tasklist/tasklist-view";

export type ViewRoute = Route & { title?: string; children?: ViewRoute[] };

export const views: ViewRoute[] = [
  {
    path: "",
    component: "tasklist-view",
    title: "Task list",
  },
];
export const routes: ViewRoute[] = views;
