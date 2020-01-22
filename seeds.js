var mongoose = require('mongoose');
var Campground = require('./models/campground');


var data = [
	{
		name: "clouds rest", 
		image: "https://dailygazette.com/sites/default/files/styles/article_image/public/180702d.jpg?itok=6L_qDMLP",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto iure voluptatum quisquam obcaecati officiis repellat harum odio possimus itaque, delectus cum, rem consequuntur maxime quibusdam dolor ratione, eum corrupti necessitatibus?"
	},
	{
		name: "desert mesa", 
		image: "https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis blanditiis quis qui provident error aliquam, sequi corporis voluptates eligendi ipsa, pariatur odio, iusto cumque sed nostrum placeat. Voluptatibus, doloremque, perspiciatis!"
	},
	{
		name: "canyon floor", 
		image: "https://acadiamagic.com/940x366/campground-1301.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus magnam, obcaecati ullam optio qui culpa hic, adipisci omnis. Ex provident id pariatur non iusto deserunt, nam molestiae quas! Vero, ut."
	}
]

function seedDB(){
	// Remove all campgrounds
	Campground.remove({}, function(err){
		if (err) {
			console.err(err);
		} else {
			console.log("removed campgrounds");
			
			// add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if (err) {
						console.err(err);
					} else {
						console.log("added a campground");
						// create a comment
						// Comment.create({
						// 		text: "this place is great",
						// 		author: "homer"
						// }, function(err, comment){
						// 		if (err) {
						// 			console.err(err);
						// 		} else {
						// 			campground.comments.push(comment);
						// 			campground.save();
						// 			console.log("created new comment");
						// 		}
						// });
					}
				});
			});
		}
	});

	// add a few comments
}

module.exports = seedDB;