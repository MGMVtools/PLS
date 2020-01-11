//code for page display
function hideElementsExceptX(elem) {
    let elemrightPanel = document.getElementsByClassName("rightPanel");
	let childelem = elemrightPanel[0].children;
    for (let i = 0; i < childelem.length; i++) {
        if (childelem[i].id !== elem) {
            childelem[i].style.display = "none";
        } else {
            childelem[i].style.display = "block";
        }
    }
}

function showAllElements(elem) {
    let elemrightPanel = document.getElementsByClassName("rightPanel");
	let childelem = elemrightPanel[0].children;
    for (let i = 0; i < childelem.length; i++) {
		childelem[i].style.display = "block";
    }
}

//read info from screen
function readNumberOfLV() {
    let LV = document.getElementById("LVinput");
    return parseInt(LV.value);
}

function readPreproName() {
    let prepro = document.getElementById("preproOption");
    let opcao = prepro.options[prepro.selectedIndex].value;
    return opcao;
}

function readSpectralData() {
    let X = document.getElementById("spectralData").value.trim(); //get data on screen without extra spaces
    let rows = X.split("\n"); //split by rows
    let numRows = rows.length;
    let numCols = rows[0].split("\t").length;
    let x = Array(numRows-1); //variable to store spectral data
    
    for (let i = 0;i < numRows; i++){
        x[i] = Array(numCols-1);
        x[i] =rows[i].split("\t").map(function(elem){return parseFloat(elem)});
    }
    return x;   
}
function readYData(){
    let y=document.getElementById("YData").value.trim(); //get data on screen without extra spaces
    y=y.split("\n").map(function(elem){return parseFloat(elem)});; //split by rows
    return y;   
}

function getDataFromScreen(){
    //get user data on screen
    let lv=readNumberOfLV(); 
    let prepro=readPreproName(); 
    let x=readSpectralData();
    let y=readYData();
    //end get user data
    
    var xp=preprocessing(x,prepro);//preprocess x
    y=autoscale(y); //autoscale y
    pls(xp,y,lv);
    debugger
    //read spectral data from screen
}


//pls function

function pls(x,y,numLV){ //performs partial least squares regression, based on NIPALS algorithm. This is PLS1 only
    //initialize variables, code based on itoolbox for Matlab by Noorgard
    let {rows:numRows, cols:numCols}=size(x);
    let P = createMatrix(numLV,numCols);
    let Q = createMatrix(numLV,1);
    let W = createMatrix(numLV,numCols);
    let T = createMatrix(numLV, numRows);
    let U = createMatrix(numLV,numRows);
    for (let i=0;i<numLV-1;i++){ //loop each component
        let u = y;
        let w = multiplyVecByMatrix(u,x);
		let normOfw = normOfVec(w);
		w = w.map(a => a/normOfw);
        debugger;
    }
    
}


function plsOneComponent(x,y){
    
    return 1;
}

function createMatrix(nrows,ncols){
    if (ncols==1){
        return Array(nrows);
    } else {
        return Array(nrows).fill(Array(ncols));
    }
}


//preprocessings:

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



function copyMatrix(X){ //copy a matrix so that it can be passed by value
    let {rows:numRows, cols:numCols} = size(X);
    let newMat = Array(numRows-1);
    for (let i=0; i<numRows;i++){
        newMat[i] = Array(numCols-1);
        for (let j=0;j<numCols;j++){
            newMat[i][j]=X[i][j];
        }
    }
    return newMat;
}

function size(X) {
    return { rows: X.length, cols:  X[0].length};
}

function meancenter(X){
    let meanX=mean(X);
    let Xmeancenter=subtract(X,meanX);
    return Xmeancenter;
}

function getColumnXOfMatrix(mat, colnum) {
    let {rows:numRows, cols:numCols} = size(mat);
    let newvec= Array(numRows- 1);
    for (let i=0;i<numRows;i++){
        newvec[i]=mat[i][colnum];
    }
    return newvec;
}

//math functions:
function subtract(X, tosub){ //do not forget that X passes by reference and not by value
    let {rows:numRows, cols:numCols} = size(X);
    let X2 = Array(numRows-1);
    for (let i=0; i < numRows; i++) {
        X2[i] = Array(numCols-1);
        for (let j=0; j < numCols; j++){
            X2[i][j] = X[i][j]-tosub[j];
        }
    }
    return X2;
}

function multiplyVecByMatrix(vec,mat){
    let {rows:numRows, cols:numCols} = size(mat);
    let {rows:numRows2, cols:numCols2} = size(vec);
    if (numRows!=numRows2){
        console.log("Matrix and vector dimensions inconsistent.");
        console.log("Matrix dimensions: " + numRows + " X " + numCols);
        console.log("Matrix dimensions: " + numRows2 + " X " + numCols2);
    }
    let result = Array(numCols-1);
    let accu = createMatrix(numRows,1);
    for (let i=0;i<numCols;i++){
        let tempcol=getColumnXOfMatrix(mat,i); //get the column of matrix
		for (let j=0; j<numRows;j++) {
			accu[j] = vec[j]*tempcol[j];
		}
        
        result[i]=cumSumArray(accu); // sum cumulatively the array to get the desired value
    }
    return result;
}
    
function multiplyMatrixByVec(mat,v){ //need to do this function
	
	    let {rows:numRows, cols:numCols} = size(mat);
    let {rows:numRows2, cols:numCols2} = size(vec);
    if (numRows!=numRows2){
        console.log("Matrix and vector dimensions inconsistent.");
        console.log("Matrix dimensions: " + numRows + " X " + numCols);
        console.log("Matrix dimensions: " + numRows2 + " X " + numCols2);
    }
    let result = Array(numoRows-1);
    let accu = createMatrix(numRows,1);
    for (let i=0;i<numCols;i++){
        let tempcol=getColumnXOfMatrix(mat,i); //get the column of matrix
		for (let j=0; j<numRows;j++) {
			accu[j] = vec[j]*tempcol[j];
		}
        
        result[i]=cumSumArray(accu); // sum cumulatively the array to get the desired value
    }
    return result;
}

function tranpose(mat){
	let {rows:numRows, cols:numCols} = size(mat);
	let newmat = createMatrix(numCols, numRows);
	
	for (i=0;i<numCols;i++){
		let tempcol=getColumnXOfMatrix(mat,i);
		newmat[i]=tempcol;
	}
	return newmat;
}


function divideMatrixbyVec(mat,vec){
    let {rows:numRows, cols:numCols} = size(mat);
    let {rows:numRows2, cols:numCols2} = size(vec);
    if (numCols!=numRows2){
        console.log("Matrix and vector dimensions inconsistent.");
        console.log("MAtrix dimensions: " + numRows + " X " + numCols);
        console.log("MAtrix dimensions: " + numRows2 + " X " + numCols2);
    }
    
    let newMat = Array(numRows-1)
    for (let i=0;i<numRows;i++){
        newMat[i] = Array(numCols-1);
        for (let j=0;j< numCols; j++){
            newMat[i][j]=mat[i][j]/vec[j];
        }
        
    }
    return newMat;
}

function mean(X){
    let {rows:numRows, cols:numCols}=size(X);
    if (typeof numCols != 'undefined' && numCols>1){
        meanX= Array(numRows-1);
        for (let j=0;j < numCols;j++){
            var somar=0;
            for (let i=0; i < numRows;i++){
                somar+=X[i][j];
            }
            meanX[j]=somar/numRows;
        }
        } else { //if one dimension array
            meanX= 0.0;
            let somar=0.0;
            for (let i=0; i < numRows;i++){
                somar+=X[i];
            }
            meanX=somar/numRows;
        }
    return meanX;
}


function normOfVec(vec){
	let b = vec.map(a => a*a);
	let cumu = cumSumArray(b);
	
	return Math.sqrt(cumu);
}


function arraySTD(vec){
    let  value=0.0;
    let somar=0;
    media=mean(vec);
    for (let i=0;i<vec.length;i++){
        somar += Math.pow(vec[i]-media,2);
    }
    value=Math.sqrt(somar/(vec.length-1)); //minus because it is the formula of std
    return value;
}

function matrixSTD(mat){
    let {rows:numRows, cols:numCols}=size(mat);
    let std = Array(numCols-1);
    for (let i=0;i<numCols;i++){
        var shortvec = getColumnXOfMatrix(mat, i);
        std[i] = arraySTD(shortvec);
    }
    return std;
}
function multiplyVecByValue(vec,valueToMultiply){
    let newarray= [...vec] //to clone array to new instance
    return newarray.map((val,index)=>val*valueToMultiply);
}
    
function cumSumArray(vec){ //sum an array cumulatively
    let val=0.0;
    val=vec.reduce((acc,val)=>(acc+val));
    return val;
}