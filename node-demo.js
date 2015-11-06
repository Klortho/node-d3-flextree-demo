#!/usr/bin/env node

var d3 = require('./d3-flextree.js'),
    document = require("jsdom").jsdom();

// Example tree
var tree = {
  w:        70,
  h:        70,
  val:      0.1,
  children: [
    {
      w:        200,
      h:        200,
      val:      0.25,
      children: [
        {
          w:        70,
          h:        70,
          val:      0.89,
          children: []
        },
        {
          w:        100,
          h:        100,
          val:      1.0,
          children: []
        }
      ]
    },
    {
      w:        40,
      h:        40,
      val:      0.54,
      children: [
        {
          w:        10,
          h:        10,
          val:      0.75,
          children: []
        }
      ]
    },
  ]
};

var level_spacing = 20;
var engine = d3.layout.flextree()
  .nodeSize(function(t) {
    return [t.h, t.w + level_spacing];
  })
  .spacing(function() { return 20; });
var g = d3.select(document.body).html('').append('svg').append('g');

// nodes
var nodes = engine(tree);
var ns = g.selectAll(".node").data(nodes).enter();
ns.append("circle")
  .attr({
    cx: function(n) { return n.x; },
    cy: function(n) { return n.y + n.h/2; },
    r: function(n) { return n.w/2; },
    stroke: "black", 
    "stroke-width": 1,
  })
  .style("fill", 
    function(n) { return "hsl(" + (n.val*216) + ", 82.1%, 32.9%)"; });
ns.append("text")
  .attr({
    "alignment-baseline": "middle",
    "text-anchor": "middle",
    x: function(n) { return n.w/2; },
    y: function(n) { return n.h/2; },
    fill: "black",
  })
  .text(function(n) { return n.label; });

// links
var links = engine.links(nodes);
var diagonal = d3.svg.diagonal()
  .source(function(d, i) {
    var s = d.source;
    return { x: s.x, y: s.y + s.h };
  })
  .projection(function(d) { return [d.x, d.y]; });
g.selectAll(".link").data(links)
  .enter().append("path")
    .attr({
      d: diagonal,
      stroke: "black",
      fill: "transparent",
    });

console.log(document.body.innerHTML);
