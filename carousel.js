// Carousel
class Carousel {
  constructor(settings) {
    this.settings = settings;

    try {
      this.itemClassName = this.settings.class.itemClassName;
    } catch (e) {
      this.itemClassName = "carousel-item";
    }

    try {
      this.displayNo = this.settings.display.number;
    } catch (e) {
      this.displayNo = 1;
    }
    try {
      this.moveAmount = this.settings.rotation.amount;
    } catch (e) {
      this.moveAmount = 1;
    }

    try {
      document.documentElement.style.setProperty(
        "--timingFunction",
        this.settings.rotation.timingFunction
      );
    } catch (e) {}

    try {
      this.duration = this.settings.rotation.duration;

      document.documentElement.style.setProperty(
        "--duration",
        this.settings.rotation.duration + "ms"
      );
    } catch (e) {
      this.duration = 500;
    }

    this.container = document.getElementById(this.settings.id); // The main container
    this.items = this.container.getElementsByClassName(this.itemClassName); // The items of the carousel
    console.log(this.container);
    this.totalItems = this.items.length; // The total number of items

    // Set up circular queue
    this.front = 0;
    this.back = this.displayNo - 1;
    this.elements = [...this.items];

    try {
      if (this.settings.buttons.hide) {
        let buttons = this.container.getElementsByClassName(
          "carousel-button-next"
        );
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = "none";
        }
        buttons = this.container.getElementsByClassName("carousel-button-prev");
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = "none";
        }
      }
    } catch (e) {}

    try {
        if (this.settings.buttons.disableForSingle && this.totalItems === 1) {
            this.duration = 0;
          let buttons = this.container.getElementsByClassName(
            "carousel-button-next"
          );
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "none";
          }
          buttons = this.container.getElementsByClassName("carousel-button-prev");
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "none";
          }
        }
      } catch (e) {}

    this.moving = false; // Stores whether an animation is currently occurring
    for (let i = 0; i < this.displayNo; i++) {
      if (this.items[i]) {
        this.items[i].classList.add("active");
      }
    }

    // Make copies of elements
    if (this.displayNo > this.totalItems) {
        console.log([...this.items].map((item) => {return item.innerText}));
        let index = 0;
        for (let i = 0; i < this.displayNo - this.totalItems; i++) {
          let el = this.elements[index].cloneNode(true);
          //this.items[0].parentNode.insertBefore(el, this.items[0].nextSibling);
          this.container.firstElementChild.appendChild(el);
          index = this.mod(index + 1, this.totalItems);
        }
       
        console.log("added");
        console.log([...this.items].map((item) => {return item.innerText}));
      }


    // Lock the width of the container
    this.container.style.maxWidth = this.container.clientWidth + "px";
    this.container.style.width = "100%";

    // Add next button event listeners
    let next, prev;
    if (this.settings.nextBtnClass) {
      next = document.getElementsByClassName(this.settings.nextBtnClass)[0];
    } else {
      next = document.getElementsByClassName("carousel-button-next")[0];
    }

    if (this.settings.backBtnClass) {
      prev = document.getElementsByClassName(this.settings.backBtnClass)[0];
    } else {
      prev = document.getElementsByClassName("carousel-button-prev")[0];
    }
    if (next) {
      next.addEventListener("click", () => {
        this.moveNext();
      });
    }
    if (prev) {
      prev.addEventListener("click", () => {
        this.movePrev();
      });
    }

    

    // Add rotate time if provided
    let offset, duration, direction;
    try {
      offset = this.settings.display.startOffset;
    } catch (e) {
      offset = 0;
    }
    try {
      duration = this.settings.display.duration;
    } catch (e) {
      duration = 0;
    }
    try {
      if (
        this.settings.display.direction === "right" ||
        this.settings.display.direction === "left"
      ) {
        direction = this.settings.display.direction;
      } else {
        direction = "right";
      }
    } catch (e) {
      direction = "right";
    }
    console.log(offset, duration, direction);
    if (duration > 0) {
      if (direction) {
        if (direction === "right") {
          setTimeout(() => {
            window.setInterval(() => {
              this.moveNext();
            }, duration);
          }, offset);
        } else {
          setTimeout(() => {
            window.setInterval(() => {
              this.movePrev();
            }, duration);
          }, offset);
        }
      }
    }
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  disableInteraction() {
    this.moving = true;
  }

  enableInteraction() {
    this.moving = false;
  }

  moveCarouselLeft(noSteps) {
    // Check if carousel is moving, if not, allow interaction
    if (!this.moving) {
      // temporarily disable interactivity
      this.disableInteraction();

      this.front = this.mod(this.front + noSteps, this.totalItems);
      this.back = this.mod(this.back + noSteps, this.totalItems);

      // Slide all of the elements over
      let moveAmount = 0; //noSteps * this.items[0].offsetWidth;
      for (let i = 0; i < noSteps; i++) {
        moveAmount += this.items[i].offsetWidth;
      }
      document.documentElement.style.setProperty(
        "--moveAmount",
        "-" + moveAmount + "px"
      );

      let diff = this.totalItems - noSteps;

      // Add the missing elements
      let index = this.mod(this.front + diff, this.totalItems);
      for (let i = 0; i < noSteps; i++) {
        let el = this.elements[index].cloneNode(true);
        el.classList.remove("active");
        this.container.firstElementChild.appendChild(el);
        index = this.mod(index + 1, this.totalItems);
      }

      for (let i = 0; i < this.displayNo + noSteps; i++) {
        this.items[i].classList.add("active");
      }

      for (let i = 0; i < this.items.length; i++) {
        this.items[i].classList.add("slide");
      }

      // Wait for animation to end
      setTimeout(() => {
        for (let j = 0; j < this.items.length; j++) {
          this.items[j].classList.remove("slide");
        }

        for (let j = 0; j < noSteps; j++) {
          this.items[0].remove();
        }

        this.enableInteraction();
      }, this.duration + 10);
    }
  }

  moveCarouselRight(noSteps) {
    // Check if carousel is moving, if not, allow interaction
    if (!this.moving) {
      // temporarily disable interactivity
      this.disableInteraction();

      this.front = this.mod(this.front - noSteps, this.totalItems);
      this.back = this.mod(this.back - noSteps, this.totalItems);

      // Slide all of the elements over
      let moveAmount = 0; //noSteps * this.items[0].offsetWidth;
      for (let i = 0; i < noSteps; i++) {
        moveAmount += this.items[i].offsetWidth;
      }
      document.documentElement.style.setProperty(
        "--moveAmount",
        "-" + moveAmount + "px"
      );

      for (let i = 0; i < this.items.length; i++) {
        this.items[i].classList.add("startOffset");
      }

      let index = this.mod(this.front + noSteps - 1, this.totalItems);
      for (let i = 0; i < noSteps; i++) {
        let el = this.elements[index].cloneNode(true);
        el.classList.add("startOffset");
        this.items[0].parentNode.insertBefore(el, this.items[0]);
        index = this.mod(index - 1, this.totalItems);
      }

      for (let i = 0; i < this.displayNo + noSteps; i++) {
        this.items[i].classList.add("active");
      }

      // Wait for animation to end
      setTimeout(() => {
        for (let j = 0; j < this.items.length; j++) {
          this.items[j].classList.remove("slide");
          this.items[j].classList.remove("startOffset");
        }

        // Remove the extra elements
        for (let i = 0; i < noSteps; i++) {
          this.items[this.totalItems].remove();
        }

        this.enableInteraction();
      }, this.duration + 10);
    }
  }

  moveNext() {
    this.moveCarouselRight(this.moveAmount);
  }

  movePrev() {
    this.moveCarouselLeft(this.moveAmount);
  }
}
