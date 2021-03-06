import { loadRegisteredComponents } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Accounts } from "meteor/accounts-base";
import { Reaction } from "/client/api";
import { initBrowserRouter } from "./browserRouter";
import { Router } from "../lib";

Meteor.startup(function () {
  loadRegisteredComponents();

  Tracker.autorun(function () {
    // initialize client routing
    if (Reaction.Subscriptions.Packages.ready() &&
        Reaction.Subscriptions.PrimaryShop.ready() &&
        Reaction.Subscriptions.MerchantShops.ready()) {
      //  initBrowserRouter calls Router.initPackageRoutes which calls shopSub.ready which is reactive,
      //  So we have to call initBrowserRouter in a non reactive context.
      //  Otherwise initBrowserRouter is called twice each time a Reaction.Subscriptions.Packages.ready() and
      //  Reaction.Subscriptions.PrimaryShop.ready() are true

      Tracker.nonreactive(()=> {
        initBrowserRouter();
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
  Accounts.onLogin(() => {
    if (Meteor.loggingIn() === false && Router._routes.length > 0) {
      initBrowserRouter();
    }
  });
});
