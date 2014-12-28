var appURL = 'http://localhost/wordpress';
var devURL = 'http://localhost/vhelper2/www/index.html';

var app = {

	init: function() {
		console.log('app.init');
		var hash = window.location.hash.replace(/^.*?#/,'');

		if (hash == '') {
			app.getIcons();
		}

		$('.app-menu a').on('click', app.menus);

	}, 

	getIcons: function() {
		console.log('app.getIcons');
		var rootURL = 'http://localhost/wordpress';
		var method = '/?json=get_category_posts';
		var params = '&slug=icons';

		$.ajax({
			type: 'GET',
			url: rootURL + method + params,
			dataType: 'json',
			success: function(data){
				$.each(data.posts, function(index, value) {
					console.log(value);
					//latest_post = value.posts[0];
					// console.log("value.posts is "+value.slug);
					img_url = value.thumbnail_images.thumbnail.url;
			      $('ul.topcoat-list').append('<li class="topcoat-list__item">' +
			      	'<h3>'+value.title+'</h3>' +
			      	'<a class="view-link" href="'+value.title.toLowerCase()+'">' +
			      	'<img src="'+img_url+'" /></a><br>');
			    });
			},
			error: function(error){
				console.log(error);
			}

		});

	},

	getCatPosts: function(cat) {
		console.log('getCatPosts');
		//console.log(cat); //debug

		var rootURL = 'http://localhost/wordpress';
		var method = '/?json=get_category_posts';
		var params = '&slug='+cat;

		$.ajax({
			type: 'GET',
			url: rootURL + method + params,
			dataType: 'json',
			success: function(data){
				$.each(data.posts, function(index, value) {
					console.log("content_id: "+value.id);
					img_url = value.thumbnail_images.thumbnail.url;
			      $('ul.cat_posts_list').append('<li class="cat-posts-list__item">' +
			      	'<h3>'+value.title+'</h3>' +
			      	'<a class="view-link" href="#'+cat+'?contentid='+value.id+'">' +
			      	'<img src="'+img_url+'" /></a><br>');
			    });	

			},
			error: function(error){
				console.log(error);
			}

		});

	},

	displayContent: function(params) {
		console.log('displayContent');

		var rootURL = 'http://localhost/wordpress';
		var method = '/?json=get_post';
		var get_params = '&post_id='+params["content-id"];
		console.log(rootURL + method + get_params);
		$.ajax({
		type: 'GET',
		url: rootURL + method + params,
		dataType: 'json',
		success: function(data){
			content = data.posts[0].content;
			console.log(content);
			$('div.content_post').append(content);

		},
		error: function(error){
			console.log(error);
		}

		});



	},

	route: function(event) {
		hash = URI(window.location.href).fragment(),
		curr_params = URI(hash).search(true);
		hash_noparams = URI(window.location.href).hash().search("");

		homePage =
    		'<div class="home"><ul class="topcoat-list"></ul></div>';

		catPage =
		    '<div class="cat_posts"><ul class="cat_posts_list"></ul>' +
			'<a class="topcoat-button" href="'+devURL+'">Back</a></div>';

		contentPage =
		    '<div><div class="content_post"></div>' +
			'<a class="topcoat-button" href="'+devURL+URI(window.location.href).search("").fragment()+'">Back</a></div>';

		samplePage = 
			'<div><article class="static-page">' +
			'<a class="topcoat-button" href="/">Back</a>' +
			'<p>Static Page Content</p>' +
			'<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>' +
			'</article></div>';

		var page;


		// hash = URI(window.location.href).fragment(),
		console.log("test");
		console.log(hash);
		console.log(curr_params);
		console.log(hash_noparams);
		console.log(URI("#activities?idk=3").search("").fragment());


		// console.log(window.location.href);
		// console.log(hash);
		// console.log(window.location.search);
		// console.log(params);

        /* If the hash is sample, show the samplePage. If it's anything else, load the singlePost view, otherwise it's the homePage */

        if (hash == 'sample') {
        	page = samplePage;
        } else if (hash != '') {
        	//console.log("here");
        	if (Object.keys(curr_params).length != 0) {
        		//console.log("here3");
        		page = contentPage;
        		app.displayContent(curr_params);
        	} else {
        		//console.log("here2");
        		page = catPage;
        		app.getCatPosts(hash);
        	}
        	
	    } else {
        	console.log('home page');
    		page = homePage;
    		app.init();
    	} 
		// uri = URI(window.location.href);
		// console.log(uri);

  //    //    var uri = new URI(window.location.href),
  //       pn = uri.pathname();
  //       params = uri.search(true);
	 //    console.log("pathname: "+pn);
  //       console.log("params: "+params);


    	slider.slidePage($(page));
	},

	menus: function(event) {

		// Close the slide panel if a menu button is clicked
		$('.js-app-container').removeClass('slideIn').addClass('slideOut');

	}

}

var slider = new PageSlider($("#container"));

$(window).on('hashchange', app.route);

app.route();