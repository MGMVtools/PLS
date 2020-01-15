

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
