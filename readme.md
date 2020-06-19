# Carousel.js

## [See the example here](https://wkelly1.github.io/Carousel/index.html)

![Example](https://github.com/wkelly1/Carousel-js/blob/master/examples/images/example.png?raw=true)


## Options

```
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
```
<script src="carousel.min.js"></script>
<link rel="stylesheet" type="text/css" href="carousel.min.css" />
```

### Add the markup
```
<div class="carousel" id="example">
    <div class="carousel-item">
        <div class="your-item-class">
        1
        </div>
    </div>
    <div class="carousel-item">
        <div class="your-item-class">
        2
        </div>
    </div>

    <div class="carousel-button-next your-button-class">👉</div>
    <div class="carousel-button-prev your-button-class">👈</div>
</div>
```

### Initialise the carousel
```
<script>
    let settings = {
        id = "example" // Must link to an id
    }
    let example = new Carousel(settings);
</script>
```
