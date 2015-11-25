function  Timeline() { //This is a function statement to define a function		

		var that = this; // assign the original timeline object to that
		var margin = {top: 20, right: 60, bottom: 30, left: 30},
		width = window.innerWidth - margin.left - margin.right,
		height = window.innerHeight*0.6 - margin.top - margin.bottom; //130
		var people=[],date=[];
		var person_index=0;

        var pic_width=32,pic_height=32;
		var parseDate= d3.time.format("%Y-%m").parse;
		var centerx=width/2;	
		var initial_daterange = [parseDate("2003-01"), parseDate("2016-01")],
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
            	preprocess(pangpang)
            	drawtimeline(people);
        });



		function drawtimeline(data){


			var today = new Date(); 
			
			var newdata=d3.entries(data);
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

		    svg.append("rect")
	          .attr("class", "pane")
		      .attr("width", width)
	          .attr("height", 500)
	          .call(zoom);   


		    date = svg.selectAll(".date").data(newdata);

	        date.enter()
	       	 	.append("g")
	        	.attr("class", "date")
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

				people.append('circle')
						.attr("cy", height)
						.attr("r", 6)
						.attr("stroke", "black")
						.on("click",function(d){
							d3.select(this.parentNode.parentNode).classed("active", true);
							that.play(this.parentNode.parentNode); // assign active date to play event
						});
				people.append('div').attr("class",'tooltip');



				people.append('circle').attr("class","extension").style("display","none")
						.attr("cx", function(d){ 
							if(d.endyear ==="current") return x(today);
							else return x(parseDate(d.endyear)); 
						})
						.attr("cy", height-pic_height/2)
						.attr("r", 10)
						.attr("fill", "green");


				d3.selectAll('.photo')
					.on("mouseover", function(d){
						var selectedperson = d3.select(this);
						var posX=selectedperson.attr("x"),posY=selectedperson.attr("y");
						d3.select(this).attr({
							width:'64px', 
							height:'64px'
						});
						
		                var	ofs_top=10,
		                	ofs_left=0;
		                console.log(selectedperson.attr("x"));
		                d3.select("#timeline .tooltip")
		                    .style({
		                        display: "block",
		                        position: "absolute",
		                        top: height+10+"px",
		                        left: posX+"px"
		                    })
		                    .html(function () {
		                        return d.name +"<br>balabalbabal";
		                    });
						// d3.select(this).transition().duration(500) 
						// 	.attr("transform", function(d){
						// 	return "translate(-16," + -pic_height+ ")";
						// });
						d3.select(this.parentNode).select('.extension').style("display","inline");
					})
					.on("mouseout", function(d){
						d3.select(this)
							.attr("transform", function(d){
							return "translate(0," + 0+ ")";
						});
						d3.select(this.parentNode).select('.extension').style("display","none");
						// $(this).css({width:'32px', height:'32px'});
						d3.select("#timeline .tooltip").style("display", "none");
					});


				// d3.selectAll('.photo').append('circle').attr("class","extension").style("display","none")
				// 		.attr("cx", function(d){ 
				// 			if(d.endyear ==="current") return x(today);
				// 			else return x(parseDate(d.endyear)); 
				// 		})
				// 		.attr("cy", height-pic_height/2)
				// 		.attr("r", 10)
				// 		.attr("fill", "green");

					// d3.select(this).append('path').attr("class","timerange").attr("d", function(d) { return path(d); } );

					// d3.select(this).append("text").text(function(d){return d.name})
					// 	.attr("x", function(d) {
					// 		return x(parseDate(d.startyear))+pic_width/2; 
					// 	})
					// 	.attr("y", height-cy);sese

					// d3.select(this).append('line').attr("class","sign")
					// 	.attr('x1', function(d){return x(parseDate(d.startyear)); })
					// 	.attr("x2", function(d){return x(parseDate(d.startyear)); })
					// 	.attr("y1", height)
					// 	.attr("y2", height-cy)
					// 	.style("stroke-width", "1px").style("stroke","steelblue");
				});//end of person each


		}

		function preprocess(data){
			var dates=[];
			data.forEach(function(d){
				if (dates.indexOf(d.startyear)==-1) {dates.push(d.startyear); people[d.startyear] =[];}
				var person ={name:d.name, degree:d.degree, endyear:d.endyear};
				people[d.startyear].push(person);

			})
		}


		function path(d){

		}

		function updatedegree(){
			var offset_height;

			d3.selectAll(".person").transition().duration(500)
				.attr("transform", function(d){
					if (d.degree==="phd") offset_height = -100
					else if(d.degree ==="master") offset_height= -50
					else {offset_height=-20;d.active =true;}

					return "translate(0," + offset_height+ ")";
				});
			d3.selectAll('.sign')
				.attr("y2", height)
				.style("stroke-width", "1px").style("stroke","red");
		         
		}

		function updatestatus(){
			var offset_height;

			d3.selectAll(".person").transition().duration(500)
				.attr("transform", function(d){
					if (d.current==="true") offset_height = -100
					else offset_height=-20
					return "translate(0," + offset_height+ ")";
				});
			d3.selectAll('.sign')
				.attr("y2", height)
				.style("stroke-width", "1px").style("stroke","black");
	         
		}

	}//end of draw

	Timeline.prototype.play=function(activeperson){
		var translate = zoom.translate(),
		 	scale = zoom.scale();
  			xd = x0.domain(); //original domain
  		if (person_index <8) person_index += 1 
  			else person_index =0

		//zoom.translate([zoom.translate()[0] - x(zoomlimit[0]) + x.range()[0], zoom.translate()[1]]);

		var activedata = d3.select(activeperson).data();
		var activedate = parseDate(activedata[0].key); //the date at the center position
var one_day=1000*60*60*24;
var shift = (x0.invert(centerx).getTime()-activedate.getTime())/one_day;


		xd[0]=d3.time.day.offset(xd[0],-shift);
		xd[1]=d3.time.day.offset(xd[1],-shift);
		console.log(shift,translate,scale);
		// var newdaterange = [parseDate(activedata[0].key), parseDate("2017-01")];
	    x0.domain(xd); //
	    zoom.x(x.domain(xd)); //reassign the scale to zoom
	    var whatever = x0.range().map(function(x) { return (x - translate[0]) / scale; }).map(x0.invert); //not sure but probably need this
console.log(translate,scale,whatever,xd);

		d3.select(".x.axis").transition().duration(500).call(xAxis); // need to call this to update the axis
	    d3.selectAll(".date").transition().duration(500).attr("transform", function(d) {
    		return "translate(" + (x(parseDate(d.key))) + ",0)";
    	});
		
	} // end of  play

		
	Timeline.prototype.forward=function(){

  			// xd = x0.domain();
  		if (person_index <8) person_index += 1 
  			else person_index =0
		// var offset_height;
		// var currentx= d3.transform(d3.select(this).attr("transform")).translate[0];

		console.log(zoom.translate(),zoom.scale());

		var activeperson= date[0][person_index];
		var activedata = d3.select(activeperson).data();
		console.log(activedata[0].value[0].name);

		var newdaterange = [parseDate(activedata[0].key), parseDate("2017-01")];
	    x0.domain(newdaterange);
	    zoom.x(x.domain(newdaterange)); //reassign the scale to zoom
	    // x.domain(x0.range().map(function(x) { return (x - translate[0]) / scale; }).map(x0.invert)); not sure but probably need this

		d3.select(".x.axis").transition().duration(500).call(xAxis); // need to call this to update the axis
	    d3.selectAll(".date").transition().duration(500).attr("transform", function(d) {

    		return "translate(" + (x(parseDate(d.key))) + ",0)";
    	});
	} // end of next

	Timeline.prototype.backward=function(){

  			// xd = x0.domain();
  		if (person_index <0) person_index = 8
  			else person_index -=1
		// var offset_height;
		// var currentx= d3.transform(d3.select(this).attr("transform")).translate[0];

		var activeperson= date[0][person_index];
		var activedata = d3.select(activeperson).data();
		console.log(activedata[0].value[0].name);

		var newdaterange = [parseDate(activedata[0].key), parseDate("2017-01")];
	    x0.domain(newdaterange);
	    zoom.x(x.domain(newdaterange)); //reassign the scale to zoom
	    // x.domain(x0.range().map(function(x) { return (x - translate[0]) / scale; }).map(x0.invert)); not sure but probably need this

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
