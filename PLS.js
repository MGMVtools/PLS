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
		Q: Q,
		bsco:bsco
	};
}




function PLSprediction(xpred,bsco,P,Q,W,lv,meanY,stdY){
	let ypred=PLSSubPrediction(xpred, bsco, P, Q, W, lv);
	ypred=scaleback(ypred,meanY,stdY);
	return ypred
}



function PLSSubPrediction(xpred, bsco, P, Q, W, lv) {
	let {
		rows: xRows,
		cols: xCols
	} = size(xpred);
	let t_hat = createMatrix(lv, xRows);
	let ypred = createMatrix(lv, xRows);
	//initialize temp with zeros
	let temp = Array(xRows).fill(0);
	temp=temp.map((a)=>0);
	for (let i = 0; i < lv; i++) {
		t_hat[i] = multiplyMatrixByVec(xpred, W[i]);
		let xpred1 = multiplyVecVerticalByVecHorizontal(t_hat[i], P[i]);
		xpred = subtractMatrixByMatrix(xpred, xpred1);
		let temp1 = multiplyVecByValue(t_hat[i], bsco[i]);
		let temp2 = multiplyVecByValue(temp1, Q[i]);
		temp=temp.map((a,b)=>a+temp2[b]);
		ypred[i] = temp;
	}
	return ypred;
}
