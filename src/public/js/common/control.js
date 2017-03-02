/**
 * Created by sirpale on 17/3/2.
 */
import HEAD from '../../../views/head.html';
import FOOT from '../../../views/foot.html';

import '../../css/normalize.css';
import '../../lib/bootstrap/css/bootstrap.css';
import '../../css/style.css';

import './core';


let main = $('#main');

$(function(){
    main.before(HEAD).after(FOOT);
});