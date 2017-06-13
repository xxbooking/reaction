import _ from "lodash";
// import swal from "sweetalert2";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { i18next } from "@reactioncommerce/reaction-i18n";

// import "sweetalert2/dist/sweetalert2.css";
// import Alerts from "./inlineAlerts";

let swal = () => {
  return new Promise((resolve) => {
    resolve();
  });
};

// Extends Bootstaps alerts and add more alert types
Meteor.startup(function () {
  if (Meteor.isClient) {
    import("sweetalert2").then((module) => {
      swal = module;
    });


    sAlert.config({
      effect: "stackslide",
      position: "bottom-left",
      timeout: 5000,
      html: false,
      onRouteClose: true,
      stack: true,
      // or you can pass an object:
      // stack: {
      //     spacing: 10 // in px
      //     limit: 3 // when fourth alert appears all previous ones are cleared
      // }
      offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
      beep: false
      // examples:
      // beep: '/beep.mp3'  // or you can pass an object:
      // beep: {
      //     info: '/beep-info.mp3',
      //     error: '/beep-error.mp3',
      //     success: '/beep-success.mp3',
      //     warning: '/beep-warning.mp3'
      // }
      // onClose: _.noop //
      // examples:
      // onClose: function() {
      //     /* Code here will be executed once the alert closes. */
      // }
    });
  }
});

/*
 * Forked and modifed from https://github.com/asktomsk/bootstrap-alerts/
 */
const Alerts = {

  /*
  Default options. Can be overridden for application
   */
  defaultOptions: {

    /*
    Button with cross icon to hide (close) alert
     */
    dismissable: true,

    /*
    CSS classes to be appended on each alert DIV (use space for separator)
     */
    classes: "",

    /*
    Hide alert after delay in ms or false to infinity
     */
    autoHide: false,

    /*
    Time in ms before alert fully appears
     */
    fadeIn: 200,

    /*
    If autoHide enabled then fadeOut is time in ms before alert disappears
     */
    fadeOut: 3000,

    /*
    Amount of alerts to be displayed
     */
    alertsLimit: 3,

    /*
    Allows use HTML in messages
     */
    html: false,

    /*
     * define placement to only show where matches
     * use: {{inlineAlerts placement="cart"}}
     * Alerts.add "message","danger", placement:"cart"
     */
    placement: "",

    /*
    Translation key for i18n (translations collection)
     */
    i18nKey: "",

    /*
    unique id (for multiple message placements)
     */
    id: ""
  },

  /*
  Add an alert

  @param message (String) Text to display.
  @param mode (String) One of bootstrap alerts types: success, info, warning, danger
  @param options (Object) Options if required to override some of default ones.
  See Alerts.defaultOptions for all values.
   */
  add: function (alertMessage, mode, alertOptions) {
    let a;
    let message = alertMessage;
    let options = alertOptions;
    // check options to see if we have translation
    if (options && options.i18nKey && options.i18nKey !== i18next.t(options.i18nKey)) {
      message = i18next.t(options.i18nKey);
    }
    // get default options
    options = _.defaults(alertOptions || {}, Alerts.defaultOptions);

    if (options.type) {
      a = Alerts.collection_.findOne({
        "options.type": options.type
      });
      if (a) {
        Alerts.collection_.update(a._id, {
          $set: {
            message: message,
            mode: mode,
            options: options
          }
        });
        return;
      }
    }

    const count = Alerts.collection_.find({}).count();
    if (count >= options.alertsLimit) {
      Alerts.collection_.find({}, {
        sort: {
          created: -1
        },
        skip: options.alertsLimit - 1
      }).forEach(function (row) {
        Alerts.collection_.remove(row._id);
      });
    }
    Alerts.collection_.insert({
      message: message,
      mode: mode,
      options: options,
      seen: false,
      created: +new Date()
    });
  },

  /*
  Call this function before loading a new page to clear errors from previous page
  Best way is using Router filtering feature to call this function
   */
  removeSeen: function () {
    Alerts.collection_.remove({
      "seen": true,
      "options.sticky": {
        $ne: true
      }
    });
  },

  /*
  If you provide a `type` option when adding an alert, you can call this function
  to later remove that alert.
   */
  removeType: function (type) {
    Alerts.collection_.remove({
      "options.type": type
    });
  },
  collection_: new Mongo.Collection(null),

  inline(alertMessage, type, alertOptions) {
    // Convert error to danger, for inlineAlerts
    const mode = type === "error" ? "danger" : type;
    return this.add(alertMessage, mode, alertOptions);
  },

  /**
   * Show a popup alert
   * @example
   * // Simple
   * Alerts.alert("title", "message", {}, callbackFunction);
   * // - OR, for more control -
   * Alerts.alert({
   * 	title: "Title",
   * 	text: "Message Text",
   * 	type: "success|info|warning|error|"
   * }, callbackFunction);
   *
   * @param  {String|Object} titleOrOptions Pass a string or an object containing options
   * @param  {[type]}   messageOrCallback [description]
   * @param  {[type]}   options           [description]
   * @param  {Function} callback          [description]
   * @return {[type]}                     [description]
   */
  alert(titleOrOptions, messageOrCallback, options, callback) {
    if (_.isObject(titleOrOptions)) {
      return swal({
        type: "info",
        ...titleOrOptions
      }).then((isConfirm) => {
        if (isConfirm === true && typeof messageOrCallback === "function") {
          messageOrCallback(isConfirm, false);
        }
      }, dismiss => {
        if (dismiss === "cancel" || dismiss === "esc" || dismiss === "overlay") {
          messageOrCallback(false, dismiss);
        }
      }).catch(function (err) {
        if (err === "cancel" || err === "overlay" || err === "timer") {
          return undefined; // Silence error
        }
        throw err;
      });
    }

    const title = titleOrOptions;
    const message = messageOrCallback;

    return swal({
      title,
      text: message,
      type: "info",
      ...options
    }).then((isConfirm) => {
      if (isConfirm === true && typeof callback === "function") {
        callback(isConfirm);
      }
    }).catch(function (err) {
      if (err === "cancel" || err === "overlay" || err === "timer") {
        return undefined; // Silence error
      }
      throw err;
    });
  },

  toast(message, type, options) {
    switch (type) {
      case "error":
      case "warning":
      case "success":
      case "info":
        return sAlert[type](message, options);
      default:
        return sAlert.success(message, options);
    }
  }
};
