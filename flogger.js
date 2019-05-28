/*! Flogger v2
 *  https://github.com/skybondsor/flogger
 *
 *  Flogger makes it as easy as possible for developers to do non-automated UI testing without losing their minds.
 *
 *  Copyright Jordyn Bonds
 *  Released under the MIT license
 */

function flogNext(){

  // Remove errors
  var flogError = document.getElementById('flogError');
  if ( flogError ){
    flogError.remove();  
  }
  
  // Get log, current test index
  var logLength = JSON.parse(localStorage.getItem('flogLog')).length;
  var curTest   = parseInt(localStorage.getItem('flogTest'));

  // If user has logged this test, continue
  if ( logLength-1 >= curTest ){
    runFlog(localStorage.getItem('flog'),'next');
  }

  // Otherwise, error
  else {
    document.getElementById('flogDesc').innerHTML = document.getElementById('flogDesc').innerHTML + '<p id="flogError">You did not log the status for this test yet.</p>';
  }
} // flogNext

function flogAuto(){

  var flogAutoLabel = document.getElementById('flogAutoLabel');

  // Are we currently automatically running tests?
  var curAuto = localStorage.getItem('flogAuto');

  // If no, start autotest
  if ( !curAuto || curAuto === "off" ){
    localStorage.setItem('flogAuto','on');
    flogAutoLabel.innerHTML = 'on';
  }

  // Otherwise, stop autotest
  else {
    localStorage.setItem('flogAuto','off');
    flogAutoLabel.innerHTML = 'off';
  }

} // flogAuto

function testPass(){
  logTest('pass');
} // testPass

function testFail(){
  logTest('FAIL');
} // testFail

function flogEnd(){
  runFlog(localStorage.getItem('flog'),'end');
} // flogEnd

function flogLoc(){

  var flogDesc = document.getElementById('flogDesc');

  var curLoc = localStorage.getItem('flogLoc');

  if ( !curLoc || curLoc === "top" ){
    localStorage.setItem('flogLoc','bottom');
    flogDesc.classList.add('bottom');
  } else {
    localStorage.setItem('flogLoc','top');
    flogDesc.classList.remove('bottom');
  }

} // flogLoc

function runFlog(theFlog,action){

  // On page load
  if ( action === 'load' ){

    var curAuto = localStorage.getItem('flogAuto') ? localStorage.getItem('flogAuto') : 'off';
    var curLoc  = localStorage.getItem('flogLoc') ? localStorage.getItem('flogLoc') : 'top';

    // Add flogger elements to DOM
    
    var flogDesc = document.createElement('div');
        flogDesc.id = 'flogDesc';
        flogDesc.class = curLoc;
        flogDesc.innerHTML = '<p class="flog-buttons"><a href="#" id="flogEnd">end</a><a href="#" id="flogAuto">auto: <span id="flogAutoLabel">'+curAuto+'</span></a><a href="#" id="flogLoc"></a><a href="#" id="flogFail">fail</a><a href="#" id="flogPass">pass</a></p><p id="flogStep">'+theFlog+' flog loaded</p>';
        document.getElementsByTagName('body')[0].appendChild(flogDesc);

    var flogShortcuts = document.createElement('div');
        flogShortcuts.id = 'flogShortcuts';
        flogShortcuts.classList.toggle('flog-hide');
        flogShortcuts.innerHTML = '<p><span class="key">a</span> toggle auto-test</p><p><span class="key">s</span> end test</p><p><span class="key">f</span> test failed</p><p><span class="key">j</span> test passed</p><p><span class="key">k</span> toggle location of test</p><p><span class="key">l</span> toggle visibility of test</p><p><span class="key">;</span> toggle shortcuts</p>';
        document.getElementsByTagName('body')[0].appendChild(flogShortcuts);

    // Init those elements
    document.getElementById('flogAuto').addEventListener('click',function(e){ e.preventDefault(); flogAuto(); return false; });
    document.getElementById('flogPass').addEventListener('click',function(e){ e.preventDefault(); testPass(); return false; });
    document.getElementById('flogFail').addEventListener('click',function(e){ e.preventDefault(); testFail(); return false; });
    document.getElementById('flogEnd').addEventListener('click', function(e){ e.preventDefault(); flogEnd();  return false; });
    document.getElementById('flogLoc').addEventListener('click', function(e){ e.preventDefault(); flogLoc();  return false; });

    // Init keyboard shortcuts, if poss
    if ( Mousetrap ){

      // a | toggle whether tests are automatically executed or not
      Mousetrap.bind('a',flogAuto);

      // s | end test
      Mousetrap.bind('s',flogEnd);

      // f | test failed
      Mousetrap.bind('f',testFail);

      // j | test passed
      Mousetrap.bind('j',testPass);

      // k | toggle desc location
      Mousetrap.bind('k',flogLoc);

      // l | toggle description visibility
      Mousetrap.bind('l', function(){
        document.getElementById('flogDesc').classList.toggle('flog-hide');
      });

      // ; | toggle shortcuts visibility
      Mousetrap.bind(';', function(){
        document.getElementById('flogShortcuts').classList.toggle('flog-hide');
      });

    }

  }

  // If we haven't added flogger items to localStorage yet
  if ( !localStorage.getItem('flog') ){

    // Add flogger items to localStorage
    localStorage.setItem('flog',theFlog);
    localStorage.setItem('flogLog','[]');
    localStorage.setItem('flogTest',0);

  } // test setup

  // Otherwise, we're mid-test, so get to it
  else {

    // Cast & Crew
    var curFlog = localStorage.getItem('flog');
    var curLog  = localStorage.getItem('flogLog');
    var curTest = action === 'next' ? parseInt(localStorage.getItem('flogTest'))+1 : parseInt(localStorage.getItem('flogTest'));

    // If we're past the last test
    if ( curTest === flogs[theFlog].length || action === "end" ){

      // Announce it's over
      var endFlogHTML = theFlog+' has ended<br /><textarea cols="20" rows="5" id="flogLog">'+localStorage.getItem('flogLog')+'</textarea><br />The Log has been selected so you can copy/paste at your leisure.';
      document.getElementById('flogStep').innerHTML = endFlogHTML;
      setTimeout(function(){
        document.getElementById('flogLog').select();
      },500);

      // Unload
      localStorage.removeItem('flog');
      localStorage.removeItem('flogLog');
      localStorage.removeItem('flogTest');

    } // end test

    // Otherwise, we're mid-test so get to it
    else {

      // If auto-test is on, and this step has an auto-test function defined...
      if ( localStorage.getItem('flogAuto') === "on" && typeof flogs[curFlog][curTest].stepExec === "function" ) {

        // Execute the test
        flogs[curFlog][curTest].stepExec();
      }

      // If runFlog is coming from logTest...
      if ( action === "next" ){

        // Advance the counter
        localStorage.setItem('flogTest',curTest);
      }

      // Either way, update description
      var curDesc = flogs[curFlog][curTest].stepDesc;
      document.getElementById('flogStep').innerHTML = curDesc;

    } // advance test
  } // test continue
} // runFlog

function logTest(status){

  // Cast & Crew
  var testLog = localStorage.getItem('flogLog') ? JSON.parse(localStorage.getItem('flogLog')) : [];
  var curTest = parseInt(localStorage.getItem('flogTest'));
  var curFlog = localStorage.getItem('flog');
  var curDesc = flogs[curFlog][curTest].stepDesc;

  // Create new test report
  var newReport = {
    status: status,
    test:   curDesc
  };

  // Append new report to log
  testLog[curTest] = newReport;

  // Update localStorage item
  localStorage.setItem('flogLog',JSON.stringify(testLog));

  // Advance
  flogNext();
} // logTest

// end flogger.js