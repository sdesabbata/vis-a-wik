/*
 *   Vis-a-Wik alpha 0.0.2
 *   Oxford, April 27th, 2015
 *   Stefano De Sabbata
 *
 *   GNU General Public License, version 3
 */


/*
 *   Wikipedia API wrap functions
 */

// Wikipedia API Search query wrapper
// (does not currently support 'continue',
// only loading the first 500 results)
function wpapi_search(query, querylang, callbackf){
	var wpapi_search_query = "http://"+encodeURIComponent(querylang)+".wikipedia.org/w/api.php?action=query&list=search&srlimit=500&format=json&srsearch="+encodeURIComponent(query)+"&callback=?";
	console.log(wpapi_search_query);
	$.getJSON(wpapi_search_query ,callbackf);
}

// Wikipedia API Page information query wrapper
// (does not currently support 'continue' as it's
// only used to retrieve info of one article at time)
function wpapi_article(query, querylang, callbackf){
	var wpapi_article_query = "http://"+encodeURIComponent(querylang)+".wikipedia.org/w/api.php?action=query&prop=info&format=json&titles="+encodeURIComponent(query)+"&callback=?";
	console.log(wpapi_article_query);
	$.getJSON(wpapi_article_query ,callbackf);
}

// Wikipedia API Links query wrapper
function wpapi_links(query, querylang, plcontinue, callbackf){
	if(plcontinue==null){
		var wpapi_links_query = "http://"+encodeURIComponent(querylang)+".wikipedia.org/w/api.php?action=query&prop=links&pllimit=500&format=json&titles="+encodeURIComponent(query)+"&callback=?";
	}else{
		var wpapi_links_query = "http://"+encodeURIComponent(querylang)+".wikipedia.org/w/api.php?action=query&prop=links&pllimit=500&format=json&titles="+encodeURIComponent(query)+"&callback=?&plcontinue="+encodeURIComponent(plcontinue);
	}
	console.log(wpapi_links_query);
	$.getJSON(wpapi_links_query ,callbackf);
}

// Wikipedia API Language Link query wrapper
// (does not currently support 'continue' as it's
// only used to retrieve one link at time)
function wpapi_langlink(query, querylang, lllang, callbackf){
	var wpapi_article_query = "http://"+encodeURIComponent(querylang)+".wikipedia.org/w/api.php?action=query&prop=langlinks&format=json&titles="+encodeURIComponent(query)+"&callback=?&lllang="+encodeURIComponent(lllang);
	console.log(wpapi_article_query);
	$.getJSON(wpapi_article_query ,callbackf);
}


/*
 *   Page functionalities
 */


// Reads the query form the search field and
// call the Wikipedia API to execute the query
function searchwikipedia(){
	var terms = $("#terms").val();
	wpapi_search(terms, lang, function(data){
    	var option_html = "";
    	// option_html will contain all the options values for the multiple selection
    	// one per each results from the Wikipedia API
    	$.each(data.query.search, function(i, item) {
    		var searchResultPageId = "SRPId_"+item.title.replace(/\(|\)|,|\s/g,'_');
    		option_html += "<option id=\""+searchResultPageId+"\" value=\""+encodeURIComponent(item.title)+"\">&#x2610;&nbsp;"+item.title+"</option>";
    	});
        $("#resultsselect").html(option_html);
	});
}

function addToSelectedArticles(articles){
	// as articles are selected in the multiple selections
	// the related valued will be pushed in the selectedArticles array
	// which contains the names of the articles to draw
	// and in the drawing list on the html page
	$.each(articles, function(i, article) {
		var articleReference = lang+":"+decodeURIComponent(article);
		if(selectedArticles.indexOf(articleReference)==-1){
			selectedArticles.push(articleReference);
    		var searchResultPageId = "#SRPId_"+decodeURIComponent(article).replace(/\(|\)|,|\s/g,'_');
    		$(searchResultPageId).html("&check;&nbsp;"+decodeURIComponent(article));
			$("#selectedarticleslist").append("<p id=\"articleReference"+lang+article+"\" class=\"selectedarticle\">"+decodeURIComponent(article)+"</p>");
		}
	});
}

// Drawing setp 1
// load nodes in the main language edition
function loadNodes(){
	// clear everything
	svg.selectAll(".link").remove();
	svg.selectAll(".node").remove();
	wiki_articles_graph = {"nodes":[],"links":[]};

	// in the initial drawing list, keep only
	// references to articles of current main lang edition
	// i.e.., prune compage language articles here (in case of re-drawing)
	// otherwise they get added again, creating duplicated
	var articlesToKeep = []
	$.each(selectedArticles, function(i, item) {
		var currentLang = item.slice(0,item.indexOf(":"));
		if(currentLang==lang){
			articlesToKeep.push(item);
		}
	});
	selectedArticles = articlesToKeep;

	// add articles to the graphs as nodes
	$.each(selectedArticles, function(i, item) {
		wiki_articles_graph.nodes.push({"name":item,"group":1});
	});

	// make a copy of selectedArticles to selectedArticlesStack 
	// used for searching for nodes in the compare language edition
	$.each(selectedArticles, function(i, item) {
		selectedArticlesStack.push(item);
	});

	// call drawing step 2
	loadLangLinkedNodes();
}

// Drawing setp 2
// search for nodes in the compare language edition
// this is is a tail recursive function
// which call itself as long as there are articles in the selectedArticlesStack
// thereafter it calls the drawing step 3
function loadLangLinkedNodes(){
	// if selectedArticlesStack is empty call drawing step 3
	if(selectedArticlesStack.length==0){
		// re-fill selectedArticlesStack for drawing step 3
		$.each(selectedArticles, function(i, item) {
			selectedArticlesStack.push(item);
		});
		loadEdges(null);
	// otherwise, pop first article from the stack
	// and search for the language link in the compare language edition
	}else{
	    //console.log("Status");
		//console.log(selectedArticlesStack);
		var currentNode = selectedArticlesStack.pop();
	    //console.log("Doing: "+currentNode);
		// add Compare languagee nodes and links
		var currentPage = currentNode.slice(currentNode.indexOf(":")+1,currentNode.length);
		// the Wikipedia API query is designed to return just one link, if any
		wpapi_langlink(currentPage, lang, lang_compare, function(data){
	    	$.each(data.query.pages, function(j, langlinkarticle) {
	    		if(langlinkarticle.langlinks!=null){
	    			$.each(langlinkarticle.langlinks, function(k, langlinked) {
	    				// if an article is found in the comapge language edition
	    				articleReference = lang+":"+langlinkarticle.title;
	    				langlinkedReference = lang_compare+":"+langlinked["*"];
	    				// add it to the selectedArticles list
						selectedArticles.push(langlinkedReference);
						// add it to the graph as node
						wiki_articles_graph.nodes.push({"name":langlinkedReference,"group":2});
						// add an edge in the graph illustrating the language link between the two language editions
		    			wiki_articles_graph.links.push({"source":selectedArticles.indexOf(articleReference),"target":selectedArticles.indexOf(langlinkedReference),"value":0.1});
					});
	    		}
	    	});
	    	// tail recursion call
	    	loadLangLinkedNodes();
		});
	}
}

// Drawing setp 3
// search for links between the selected articles
// this is is a tail recursive function
// which call itself as long as there are articles in the selectedArticlesStack
// thereafter it calls the drawing step 4
function loadEdges(plcontinue){
	// if selectedArticlesStack is empty call drawing step 3
	if(selectedArticlesStack.length==0){
		drawGraph();
	// otherwise, pop first article from the stack
	// and search for the its links
	}else{
	    //console.log("Status");
		//console.log(selectedArticlesStack);
		var currentNode = selectedArticlesStack.pop();
	    //console.log("Doing: "+currentNode);
		
		var currentPage = currentNode.slice(currentNode.indexOf(":")+1,currentNode.length);
		var currentLang = currentNode.slice(0,currentNode.indexOf(":"));

		wpapi_links(currentPage, currentLang, plcontinue, function(data){
			$.each(data.query.pages, function(i, item) {
				if(item.links!=null){
		    		$.each(item.links, function(j, link) {
		    			// for each link found, if it links the current node to any of the other selected nodes
		    			if(selectedArticles.indexOf(currentLang+":"+link.title)>-1){
		    				// add a edge in the graph
		    				wiki_articles_graph.links.push({"source":selectedArticles.indexOf(currentNode),"target":selectedArticles.indexOf(currentLang+":"+link.title),"value":1});
		    			}
		    		});
	    		}
	    	});
	    	//console.log("Done: "+currentNode);
			//console.log(selectedArticlesStack);

			// tail recursion call
			// if there are more links
			// call this function using the plcontinue value
			if(data["query-continue"]!=null){
	    		selectedArticlesStack.push(currentNode);
	    		loadEdges(data["query-continue"].links.plcontinue);
	    	// otherwise just call this function using a null value
	    	}else{
	    		loadEdges(null);
	    	}
		});
	}
}


// Drawing setp 4
// draw the SVG network diagram
function drawGraph(){
	force
		.nodes(wiki_articles_graph.nodes)
		.links(wiki_articles_graph.links)
		.start();

	// define the arrow marker
	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])
	  .enter().append("svg:marker")
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    //.attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");

	// draw the edges
	var path = svg.append("svg:g").selectAll("path")
	    .data(wiki_articles_graph.links)
	  .enter().append("svg:path")
	    .attr("class", "link")
	    .attr("marker-end", "url(#end)");

	// draw the nodes
	var node = svg.selectAll(".node")
	  	.data(wiki_articles_graph.nodes)
	  .enter().append("g")
	  	.attr("class", "node")
	  	.call(force.drag);

	// -> node glyph
	node.append("circle")
	  	.attr("r", 7)
	  	.style("fill", function(d) { return color(d.group); });

	// -> node label
	node.append("text")
    	.attr("x", 12)
    	.attr("dy", ".35em")
	  	.text(function(d) { return d.name; });

	// D3 Force layout drawing/positioning function
	force.on("tick", function(e) {
		path.attr("d", function(d) {
	        var dx = d.target.x - d.source.x,
	            dy = d.target.y - d.source.y;
	        return "M" + 
	            d.source.x + "," + 
	            d.source.y + "L" + 
	            d.target.x + "," + 
	            d.target.y;
	    });

		// Push different nodes in different directions for clustering.
		var k = 12 * e.alpha;
		wiki_articles_graph.nodes.forEach(function(nodeObject, i) {
			nodeObject.x += nodeObject == 1 ? k : -k;
		});

	    node
	        .attr("transform", function(d) { 
	  	    return "translate(" + d.x + "," + d.y + ")"; });
	});

	
	$("#drawbutton").prop('value','Draw');
	$("#drawbutton").prop('disabled', false);
}

// clear all drawing and selection
function clearVis(){	
	svg.selectAll(".link").remove();
	svg.selectAll(".node").remove();
	selectedArticles = [];
	selectedArticlesStack = [];
	$("#resultsselect").html("");
	$("#selectedarticleslist").html("");
}

// set selected languages
function setLanguages(){
	lang = $("#searchlang").val();
	lang_compare = $("#comparelang").val();
	clearVis();
}

/*
 *   Main
 */

// selected articles
var selectedArticles = [];
var selectedArticlesStack = [];

// main and compare languges (editions)
var lang;
var lang_compare;

// SVG size
var width = 800;
var height = 600;

// D3 color scale
var color = d3.scale.category10();

// D3 Force layout definition
var force = d3.layout.force()
    .linkDistance(function(thisLink, thisIndex){
    	// a bit rough, but effective
    	// draw language links twice as long a intra-language links
    	if(thisLink.value==1){
    		return 100;
    	}else{
    		return 200;
    	}
    })
    .charge(-300)
	.size([width, height]);

// instantiate SVG
var svg = d3.select("#contentdiv").append("svg")
	.attr("width", width)
	.attr("height", height);

// instantiate the graph data structutre
var wiki_articles_graph = {"nodes":[],"links":[]};

// set behaviours
$(document).ready(function() {
	setLanguages();
	// search wikipedia when Search button is pressed
	// or return on search text field
	$("#searchbutton").click(function() {
		searchwikipedia();
	});
	$("#terms").keypress(function(e) {
		if(e.which == 13) {
			searchwikipedia();
		}
	});
	// set languages
	$("#searchlang").on('change', function() {
		setLanguages();
	});
	$("#comparelang").on('change', function() {
		setLanguages();
	});
	// add articles to selected articles list
	// when related search result is selected
	$("#resultsselect").on('change', function() {
		console.log($(this).val());
		addToSelectedArticles($(this).val());
	});
	// draw
	$("#drawbutton").click(function() {
		$(this).prop('value','Drawing...');
		$(this).prop('disabled', true);
		loadNodes();
	});
	// clear
	$("#clearbutton").click(function() {
		clearVis();
	});

});