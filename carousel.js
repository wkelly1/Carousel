/**
 * Carousel-slideshow library
 * https://www.npmjs.com/package/carousel-slideshow
 * Initial work: Will Kelly - https://github.com/wkelly1
 */
class Carousel {
  constructor(settings) {
    this._settings = settings;

    if (!this._initializeSettings(this._settings)) {
      throw "Missing required settings";
    }

    this._setInitialSettings(this._settings);
    this._addButtonEventListeners();
    //this._addAutoRotationCallbacks();
    this._startInterval();

    window.onresize = () => {
      this._handleResizing();
    };
  }

  _initializeSettings(settings) {
    let defaults = {
      rotation: {
        amount: 1, // How many elements it moves per rotation
        timingFunction: "ease-in-out", // Timing function of the movement
        duration: 500, // How long the movement takes
      },
      buttons: {
        hide: false, // Whether to hide the buttons
        disableForSingle: false, // Disables the buttons when there is only one element in the carousel
      },
      display: {
        number: 5, // Number of elements to display at a time,
        duration: 0, // If specified then the carousel will rotate every time that number of milliseconds has elapsed
        startOffset: 0, // Waits this long before auto rotating,
        direction: "left", // The direction to move the carousel either left or right
      },
      class: {
        itemClassName: "carousel-item", // Used if you have altered the class for an item
      },
      fit: {
        fitToChildren: true,
        fitToParent: false,
      },
    };

    // Check that the object contains the required values
    if (settings.id === undefined) {
      return false;
    } else {
      this._id = settings.id;
    }

    // Check for other settings and set to default if not provided
    if (settings.rotation === undefined) {
      this._moveAmount = defaults.rotation.amount;
      this._duration = defaults.rotation.duration;
      this._timingFunction = defaults.rotation.timingFunction;
    } else {
      if (settings.rotation.amount === undefined) {
        this._moveAmount = defaults.rotation.amount;
      } else {
        this._moveAmount = settings.rotation.amount;
      }

      if (settings.rotation.duration === undefined) {
        this._duration = defaults.rotation.duration;
      } else {
        this._duration = settings.rotation.duration;
      }

      if (settings.rotation.timingFunction === undefined) {
        this._timingFunction = defaults.rotation.timingFunction;
      } else {
        this._timingFunction = settings.rotation.timingFunction;
      }
    }

    if (settings.buttons === undefined) {
      this._buttonsHide = defaults.buttons.hide;
      this._disableForSingle = defaults.buttons.disableForSingle;
    } else {
      if (settings.buttons.hide === undefined) {
        this._buttonsHide = defaults.buttons.hide;
      } else {
        this._buttonsHide = settings.buttons.hide;
      }

      if (settings.buttons.disableForSingle === undefined) {
        this._disableForSingle = defaults.buttons.disableForSingle;
      } else {
        this._disableForSingle = settings.buttons.disableForSingle;
      }
    }

    if (settings.display === undefined) {
      this._displayNo = defaults.display.number;
      this._rotationDuration = defaults.display.duration;
      this._startOffset = defaults.display.startOffset;
      this._direction = defaults.display.direction;
    } else {
      if (settings.display.number === undefined) {
        this._displayNo = defaults.display.number;
      } else {
        this._displayNo = settings.display.number;
      }

      if (settings.display.duration === undefined) {
        this._rotationDuration = defaults.display.duration;
      } else {
        this._rotationDuration = settings.display.duration;
      }

      if (settings.display.startOffset === undefined) {
        this._startOffset = defaults.display.startOffset;
      } else {
        this._startOffset = settings.display.startOffset;
      }

      if (settings.display.direction === undefined) {
        this._direction = defaults.display.direction;
      } else {
        this._direction = settings.display.direction;
      }
    }

    if (settings.fit === undefined) {
      this._itemClassName = defaults.class.itemClassName;
    } else {
      if (settings.class.itemClassName === undefined) {
        this._itemClassName = defaults.class.itemClassName;
      } else {
        this._itemClassName = settings.class.itemClassName;
      }
    }

    if (settings.fit === undefined) {
      this._fitToChildren = defaults.fit.fitToChildren;
      this._fitToParent = defaults.fit.fitToParent;
      this._responsive = defaults.fit.responsive;
    } else {
      if (settings.fit.fitToChildren === undefined) {
        this._fitToChildren = defaults.fit.fitToChildren;
      } else {
        this._fitToChildren = settings.fit.fitToChildren;
      }

      if (settings.fit.fitToParent === undefined) {
        this._fitToParent = defaults.fit.fitToParent;
      } else {
        this._fitToParent = settings.fit.fitToParent;
      }

      if (settings.fit.responsive === undefined) {
        this._responsive = defaults.fit.responsive;
      } else {
        this._responsive = settings.fit.responsive;
      }
    }

    return true;
  }

  _setInitialSettings(settings) {
    // Set timing function
    document.documentElement.style.setProperty(
      "--timingFunction",
      this._timingFunction
    );

    // Set duration of animation
    document.documentElement.style.setProperty(
      "--duration",
      this._duration + "ms"
    );

    this._container = document.getElementById(this._id); // The main container
    if (!this._container) {
      throw "Container does not exist";
    }

    this._items = this._container.getElementsByClassName(this._itemClassName); // The items of the carousel
    this._totalItems = this._items.length; // The total number of items

    // Sets the children to the size of the parent
    this._setChildrenWidth();

    // Set up circular queue
    this._front = 0;
    this._back = this._displayNo - 1;
    this._elements = [...this._items];

    // Hide buttons if specified
    if (this._buttonsHide) {
      let buttons = this._container.getElementsByClassName(
        "carousel-button-next"
      );
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "none";
      }
      buttons = this._container.getElementsByClassName("carousel-button-prev");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "none";
      }
    }

    // Hide buttons if only one element if specified
    if (this._disableForSingle && this._totalItems === 1) {
      this._duration = 0;
      let buttons = this._container.getElementsByClassName(
        "carousel-button-next"
      );
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "none";
      }
      buttons = this._container.getElementsByClassName("carousel-button-prev");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "none";
      }
    }

    this._moving = false; // Stores whether an animation is currently occurring

    // Displays all elements
    for (let i = 0; i < this._displayNo; i++) {
      if (this._items[i]) {
        this._items[i].classList.add("active");
      }
    }

    // Make copies of elements if required
    if (this._displayNo > this._totalItems) {
      let index = 0;
      for (let i = 0; i < this._displayNo - this._totalItems; i++) {
        let el = this._elements[index].cloneNode(true);
        this._container.firstElementChild.appendChild(el);
        index = this._mod(index + 1, this._totalItems);
      }
    }

    // Lock the width of the container
    if (this._fitToChildren) {
      this._container.style.maxWidth = this._container.clientWidth + "px";
      this._container.style.width = "100%";
    }
  }

  _handleResizing() {
    if (this._responsive) {
      this._setChildrenWidth();
    }
  }

  _setChildrenWidth() {
    if (this._fitToParent) {
      for (let i = 0; i < this._totalItems; i++) {
        this._items[i].firstElementChild.style.width =
          this._container.clientWidth / this._displayNo + "px";
      }
    }
  }

  /**
   * Adds the event listeners for the next and back
   */
  _addButtonEventListeners() {
    let next, prev;
    if (this._settings.nextBtnClass) {
      next = document.getElementsByClassName(this._settings.nextBtnClass)[0];
    } else {
      next = document.getElementsByClassName("carousel-button-next")[0];
    }

    if (this._settings.backBtnClass) {
      prev = document.getElementsByClassName(this._settings.backBtnClass)[0];
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
  }

  _startInterval() {
    if (this._startOffset > 0) {
      setTimeout(() => {
        this._interval();
      }, this._startOffset);
    } else {
      if (this._rotationDuration > 0) {
        this._interval();
      }
    }
  }

  _interval() {
    if (this._direction === "right") {
      this.moveNext();
    } else {
      this.movePrev();
    }

    this._animationTimeout.then(() => {
      if (this._rotationDuration > 0) {
        setTimeout(() => {
          this._interval();
        }, this._rotationDuration);
      }
    });
  }

  _mod(n, m) {
    return ((n % m) + m) % m;
  }

  _disableInteraction() {
    this._moving = true;
  }

  _enableInteraction() {
    this._moving = false;
  }

  _moveCarouselLeft(noSteps) {
    return new Promise((resolve, reject) => {
      // Check if carousel is moving, if not, allow interaction
      if (!this._moving) {
        // temporarily disable interactivity
        this._disableInteraction();

        this._front = this._mod(this._front + noSteps, this._totalItems);
        this._back = this._mod(this._back + noSteps, this._totalItems);

        // Slide all of the elements over
        let moveAmount = 0; //noSteps * this._items[0].offsetWidth;
        for (let i = 0; i < noSteps; i++) {
          moveAmount += this._items[i].offsetWidth;
        }

        document.documentElement.style.setProperty(
          "--moveAmount",
          "-" + moveAmount + "px"
        );

        let diff = this._totalItems - noSteps;

        // Add the missing elements
        let index = this._mod(this._front + diff, this._totalItems);
        for (let i = 0; i < noSteps; i++) {
          let el = this._elements[index].cloneNode(true);
          el.classList.remove("active");
          this._container.firstElementChild.appendChild(el);
          index = this._mod(index + 1, this._totalItems);
        }

        // Makes sure that the children are the correct size
        this._setChildrenWidth();

        for (let i = 0; i < this._displayNo + noSteps; i++) {
          this._items[i].classList.add("active");
        }

        for (let i = 0; i < this._items.length; i++) {
          this._items[i].classList.add("slide");
        }

        // Wait for animation to end
        this._animationTimeout = setTimeout(() => {
          for (let j = 0; j < this._items.length; j++) {
            this._items[j].classList.remove("slide");
          }

          for (let j = 0; j < noSteps; j++) {
            this._items[0].remove();
          }

          this._enableInteraction();
          resolve("done");
        }, this._duration + 10);
      } else {
        resolve("done");
      }
    });
  }

  _moveCarouselRight(noSteps) {
    return new Promise((resolve, reject) => {
      // Check if carousel is moving, if not, allow interaction
      if (!this._moving) {
        // temporarily disable interactivity
        this._disableInteraction();

        this._front = this._mod(this._front - noSteps, this._totalItems);
        this._back = this._mod(this._back - noSteps, this._totalItems);

        // Slide all of the elements over
        let moveAmount = 0; //noSteps * this._items[0].offsetWidth;
        for (let i = 0; i < noSteps; i++) {
          moveAmount += this._items[i].offsetWidth;
        }
        document.documentElement.style.setProperty(
          "--moveAmount",
          "-" + moveAmount + "px"
        );

        for (let i = 0; i < this._items.length; i++) {
          this._items[i].classList.add("startOffset");
        }

        let index = this._mod(this._front + noSteps - 1, this._totalItems);
        for (let i = 0; i < noSteps; i++) {
          let el = this._elements[index].cloneNode(true);
          el.classList.add("startOffset");
          this._items[0].parentNode.insertBefore(el, this._items[0]);
          index = this._mod(index - 1, this._totalItems);
        }

        // Makes sure that the children are the correct size
        this._setChildrenWidth();

        for (let i = 0; i < this._displayNo + noSteps; i++) {
          this._items[i].classList.add("active");
        }

        // Wait for animation to end
        this._animationTimeout = setTimeout(() => {
          for (let j = 0; j < this._items.length; j++) {
            this._items[j].classList.remove("slide");
            this._items[j].classList.remove("startOffset");
          }

          // Remove the extra elements
          for (let i = 0; i < noSteps; i++) {
            this._items[this._totalItems].remove();
          }

          this._enableInteraction();

          resolve("done");
        }, this._duration + 10);
      } else {
        resolve("done");
      }
    });
  }

  _updateDisplayDuration(duration) {
    if (duration < 0) {
      throw "Duration cannot be negative";
    }
    if (duration === 0) {
      this._duration = 0;
      this._removeRotationEventListeners();
    } else {
      if (this._duration === 0) {
        this._duration = duration;
        this._addRotationEventListeners();
      }
    }
    return true;
  }

  // Public methods
  updateSettings(settings) {
    return new Promise((resolve, reject) => {
      this._animationTimeout.then(() => {
        let wasMoving = !(this._rotationDuration === 0);
        this._initializeSettings(settings);
        this._setInitialSettings(settings);
        if (settings.display.duration > 0 && !wasMoving) {
          this._startInterval();
        }
        this._settings = settings;
        resolve("Settings updated");
      });
    });
  }

  moveNext() {
    this._animationTimeout = this._moveCarouselRight(this._moveAmount);
  }

  movePrev() {
    this._animationTimeout = this._moveCarouselLeft(this._moveAmount);
  }
}
