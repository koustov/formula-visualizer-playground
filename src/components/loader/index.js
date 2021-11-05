import React from 'react';
import './loader.css';

function Loader(props) {
	return (
		<div className='loader'>
			<div className='circle'>
				<span className='quarter'></span>
				<span className='quarter'></span>
				<span className='quarter'></span>
				<span className='quarter'></span>
				<span className='text'>Formula Visualizer</span>
			</div>
		</div>
	);
}

export default Loader;
