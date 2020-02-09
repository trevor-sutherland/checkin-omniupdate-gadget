$(document).ready(function () {
    
    var siteList = [];

    // global vars:
    gadget.ready().then(gadget.fetch).then(function () {
       
        console.log("Gadget Ready, let's get to work.");

        // get list of sites:

    }).fail(function(err){
        // gadget.ready failed, display a message:
        if (err.responseText.code = "SESSION_NOT_FOUND"){
            $("#checkedOut tbody").append('<tr colspan="3"><td><strong>Error (SESSION_NOT_FOUND)</strong><br/> This can happen when your authorization token has expired. Please try <a href="#" onClick="parent.location.reload();">refreshing the entire page</a>.</td></tr>');
        }

        console.log("gadget.ready fail!", err);
    });

    // get the sites that are located in the account
    function getSitesInAccount(){
        $(".btn.refresh").on('click', function(){
        $("#checkedOut tbody").html("");
        $(".toggleSites").removeClass("active");
            getSitesInAccount();
            })
        $.when( sites.getSites() ).done(function(data) {
            
            // sort data by site name:
            var sorted = sites.sortData(data);

            // format list of sites on the HTML:
            $.each(sorted, function(key, value) {
                siteList.push(value.site);
                getFilesInSite(value);
            });
        });
    }

    // find the files associated with the site
    function getFilesInSite(value){

        // write shell of row in alphebetical order:
        var _html = $("#checkedOut tbody").append( $(sites.createTableRow( value ) ) );
        $("#checkedOut tbody").append( _html );

        // get list of checkout files for each site:
        $.when( files.getFiles(value.site) ).done(function(data) {

            var _active = files.getActiveFiles(data);
            $(".site." + value.site).find('.count').append( _active.length + " files" );
            $(".site." + value.site).addClass("count" + _active.length);

            var checkInButton = $('<a/>').attr({ class: 'btn btn-outline-info btn-sm float-right'}).html('Check In');
            
            if (_active.length == 0){
                //add disabled class to sites with 0 files:
                $(checkInButton).addClass("disabled");
            }else{
                //add click event to site with files checked out:
                checkInButton.on('click', function(){
                    checkInButtonClick(_active);
                });
            }

            $(".site." + value.site).find('.button').append( checkInButton );
        });
    }

    // check back in files:
    function checkInButtonClick(_activeFiles){
        // can't check in what isn't checked out
        if (_activeFiles.length == 0) return;

        // get site from first _activeFile;
        var _site = _activeFiles[0].site;

        // check in files:
        files.checkInFiles(_activeFiles);
                
        // update visuals:
        $(".site." + _site).find(".count").html("0 files");
        $(".site." + _site).find(".btn").addClass("disabled");
        
        $(".site." + _site).addClass("count0");
        if ($(".toggleSites").hasClass("active")){
            $(".site." + _site).addClass("visible");
        }

    }

    //
    // EVENT LISTENERS
    //

    $(".btn.checkInAll").on('click', function(){
        $.each(siteList, function(key, value) {
            _button = $("." + value).not('.count0').find("a.btn").click();
        });
    });

    $(".btn.refresh").on('click', function(){
        $("#checkedOut tbody").html("");
        $(".toggleSites").removeClass("active");
        getSitesInAccount();
    })

    $(".btn.toggleSites").on('click', function(){

        $(this).toggleClass("active");
        var _active = $(this).hasClass("active");

        $.each(siteList, function(key, value) {
            if ($("." + value).hasClass("count0")){
                if (_active){
                    $("." + value).addClass("visible");
                }else{
                    $("." + value).removeClass("visible");
                }
            }
        });

    });

});