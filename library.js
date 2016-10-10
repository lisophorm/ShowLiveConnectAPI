var ShowliveInterface = function (elementID, targetUrl) {
    console.log('constructor');
    var hookInterfaceTimer = 0;
    var iframe = document.getElementById(elementID).contentWindow;
    var targetUrl = targetUrl;
    var onReadyCallbackFunc=null;
    var onReadyCallbackParams={};
    var onClickCallbackFunc=null;
    var onResizeCallbackFunc=null;
    var onClickCallbackParams={};
    var showData={};

    window.addEventListener('message', function (event) {
        console.log('Client received message:', event);
        switch (event.data.message) {
            case 'interfaceready':
                showData=event.data.data;
                libraryReady();
                console.log(showData);
                break;
            case 'notifyPlot':
                console.log('clikkicli');
                console.log(event.data);
                if (typeof onClickCallbackFunc==='function') {
                    console.log('call custom function');
                    console.log(event.data);
                    onClickCallbackFunc.call(this,event.data.data);
                } else {
                    console.log('callback not assigned');
                }
                break;
            case 'resize':
                if (typeof onResizeCallbackFunc==='function') {
                    onResizeCallbackFunc.call(this);
                }
                break;


        }
    });

    this.onReady=function(callable) {
        onReadyCallbackFunc=callable;
        hookInterfaceTimer = setInterval(initLibrary, 1000);
    }
    this.onStandClicked=function(callBack) {
        onClickCallbackFunc=callBack;
    }
    this.onResize=function(callback) {
        onResizeCallbackFunc=callback;
    }

    this.focusOnShow =function() {
        iframe.postMessage({message: 'focusonplan',data:null}, targetUrl);
    }

    this.focusOnStand=function(plot,isAnimated) {
        iframe.postMessage({message: 'focusonplot',data:{
            plot:plot,
            isAnimated:isAnimated
        }}, targetUrl);
    };

    this.getshowData = function() {
        return showData;
    }
    this.getStandData=function(plotRef) {
        console.log('get stand data');
        if(typeof showData.plots[plotRef] ==='undefined') {
            throw new Error('Element not found');
            return false;
        }
        var theStand=showData.plots[plotRef];
        theStand.hasOccupants=false;
        if(theStand.occupant_ids.length>0) {
            theStand.hasOccupants=true;
            theStand.occupants=[];
            for (var i=0;i<theStand.occupant_ids.length;i++) {
                theStand.occupants.push(showData.occupants[theStand.occupant_ids[i]]);
            }
        }
        return theStand;
    }

    function initLibrary() {

        try {
            iframe.postMessage({message: 'init'}, targetUrl);
        } catch (e) {
            //console.log(e);
            console.log('Connecting to the API... Make sure you used he correct targetURL and http(s) must match ')
        }

    }

    function libraryReady() {
        if(typeof onReadyCallbackFunc==='function') {
            onReadyCallbackFunc.call(this,showData);
        }
        clearInterval(hookInterfaceTimer);
    }
}


var showLiveInterface = new ShowliveInterface('iframe', 'http://localhost');
showLiveInterface.onReady(function(showData) {
    console.log("ShowLive Interface ready")
    console.log('showData:',showData);
});



