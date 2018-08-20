# sliding-nightmare

carousel slider, developed 100% with vanilla javascript without external dependencies. It also uses the virtualization of elements which allows having a large number of elements without affecting the performance.

## Get Start
    $ npm i sliding-nightmare --save

#### index.html
```html
<section>
  <div class="sliding-nightmare" id="sliding-nightmare">
    <div class="nightmare-inner">
      <!-- Following this structure you can insert any number of "nightmare-item" elements -->
      <div class="nightmare-item">
        <img src="./img/image1.png" alt="image1">
      </div>
      <div class="nightmare-item">
        <img src="./img/image2.png" alt="image2">
      </div>
      <div class="nightmare-item">
        <img src="./img/image3.png" alt="image3">
      </div>
      <div class="nightmare-item">
        <img src="./img/image4.png" alt="image4">
      </div>
    </div>
    <div class="nightmare-controls" role="button">
      <a href="#" class="nightmare-button-prev">
        <span class="nightmare-icon-prev"></span>
      </a>
    </div>
    <div class="nightmare-controls" role="button">
      <a href="#" class="nightmare-button-next">
        <span class="nightmare-icon-next"></span>
      </a>
    </div>
  </div>
</section>
<script src="./node_modules/sliding-nightmare/lib/app.js"></script>
<script src="./app.js"></script>
```
#### app.js
```js
window.addEventListener('load', () => {

  new SlidingNightmare('carousel-id');

  // with options
  new SlidingNightmare('sliding-nightmare', { 
    carouselStyles: {
      // compatible with HTMLElement.style - Web API
      height: '120px', // default 70vh
    },
    cover: false, // default true
    numOfVisibleElements: 4, // default 1
    animationDuration: 400, // default 600 ms
    imagesPaddingVertical: '20px', // default 0px
  });
});
```
