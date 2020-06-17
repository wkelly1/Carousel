
# Carousel.js

## [See the example here](https://wkelly1.github.io/)

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
```
    <script src="carousel.min.js"></script>
    <link rel="stylesheet" type="text/css" href="carousel.min.css" />

    <script>
        let example = new Carousel(settings);
    </script>
```