//
// Patrik Oskarsson (patrik.oskarsson@gmail.com)
//

var markerIds = [];
var homecards = [];

// $.ajaxSetup({
//     async: false
// });

function getMarkerIds(type = 'apartments') {
    $.ajax({
        url: "https://www.spotahome.com/api/public/listings/search/markers/madrid?type[]=" + type,
        async: false,
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(json) {
            var i = 0;
            // console.log(json);
            $(json.data).each(function(index, value) {
                // console.log(value);
                if (++i > 30) return false;
                markerIds.push(value.id);
            })
        }
    })
}

function getHomeCards(theMarkerIds) {
    let theHomeCardUrl = "https://www.spotahome.com/api/public/listings/search/homecards_ids?ids[]=" + theMarkerIds.join("&ids[]=")
    $.ajax({
        url: theHomeCardUrl,
        async: false,
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(json) {
            homecards = json.data.homecards;
            // console.log(homecards);
        }
    })
}

function sortByPricePerMonthASC(x, y) {
    return x.pricePerMonth - y.pricePerMonth;
}

function sortByPricePerMonthDESC(x, y) {
    return y.pricePerMonth - x.pricePerMonth;
}

function refreshJSON() {
    // Variables used
    var code = "";

    // Clear previous listing
    $('#properties_here').html("");

    // Get selected data in form
    var form_type = $("#property_type").val();
    var form_order = $("#sort_order").val();

    // Get the ids
    markerIds = [];
    getMarkerIds(form_type);

    // Get all home cards
    homecards = [];
    getHomeCards(markerIds);
    console.log(homecards);

    // Sort homecards
    if (form_order == "Ascending") {
        homecards.sort(sortByPricePerMonthASC);
    } else {
        homecards.sort(sortByPricePerMonthDESC);
    }

    for (var n = 0; n < 30; n++) {
        $('#debug').append(homecards[n].title + " PPM=" + homecards[n].pricePerMonth + '<br>');

        code = '<div class="card flex-row flex-wrap">';
        code += '<div class="card-header border-0"><img src="' + homecards[n].photoUrls.homecard + '" alt="Image of the property" width="120" class="rounded"></div>';
        code += '<div class="card-block px-2 col-md-6 col-sm-6 col-6 col-lg-7" style="position: relative">';
        code += '  <h5 class="card-title">' + homecards[n].title + '</h5>';
        code += '  <a href="https://www.spotahome.com' + homecards[n].url + '" target="_blank"><button type="button" class="btn btn-primary btn-sm myclass-bottom-right">More details</button></a>';
        code += '</div>';
        code += '<div class="card-block ml-auto mr-0 col-md-2 col-sm-2 text-right col-2" style="position: relative">';
        code += '  <h5 class="card-title">' + homecards[n].currencySymbol + homecards[n].pricePerMonth + '</h5>';
        code += '  <br>';
        code += '  <button type="button" class="btn btn-primary btn-sm myclass-bottom-right">Book now</button>';
        code += '</div>';
        code += '</div>';
        code += '<br />';

        $("#properties_here").append(code);

    }

}

// Rendering the initial listing
$(document).ready(function() {
    refreshJSON()
});