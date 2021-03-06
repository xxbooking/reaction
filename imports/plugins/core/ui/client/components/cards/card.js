import React, { Children, Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { registerComponent } from "@reactioncommerce/reaction-components";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: props.expanded
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: nextProps.expanded
    });
  }

  handleExpanderClick = (event) => {
    this.setState({
      expanded: !this.state.expanded
    }, () => {
      if (typeof this.props.onExpand === "function") {
        this.props.onExpand(event, this, this.props.name, this.state.expanded);
      }
    });
  }

  render() {
    const elements = Children.map(this.props.children, (child) => {
      const newProps = {};

      if (child.props.actAsExpander) {
        newProps.actAsExpander = true;
        newProps.onClick = this.handleExpanderClick;
      }

      if (child.props.expandable || child.props.actAsExpander) {
        newProps.expanded = this.state.expanded;
      }

      return React.cloneElement(child, newProps);
    });

    const baseClassName = classnames({
      "panel": true,
      "panel-default": true,
      "panel-active": this.state.expanded,
      "closed": this.state.expanded === false
    });

    return (
      <div className={baseClassName} style={this.props.style}>
        {elements}
      </div>
    );
  }
}

Card.defaultProps = {
  expandable: false,
  expanded: true
};

Card.propTypes = {
  children: PropTypes.node,
  expandable: PropTypes.bool,
  expanded: PropTypes.bool,
  name: PropTypes.string,
  onExpand: PropTypes.func,
  style: PropTypes.object
};

registerComponent("Card", Card);

export default Card;
