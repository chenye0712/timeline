function  Timeline() { //This is a function statement to define a function		

		var that = this; // assign the original timeline object to that
		var margin = {top: 20, right: 60, bottom: 30, left: 40},
		width = window.innerWidth - margin.left - margin.right,
		height = window.innerHeight*0.6 - margin.top - margin.bottom; //130
		var peopledata=[],date=[],number;
		var person_index=0,activeperson;

        var pic_width=32,pic_height=32;
		var parseDate= d3.time.format("%Y-%m").parse;
		var centerx=width/2;	
		var initial_daterange = [parseDate("2002-01"), parseDate("2017-01")],
			zoomlimit=[parseDate("2000-01"), parseDate("2024-01")];

		var x0 = d3.time.scale()
		    .range([0, width]);

    	x0.domain(initial_daterange);
		x = x0.copy();
	    var y = d3.scale.linear()
	         .range([height, 0]);

	    var color = d3.scale.category10();

	    var xAxis = d3.svg.axis()
	        .scale(x)//.ticks(d3.time.month,3)
	        .orient("bottom");
		

	    var yAxis = d3.svg.axis()
	        .scale(y)
	       .orient("left").ticks(5);

	    var zoom = d3.behavior.zoom().scaleExtent([0.05, 6])
        	.on("zoom", zooming),
        	translate = zoom.translate(),
		 	scale = zoom.scale();

		zoom.x(x);



	Timeline.prototype.draw = function () {  
		d3.csv("pangpang.csv", function(err, pangpang) {
			// var dates =[];		
            	console.log(pangpang);
            	preprocess(pangpang);
            	peopledata=d3.entries(peopledata);
            	drawtimeline(peopledata);
        });

		function drawtimeline(data){
			console.log(peopledata);
			var today = new Date(); 
			
        	//var daterange = [d3.min(newdata, function(d) {return parseDate(d.key);}), parseDate("2016-01")];
        	// var daterange = [parseDate("2003-01"), parseDate("2016-01")];
			var timechart = document.getElementById("timeline");


		    var svg = d3.select("#timeline").append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top+margin.bottom)
		        .append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(zoom);

		    var clip = svg.append("defs").append("clipPath")
		        .attr("id", "clip")
		        .append("rect") 
		        .attr("x", 0)
		        .attr("y", 0)
		        .attr("width", width)
		        .attr("height", 500);

		    var controls = d3.select("#timeline").append('div').style({
		    	"position":"fixed",
		    	"top":"300px"
		    	});

		    controls.append("button").attr("class","control").attr("id","right")
		    		.on("click", function(e){
						d3.event.stopPropagation();
						forward();
					})
        			.append("span").attr("class", "triangle").html("▶");

        	controls.append("button").attr("class","control").attr("id","left")
        			.on("click", function(e){
						d3.event.stopPropagation();
						backward();
					})
        			.append("span").attr("class", "triangle").html("◀");

		    svg.append("rect")
	          .attr("class", "pane")
		      .attr("width", width)
	          .attr("height", 500)
	          .call(zoom);   


		    date = svg.selectAll(".date").data(data);

	        date.enter()
	       	 	.append("g")
	        	.attr("class", "date")
	        	.attr("id",function(d,i){
	        		return i;
	        	})
	        	.attr("transform", function(d) {
	        		// console.log(x(parseDate(d.key)));
	        		return "translate(" + x(parseDate(d.key)) + ",0)";
	        	});
	   		date.exit().remove();
	   		 
	   		svg.append("g")
	            .attr("class", "x axis")
	            .attr("transform", "translate("+0+"," + height+ ")")
	            .call(xAxis);



	        //add info for each startyear    
	        date.each(function(d,i){
	        	var startdate=x(parseDate(d.key)); 
				var people =d3.select(this).selectAll('.person').data(d.value).enter().append("g").attr("class","person");
		
				people.append("svg:image").attr("class","photo")
						.attr("xlink:href", "img/Chen Ye.png")
						.attr("xlink:href", function(d){
							src ="img/" + d.name +".png";
							return src;
						})
						.attr("width", pic_width)
						.attr("height", pic_height)
						.attr("x",  -pic_width/2)
						.attr("y", function(d,i){
							return height-pic_height*1.1*(i+2);
						})
						.on("mouseover", function(d){
							var selectedperson = d3.select(this);
							var posX=selectedperson.attr("x"),posY=selectedperson.attr("y");
							
			                var	ofs_top=10,
			                	ofs_left=0;
							// selectedperson
							// .transition().duration(500)
							// .attr("transform","translate(0,-100)");
							d3.select(this.parentNode).select('.extension').style("display","inline");
							d3.select(this.parentNode).select('.sign').style("display","inline");
							d3.select(this.parentNode).select('.tooltip').style("display","inline");

						})
						.on("mouseleave", function(d){
							var selectedperson = d3.select(this.parentNode);
							if (!selectedperson.classed("active"))
							{
								d3.select(this.parentNode).select('.extension').style("display","none");
								d3.select(this.parentNode).select('.sign').style("display","none");
								d3.select(this.parentNode).select('.tooltip').style("display","none");
							}
							selectedperson
							.transition().duration(500)
							.attr("transform","translate(0,0)");

						// $(this).css({width:'32px', height:'32px'});
						})
						.on("click", function(d){
							d3.event.stopPropagation();
							console.log("selected");
							var selectedperson = d3.select(this.parentNode);
							activeperson = this.parentNode;
							d.active=true;
							selectedperson.classed("active",true);
						
							console.log(selectedperson);
		
						
						});


				people.append('line').attr("class","sign")
							.attr('x1', 0)
							.attr("x2", 0)
							.attr("y1", height)
							.attr("y2", height-40)
							.style({
								"stroke-width":"1px",
								"stroke":"steelblue",
								"display":"none"
							});

				people.append('circle')
						.attr("cy", height)
						.attr("r", 1)
						.attr("stroke", "black");
						
				var tooltips = people.append('g').attr("class",'tooltip')
						.attr("transform", function(d){
							var cy=d3.select(this.parentNode).select('image').attr("y");
		
							return "translate(16," + cy+ ")";
						})
						.style("display","none");

				tooltips.append('rect')
						.attr({
							"height":50,
							"width":100,
							"fill":"steelblue"
						});
				tooltips.append('text').attr("class","description")
						.text(function(d){
							return d.name;
						})
						.attr("transform", function(d){
							return "translate(0," + 20+ ")";
						})
						.style({
							"display":"inline",
		                     "position":"relative"
						});



				people.append('circle').attr("class","extension").style("display","none")
						.attr("cx", function(d){ 
							if(d.endyear ==="current") return x(today);
							else return x(parseDate(d.endyear)); 
						})
						.attr("cy", height-pic_height/2)
						.attr("r", 10)
						.attr("fill", "green");

		
				});//end of person each

	        $('html').click(function(e) {
		       console.log("clear");
		       d3.select('.date').classed("active",false);
		       
		    });

		}// end of draw

		function preprocess(data){
			var dates=[];
			number = data.length;
			data.forEach(function(d){
				if (dates.indexOf(d.startyear)==-1) {dates.push(d.startyear); peopledata[d.startyear] =[];}
				var person ={name:d.name, degree:d.degree, endyear:d.endyear};
				peopledata[d.startyear].push(person);

			})
		}

		function updatedegree(){
			var offset_height;

			d3.selectAll(".person").transition().duration(500)
				.attr("transform", function(d){
					if (d.degree==="phd") offset_height = -100
					else if(d.degree ==="master") offset_height= -50
					else {offset_height=-20;d.actve =true;}

					return "translate(0," + offset_height+ ")";
				});
			d3.selectAll('.sign')
				.attr("y2", height)
				.style("stroke-width", "1px").style("stroke","red");
		         
		}

		function forward(){
			var people = d3.selectAll('.person');

				console.log(number);
				people.each(function(d,i){
					if(d.active) {
						if (person_index < number-1) person_index =i+1
						d.active=false;
					}
				});
				people.each(function(d,i){
					if(i===person_index) {
						d.active=true;	
					}
				});
	
			console.log(person_index,peopledata);
			d3.selectAll(".tooltip").style("display",function(d){
				if(d.active) return "inline"
				else return "none"
			})
			d3.selectAll(".sign").style("display",function(d){
				if(d.active) return "inline"
				else return "none"
			})

		}

		function backward(){
			var people = d3.selectAll('.person');
			people.each(function(d,i){
				if(d.active) {
					console.log(d,i);
					if (person_index >0) person_index =i-1;
					d.active=false;
				}
			});
			people.each(function(d,i){
				if(i===person_index) {
					d.active=true;
				}
			});

			d3.selectAll(".tooltip").style("display",function(d){
				if(d.active) return "inline"
				else return "none"
			})

		}


	}//end of draw

	Timeline.prototype.play=function(activeperson){
		var translate = zoom.translate(),
		 	scale = zoom.scale();
  			xd = x0.domain(); //original domain
  		console.log(activeperson);
		//zoom.translate([zoom.translate()[0] - x(zoomlimit[0]) + x.range()[0], zoom.translate()[1]]);

		var activedata = activeperson.data();
		console.log(activedata);
		var activedate = parseDate(activedata.key); //the date at the center position
		var one_day=1000*60*60*24;
		var shift = (x0.invert(centerx).getTime()-activedate.getTime())/one_day;


		xd[0]=d3.time.day.offset(xd[0],-shift);
		xd[1]=d3.time.day.offset(xd[1],-shift);
		console.log(shift,translate,scale);
		// var newdaterange = [parseDate(activedata[0].key), parseDate("2017-01")];
	    x.domain(xd); //
	    zoom.x(x.domain(xd)); //reassign the scale to zoom
	   
		d3.select(".x.axis").transition().duration(500).call(xAxis); // need to call this to update the axis
	    d3.selectAll(".date").transition().duration(500).attr("transform", function(d) {
    		return "translate(" + (x(parseDate(d.key))) + ",0)";
    	});
		
	} // end of  play

		
	Timeline.prototype.forward=function(){
		console.log(activeperson);
  			xd = x0.domain();

		var activedata = activeperson.data();
		var activedate = parseDate(activedata[0].key); //the date at the center position
		var one_day=1000*60*60*24;
		var shift = (x0.invert(centerx).getTime()-activedate.getTime())/one_day;


		xd[0]=d3.time.day.offset(xd[0],-shift);
		xd[1]=d3.time.day.offset(xd[1],-shift);
		console.log(shift,translate,scale);
		// var newdaterange = [parseDate(activedata[0].key), parseDate("2017-01")];
	    x.domain(xd); //
	    zoom.x(x.domain(xd)); //reassign the scale to zoom
	   
		d3.select(".x.axis").transition().duration(500).call(xAxis); // need to call this to update the axis
	    d3.selectAll(".date").transition().duration(500).attr("transform", function(d) {
    		return "translate(" + (x(parseDate(d.key))) + ",0)";
    	});
		
	} // end of next

	function zooming(){
		//call the zoom.translate vector with the array returned from panLimit
		var translate = zoom.translate(),
		scale = zoom.scale();
		xd = x.domain(); 

		console.log(zoom.translate(),zoom.scale(),xd);
		if ((x.domain()[0] < zoomlimit[0])&& (x.domain()[1] > zoomlimit[1])){
		
		  zoom.translate([zoom.translate()[0] - x(zoomlimit[0]) + x.range()[0], zoom.translate()[1]]);
		} else if (x.domain()[1] > zoomlimit[1]) {
		  zoom.translate([zoom.translate()[0] - x(zoomlimit[1]) + x.range()[1], zoom.translate()[1]]);
		}

        d3.selectAll(".x.axis").call(xAxis);
        d3.selectAll(".date").attr("transform", function(d) {
    		return "translate(" + x(parseDate(d.key)) + ",0)";
    	});
    }

    function panLimit(){

    }

}
