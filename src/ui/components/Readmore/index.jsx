import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

class ReadMore extends Component {
	constructor(...args) {
		super(...args);

		this.state = {
			expanded: false,
			truncated: false
		};

		this.handleTruncate = this.handleTruncate.bind(this);
		this.toggleLines = this.toggleLines.bind(this);
	}

	handleTruncate(truncated) {
		if (this.state.truncated !== truncated) {
			this.setState({
				truncated
			});
		}
	}

	toggleLines(event) {
		event.preventDefault();

		this.setState({
			expanded: !this.state.expanded
		});
	}

	render() {
		const {
			children,
			more,
			less,
			lines
		} = this.props;

		const {
			expanded,
			truncated
		} = this.state;

		return (
			<div className="read-more">
				<Truncate
					lines={!expanded && lines}
					ellipsis={more && (
						<p className="d-flex flex-row-reverse"><a className="color-blue-light" role="button" tabIndex="0" onClick={this.toggleLines}>{more}</a></p>
					)}
					onTruncate={this.handleTruncate}
				>
					{children}
				</Truncate>
				{!truncated && expanded && less && (
					<span className="d-flex flex-row-reverse"> <a className="color-blue-light" role="button" tabIndex="0" onClick={this.toggleLines}>{less}</a></span>
				)}
			</div>
		);
	}
}

ReadMore.defaultProps = {
	lines: 3
};

ReadMore.propTypes = {
	children: PropTypes.node.isRequired,
	more: PropTypes.string,
	less: PropTypes.string,
	lines: PropTypes.number
};

export default ReadMore;