

//preprocessings uses functions from other js files:

function preprocessing(X,prepro){
    //just mean centering implemented
    let X2 = copyMatrix(X); // so that X can be passed by value
    if (prepro=="mean"){
        return meancenter(X2);   
    } else if (prepro=="auto"){
        return autoscale(X2);
    }
}

function autoscale(X) {
    let {rows:numRows, cols:numCols}=size(X);
    if (typeof numCols != 'undefined' && numCols>1){ //if more than one dimension
        //first mean center X
        let newX = meancenter(X);
        let sigma = matrixSTD(X);
        newX = divideMatrixbyVec(newX, sigma)
        } else { //if one dimension array
            newX = Array(numRows-1);
            let sigma=arraySTD(X);
            let media=mean(X);
            for (let j=0; j<numRows;j++){
                newX[j]=(X[j]-media)/sigma;
            }
        }
    return newX;
}

function meancenter(X){
    let meanX=mean(X);
    let Xmeancenter=subtract(X,meanX);
    return Xmeancenter;
}


function scaleback(X,meanX,stdX){
	let {rows:numRows, cols:numCols}=size(X);
	
	//create standard deviation term, if you do not which to introduce the standard deviation term, provide stdX=1;
	let stdTerm=zeros(numRows,numCols);
	//create mean term
	let meanXterm=zeros(numRows,numCols);
	//get values to each term
	if (numCols>1){ //check if more than one dimension
		stdTerm.map((a)=>a.fill(stdX));
		meanXterm.map((a)=>a.fill(meanX));
	} else{
		stdTerm.map((a)=>stdX);
		meanXterm.map((a)=>meanX);
	}
	
	let Xscaledtemp1=multiplyMatrixElementWise(X,stdTerm);
	let xscaled=addMatrixElementWise(Xscaledtemp1,meanXterm)

	return xscaled;
}