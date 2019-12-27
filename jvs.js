

function hideElementsExceptX(elem) {
    var everyChild = document.querySelectorAll(".rightPanel");
    var i = 0;
    
    console.log("number of childs found: " + everyChild.length);
    for (i = 0; i < everyChild.length; i++) {
        console.log(elem + everyChild[i].id);
        if (everyChild[i].id !== elem) {
            everyChild[i].style.display="none";
        } else {
            console.log("hide" + elem)
            everyChild[i].style.display="block";
        }
    }
}  


function showAllElements(elem){
    var everyChild = document.querySelectorAll(".rightPanel");
    for (var i = 0; i<everyChild.length; i++) {
        console.log(elem + everyChild[i].id)
            console.log("hide"+elem)
            everyChild[i].style.display="block";
    }
}  


function readNumberOfLV(){
    var LV = document.getElementById("LVinput");
    return LV.value;
}

function readPreproName(){
    var prepro = document.getElementById("preproOption");
    return prepro.value;
}

function readSpectralData(){
    var X=document.getElementById("spectralData").value.trim(); //get data on screen without extra spaces
    var rows=X.split("\n"); //split by rows
    var numRows=rows.length;
    var numCols=rows[0].split("\t").length;
    var x = new Array(numRows-1); //variable to store spectral data
    
    for (i=0;i<numRows;i++){
        x[i]=new Array(numCols-1);
        x[i]=rows[i].split("\t").map(function(elem){return parseFloat(elem)});
    }
    return x;   
}
function readYData(){
    var y=document.getElementById("YData").value.trim(); //get data on screen without extra spaces
    var rows=y.split("\n").map(function(elem){return parseFloat(elem)});; //split by rows
    return y;   
}

function preprocessing(X,prepro){
    //just mean centering implemented
    if (prepro=="mean"){
        x=meancenter(X);
        return x;
    }
}


function meancenter(X){
    meanX=mean(x);
    Xmeancenter=subtract(X,meanX);
    return Xmeancenter;
}


function getDataFromScreen(){
    lv=readNumberOfLV(); //get number of LVs on screen
    prepro=readPreproName(); //get prepro from screen
    
    x=readSpectralData();
    y=readYData();
    x=preprocessing(x,prepro);//preprocess x
    //read spectral data from screen
}


//math functions:
function subtract(X, tosub){
    numRows = X.length;
    numCols = X[0].length;
    var i=0;
    for (i=0; i < numRows; i++) {
        for (j=0; j < numCols; j++){
            X[i][j]-=tosub[j];
        }
    }
    return X
}

function mean(X){
    meanX=new Array(X[0].length-1)
    numRows=X.length;
    numCols=X[0].length;

        for (j=0;j < numCols;j++){
            somar=0;
            for (i=0; i < numRows;i++){
                somar+=X[i][j];
            }
            meanX[j]=somar/numRows;
        }
    return meanX;
    
}