
function sketch(p) {
    let innerParticles = [];
    let outerParticles = [];

    // Particle class
    class Particle {
        constructor() {
            this.x = p.random(0, p.width);
            this.y = p.random(0, p.height);
            this.r = p.random(1, 8);
            this.xSpeed = p.random(-2, 2);
            this.ySpeed = p.random(-1, 1.5);
        }

        createParticle() {
            p.noStroke();
            p.fill('rgba(29, 0, 249, 0.5)');
            p.circle(this.x, this.y, this.r * 2);
        }

        moveParticle() {
            if (this.isInInnerBox()) {
                // If the particle is inside the inner box
                if (this.x < 200 || this.x > 520) {
                    this.xSpeed *= -1;
                }
                if (this.y < 100 || this.y > 300) {
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
            }
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }
        checkCollision(other) {
            // Calculate the distance between two particles
            const distanceX = other.x - this.x;
            const distanceY = other.y - this.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // Check if the distance is less than the sum of the radii (collision)
            if (distance < this.r + other.r) {
                // Calculate normal vector and unit normal vector
                const normalX = distanceX / distance;
                const normalY = distanceY / distance;

                // Calculate relative velocity
                const relativeVelocityX = other.xSpeed - this.xSpeed;
                const relativeVelocityY = other.ySpeed - this.ySpeed;

                // Calculate dot product of relative velocity and normal vector
                const dotProduct = relativeVelocityX * normalX + relativeVelocityY * normalY;

                // If the dot product is less than 0, the particles are moving towards each other
                if (dotProduct < 0) {
                    // Calculate the impulse scalar
                    const impulse = dotProduct / 2;

                    // Update the velocities of both particles
                    this.xSpeed += impulse * normalX;
                    this.ySpeed += impulse * normalY;
                    other.xSpeed -= impulse * normalX;
                    other.ySpeed -= impulse * normalY;

                    // Move the particles apart to avoid overlap
                    const overlap = this.r + other.r - distance;
                    const correctionX = overlap * normalX / 2;
                    const correctionY = overlap * normalY / 2;
                    this.x -= correctionX;
                    this.y -= correctionY;
                    other.x += correctionX;
                    other.y += correctionY;
                }
            }
        }

        isInInnerBox() {
            // Assuming inner box dimensions are (200, 100) to (520, 300)
            return this.x > 200 && this.x < 520 && this.y > 100 && this.y < 300;
        }
    }

    p.setup = () => {
        p.createCanvas(720, 400);

        // Create inner particles within the inner box
        for (let i = 0; i < 20; i++) {
            const particle = new Particle();
            particle.x = p.random(200, 520);
            particle.y = p.random(100, 300);
            innerParticles.push(particle);
        }

        // Create outer particles within the outer box (excluding the inner box area)
        for (let i = 0; i < 40; i++) {
            const particle = new Particle();
            let validPosition = false;
            while (!validPosition) {
                particle.x = p.random(0, p.width);
                particle.y = p.random(0, p.height);
                if (
                    (particle.x < 200 || particle.x > 520) ||
                    (particle.y < 100 || particle.y > 300)
                ) {
                    validPosition = true;
                }
            }
            outerParticles.push(particle);
        }
    };

    p.draw = () => {
        p.background('yellow');

        // Draw inner box
        p.stroke(0);
        p.fill(255);
        p.rect(200, 100, 320, 200);

        // Handle inner particles
        for (let i = 0; i < innerParticles.length; i++) {
            const particle = innerParticles[i];
            particle.createParticle();
            particle.moveParticle();

            // Check for collisions with other inner particles
            for (let j = i + 1; j < innerParticles.length; j++) {
                particle.checkCollision(innerParticles[j]);
            }

            // Check if the particle has moved outside the inner box
            if (!particle.isInInnerBox()) {
                outerParticles.push(particle);
                innerParticles.splice(i, 1);
                i--;
            }
        }

        // Handle outer particles
        for (let i = 0; i < outerParticles.length; i++) {
            const particle = outerParticles[i];
            particle.createParticle();
            particle.moveParticle();

            // Check for collisions with other outer particles
            for (let j = i + 1; j < outerParticles.length; j++) {
                particle.checkCollision(outerParticles[j]);
            }

            // Check if the particle has moved inside the inner box
            if (particle.isInInnerBox()) {
                innerParticles.push(particle);
                outerParticles.splice(i, 1);
                i--;
            }
        }
    };
}
