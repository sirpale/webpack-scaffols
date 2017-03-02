/**
 * Created by sirpale on 17/2/28.
 */
// import React,{ Component, PropTypes } from 'react';
// import ReactDom, {render} from 'react-dom';
import HEAD from '../../../views/head.html';
import FOOT from '../../../views/foot.html';
import './main';
import content from '../components/content';

// render (
//     document.getElementById('app').innerHTML = content
// );
// let main = document.getElementById('main');
//
// console.log($);
//
//
// main.insertAdjacentHTML('beforebegin',HEAD);
// main.insertAdjacentHTML('afterend',FOOT);

let main = $('#main');

$(function(){
  main.before(HEAD).after(FOOT);
});




// document.getElementById('app').innerHTML = content;






