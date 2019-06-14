"use strict";

window.addEventListener( "DOMContentLoaded", function () {
  var output = document.getElementById( "services" );

  [
    [ 3, 7 ],
    [ 32, 5, 64, 2, 34, 57, 24, 7674, 3, 366 ],
    [ 7, "a" ]
  ].forEach( function ( input ) {
    svc( "sum", input ).then( function ( result ) {
      output.innerHTML += "<p>" + JSON.stringify( input ) +
        " = " + result + "</p>";
    }, function ( err ) {
      output.innerHTML += '<p>' + JSON.stringify( input ) +
        " = " + err + "</p>";
    } );
  } );

} );


function svc( name, data ) {
  return new Promise( function ( resolve, reject ) {
    fetch( name, {
      method: "POST",
      body: JSON.stringify( data )
    } ).then(
      function ( response ) {
        if ( response.ok ) {
          response.text().then( function ( text ) {
            try {
              resolve( JSON.parse( text ) );
            } catch ( ex ) {
              reject( "Invalid JSON: " + text );
            }
          } );
        } else {
          response.text().then( function ( text ) {
            reject( "Error " + response.status + ": " + text );
          } )
        }
      }
    ).catch( reject );
  } );
}