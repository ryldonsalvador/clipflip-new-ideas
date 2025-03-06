var lastX = 0;
var direction;
var animDirection;
var $container;

var inAnimation = null;
var outAnimation = null;
var nextSlide = null;
var $containerWidth;


document.addEventListener("DOMContentLoaded", function () {

function onCreativeLoad(){

    TweenMax.set("#container", { display:"block" });

    Draggable.create(document.createElement("div"), {
      trigger: "#container",
      type: "x",
      minimumMovement: 10,
      onDragStart: function() {
        if (inAnimation && inAnimation.isActive()) {
          TweenMax.to([inAnimation, outAnimation], 0.3, {timeScale: 10})
          
          if (this.getDirection() === "left") {
            nextSlide = slides[currentSlide.index - 1] || slides[slides.length - 1];
            
          } else {
            nextSlide = slides[currentSlide.index + 1] || slides[0];
            
          }
        } else if (this.getDirection() === "left") {
          setSlide(slides[currentSlide.index - 1] || slides[slides.length - 1]);
          console.log('left');
        } else {
          setSlide(slides[currentSlide.index + 1] || slides[0]);
        }
      }
    });


    $container = document.getElementById("container");
    $containerWidth = $container.offsetWidth;

    TweenMax.set("#container", { perspective: $containerWidth * 1.5 });
    TweenMax.set(".slide", {
      backfaceVisibility: "hidden",
      transformOrigin: "50% 50% -" + $containerWidth / 2
    });

    $('.cta').click(function(){
    })

    TweenLite.defaultEase = Linear.easeNone;

    var slideDelay = 1.5;
    var slideDuration = .5;

    var slideElements = document.querySelectorAll(".slide");
    var slides = Array.prototype.map.call(slideElements, createSlide);

    slides.forEach(function(slide, i) {
      slide.next = slides[i + 1] || slides[0];
      slide.duration = slideDuration;
    });

    var currentSlide = slides[0];

//var autoPlay = TweenLite.delayedCall(slideDelay, setSlide);

    function setSlide(slide) {
      //autoPlay.restart(true);

      if (slide === currentSlide) {
        return;
      }

      if (currentSlide.index === 0 && slide.index === slides.length - 1) {
        currentSlide.setPrevInactive();
        currentSlide = slide;
        currentSlide.setPrevActive();
      } else if (currentSlide.index === slides.length - 1 && slide.index === 0) {
        currentSlide.setInactive();
        currentSlide = slide;
        currentSlide.setActive();
      } else if (slide.index < currentSlide.index) {
        currentSlide.setPrevInactive();
        currentSlide = slide;
        currentSlide.setPrevActive();
      } else {
        currentSlide.setInactive();
        currentSlide = slide;
        currentSlide.setActive();
      }
    }

function createSlide(element, index) {
  var slide = {
    next: null,
    duration: 0,
    index: index,
    element: element,
    isActive: false,
    setActive: setActive,
    setInactive: setInactive,
    setPrevActive: setPrevActive,
    setPrevInactive: setPrevInactive
  };

  if (index === 0) {
    TweenMax.set(element, { autoAlpha: 1 });
  } else {
    TweenMax.set(element, { autoAlpha: 0 });
  }

  function setActive() {
    animDirection = 1;
    slide.isActive = true;
    inAnimation = TweenLite.fromTo(
      element,
      slide.duration,
      { rotationY: -90, autoAlpha: 1 },
      { rotationY: 0, onComplete: callNext }
    );
  }

      function setPrevActive() {
        animDirection = -1;
        slide.isActive = true;
        inAnimation = TweenLite.fromTo(
          element,
          slide.duration,
          { rotationY: 90, autoAlpha: 1 },
          { rotationY: 0, onComplete: callNext }
        );
      }

      function setInactive() {
        slide.isActive = false;
        outAnimation = TweenLite.to(element, slide.duration, {
          rotationY: 90,
          onComplete: setAlpha
        });
      }

      function setPrevInactive() {
        slide.isActive = false;
        outAnimation = TweenLite.to(element, slide.duration, {
          rotationY: -90,
          onComplete: setAlpha
        });
      }

      function setAlpha() {
        var $this = this.target;
        TweenMax.set($this, { autoAlpha: 0 });
      }

      function callNext() {
        if (nextSlide) {
          setSlide(nextSlide);
          nextSlide = null;
        }
      }

    return slide;
    }
}
  onCreativeLoad();
});
