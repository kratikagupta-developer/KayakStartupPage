document.addEventListener("click", function(event){
    console.log(event);
    if (!event.target.closest('.dropdown'))
    {
        document.getElementById('season_options').style.visibility = 'hidden';
        document.getElementById('category_options').style.visibility = 'hidden';
        document.getElementById('destination_options').style.visibility = 'hidden';

    }
});

function capitalize(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200" || rawFile.status == '0') {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function set_season_dropdown(tour_data)
{
    var dd_seasons = document.getElementById('seasons');
    var season_options = document.getElementById('season_options');
    var body = document.getElementsByTagName('body')[0];

    dd_seasons.onclick = function(e){
        season_options.style.visibility = 'visible';
        document.getElementById('category_options').style.visibility = 'hidden';
        document.getElementById('destination_options').style.visibility = 'hidden';
        e.stopPropagation();
    }
    
    body.onclick = function(e){
        season_options.style.visibility = 'hidden';
        e.stopPropagation();
    };

    var seasons = Object.keys(tour_data['seasonCategories']);
    season_options.innerHTML = '';
    seasons.forEach(x => {
        inner_div = document.createElement('div');
        inner_div.innerHTML = capitalize(x);
        inner_div.className = 'season choice clickable';
        season_options.appendChild(inner_div);
    });

    choices = document.getElementsByClassName('season choice');
    season_selected = document.getElementById('season_selected');
    
    for (let choice of choices)
    {
        choice.onclick = function(e){
            season_selected.innerHTML = choice.innerHTML;
            season_options.style.visibility = 'hidden';
            document.getElementById('category_selected').innerHTML = 'Category';
            document.getElementById('category_options').innerHTML = '';
            document.getElementById('destination_selected').innerHTML = 'Destination';
            document.getElementById('destination_options').innerHTML = '';
            set_category_dropdown(tour_data, tour_data['seasonCategories'][choice.innerHTML.toLowerCase()]);
            
            e.stopPropagation();
        }
    }

}

function set_category_dropdown(tour_data, categories)
{
    var dd_category = document.getElementById('categories');
    var category_options = document.getElementById('category_options');
    var body = document.getElementsByTagName('body')[0];

    dd_category.onclick = function(e){
        category_options.style.visibility = 'visible';
        document.getElementById('season_options').style.visibility = 'hidden';
        document.getElementById('destination_options').style.visibility = 'hidden';
        e.stopPropagation();
    }
    
    body.onclick = function(e){
        category_options.style.visibility = 'hidden';
        e.stopPropagation();
    };

    category_options.innerHTML = '';
    categories.forEach(x => {
        inner_div = document.createElement('div');
        inner_div.innerHTML = capitalize(x);
        inner_div.className = 'category choice clickable';
        category_options.appendChild(inner_div);
    });

    choices = document.getElementsByClassName('category choice');
    category_selected = document.getElementById('category_selected');
    
    for (let choice of choices)
    {
        choice.onclick = function(e){
            category_selected.innerHTML = choice.innerHTML;
            category_options.style.visibility = 'hidden';
            document.getElementById('destination_selected').innerHTML = 'Destination';
            document.getElementById('destination_options').innerHTML = '';
            set_destination_dropdown(tour_data['destinations'], choice.innerHTML.toLowerCase());
            e.stopPropagation();
        }
    }
}

function set_destination_dropdown(destinations, category)
{
    var dd_destination = document.getElementById('destinations');
    var destination_options = document.getElementById('destination_options');
    var body = document.getElementsByTagName('body')[0];

    dd_destination.onclick = function(e){
        destination_options.style.visibility = 'visible';
        document.getElementById('season_options').style.visibility = 'hidden';
        document.getElementById('category_options').style.visibility = 'hidden';
        e.stopPropagation();
    }
    
    body.onclick = function(e){
        destination_options.style.visibility = 'hidden';
        e.stopPropagation();
    };

    destination_options.innerHTML = '';
    destinations.forEach(destination => {
        if (destination['category'] == category)
        {
            inner_div = document.createElement('div');
            inner_div.innerHTML = capitalize(destination['name']);
            inner_div.className = 'destination choice clickable';
            destination_options.appendChild(inner_div);
        }
    });

    choices = document.getElementsByClassName('destination choice');
    destination_selected = document.getElementById('destination_selected');
    
    for (let choice of choices)
    {
        choice.onclick = function(e){
            destination_selected.innerHTML = capitalize(choice.innerHTML);
            destination_options.style.visibility = 'hidden';
            e.stopPropagation();
        }
    }

}


document.getElementById('location').style.visibility = 'hidden';

tour_data = readTextFile('assets/tour-data.json', function(file_text){
    tour_data = JSON.parse(file_text);
        
    set_season_dropdown(tour_data);

});

document.getElementsByClassName('logo')[0].onclick = function(){
    location.reload();
}

btn_search = document.getElementById('search');
// svg_search = document.getElementById('search_svg');
btn_search.onclick = function(){
    destination = document.getElementById('destination_selected').innerHTML;
    document.getElementById('location').style.visibility = 'visible';
    tour_data['destinations'].forEach(x => {
        if (x['name'] == destination)
        {
            element = x;
        }
    });
    dest_name = destination.replace(' ', '-').toLowerCase();
    image_name = 'assets/' + dest_name + '-' + element['id'] + '.jpg';
    document.getElementById('location').style.background = 'url("' + image_name + '")';
    document.getElementById('location_text').innerHTML = destination + ', ' + element['country'];
};