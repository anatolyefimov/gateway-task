import React from 'react';

import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';

import { newItemId, paths } from '@/router';

const GridToolbar: React.FC = () => {
	return (
		<GridToolbarContainer>
			<Button
				component={Link}
				to={paths.gatewaysWithId.replace(':id', newItemId)}
			>
				Add Gateway
			</Button>
		</GridToolbarContainer>
	);
};

export default React.memo(GridToolbar);
