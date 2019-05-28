
// These flogs are in the order of how the functionality would arise for a user and should therefore be done in this order

var flogs = {
  firstTimeVisitor: [
    {
      stepDesc: "firstTimeVisitor test loaded"
    },
    {
      stepDesc: "Clicking link opened Wikipedia in a new tab",
      stepExec: function(){
        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        
        document.getElementById('theLink').dispatchEvent(clickEvent);
      }
    }
  ], // firstTimeVisitor
  crazySelecter: [
    {
      stepDesc: "crazySelecter test loaded"
    },
    {
      stepDesc: "Selecting text launches alert",
      stepExec: function(){
        var selectEvent = new MouseEvent("select", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        
        document.getElementById('theParagraph').dispatchEvent(selectEvent);
      }
    }
  ]
}; // flogs

// end basic.js
