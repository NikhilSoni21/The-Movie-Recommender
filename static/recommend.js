// Javascript code for popular movies

// Taking api key from TMDB
const API_KEY = "api_key=a5dc16934036dca8908eec72cc603290";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const main = document.getElementById("main");
const tagsEl = document.getElementById("tags");
var selectedGenre = [];
setGenre();

// Take elements from genreS array , assign in tags div
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        // If tags added element is there adding it
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1); // Removing similar selected element
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      // Geting movies by id by calling the API
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

// For highlighting the selected tag
function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add("highlight");
    });
  }
}

// Creating the clear button
function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
}

getMovies(API_URL);

// Fetching API and passing API_URL
function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

// Showing movies
function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? IMG_URL + poster_path
                 : "http://via.placeholder.com/1080x1580"
             }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Quick Overview</h3>
                ${overview}
                <br/> 
                <p class="know-more" id="${id}"></p>
            </div>
        
        `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
  });
}

// Return a string that is assigning as class of vote_average
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Javasript code for popular movies ends

// Javascript code for popular
$(function () {
  // Button will be disabled until we type something inside the input field
  const source = document.getElementById("autoComplete");
  const inputHandler = function (e) {
    if (e.target.value == "") {
      $(".movie-button").attr("disabled", true);
    } else {
      $(".movie-button").attr("disabled", false);
    }
  };
  source.addEventListener("input", inputHandler);

  $(".fa-arrow-up").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  $(".app-title").click(function () {
    window.location.href = "/";
  });

  $(".movie-button").on("click", function () {
    var my_api_key = "a5dc16934036dca8908eec72cc603290";
    var title = $(".movie").val();
    if (title == "") {
      $(".results").css("display", "none");
      $(".fail").css("display", "block");
    }

    if ($(".fail").text() && $(".footer").css("position") == "absolute") {
      $(".footer").css("position", "fixed");
    } else {
      load_details(my_api_key, title);
    }
  });
});

// will be invoked when clicking on the recommended movie cards
function recommendcard(e) {
  $("#loader").fadeIn();
  var my_api_key = "a5dc16934036dca8908eec72cc603290";
  var title = e.getAttribute("title");
  load_details(my_api_key, title);
}

// get the details of the movie from the API (based on the name of the movie)
function load_details(my_api_key, title) {
  $.ajax({
    type: "GET",
    url:
      "https://api.themoviedb.org/3/search/movie?api_key=" +
      my_api_key +
      "&query=" +
      title,
    async: false,
    success: function (movie) {
      if (movie.results.length < 1) {
        $(".fail").css("display", "block");
        $(".results").css("display", "none");
        $("#loader").delay(500).fadeOut();
      } else if (movie.results.length == 1) {
        $("#loader").fadeIn();
        $(".fail").css("display", "none");
        $(".results").delay(1000).css("display", "block");
        var movie_id = movie.results[0].id;
        var movie_title = movie.results[0].title;
        var movie_title_org = movie.results[0].original_title;
        get_movie_details(movie_id, my_api_key, movie_title, movie_title_org);
      } else {
        var close_match = {};
        var flag = 0;
        var movie_id = "";
        var movie_title = "";
        var movie_title_org = "";
        $("#loader").fadeIn();
        $(".fail").css("display", "none");
        $(".results").delay(1000).css("display", "block");
        for (var count in movie.results) {
          if (title == movie.results[count].original_title) {
            flag = 1;
            movie_id = movie.results[count].id;
            movie_title = movie.results[count].title;
            movie_title_org = movie.results[count].original_title;
            break;
          } else {
            close_match[movie.results[count].title] = similarity(
              title,
              movie.results[count].title
            );
          }
        }
        if (flag == 0) {
          movie_title = Object.keys(close_match).reduce(function (a, b) {
            return close_match[a] > close_match[b] ? a : b;
          });
          var index = Object.keys(close_match).indexOf(movie_title);
          movie_id = movie.results[index].id;
          movie_title_org = movie.results[index].original_title;
        }
        get_movie_details(movie_id, my_api_key, movie_title, movie_title_org);
      }
    },
    error: function (error) {
      alert("Invalid Request - " + error);
      $("#loader").delay(500).fadeOut();
    },
  });
}

// getting closest match to the requested movie name using Levenshtein distance
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// get all the details of the movie using the movie id.
function get_movie_details(movie_id, my_api_key, movie_title, movie_title_org) {
  $.ajax({
    type: "GET",
    url:
      "https://api.themoviedb.org/3/movie/" +
      movie_id +
      "?api_key=" +
      my_api_key,
    success: function (movie_details) {
      show_details(
        movie_details,
        movie_title,
        my_api_key,
        movie_id,
        movie_title_org
      );
    },
    error: function (error) {
      alert("API Error! - " + error);
      $("#loader").delay(500).fadeOut();
    },
  });
}

// passing all the details to python's flask for displaying and scraping the movie reviews using imdb id
function show_details(
  movie_details,
  movie_title,
  my_api_key,
  movie_id,
  movie_title_org
) {
  var imdb_id = movie_details.imdb_id;
  var poster;
  if (movie_details.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + movie_details.poster_path;
  } else {
    poster = "static/default.jpg";
  }
  var overview = movie_details.overview;
  var genres = movie_details.genres;
  var rating = movie_details.vote_average;
  var vote_count = movie_details.vote_count;
  var release_date = movie_details.release_date;
  var runtime = parseInt(movie_details.runtime);
  var status = movie_details.status;
  var genre_list = [];
  for (var genre in genres) {
    genre_list.push(genres[genre].name);
  }
  var my_genre = genre_list.join(", ");
  if (runtime % 60 == 0) {
    runtime = Math.floor(runtime / 60) + " hour(s)";
  } else {
    runtime =
      Math.floor(runtime / 60) + " hour(s) " + (runtime % 60) + " min(s)";
  }

  // calling `get_movie_cast` to get the top cast for the queried movie
  movie_cast = get_movie_cast(movie_id, my_api_key);

  // calling `get_individual_cast` to get the individual cast details
  ind_cast = get_individual_cast(movie_cast, my_api_key);

  // calling `get_recommendations` to get the recommended movies for the given movie id from the TMDB API
  recommendations = get_recommendations(movie_id, my_api_key);

  details = {
    title: movie_title,
    cast_ids: JSON.stringify(movie_cast.cast_ids),
    cast_names: JSON.stringify(movie_cast.cast_names),
    cast_chars: JSON.stringify(movie_cast.cast_chars),
    cast_profiles: JSON.stringify(movie_cast.cast_profiles),
    cast_bdays: JSON.stringify(ind_cast.cast_bdays),
    cast_bios: JSON.stringify(ind_cast.cast_bios),
    cast_places: JSON.stringify(ind_cast.cast_places),
    imdb_id: imdb_id,
    poster: poster,
    genres: my_genre,
    overview: overview,
    rating: rating,
    vote_count: vote_count.toLocaleString(),
    rel_date: release_date,
    release_date: new Date(release_date)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" "),
    runtime: runtime,
    status: status,
    rec_movies: JSON.stringify(recommendations.rec_movies),
    rec_posters: JSON.stringify(recommendations.rec_posters),
    rec_movies_org: JSON.stringify(recommendations.rec_movies_org),
    rec_year: JSON.stringify(recommendations.rec_year),
    rec_vote: JSON.stringify(recommendations.rec_vote),
  };

  $.ajax({
    type: "POST",
    data: details,
    url: "/recommend",
    dataType: "html",
    complete: function () {
      $("#loader").delay(500).fadeOut();
    },
    success: function (response) {
      $(".results").html(response);
      $("#autoComplete").val("");
      $(".footer").css("position", "absolute");
      if ($(".movie-content")) {
        $(".movie-content").after(
          '<div class="gototop"><i title="Go to Top" class="fa fa-arrow-up"></i></div>'
        );
      }
      $(window).scrollTop(0);
    },
  });
}

// getting the details of individual cast
function get_individual_cast(movie_cast, my_api_key) {
  cast_bdays = [];
  cast_bios = [];
  cast_places = [];
  for (var cast_id in movie_cast.cast_ids) {
    $.ajax({
      type: "GET",
      url:
        "https://api.themoviedb.org/3/person/" +
        movie_cast.cast_ids[cast_id] +
        "?api_key=" +
        my_api_key,
      async: false,
      success: function (cast_details) {
        cast_bdays.push(
          new Date(cast_details.birthday)
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" ")
        );
        if (cast_details.biography) {
          cast_bios.push(cast_details.biography);
        } else {
          cast_bios.push("Not Available");
        }
        if (cast_details.place_of_birth) {
          cast_places.push(cast_details.place_of_birth);
        } else {
          cast_places.push("Not Available");
        }
      },
    });
  }
  return {
    cast_bdays: cast_bdays,
    cast_bios: cast_bios,
    cast_places: cast_places,
  };
}

// getting the details of the cast for the requested movie
function get_movie_cast(movie_id, my_api_key) {
  cast_ids = [];
  cast_names = [];
  cast_chars = [];
  cast_profiles = [];
  top_10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $.ajax({
    type: "GET",
    url:
      "https://api.themoviedb.org/3/movie/" +
      movie_id +
      "/credits?api_key=" +
      my_api_key,
    async: false,
    success: function (my_movie) {
      if (my_movie.cast.length > 0) {
        if (my_movie.cast.length >= 10) {
          top_cast = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
          top_cast = [0, 1, 2, 3, 4];
        }
        for (var my_cast in top_cast) {
          cast_ids.push(my_movie.cast[my_cast].id);
          cast_names.push(my_movie.cast[my_cast].name);
          cast_chars.push(my_movie.cast[my_cast].character);
          if (my_movie.cast[my_cast].profile_path) {
            cast_profiles.push(
              "https://image.tmdb.org/t/p/original" +
                my_movie.cast[my_cast].profile_path
            );
          } else {
            cast_profiles.push("static/default.jpg");
          }
        }
      }
    },
    error: function (error) {
      alert("Invalid Request! - " + error);
      $("#loader").delay(500).fadeOut();
    },
  });

  return {
    cast_ids: cast_ids,
    cast_names: cast_names,
    cast_chars: cast_chars,
    cast_profiles: cast_profiles,
  };
}

// getting recommendations
function get_recommendations(movie_id, my_api_key) {
  rec_movies = [];
  rec_posters = [];
  rec_movies_org = [];
  rec_year = [];
  rec_vote = [];

  $.ajax({
    type: "GET",
    url:
      "https://api.themoviedb.org/3/movie/" +
      movie_id +
      "/recommendations?api_key=" +
      my_api_key,
    async: false,
    success: function (recommend) {
      for (var recs in recommend.results) {
        rec_movies.push(recommend.results[recs].title);
        rec_movies_org.push(recommend.results[recs].original_title);
        rec_year.push(
          new Date(recommend.results[recs].release_date).getFullYear()
        );
        rec_vote.push(recommend.results[recs].vote_average);
        if (recommend.results[recs].poster_path) {
          rec_posters.push(
            "https://image.tmdb.org/t/p/original" +
              recommend.results[recs].poster_path
          );
        } else {
          rec_posters.push("static/default.jpg");
        }
      }
    },
    error: function (error) {
      alert("Invalid Request! - " + error);
      $("#loader").delay(500).fadeOut();
    },
  });
  return {
    rec_movies: rec_movies,
    rec_movies_org: rec_movies_org,
    rec_posters: rec_posters,
    rec_year: rec_year,
    rec_vote: rec_vote,
  };
}
