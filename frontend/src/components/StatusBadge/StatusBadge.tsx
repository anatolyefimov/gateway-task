import React from 'react';

import classNames from 'classnames';

import './StatusBadge.css';

type StatusBadgeProps = {
	isOnline?: boolean;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ isOnline = false }) => {
	const circleClassName = classNames('status-badge__circle', {
		'status-badge__circle--online': isOnline,
		'status-badge__circle--offline': !isOnline,
	});
	return (
		<div className="status-badge">
			{isOnline ? 'online' : 'offline'} <div className={circleClassName} />
		</div>
	);
};

export default StatusBadge;
