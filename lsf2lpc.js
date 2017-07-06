// IO 
inlets = 1;
outlets = 2;

// GLOBAL VARIABLES
var g1 = [];
var g2 = []; 
var p; // filters order
var A = [] ; // filter coefficients
var LSF = []; // line spectral frequencies



/*
 = = = = = = = = = = = = = = = = = = = = = = = = = =
                      FUNCTIONS
 = = = = = = = = = = = = = = = = = = = = = = = = = =
 */

/*------------------------------------------------------------------------------
 === init
              Initialize variables
*/
function init(){
  p = LSF.length;
  A.length = 0;
  g1.length = 0;
  g2.length = 0;
  
}


/*------------------------------------------------------------------------------
 === lsf2lpc
              Computes the Ai coefficients 
*/
function lsf2lpc(){
  // Gets the cosine value of LSFs
  for (i = 0; i < p; i++){
    A[i] = Math.cos(LSF[i]);
  }

  g1 = getLSFpol(A, g1, p+1);
  g2 = getLSFpol(A.slice(1), g2, p);
  
  for (i = p >> 1; i > 1; i--){
    g2[i] -= g2[i - 2];
  }
  
  
  g2[(p + 1) >> 1] = 0.0;
  A[0] = 1.0;
  j = p;

  for (i = 1; i <= (p >> 1); i++){
    A[i] = 0.5 * (g1[i] + g2[i]);
    A[j] = 0.5 * (g1[i] - g2[i]);
    j--;
  }

  A[(p + 1)>> 1] = 0.5 * g1[(p+1) >> 1];
}



/*------------------------------------------------------------------------------
 === getLPCpol
*/
function getLSFpol(LSP, f, P){
  // init
  var b;
  f[0] = 1.0;
  f[1] = -2.0 * LSP[0];
  
  // ComPutation
  for ( i = 2; i <= (P >> 1); i++) {
    b = -2.0 * LSP[(i << 1) -2];
    f[i] = b * f[i -1] + 2.0 * f[i -2];
    
    for (j = i -1; j >1; j--) {
      f[j] += b * f[j -1] + f[j -2];
    }

    f[1] += b;
  }
  // THE END
  return f;
}


/*------------------------------------------------------------------------------
 === getLPC
*/




/*
 = = = = = = = = = = = = = = = = = = = = = = = = = =
                  INPUTS & OUTPUTS
 = = = = = = = = = = = = = = = = = = = = = = = = = =
 */

/*------------------------------------------------------------------------------
 === list
              This function handles the input data (list)
*/
function list(lsfin){
  // Reads input
  LSF = arrayfromargs(arguments);
  init()
  lsf2lpc();
  bang();
}


/*------------------------------------------------------------------------------
 === bang
              This function handles the message and stores inputs
*/
function bang(){
  outlet(0, A);
  outlet(1, p+1);
}
