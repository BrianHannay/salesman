"use strict";

var distances = {
 a:{
 	 a: 0,
     b: 20,
     c: 100,
     d: 70,
     e: 90,
     f: 50,
     g: 5000
   },
 b:{
 	 b: 0,
     c: 300,
     d: 50,
     e: 80,
     f: 30,
     g: 5000
   },
 c:{
 	 c: 0,
     d: 400,
     e: 600,
     f: 200,
     g: 5000
   },
 d:{
 	 d: 0,
     e: 50,
     f: 40,
     g: 10
   },
 e:{
 	 e: 0,
     f: 20,
     g: 5000
   },
 f:{
 	 f: 0,
     g: 5000
   },
  g:{

  }
}

var options = ["a", "b", "c", "d", "e", "f", "g"];
function getDist(start, end){
	if(start == end){
		return 0;
	}
	if(typeof distances[start][end] == "undefined"){
		return distances[end][start];
	}
	else{
		return distances[start][end];
	}
}




var activePaths = [];
var solution;
function solve(start, end){
	solution = {
		start: start,
		end: start,
		length: 9999999999,
		uses: start,
		path: "start -> " + start
	};
	for (var i = 0; i < options.length; i++) {
		solution = link(solution, options[i]);
	}
	solution = link(solution, end); // must go to end
	activePaths.push({
		start: null,
		end: start,
		length: 0,
		uses: start,
		path: ""
	});
	while(activePaths.length != 0){
		addPermutations();
		findBest();
		while(eliminateFailures());
	}
	return solution;
}

function findBest(){
	for (var i = 0; i < activePaths.length; i++) {
		if(activePaths[i].length < solution.length && isComplete(activePaths[i])){
			solution = activePaths[i];
		}
	}
}

function isComplete(path){	
	if(path.end != "a"){
			return false;
	}
	for(var i=0; i<options.length; i++){
		//if there is an option that the path doesn't use,
		if(-1 === path.uses.indexOf(options[i])){
			return false; // this isn't a solution.
		}
	}
	return true;
}

var permutesAdded = 0;
function addPermutations(){
	var maxDist = 0;
		//copy of activePaths;
	var before = activePaths.slice();
	activePaths = [];
	
	var result = [];

	for(var i=0; i<before.length; i++){
		for(var j=0; j<options.length; j++){
			if(before[i].end == options[j] || before[i].length + getDist(options[j], "a") + getDist(before[i].end, options[j]) > solution.length){
				continue;
			}
			var possibleResult = link(before[i], options[j]);
			activePaths.push(possibleResult);
			if(possibleResult.length > maxDist) maxDist = possibleResult.length;
		}		
	}
}

function link(path, toNode){
	return {
		start: path.start,
		end: toNode,
		length: path.length + getDist(path.end, toNode),
		uses: path.uses + toNode,
		path: path.path + ", " + path.end + " -> " + toNode
	};
}

var place = 0;
function eliminateFailures(){
	for(var i=place; i<activePaths.length; i++){
		//delete all activePaths in a row that are too long
		if(activePaths[i].length + getDist(activePaths[i].end, "a") >= solution.length){
			console.log("Killed: ", activePaths.pop(i));
			//there may be more to remove
			place = i;
			return true;
		}
	}
	//all done!
	var place = 0;
	return false;
}
console.log(solve("a","a"));