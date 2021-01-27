# Carousel.js

[![npm version](https://shields.io/npm/v/carousel-slideshow)](https://www.npmjs.com/package/carousel-slideshow)
[![licence](https://shields.io/npm/l/carousel-slideshow)](https://github.com/wkelly1/Carousel/blob/master/LICENSE)
[![npm downloads](https://shields.io/npm/dt/carousel-slideshow)](https://www.npmjs.com/package/carousel-slideshow)

## [See the example here](https://wkelly1.github.io/Carousel/index.html)

![Example](https://github.com/wkelly1/Carousel-js/blob/master/examples/images/example.png?raw=true)

## Instillation

```console 
npm install carousel-slideshow --save
```

## Options

```javascript
let settings = {
    id: "example",
    rotation: {
        amount: 1, // How many elements it moves per rotation
        timingFunction: "ease-in-out", // Timing function of the movement
        duration: 100, // How long the movement takes
    },
    buttons: {
        hide: false, // Whether to hide the buttons
        disableForSingle: false, // Disables the buttons when there is only one element in the carousel
    },
    display: {
        number: 5, // Number of elements to display at a time,
        duration: 2000, // If specified then the carousel will rotate every time that number of milliseconds has elapsed
        startOffset: 0, // Waits this long before auto rotating,
        direction: "left", // The direction to move the carousel either left or right
    },
    class: {
        itemClassName: "carousel-item", // Used if you have altered the class for an item
    },
};
```

## Using the carousel

### Add the library

```html
<script src="carousel.min.js"></script>
<link rel="stylesheet" type="text/css" href="carousel.min.css" />
```

### Add the markup

```html
<div class="carousel-container" id="example">
  <div class="carousel">
    <div class="carousel-item">
      <div class="your-item-class">1</div>
    </div>
    <div class="carousel-item">
      <div class="your-item-class">2</div>
    </div>

    <div class="carousel-button-next your-button-class">👉</div>
    <div class="carousel-button-prev your-button-class">👈</div>
  </div>
</div>
```

### Initialise the carousel

```html
<script>
  let settings = {
    id: "example",
    rotation: {
      amount: 1, // How many elements it moves per rotation
      timingFunction: "ease-in-out", // Timing function of the movement
      duration: 1000, // How long the movement takes
    },
    buttons: {
      hide: false, // Whether to hide the buttons
      disableForSingle: false, // Disables the buttons when there is only one element in the carousel
    },
    display: {
      number: 5, // Number of elements to display at a time,
      duration: 2000, // If specified then the carousel will rotate every time that number of milliseconds has elapsed
      startOffset: 0, // Waits this long before auto rotating,
      direction: "left", // The direction to move the carousel either left or right
    },
    class: {
      itemClassName: "carousel-item", // Used if you have altered the class for an item
    },
    fit: {
      fitToChildren: true,
      responsive: true,
    },
  };

  let example = new Carousel(settings);
</script>
```

### Example: Customize your items

Now that the carousel has been setup we can now make it display your contents. Lets give it a background and a width and height. Note: when
`fitToParent = true` we do not need to give it a width and instead should give the container a width and it will workout the correct size for the children.

```css
.your-item-class {
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dotted black;
  width: 200px;
  height: 200px;
}
```
