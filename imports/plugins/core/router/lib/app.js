import React, { Component, PropTypes } from "react";
import classnames from "classnames";
import Meteor from "meteor/meteor";
import Tracker from "meteor/tracker";
// import { Reaction, Router } from "/client/api";
import { composeWithTracker } from "/lib/api/compose";
import { Loading } from "/imports/plugins/core/ui/components";
import { Reaction } from "@reactioncommerce/reaction-core";
import Router from "./router";
// import ToolbarContainer from "/imports/plugins/core/dashboard/containers/toolbarContainer";
// import Toolbar from "/imports/plugins/core/dashboard/components/toolbar";
// import { ActionViewContainer, PackageListContainer } from "/imports/plugins/core/dashboard/client/containers";
// import { ActionView, ShortcutBar } from "/imports/plugins/core/dashboard/client/components";

// const ConnectedToolbarComponent = ToolbarContainer(Toolbar);
// const ConnectedAdminViewComponent = ActionViewContainer(ActionView);
// const ConnectedShortcutBarContainer = PackageListContainer(ShortcutBar);

const styles = {
  customerApp: {
    width: "100%"
  },
  adminApp: {
    width: "100%",
    height: "100vh",
    display: "flex",
    overflow: "hidden"
  },
  adminContentContainer: {
    flex: "1 1 auto",
    height: "100vh"
  },
  adminContainer: {
    display: "flex",
    flex: "1 1 auto"
  },
  scrollableContainer: {
    overflow: "auto"
  }
};

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    currentRoute: PropTypes.object.isRequired,
    hasDashboardAccess: PropTypes.bool,
    isActionViewOpen: PropTypes.bool
  }

  get isAdminApp() {
    return this.props.hasDashboardAccess;
  }

  componentDidMount() {
    console.log(this.props);
  }

  // renderAdminApp() {
  //   const pageClassName = classnames({
  //     "admin": true,
  //     "page": true,
  //     "show-settings": this.props.isActionViewOpen
  //   });
  //
  //   const currentRoute = this.props.currentRoute;
  //   const routeOptions = currentRoute.route && currentRoute.route.options || {};
  //   const routeData = routeOptions && currentRoute.route.options.structure || {};
  //
  //   return (
  //     <div
  //       style={styles.adminApp}
  //     >
  //       <div className={pageClassName} id="reactionAppContainer" style={styles.adminContentContainer}>
  //         <div className="reaction-toolbar">
  //           <ConnectedToolbarComponent data={routeData} />
  //         </div>
  //         <div style={styles.scrollableContainer}>
  //           {this.props.children}
  //         </div>
  //       </div>
  //       {this.props.hasDashboardAccess && <ConnectedAdminViewComponent />}
  //       {this.props.hasDashboardAccess && <ConnectedShortcutBarContainer />}
  //     </div>
  //   );
  // }

  render() {
    const pageClassName = classnames({
      "admin": true,
      "show-settings": this.props.isActionViewOpen
    });

    // const currentRoute = this.props.currentRoute;
    // const layout = currentRoute.route.options.layout;

    // if (this.isAdminApp && layout !== "printLayout") {
    //   return this.renderAdminApp();
    // }

    return (
      <div
        className={pageClassName}
        style={styles.customerApp}
      >
        {this.props.children}
      </div>
    );
  }
}

function composer(props, onData) {
  if (Router.ready()) {
    onData(null, {
      children: Router.reactComponents,
      // isActionViewOpen: Reaction.isActionViewOpen(),
      // hasDashboardAccess: Reaction.hasDashboardAccess(),
      currentRoute: Router.current()
    });
  }


  onData(null, {
    // isActionViewOpen: Reaction.isActionViewOpen(),
    // hasDashboardAccess: Reaction.hasDashboardAccess(),
    currentRoute: Router.current()
  });
}

export default composeWithTracker(composer, Loading)(App);
