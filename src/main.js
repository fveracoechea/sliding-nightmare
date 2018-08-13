window.addEventListener('load', () => {
  if(window.matchMedia("(max-width: 567px)").matches){
    new SlidingNightmare('sliding-nightmare', {
      carouselStyles: {
        height: '120px', 
      },
      cover: true,
      numOfVisibleElements: 1,
      animationDuration: 600,
      iamgePaddingVertical: '20px',
    });
  } else if (window.matchMedia("(max-width: 920px)").matches){
    new SlidingNightmare('sliding-nightmare', {
      carouselStyles: {
        height: '120px', 
      },
      cover: true,
      numOfVisibleElements: 2,
      animationDuration: 600,
      iamgePaddingVertical: '20px',  
    });
  } else if (window.matchMedia("(max-width: 1600px)").matches){
    new SlidingNightmare('sliding-nightmare', {
      carouselStyles: {
        height: '120px', 
      },
      cover: true,
      numOfVisibleElements: 4,
      animationDuration: 600,
      iamgePaddingVertical: '20px',
    });
  } else {
    new SlidingNightmare('sliding-nightmare', {
      carouselStyles: {
        height: '120px', 
      },
      cover: true,
      numOfVisibleElements: 4,
      animationDuration: 600,
      iamgePaddingVertical: '20px',
    });
  }
});
