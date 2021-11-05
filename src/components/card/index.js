import React, { useEffect, useState } from 'react';
import './card.css';

function Card(props) {
	return (
		<div className='row1-container'>
			<div className={`box box-down ${props.color}`}>
				<h2>{props.title}</h2>
				{props.children}
			</div>
		</div>
	);
}

export default Card;
