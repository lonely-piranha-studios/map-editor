import React from 'react';
import { connect } from 'react-redux';

class MapNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      width: 0,
      height: 0
    };
  }

  newMap() {
    this.props.dispatch({ type: 'MAP_NEW', ...this.state });
  }

  render() {
    return (
      <div>
        <form onSubmit={e => { e.preventDefault(); this.newMap(); }}>
          Name:<br />
          <input required value={this.state.name} onChange={e => this.setState({ name: e.target.value })} /><br />
          Width:<br />
          <input type="number" min="3" value={this.state.width} onChange={e => this.setState({ width: e.target.value })} /><br />
          Height:<br />
          <input type="number" min="3" value={this.state.height} onChange={e => this.setState({ height: e.target.value })} /><br />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}


const mapStateToProps = () => ({});

export default connect(mapStateToProps)(MapNew);
