import React, { Component } from 'react';

class Boundary extends Component {
  state = {
    hasError: false 
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo);

  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loader">
          <h3>:( Something went horribly wrong.</h3>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default Boundary;
