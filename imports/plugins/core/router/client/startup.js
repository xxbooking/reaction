// import { Meteor } from "meteor/meteor";
// import { Tracker } from "meteor/tracker";
// import { Reaction } from "/client/api";
// import { initBrowserRouter } from "./browserRouter";
// import { Router } from "../lib";
//
// Meteor.startup(function () {
//   Tracker.autorun(function () {
//     // initialize client routing
//     if (Reaction.Subscriptions.Packages.ready() && Reaction.Subscriptions.Shops.ready()) {
//       initBrowserRouter();
//     }
//   });
//
//   //
//   // we need to sometimes force
//   // router reload on login to get
//   // the entire layout to rerender
//   // we only do this when the routes table
//   // has already been generated (existing user)
//   //
//   Accounts.onLogin(() => {
//     if (Meteor.loggingIn() === false && Router._routes.length > 0) {
//       initBrowserRouter();
//     }
//   });
// });
import { createRouter } from "meteor/ssrwpo:ssr";
import App from "../lib/app";
import { Reaction } from "@reactioncommerce/reaction-core";
import { Router } from "@reactioncommerce/reaction-router";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";

Reaction.init();

Meteor.startup(function () {
  Tracker.autorun(() => {
    const packageSub = Meteor.subscribe("Packages");
    const shopSub = Meteor.subscribe("Shops");

    if (packageSub.ready() && shopSub.ready()) {
      Router.initPackageRoutes({
        reactionContext: Reaction,
        indexRoute: Session.get("INDEX_OPTIONS") || { workflow: "coreProductGridWorkflow" }
      });
    }
  });

    //
    // we need to sometimes force
    // router reload on login to get
    // the entire layout to rerender
    // we only do this when the routes table
    // has already been generated (existing user)
    //
    // Accounts.onLogin(() => {
    //   if (Meteor.loggingIn() === false && Router._routes.length > 0) {
    //     initBrowserRouter();
    //   }
    // });
});

createRouter({
  MainApp: App
});
