class SlidingNightmare {
  constructor(carouselId, options = {}){
    const  {
      carouselStyles = {},
      cover = true,
      animationDuration = 600, 
      numOfVisibleElements = 1,
      interval = 4000,
      imagesPaddingVertical = '0px',
    } = options;
    if(!carouselId && typeof carouselId !== 'string') throw new Error('Sliding Nightmare Error: slider id is required');
    this.carousel = document.querySelector(`#${carouselId}`);
    this.items = [...document.querySelectorAll(`#${carouselId} div.nightmare-inner div.nightmare-item`)];
    this.interval = interval;
    if (this.items.length < numOfVisibleElements) throw new Error('Sliding Nightmare Error: you can not render more items than there are in the');
    this.inner = document.querySelector(`#${carouselId} div.nightmare-inner`);
    this.visibleElementsNum = numOfVisibleElements;
    this.visibleItmes = [];
    this.hiddenItems = this.setHiddenItems(this.items);
    this.clickIsActive = true;
    this.animationDuration = animationDuration;
    this.imagesPaddingVertical = imagesPaddingVertical;
    this.addItemsStyles();
    this.addStyles();
    this.setStyles(carouselStyles);
    this.cover = cover;
    this.itemsOffsetWidth = this.visibleItmes[0].offsetWidth;
    this.enableToClik = true;
    this.handlerOnNext = this.handlerOnNext.bind(this);
    this.handlerOnPrev = this.handlerOnPrev.bind(this);
    this.handlerOnOclick();
    this.startTimeout();
  }
  setStyles(styles) {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        const style = styles[key];
        this.carousel.style[key] = style;
      }
    }
  }
  addItemsStyles() {
    this.widthItems = `${(this.inner.offsetWidth / this.visibleElementsNum)}px`;
    for (const item of this.items) {
      item.style.width = this.widthItems;
      if (this.cover) {
        item.style.objectFit = 'cover';
      }
      item.style.paddingLeft = this.imagesPaddingVertical;
      item.style.paddingRight = this.imagesPaddingVertical;
    }
  }
  addStyles(){
    const html = `
    <style class="sliding-nightmare-styles">
    .sliding-nightmare {
      font-size: 16px;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100%;
      height: 70vh;
      background-color: #fff;
      overflow: hidden;
    }
    .sliding-nightmare .nightmare-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      height: 100%;
      min-width: 100%;
      top: 0;
      left: 0;
    }
    .sliding-nightmare .nightmare-inner .nightmare-item {
      display: inline-block;
      position: relative;
      height: 100%;
    }
    .sliding-nightmare .nightmare-inner .nightmare-item img {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
    .sliding-nightmare .nightmare-controls {
      cursor: pointer;
      background-color: rgba(230, 230, 230, 0.5);
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      position: relative;
      -webkit-transition: all .2s ease-in-out;
      transition: all .2s ease-in-out;
    }
    .sliding-nightmare .nightmare-controls:hover {
      background-color: rgba(230, 230, 230, 0.8);
    }
    .sliding-nightmare .nightmare-controls:active {
      box-shadow: 0 0 4px #000 inset;
    }
    .sliding-nightmare .nightmare-icon-next {
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA%2FPjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI2IDI2IiBoZWlnaHQ9IjI2cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNiAyNiIgd2lkdGg9IjI2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMi4wNDksMC41OCAtMC4wMzUsMi42NjQgMTAuODAxLDEzLjUgLTAuMDM1LDI0LjMzNiAyLjA0OSwyNi40MiAxNC45NjksMTMuNSAgIi8%2BPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIxMy4wNDksMC41OCAxMC45NjUsMi42NjQgMjEuODAxLDEzLjUgMTAuOTY1LDI0LjMzNiAxMy4wNDksMjYuNDIgMjUuOTY5LDEzLjUgICIvPjwvZz48L3N2Zz4%3D");
    }
    .sliding-nightmare .nightmare-icon-prev {
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA%2FPjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI2IDI2IiBoZWlnaHQ9IjI2cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNiAyNiIgd2lkdGg9IjI2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMjMuODg1LDAuNTggMjUuOTY5LDIuNjY0IDE1LjEzMywxMy41IDI1Ljk2OSwyNC4zMzYgMjMuODg1LDI2LjQyIDEwLjk2NSwxMy41ICAiLz48cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjEyLjg4NSwwLjU4IDE0Ljk2OSwyLjY2NCA0LjEzMywxMy41IDE0Ljk2OSwyNC4zMzYgMTIuODg1LDI2LjQyIC0wLjAzNSwxMy41ICAiLz48L2c%2BPC9zdmc%2B");
    } 
    .sliding-nightmare .nightmare-icon-next,
    .sliding-nightmare .nightmare-icon-prev {
      position: relative;
      display: block;
      width: 30px;
      height: 30px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border: solid 8px transparent;
    }
    
    </style>
  `;
    if(!document.querySelector('style.sliding-nightmare-styles')){
      document.head.insertAdjacentHTML('beforeend', html);
    } else {
      document.querySelector('style.sliding-nightmare-styles').outerHTML = html;
    }
  }

  setHiddenItems(items) {
    return items.filter((item, i) => {
      if( i < this.visibleElementsNum) {
        this.visibleItmes.push(item);
        return false;
      } else {
        item.remove();
        return true;
      }
    });
  }

  handlerOnOclick(){
    this.carousel.addEventListener('click', (e) => {
      e.preventDefault();
      if(this.enableToClik){
        switch (e.target.className) {
          case 'nightmare-icon-prev':
            this.handlerOnPrev();
            break;
          case 'nightmare-icon-next':
            this.handlerOnNext();
            break;
        }
      }
    });
  }
  renderVisibleItems(){
    for (const item of this.visibleItmes) {
      this.inner.insertAdjacentElement('beforeend', item);
    }
  }
  removeVisibleItems(){
    for (const item of this.visibleItmes) {
      item.remove();
    }
  }
  handlerOnNext(){
    let hasHidden, newItem;
    this.resetTimeout();
    this.enableToClik = false;
    if(this.hiddenItems.length > 0){
      newItem  = this.hiddenItems.shift();
      this.visibleItmes.push(newItem);
      this.inner.insertAdjacentElement('beforeend', newItem);
      hasHidden = true;
    } else {
      hasHidden = false;
      newItem = this.visibleItmes[0].cloneNode(true);
      this.visibleItmes.push(newItem);
      this.inner.insertAdjacentElement('beforeend', newItem);
    }
    this.inner.style.transition = `transform ${this.animationDuration}ms ease`;
    this.inner.style.transform = `translateX(${-this.itemsOffsetWidth}px)`;
    setTimeout(() => {
      let removedItem;
      if(hasHidden){
        removedItem  = this.visibleItmes.shift();
        this.hiddenItems.push(removedItem);
        removedItem.remove();
      } else {
        removedItem = this.visibleItmes.shift();
        removedItem.remove();
      }
      this.inner.style.transition = 'unset';
      this.inner.style.transform = `translateX(0)`;
      this.enableToClik = true;
    }, this.animationDuration);
  }

  handlerOnPrev(){
    let hasHidden, newItem, removedItem;
    this.resetTimeout();
    this.enableToClik = false;
    this.inner.style.left = `-${this.itemsOffsetWidth}px`;
    if (this.hiddenItems.length > 0){
      hasHidden = true;
      newItem  = this.hiddenItems.pop();
      this.visibleItmes.unshift(newItem);
      this.inner.insertAdjacentElement('afterbegin', newItem);
    } else {
      hasHidden = false;
      newItem = this.visibleItmes[this.visibleItmes.length - 1].cloneNode(true);
      this.visibleItmes.unshift(newItem);
      this.inner.insertAdjacentElement('afterbegin', newItem);
    }
    this.inner.style.transition = `transform ${this.animationDuration}ms ease`;
    this.inner.style.transform = `translateX(${this.itemsOffsetWidth}px)`;
    setTimeout(() => {
      if (hasHidden) {
        removedItem  = this.visibleItmes.pop();
        this.hiddenItems.unshift(removedItem);
        removedItem.remove();
      } else {
        removedItem = this.visibleItmes.pop();
        removedItem.remove();
      }
      this.inner.style.transition = 'unset';
      this.inner.style.transform = `translateX(0)`;
      this.inner.style.left = `0`;
      this.enableToClik = true;
    }, this.animationDuration);
  }

  resetTimeout(){
    clearTimeout(this.timeout);
    this.startTimeout();
  }

  startTimeout() {
    this.timeout = setTimeout(() => {
      this.handlerOnNext();
    }, this.interval);
  }
}
