import { createRouter } from "meteor/ssrwpo:ssr";
import App from "../lib/app";
import { Reaction } from "@reactioncommerce/reaction-core";
import { Router } from "@reactioncommerce/reaction-router";

Reaction.init();

Router.initPackageRoutes({
  reactionContext: Reaction,
  indexRoute: { workflow: "coreProductGridWorkflow" }
});

createRouter({
  MainApp: App
});
