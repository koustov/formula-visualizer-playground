import React, { useEffect, useState } from 'react';
import './App.css';
import { Charts } from './templates';
// import Loader from './components/loader';
import Card from './components/card';
// import Loader from './components/loader';
import { FormulaVisualizer } from 'formula-visualizer';
import { numberRange } from 'array-initializer';

function App() {
	const initialRange = { start: -1000, end: 1000 };
	const [xrange, setXRange] = useState(initialRange);
	const [zoom, setZoom] = useState(100);
	let xvals = numberRange(initialRange.start, initialRange.end);
	const [gridSize, setGridSize] = useState(10);
	const [allvalues, setAllvalues] = useState({});
	const [mouseMoveLocation, setMouseMoveLocation] = useState({});
	const [canvasData, setCanvasData] = useState({ h: 800, w: 800 });
	const c = Charts[0].default;
	const [selectedChart, setSelectedChart] = useState(c.items[0]);
	const [allFormulas, setAllFormulas] = useState({});
	// const [loading, setLoading] = useState('1');
	const [initializing, setInitializing] = useState(true);
	const [isCustom, setIsCustom] = useState(true);

	useEffect(() => {
		setAllFormulas(Charts);
		setInitializing(false);
		const elem = document.getElementById('graph');
		setCanvasData({
			h: elem.clientHeight,
			w: elem.clientWidth,
		});
	}, []);

	const mouseMove = (x, y) => {
		setMouseMoveLocation({
			x: x,
			y: y,
		});
	};
	const rangeUpdated = (rangedata) => {
		setXRange(rangedata);
		xvals = numberRange(rangedata.start, rangedata.end);
	};

	const onFormulaChanged = (formulaId) => {
		if (formulaId === '0-0') {
			setIsCustom(true);
		} else {
			setIsCustom(false);
			const groupid = parseInt(formulaId.split('-')[0]);
			const itemid = parseInt(formulaId.split('-')[1]);

			const c = Charts[groupid].default;
			const selectedChart = c.items[itemid];
			const ac = { ...selectedChart.parameters } || {};
			setAllvalues(ac);

			setSelectedChart({ ...selectedChart });
		}
	};

	const onParameterValueChanged = (val, index) => {
		allvalues[index] = val;
		setAllvalues(allvalues);
	};

	const getRelative = (pixel) => {
		return (pixel * zoom) / zoom;
	};

	const onScaleChange = (isup) => {
		const factor = isup ? zoom + 10 : zoom - 10;
		setZoom(factor);
		var canvas = document.getElementById('board');
		var ctx = canvas.getContext('2d');
		ctx.translate(100, 100);
		ctx.scale(factor / 100, factor / 100);
		ctx.restore();
	};

	const download = () => {
		// var link = document.createElement('board');
		// link.download = 'formula_visualizer.png';
		// link.href = document.getElementById('board').toDataURL();
		// link.click();

		let canvasImage = document.getElementById('board').toDataURL('image/png');

		// this can be used to download any image from webpage to local disk
		let xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = function () {
			let a = document.createElement('a');
			a.href = window.URL.createObjectURL(xhr.response);
			a.download = 'image_name.png';
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			a.remove();
		};
		xhr.open('GET', canvasImage); // This is to download the canvas Image
		xhr.send();
	};

	const copyToClipBoard = () => {
		const img = new Image();
		const canvas = document.getElementById('board');
		let imageURL;
		canvas.toBlob((blob) => (imageURL = blob));
		const c = document.createElement('canvas');
		const ctx = c.getContext('2d');
		img.crossOrigin = '';
		img.src = imageURL;
		return new Promise((resolve) => {
			img.onload = function () {
				c.width = this.naturalWidth;
				c.height = this.naturalHeight;
				ctx.drawImage(this, 0, 0);
				c.toBlob(
					(blob) => {
						// here the image is a blob
						resolve(blob);
					},
					'image/png',
					0.75
				);
			};
		});
	};

	return (
		<div className='App'>
			<div className='header'>
				<div className='nav'>
					<div className='logo'>
						<div className='logo-img'></div>
						<div>Formula Visualizer</div>
					</div>
					<div className='social-buttons'>
						<div className='button-container'>
							<a
								href='https://github.com/koustov/formula-visualizer'
								target='_blank'
								rel='noreferrer'
								className='circle-button'>
								<i className='fab fa-github'></i>
							</a>
						</div>
						<div className='button-container'>
							<a
								href='https://twitter.com/koustov'
								target='_blank'
								rel='noreferrer'
								className='circle-button'>
								<i className='fab fa-twitter'></i>
							</a>
						</div>
						<div className='button-container'>
							<a
								href='https://twitter.com/koustov'
								target='_blank'
								rel='noreferrer'
								className='circle-button'>
								<i className='fab fa-npm'></i>
							</a>
						</div>
						<div className='button-container'>
							<a
								href='https://facebook.com/kmaitra'
								target='_blank'
								rel='noreferrer'
								className='circle-button'>
								<i className='fab fa-facebook'></i>
							</a>
						</div>
						<div className='button-container'>
							<a
								href='https://www.linkedin.com/in/koustov-maitra-01836617/'
								target='_blank'
								rel='noreferrer'
								className='circle-button'>
								<i className='fab fa-linkedin-in'></i>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className='main-body'>
				<div className='main-content'>
					<div className='sidebar'>
						<div className='sidebar-main-content'>
							<Card title='Formulae' color='cyan'>
								<div className='sidebar-row'>
									<div>
										<label for='chart-selection'>Select formula</label>
									</div>
									<div className='selectdiv'>
										{Object.keys(allFormulas).length ? (
											<select
												name='chart-selection'
												id='chart-selection'
												onChange={(e) => onFormulaChanged(e.target.value)}>
												{allFormulas.map((g, gi) => {
													return (
														<optgroup label={g.default.title} key={gi}>
															{g.default.items.map((it, iti) => {
																return (
																	<option value={`${gi}-${iti}`} key={iti}>
																		{it.formula
																			? `y = ${it.formula}`
																			: it.display}
																	</option>
																);
															})}
														</optgroup>
													);
												})}
											</select>
										) : null}
									</div>
								</div>
								{isCustom ? (
									<div className='sidebar-row'>
										<div>
											<label for='custom-formula'>Custom Formula</label>
										</div>
										<div className='inputdiv'>
											<input
												type='text'
												id={`custom-formula`}
												placeholder={`Custom formula`}
												value={selectedChart.formula}
												onChange={(e) => {
													setSelectedChart({
														display: 'Custom',
														formula: e.target.value,
													});
												}}
											/>
										</div>
									</div>
								) : null}

								{Object.keys(allvalues).length > 0 ? (
									<>
										{Object.keys(allvalues).map((p, pi) => {
											return (
												<React.Fragment key={pi}>
													{p !== 'x' && p !== 'y' ? (
														<div className='sidebar-row' key={pi}>
															<div>
																<label for={`parameter-${p}`}>
																	Parameter value: {p}
																</label>
															</div>
															<div className='inputdiv'>
																<input
																	type='number'
																	id={`parameter-${p}`}
																	placeholder={`Parameter "${p}"`}
																	value={allvalues[p]}
																	onChange={(e) => {
																		onParameterValueChanged(e.target.value, p);
																	}}
																/>
															</div>
														</div>
													) : null}
												</React.Fragment>
											);
										})}
									</>
								) : null}
							</Card>
							<Card title='Settings' color='orange'>
								<div className='sidebar-row'>
									<div>
										<label for={`xstart`}>X range start value</label>
									</div>
									<div className='inputdiv'>
										<input
											type='nummber'
											id={`xstart`}
											placeholder={`X Range Start`}
											value={xrange.start}
											onChange={(e) => {
												xrange.start = e.target.value;
												rangeUpdated(xrange);
											}}
										/>
									</div>
									<div>
										<div>
											<label for={`xend`}>X range end value</label>
										</div>
										<div className='inputdiv'>
											<input
												type='number'
												id={`xend`}
												placeholder={`X Range End`}
												value={xrange.end}
												onChange={(e) => {
													xrange.end = e.target.value;
													rangeUpdated(xrange);
												}}
											/>
										</div>
									</div>
								</div>
								<div className='sidebar-row'>
									<div>
										<label for={`gridgap`}>Cell size (px)</label>
									</div>
									<div className='inputdiv'>
										<input
											type='nummber'
											id={`gridgap`}
											placeholder={`Grid gap`}
											value={gridSize}
											onChange={(e) => {
												setGridSize(e.target.value);
											}}
										/>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className='graph-container'>
						<div className='graph-title-container'>
							<div className='graph-title'>
								<div>
									<div className='wrapped-text'>
										<span>
											<i className='far fa-font' />
										</span>
										<span>{selectedChart.display}</span>
									</div>
								</div>
							</div>
							<div className='graph-title'>
								<div>
									<div className='wrapped-text'>
										<span>
											<i className='far fa-square-root-alt' />
										</span>
										<span>y={selectedChart.formula}</span>
									</div>
								</div>
							</div>
						</div>
						<div className='graph-title-container'>
							<div className='graph-title'>
								<div>
									<div className='wrapped-text'>
										<span>
											<i className='far fa-expand' />
										</span>
										<span>
											{getRelative(canvasData.w)} X {getRelative(canvasData.h)}
										</span>
									</div>
								</div>
								<div>
									<div className='wrapped-text'>
										<span>
											<i className='far fa-border-all' />
										</span>
										<span>
											{getRelative(gridSize)} X {getRelative(gridSize)}
										</span>
									</div>
								</div>
								<div>
									<div className='wrapped-text'>
										<span>
											<i className='far fa-search' />
										</span>
										<span>{zoom}%</span>
									</div>
								</div>
								<div>
									<div className='wrapped-text'>
										<i className='far fa-map-marker-alt' />
										<span>
											{getRelative(mouseMoveLocation.x)} ,{' '}
											{getRelative(mouseMoveLocation.y)}
										</span>
									</div>
								</div>
								<div className='toolbar-buttons'>
									<div className='button-container'>
										<button
											className='circle-button'
											onClick={() => {
												download();
											}}>
											<i className='far fa-download'></i>
										</button>
									</div>
									<div className='button-container'>
										<button
											className='circle-button'
											onClick={() => copyToClipBoard()}>
											<i className='far fa-clipboard'></i>
										</button>
									</div>
									<div className='button-container'>
										<button
											className='circle-button'
											onClick={() => onScaleChange(true)}>
											<i className='far fa-search-plus'></i>
										</button>
									</div>
									<div className='button-container'>
										<button
											className='circle-button'
											onClick={() => onScaleChange(false)}>
											<i className='far fa-search-minus'></i>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div id='graph' className='graph-wrapper'>
							{/* <div id='graph' className='graph'>
								{loading === '1' ? (
									<div id={`graph-loader`} show={loading}>
										<Loader />
									</div>
								) : (
									<> */}
							{selectedChart.formula && !initializing ? (
								<FormulaVisualizer
									formula={selectedChart.formula}
									parameters={allvalues}
									xrange={xvals}
									onMouseMove={(x, y) => mouseMove(x, y)}
								/>
							) : null}
							{/* </>
								)}
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
