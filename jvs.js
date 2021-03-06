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
	let x = Array(numRows - 1); //variable to store spectral data

	for (let i = 0; i < numRows; i++) {
		x[i] = Array(numCols - 1);
		x[i] = rows[i].split("\t").map(function (elem) {
			return parseFloat(elem)
		});
	}
	return x;
}

function readYData() {
	let y = document.getElementById("YData").value.trim(); //get data on screen without extra spaces
	y = y.split("\n").map(function (elem) {
		return parseFloat(elem)
	});; //split by rows
	return y;
}

function getDataFromScreenPrediction() {
	//get user data on screen
	let lv = readNumberOfLV();
	let prepro = readPreproName();
	let x = readSpectralData();
	let y = readYData();
	//end get user data

	var xp = preprocessing(x, prepro); //preprocess x
	var xp = preprocessing(x, "mean"); //preprocess x
	
	let meanY=mean(y);
	let stdY=arraySTD(y);
	let yp = autoscale(y); //autoscale y
	
	let {
		T: T,
		U: U,
		P: P,
		W: W,
		Q: Q,
		bsco:bsco
	} = pls(xp, yp, lv);
	
	
	
	//prediction
	
	let ypred=PLSprediction(xp,bsco,P,Q,W,lv,meanY,stdY);
	let lr =linearRegression(y,ypred[0]);
	let rmsec=RMSEcalc(y,ypred[1]);
	
	
	
	//write solution to textareas
	writeResultsToscreen(T, "TData");
	writeResultsToscreen(U, "UData");
	writeResultsToscreen(P, "PData");
	writeResultsToscreen(W, "WData");
	writeResultsToscreen(Q, "QData");
	writeResultsToscreen(xp, "XmeanData");
	document.getElementById("meanY").value=meanY;
	document.getElementById("stdY").value=stdY;
	document.getElementById("txtrsquaredc").value=lr['r2'];
	document.getElementById("txtrmsec").value=rmsec;
	
	//read spectral data from screen
}




function getDataFromScreen() {
	//get user data on screen
	let lv = readNumberOfLV();
	let prepro = readPreproName();
	let x = readSpectralData();
	let y = readYData();
	//end get user data

	var xp = preprocessing(x, prepro); //preprocess x
	var xp = preprocessing(x, "mean"); //preprocess x
	
	let meanY=mean(y);
	let stdY=arraySTD(y);
	let yp = autoscale(y); //autoscale y
	
	let {
		T: T,
		U: U,
		P: P,
		W: W,
		Q: Q,
		bsco:bsco
	} = pls(xp, yp, lv);
	
	
	
	//prediction
	
	let ypred=PLSprediction(xp,bsco,P,Q,W,lv,meanY,stdY);
	let lr =linearRegression(y,ypred[0]);
	let rmsec=RMSEcalc(y,ypred[1]);
	
	
	
	//write solution to textareas
	writeResultsToscreen(T, "TData");
	writeResultsToscreen(U, "UData");
	writeResultsToscreen(P, "PData");
	writeResultsToscreen(W, "WData");
	writeResultsToscreen(Q, "QData");
	writeResultsToscreen(xp, "XmeanData");
	document.getElementById("meanY").value=meanY;
	document.getElementById("stdY").value=stdY;
	document.getElementById("txtrsquaredc").value=lr['r2'];
	document.getElementById("txtrmsec").value=rmsec;
	
	//read spectral data from screen
}



function writeResultsToscreen(variable, screenID) {
	document.getElementById(screenID).value = variable.join("\n").split(",").join("\t");
}


