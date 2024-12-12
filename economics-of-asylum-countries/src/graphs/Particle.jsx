import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { incoming_refugee_data, outgoing_refugee_data, population_data } from "../utils/data_parser";
import { countryState } from "../context/CountryProvider";

function sketch(p, year, ID){

    let innerBoxParticles = [];
    let outerBoxParticles = [];

    // Particle class
    class Particle {
        constructor(isInnerBox = false, isIncomingRefugee = false) {
            this.isInnerBox = isInnerBox;
            this.isIncomingRefugee = isIncomingRefugee;
            this.x = isInnerBox
                ? p.random(200, 720)
                : p.random(0, p.width);
            this.y = isInnerBox
                ? p.random(100, 550)
                : p.random(0, p.height);
            this.r = 6;
            this.xSpeed = p.random(-2, 2);
            this.ySpeed = p.random(-1, 1.5);
            this.color = isIncomingRefugee ? 'purple' : 'rgba(16, 0, 141, 0.5)';
            if (!this.isInnerBox) {
                this.color = 'red';
            }
        }

        createParticle() {
            p.noStroke();
            p.fill(this.color);
            if (this.isIncomingRefugee) {
                p.square(this.x, this.y, this.r * 2); // Draw square for incoming refugees
            } else {
                p.circle(this.x, this.y, this.r * 2); // Draw circle for regular population
            }
        }

        moveParticle() {
            if (this.isInnerBox) {
                // If the particle is inside the inner box
                if (this.x < 200 || this.x > 720) {
                    this.xSpeed *= -1;
                }
                if (this.y < 100 || this.y > 550) {
                    this.ySpeed *= -1;
                }
            } else {
                // If the particle is outside the inner box
                if (this.x < 0 || this.x > p.width) {
                    this.xSpeed *= -1;
                }
                if (this.y < 0 || this.y > p.height) {
                    this.ySpeed *= -1;
                }
                if(this.x  == 200 || this.x == 720 || this.y == 100 || this.y == 550){
                    if (this.x == 200 || this.x == 720) {
                        this.xSpeed *= -1;
                    }
                    if (this.y == 100 || this.y == 550) {
                        this.ySpeed *= -1;
                    }
                }
            }
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }
    }

    const populationFactor = 0.000001;
    const refugeeMultiplier = 100000;
    const incomingRefugeePercentage = 1;

    p.setup = () => {
        p.createCanvas(920, 650);
        console.log(2024-year);
        const shownYear = 2020-year >= 0?  2020-year: 20;
        var totalPopulation = population_data[ID][shownYear];
        var scaledTotalPopulation = Math.floor(population_data[ID][shownYear] * populationFactor);
        console.log("tot pop", scaledTotalPopulation);
        var incomingRefugees = Math.floor(incoming_refugee_data[year][ID]);
        var outgoingRefugees = Math.floor(outgoing_refugee_data[year][ID].Count);
        var totalRefugees = incomingRefugees + outgoingRefugees;
        var normalizedRefugees = totalRefugees / totalPopulation;
        var scaledRefugeeParticles = Math.floor(normalizedRefugees * refugeeMultiplier);
        // var incomingRefugeeParticles = Math.floor(incomingRefugees / totalRefugees * scaledRefugeeParticles * incomingRefugeePercentage);
        var incomingRefugeeParticles = Math.floor(incomingRefugees/totalRefugees * 100);
        console.log(scaledTotalPopulation, incomingRefugeeParticles, scaledRefugeeParticles);
        
        innerBoxParticles = Array(scaledTotalPopulation).fill().map(() => new Particle(true, false));
        incomingRefugeeParticles = Array(incomingRefugeeParticles).fill().map(() => new Particle(true, true));
        innerBoxParticles = [...innerBoxParticles, ...incomingRefugeeParticles];

        // console.log(scaledRefugeeParticles);
        outerBoxParticles = Array(scaledRefugeeParticles).fill().map(() => new Particle(false, false));
    };

    p.draw = () => {
        p.background('black');
        p.stroke(0); // Set stroke color to black
        p.noFill(); // No fill color for the outer box border
        p.rect(0, 0, p.width, p.height); // Draw the outer box border
        // Draw inner box
        p.stroke(0);
        p.fill("grey"); 
        p.rect(200, 100, 520, 450); // Bigger rectangle

        // Handle particles inside the inner box
        for (const particle of innerBoxParticles) {
            particle.createParticle();
            particle.moveParticle();
        }

        // Handle particles outside the inner box
        for (const particle of outerBoxParticles) {
            particle.createParticle();
            particle.moveParticle();
        }
        // Draw legend
        p.stroke(0);
        p.fill(255); // white color
        p.rect(15, 20, 160, 100); // Draw the box

        const shapeSize = 12;
        const spacing = 20;
        const legendX = 30;
        const legendY = 50;

        p.fill('rgba(16, 0, 141, 0.5)');
        p.circle(legendX, legendY, shapeSize); // Normal population
        p.fill(0);
        p.text("Normal population", legendX + shapeSize + 10, legendY + 5);

        p.fill('purple');
        p.square(legendX -5, legendY + spacing - 5, shapeSize); // Incoming refugees
        p.fill(0);
        p.text("Incoming refugees", legendX + shapeSize + 10, legendY + spacing + 5);

        p.fill('red');
        p.circle(legendX, legendY + 2 * spacing + 5, shapeSize); // Outgoing refugees
        p.fill(0);
        p.text("Outgoing refugees", legendX + shapeSize + 10, legendY + 2 * spacing + 10);
    };
    
}

const Particle = () => {
    const { year, ID} = countryState();
   
    if (
       
        !incoming_refugee_data ||
        !incoming_refugee_data[year] ||
        !incoming_refugee_data[year][ID] ||
        !outgoing_refugee_data ||
        !outgoing_refugee_data[year] ||
        !outgoing_refugee_data[year][ID] ||
        !outgoing_refugee_data[year][ID].Count
    ) {
        return <h1>No data is present</h1>;
    }

    return <ReactP5Wrapper sketch={(p) => sketch(p, year, ID)} />;
};
export default Particle;