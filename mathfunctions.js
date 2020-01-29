

function RMSEcalc(yref,ypred){
	let accu=0;
	for (let i=0; i<ypred.length;i++){
		let temp1=yref[i]-ypred[i];
		let temp2=temp1*temp1;
		accu+=temp2;
	}
	let RMSE = accu/ypred.length;
	RMSE = Math.sqrt(RMSE);
	
	return RMSE;
}


function linearRegression(y,x){ //function from https://stackoverflow.com/questions/6195335/linear-regression-in-javascript 20200125
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;
}







function subtractMatrixByMatrix(mat1, mat2) {
	let result = mat1.map((a, b) => a.map((c, d) => c - mat2[b][d]));
	return result;
}


function createMatrix(nrows, ncols) {
	if (ncols == 1) {
		return Array(nrows);
	} else {
		return Array(nrows).fill(Array(ncols));
	}
}


function mutiplyVecByVecTransposed(vec1, vec2) {
	let {
		rows: numRows,
		cols: numCols
	} = size(vec1);
	let {
		rows: numRows2,
		cols: numCols2
	} = size(vec2);
	let result = vec1.map((a) => multiplyVecByValue(vec2, a));
	return result;
}


function multiplyVecTransposedByVec(vec1, vec2) {
	let temp1 = vec1.map((a, i) => vec2[i] * a);
	let result = cumSumArray(temp1);
	return result;
}


function multiplyVecTransposedByVec(vec1, vec2) {
	let temp1 = vec1.map((a, i) => vec2[i] * a);
	let result = cumSumArray(temp1);
	return result;
}



function copyMatrix(X) { //copy a matrix so that it can be passed by value
	let {
		rows: numRows,
		cols: numCols
	} = size(X);
	let newMat = Array(numRows - 1);
	for (let i = 0; i < numRows; i++) {
		newMat[i] = Array(numCols - 1);
		for (let j = 0; j < numCols; j++) {
			newMat[i][j] = X[i][j];
		}
	}
	return newMat;
}

function size(X) {
	return {
		rows: X.length,
		cols: X[0].length
	};
}


function getColumnXOfMatrix(mat, colnum) {
	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let newvec = Array(numRows - 1);
	for (let i = 0; i < numRows; i++) {
		newvec[i] = mat[i][colnum];
	}
	return newvec;
}

//math functions:
function subtract(X, tosub) { //do not forget that X passes by reference and not by value
	let {
		rows: numRows,
		cols: numCols
	} = size(X);
	let X2 = Array(numRows - 1);
	for (let i = 0; i < numRows; i++) {
		X2[i] = Array(numCols - 1);
		for (let j = 0; j < numCols; j++) {
			X2[i][j] = X[i][j] - tosub[j];
		}
	}
	return X2;
}

function multiplyVecByMatrix(vec, mat) {
	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let {
		rows: numRows2,
		cols: numCols2
	} = size(vec);
	if (numRows != numRows2) {
		console.log("Matrix and vector dimensions inconsistent.");
		console.log("Matrix dimensions: " + numRows + " X " + numCols);
		console.log("Matrix dimensions: " + numRows2 + " X " + numCols2);
	}
	let result = Array(numCols - 1);
	let accu = createMatrix(numRows, 1);
	for (let i = 0; i < numCols; i++) {
		let tempcol = getColumnXOfMatrix(mat, i); //get the column of matrix
		for (let j = 0; j < numRows; j++) {
			accu[j] = vec[j] * tempcol[j];
		}

		result[i] = cumSumArray(accu); // sum cumulatively the array to get the desired value
	}
	return result;
}

function multiplyMatrixByVec(mat, vec) { //need to do this function

	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let {
		rows: numRows2,
		cols: numCols2
	} = size(vec);
	if (numCols != numRows2) {
		console.log("Matrix and vector dimensions inconsistent.");
		console.log("Matrix dimensions: " + numRows + " X " + numCols);
		console.log("Matrix dimensions: " + numRows2 + " X " + numCols2);
	}
	let result = Array(numCols - 1);
	let accu = createMatrix(1, numCols);
	for (let i = 0; i < numRows; i++) {
		let tempRow = mat[i]; //get the column of matrix
		for (let j = 0; j < numCols; j++) {
			accu[j] = vec[j] * tempRow[j];
		}
		result[i] = cumSumArray(accu); // sum cumulatively the array to get the desired value
	}
	return result;
}

function tranpose(mat) {
	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let newmat = createMatrix(numCols, numRows);

	for (i = 0; i < numCols; i++) {
		let tempcol = getColumnXOfMatrix(mat, i);
		newmat[i] = tempcol;
	}
	return newmat;
}


function divideMatrixbyVec(mat, vec) {
	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let {
		rows: numRows2,
		cols: numCols2
	} = size(vec);
	if (numCols != numRows2) {
		console.log("Matrix and vector dimensions inconsistent.");
		console.log("MAtrix dimensions: " + numRows + " X " + numCols);
		console.log("MAtrix dimensions: " + numRows2 + " X " + numCols2);
	}

	let newMat = Array(numRows - 1)
	for (let i = 0; i < numRows; i++) {
		newMat[i] = Array(numCols - 1);
		for (let j = 0; j < numCols; j++) {
			newMat[i][j] = mat[i][j] / vec[j];
		}

	}
	return newMat;
}

function mean(X) {
	let {
		rows: numRows,
		cols: numCols
	} = size(X);
	if (typeof numCols != 'undefined' && numCols > 1) {
		meanX = Array(numRows - 1);
		for (let j = 0; j < numCols; j++) {
			var somar = 0;
			for (let i = 0; i < numRows; i++) {
				somar += X[i][j];
			}
			meanX[j] = somar / numRows;
		}
	} else { //if one dimension array
		meanX = 0.0;
		let somar = 0.0;
		for (let i = 0; i < numRows; i++) {
			somar += X[i];
		}
		meanX = somar / numRows;
	}
	return meanX;
}


function normOfVec(vec) {
	let b = vec.map(a => a * a);
	let cumu = cumSumArray(b);

	return Math.sqrt(cumu);
}


function arraySTD(vec) {
	let value = 0.0;
	let somar = 0;
	media = mean(vec);
	for (let i = 0; i < vec.length; i++) {
		somar += Math.pow(vec[i] - media, 2);
	}
	value = Math.sqrt(somar / (vec.length - 1)); //minus because it is the formula of std
	return value;
}

function matrixSTD(mat) {
	let {
		rows: numRows,
		cols: numCols
	} = size(mat);
	let std = Array(numCols - 1);
	for (let i = 0; i < numCols; i++) {
		var shortvec = getColumnXOfMatrix(mat, i);
		std[i] = arraySTD(shortvec);
	}
	return std;
}

function multiplyVecByValue(vec, valueToMultiply) {
	let newarray = [...vec] //to clone array to new instance
	return newarray.map((val, index) => val * valueToMultiply);
}

function cumSumArray(vec) { //sum an array cumulatively
	let val = 0.0;
	val = vec.reduce((acc, val) => (acc + val));
	return val;
}



function multiplyVecVerticalByVecHorizontal(vecV,vecH){
	let {rows: numRows1,cols: numCols1} = size(vecV);
	let {rows: numRows2,cols: numCols2} = size(vecH);
	
	
	let resultmat=createMatrix(numRows1,numRows2);
	
	for (i=0;i<numRows1;i++){
		resultmat[i]=multiplyVecByValue(vecH,vecV[i]);
	}
	return resultmat;
}



function multiplyMatrixElementWise(mat1,mat2){
	let {rows: numRows1,cols: numCols1} = size(mat1);
	let {rows: numRows2,cols: numCols2} = size(mat2);
	
	let matMulti=zeros(numRows1,numCols1);
	
	if (numRows1!=numRows2 || numCols1!=numCols2){
		console.log("Matrix dimensions should be the same for elementwise multiplication")
	} else{
		for (i=0;i<numRows1;i++){
			
				matMulti[i]=mat1[i].map((a,j)=>a*mat2[i][j]);
			
		}
	}
	return matMulti;
}
function addMatrixElementWise(mat1,mat2){
	let {rows: numRows1,cols: numCols1} = size(mat1);
	let {rows: numRows2,cols: numCols2} = size(mat2);
	
	let matMulti=zeros(numRows1,numCols1);
	
	if (numRows1!=numRows2 || numCols1!=numCols2){
		console.log("Matrix dimensions should be the same for elementwise multiplication")
	} else{
		for (i=0;i<numRows1;i++){
				matMulti[i]=mat1[i].map((a,j)=>a+mat2[i][j]);
		}
	}
	return matMulti;
}


function zeros(numRows,numCols){
	let mat=createMatrix(numRows,numCols);
	mat=mat.map((a)=>a.fill(0));
	return mat;
}