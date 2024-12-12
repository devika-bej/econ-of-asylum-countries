// used in the particles visualisation

export default function sketch(p){
    let canvas;

    p5.setup = () => {
      canvas = p5.createCanvas(300, 200);
      p5.noStroke();
    }

    p5.draw = () => {
      p5.background('orangered');
      p5.ellipse(150, 100, 100, 100);
    }

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p5.fill(newProps.color);
    }
}