<template>
  <v-card>
    <v-card-text>
      <v-btn @click="colorActual = '#623815'">café</v-btn>
      <v-btn @click="colorActual = '#621561'">purpura</v-btn>
      <v-btn @click="colorActual = '#366215'">verde</v-btn>
      <v-btn @click="strokeWidthActual = 5">5</v-btn>
      <v-btn @click="strokeWidthActual = 10">10</v-btn>
      <canvas class="cnvR" ref="canvas" width="1024" height="1024"></canvas>
    </v-card-text>
  </v-card>
</template>

<script>
import paper from 'paper/dist/paper-core'
export default {
  data() {
    return {
      colorActual: '#621561',
      strokeWidthActual: 5,
      x: -1,
      y: -1
    }
  },
  methods: {
    mousemoveCanvas(event) {
    }
  },
  mounted() {
    let vm = this

    var canvas = this.$refs.canvas



    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    paper.view.onResize = function (event) {
    }

    //canvas.setAttribute("resize", "true")
    let scale = canvas.scrollWidth / 1024

    var tool = new paper.Tool()

    var path;

    var rectangle = new paper.Rectangle(new paper.Point(0, 0), new paper.Point(canvas.width, canvas.height));
    path = new paper.Path.Rectangle(rectangle);
    path.strokeColor = '#623815'
    path.strokeWidth = 20 * scale
    path.fillColor = '#FFF';

    var textItem = new paper.PointText({
      content: 'Click and drag to draw a line.',
      point: new paper.Point(20, 30),
      fillColor: 'black',
    });

    var p1 = ["Path",{"applyMatrix":true,"opacity":0.95,"segments":[[[805.31525,413.07119],[0,0],[6.36016,0]],[[826.14237,411.91412],[-7.64562,0],[0,0]]],"strokeColor":[0.21176,0.38431,0.08235],"strokeWidth":5,"strokeJoin":"round"}]






    console.log(scale)

    let ns = []
    let index = 0
    p1[1].segments.forEach(s => {
      ns.push([])
      s.forEach(sb => {
        ns[index].push([sb[0] * scale, sb[1] * scale])
      });
      index++
    });

    p1[1].segments = ns
    p1[1].strokeWidth *= scale

    paper.project.activeLayer.importJSON(JSON.stringify(p1))

    var p2 = ["Path",{"applyMatrix":true,"opacity":0.95,"segments":[[[114.66252,297.80404],[0,0],[0,-18.44484]],[[141.73561,246.84292],[-9.17998,14.12304],[15.56975,-23.95346]],[[191.1042,175.17885],[-23.0136,18.41088],[53.54744,-42.83795]],[[361.50544,208.62208],[-42.15248,-42.15248],[83.71738,83.71738]],[[391.76361,579.68274],[-134.15583,-100.61687],[30.28208,22.71156]],[[492.09331,614.71851],[-36.52561,-7.30512],[121.0764,24.21528]],[[791.48989,487.31571],[-60.11593,112.71736],[14.4417,-27.07819]],[[816.97045,414.0591],[0,30.50601],[0,0]]],"strokeColor":[0.38431,0.08235,0.38039],"strokeWidth":5,"strokeJoin":"round"}]

    let ns2 = []
    index = 0
    p2[1].segments.forEach(s => {
      ns2.push([])
      s.forEach(sb => {
        ns2[index].push([sb[0] * scale, sb[1] * scale])
      });
      index++
    });

    p2[1].segments = ns2
    p2[1].strokeWidth *= scale

    paper.project.activeLayer.importJSON(JSON.stringify(p2))

    var p3 = ["Path",{"applyMatrix":true,"opacity":0.95,"segments":[[[588.94798,379.56069],[0,0],[-3.34011,0]],[[572.67052,407.6763],[2.75637,-4.96146],[-11.75067,21.1512]],[[572.67052,494.98266],[-24.86585,-18.64939],[6.4178,4.81335]],[[594.86705,508.30058],[-5.00811,-5.00811],[0,0]]],"strokeColor":[0.21176,0.38431,0.08235],"strokeWidth":10,"strokeJoin":"round"}]

    let ns3 = []
    index = 0
    p3[1].segments.forEach(s => {
      ns3.push([])
      s.forEach(sb => {
        ns3[index].push([sb[0] * scale, sb[1] * scale])
      });
      index++
    });

    p3[1].segments = ns3
    p3[1].strokeWidth *= scale

    paper.project.activeLayer.importJSON(JSON.stringify(p3))



    // Define a mousedown and mousedrag handler
    tool.onMouseDown = function (event) {
      if (path) {
        path.selected = false;
      }

      console.log('inicio')
      console.log(scale)
      console.log(vm.strokeWidthActual)
      console.log(vm.strokeWidthActual.toFixed(2) * scale)
      console.log('fin')


      // Create a new path and set its stroke color to black:
      path = new paper.Path({
        segments: [event.point],
        strokeColor: vm.colorActual,
        strokeWidth: vm.strokeWidthActual * scale,
        strokeJoin: 'round',
        opacity: 0.95
      });
    }


    tool.onMouseDrag = function (event) {
      path.add(event.point);

      // Update the content of the text item to show how many
      // segments it has:
      textItem.content = 'Segment count: ' + path.segments.length;
    }

    tool.onMouseUp = function (event) {
      var segmentCount = path.segments.length;

      // When the mouse is released, simplify it:
      path.simplify(10);

      // Select the path, so we can see its segments:
      //path.fullySelected = true;

      var newSegmentCount = path.segments.length;
      var difference = segmentCount - newSegmentCount;
      var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
      textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';



      console.log(path)

      var copy = path.clone();

      // Scale the copy by 50%:
      copy.scale(1.0 / scale, new paper.Point(0, 0))
      copy.strokeWidth *= 1.0 / scale



      let jsonp = path.exportJSON()
      let json = copy.exportJSON()
      console.log(jsonp)
      console.log(json)

      copy.remove()


    }
  }
}
</script>


<style type="text/css">
/* Scale canvas with resize attribute to full size */
.cnvR {
  width: 100%;
  height: 100%;
}
</style>
