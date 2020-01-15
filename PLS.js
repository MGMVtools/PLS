function pls(x, y, numLV) { //performs partial least squares regression, based on NIPALS algorithm. This is PLS1 only
	//initialize variables, code based on itoolbox for Matlab by Noorgard
	let {
		rows: numRows,
		cols: numCols
	} = size(x);
	//set maximum numberr of LVS safegard
	if (numLV > numRows) {
		debugger
		numLV = numRows
	};
	if (numLV > numCols) {
		debugger
		numLV = numCols
	};
	let P = createMatrix(numLV, numCols);
	let Q = createMatrix(numLV, 1);
	let W = createMatrix(numLV, numCols);
	let T = createMatrix(numLV, numRows);
	let U = createMatrix(numLV, numRows);
	let bsco = createMatrix(numLV, 1);
	for (let i = 0; i < numLV; i++) { //loop each component
		//perform pls of one component
		let u = y;
		let w = multiplyVecByMatrix(u, x);
		let normOfw = normOfVec(w);
		w = w.map(a => a / normOfw);
		let t = multiplyMatrixByVec(x, w);
		//p=(t'*x)/(t'*t);
		let p1 = multiplyVecByMatrix(t, x); //(t'*x)
		let p2 = multiplyVecTransposedByVec(t, t); //(t'*t);
		let p = p1.map((a) => a / p2); //(t'*x/(t'*t))'
		let p_norm = normOfVec(p);
		t = t.map((a) => a * p_norm);
		w = w.map((a) => a * p_norm);
		p = p.map((a) => a / p_norm);
		let q = 1;
		//end pls for one compoennt
		bsco1 = multiplyVecTransposedByVec(u, t);
		bsco2 = multiplyVecTransposedByVec(t, t);
		bsco[i] = bsco1 / bsco2;
		let deflation = mutiplyVecByVecTransposed(t, p);
		x = subtractMatrixByMatrix(x, deflation);
		let y1 = t.map((a) => bsco[i] * a * q); //bsco[:,i]*t*q'
		y = y.map((a, b) => a - y1[b]);

		T[i] = t;
		U[i] = u;
		P[i] = p;
		W[i] = w;
		Q[i] = q;
	}
	return {
		T: T,
		U: U,
		P: P,
		W: W,
		Q: Q
	};
}


