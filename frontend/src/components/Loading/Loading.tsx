import React from 'react';

import { CircularProgress } from '@mui/material';

import './Loading.css';

const Loading: React.FC = () => {
	return (
		<div className="loading">
			<CircularProgress />
		</div>
	);
};

export default Loading;
