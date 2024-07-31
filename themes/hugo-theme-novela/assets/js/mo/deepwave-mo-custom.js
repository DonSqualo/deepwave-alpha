console.log('INIT deepwave-mo-custom.js')

function testAction(referenceString) {
  alert('TEST action = ' + referenceString)
}


function setYoutubeIFrameHeight() {
  const frame = document.getElementById("yt-iframe");
  let width = parseInt(frame.offsetWidth);
  frame.height = parseInt(width * (16 / 9));
  console.log("width: " + frame.height.toString());
}

document.addEventListener('DOMContentLoaded', function(e) {

  handleMOClicks()
  handleMOAnimation()
  //handleMOProgress()
  handleSidenotes()
  handleCTAs()
  setYoutubeIFrameHeight();

})



// #################################################################################
// #################################################################################
// SETTING HEIGHT HANDLE FOR MOBILE IOS
function setHeightHandle() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  console.log('vh: ' + vh)
}
setHeightHandle()

window.addEventListener('resize', () => {
  setTimeout(setHeightHandle, 500);
});


// #################################################################################
// #################################################################################
// CHECKING WEBP SUPPORT

// via https://developpaper.com/determine-whether-the-browser-supports-webp-images/

//The developer tool of Chrome browser is used to capture and display packages, and the fields related to response header and request header can be viewed;
//Judge whether the accept contains the image / webp field. If it does, webp is supported. Otherwise, it is not supported.
//Function returns true or false; true is supported, but false is not;
function browserCheckWebp() {
  try {
    //!]. Map is mainly used to judge whether the browser is IE9 +, so as to avoid the todataurl method hanging up;
    //If you directly extend the map method to the array prototype, you need to use methods other than!]. Map to judge, for example!! window.addEventListener  Etc;
    return (!![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
  } catch (err) {
    return false;
  }
}

if (browserCheckWebp()) {
  console.log('Browser supports webp: YES')
} else {
  console.log('Browser supports webp: NO')
}



// #################################################################################
// #################################################################################
// PRELOADING IMAGES

// let loadStatus = []

// function preloadAnimationImages(archiveID) {

//   if (loadStatus.includes(archiveID)) {
//     return
//   }

//   let archiveIDLowerCase = archiveID.toLowerCase()
//   let archivePath
//   let fileExtension
//   let imgPaths = []

//   if (browserCheckWebp()) {
//     archivePath = '/animations/' + archiveIDLowerCase + '_webp.zip'
//     fileExtension = '.webp'
//   } else {
//     return // ### !!! ### FIND ALTERNATIVE (MP4?)
//     archivePath = '/animations/' + archiveIDLowerCase + '_png.zip'
//     fileExtension = '.png'
//   }

//   // via: https://stuk.github.io/jszip/
//   let promise = new JSZip.external.Promise(function(resolve, reject) {
//     JSZipUtils.getBinaryContent(archivePath, function(err, data) {
//       if (err) {
//         console.log(err)
//       } else {
//         resolve(data);
//       }
//     })
//   })

//   promise.then(JSZip.loadAsync)
//     .then(function(zip) {
//       console.log('Loaded: ' + archivePath)
//       loadStatus.push(archiveID)

//       /// via: https://github.com/Stuk/jszip/issues/399 // customized for MO
//       var isImg = /(.png|.webp)$/ // /(.jpg|.png|.gif|.jpeg|.webp)$/
//       var isSys = /^[_.]/
//       var promises = Object.keys(zip.files).filter(function(fileName) {
//         // don't consider non image files
//         if (!isSys.test(fileName)) {
//           return isImg.test(fileName.toLowerCase())
//         }
//       }).map(function(fileName) {
//         var file = zip.files[fileName]
//         return file.async("blob").then(function(blob) {
//           return [
//             fileName,  // keep the link between the file name and the content
//             URL.createObjectURL(blob) // create an url. img.src = URL.createObjectURL(...) will work
//           ]
//         })
//       })
//       // `promises` is an array of promises, `Promise.all` transforms it into a promise of arrays
//       return Promise.all(promises)
//     }).then(function(result) {
//       result.sort()
//       return result
//     }).then(function(result) {
//       result.forEach(function(entry, index) {
//         // Append DOM element
//         let node = document.createElement('div')
//         node.setAttribute('style', 'background-image:url("' + entry[1] + '")')
//         document.querySelector('#' + archiveID + ' .mo-animation').appendChild(node)
//       })
//     }).catch(error => console.log(error.message))
// }

// Load first animation immediately
// preloadAnimationImages('MO11')



function preloadImages(firstFrame, numberOfFrames) {
  // #wenn zip
  // #wenn webp > load webp zip
  // #else > load png zip
  // #else
  // #wenn webp > load webps
  // #else > load pngs

  // #attach divs with bg images to .mo-animation
}


// #################################################################################
// #################################################################################
// EASING FUNCTIONS

// t = time, b = beginning value, c = change in value, d = duration
function easeInOutQuad(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
function easeInOutBack(t, b, c, d) {
  let s = 1.70158
  //if (s == undefined) s = 1.70158;
  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
function easeInOutBackS(t, b, c, d, s) {
  //let s = 1.70158
  //if (s == undefined) s = 1.70158;
  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
function easeInOutExpo(t, b, c, d) {
  if (t == 0) return b;
  if (t == d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}



// #################################################################################
// #################################################################################
// HANDLING FRAME BY FRAME ANIMATION

function handleMOAnimation() {
  console.log('INIT handleMOAnimation!')

  /// TIMING VARS
  let pauseBefore = 800              // Pause before first text appears
  let animationAppearDuration = 100 // Pause between text and hand-drawn animation
  let animationDuration = 4000    // Animation Duration
  let pauseBetween = 600          // Pause after animation
  let translationDuration = 1000   // Translation visibility
  let pauseAfter = 1000            // Pause before next slide

  let slideTotal = pauseBefore + animationAppearDuration + animationDuration + pauseBetween + translationDuration + pauseAfter

  const progressBase = []         // Array to hold Progress Circle Values
  let slideCounter = 0

  /// ERFASSE ALLE SECTIONS
  let moSections = document.querySelectorAll('.mo-sections-wrapper')
  if (moSections.length > 0) {

    window.controllers = [];

    moSections.forEach(function(entry, index) {

      ///console.log('SECTION START ' + index)

      let sectionDuraton = 0 // Section Duration

      // init ScrollMagic controller for SECTIONS
      let sectionController = new ScrollMagic.Controller({
        globalSceneOptions: {
          triggerHook: 'onEnter', // onEnter // onCenter // onLeave
          reverse: true
        }
      });

      // init ScrollMagic controller for SLIDES
      let slideController = new ScrollMagic.Controller({
        globalSceneOptions: {
          triggerHook: 'onLeave', // onEnter // onCenter // onLeave
          reverse: true
        }
      });

      window.controllers.push(slideController);

      let mos = entry.querySelectorAll('.mo-section')
      // SECTION
      let sectionTrigger = entry
      new ScrollMagic.Scene({ triggerElement: sectionTrigger, duration: (slideTotal * mos.length + mos.length), offset: 0, triggerHook: 'onEnter' })
        .on("enter leave", sectionCallback)
        .addTo(sectionController);


      // SECTION CALLBACK
      function sectionCallback(e) {

        let progressElement = document.getElementById('mo-progress')
        let circlesContainer = progressElement.querySelector('#mo-progress--circles')
        let sectionHeadlineContainer = progressElement.querySelector('#mo-progress--headline')

        sectionHeadlineContainer.addEventListener("click", () => {
          window.openNavigationMap()
        })

        circlesContainer.innerHTML = ''

        if (e.type == "enter") {
          // Set progress headline to section headline
          let sectionHeadlines = document.querySelectorAll('.mo-subheader h2')
          let smallSectionHeadlines = document.querySelectorAll('.mo-subheader span')
          sectionHeadlineContainer.innerHTML = smallSectionHeadlines[index].innerHTML

          // Add ProgressCircles according to number of slides
          mos.forEach((mo, moIndex) => {
            let node = document.createElement('div')
            node.setAttribute('class', 'mo-progress--circle')
            node.style.cursor = 'pointer';
            node.setAttribute('title', window.smalltitles[index][moIndex].title)

            node.onclick = e => {
              // mo.scrollIntoView({ behavior: 'smooth', block: 'center' });
              window.scrollToMo(window.smalltitles[index][moIndex].order, false);
              setTimeout(() => progressElement.classList.remove("hidden"), 300);
            }

            circlesContainer.appendChild(node)
            if (e.scrollDirection == 'FORWARD') {
              new CircleProgress(node, { max: 100, value: 0, textFormat: 'none' })
            } else {
              new CircleProgress(node, { max: 100, value: 100, textFormat: 'none' })
            }
          })
          progressElement.classList.remove('hidden')
          console.log("Scene entered: " + index)

        } else if (e.type == "leave") {
          progressElement.classList.add('hidden')
          console.log("Scene left: " + index)
        }
      }


      // CALLBACK SLIDETRANSITION
      let counter = 0

      function nextSlide(e) {
        if (e.scrollDirection == 'FORWARD') {
          counter += 1
        } else if (e.scrollDirection == 'REVERSE') {
          counter -= 1
        }
      }



      /// HANDLE MOs
      if (mos.length > 0) {
        mos.forEach(function(entry, mosIndex) {

          // Scene ID
          var sceneID = entry.getAttribute('id')
          var sceneSelector = '#' + sceneID
          var triggerElmt = entry.querySelector('.mo-single')
          var backgroundElmt = triggerElmt.querySelector('.mo-background')
          var accentColor = "#5cf" // fallback

          if (backgroundElmt.style.background.split("#").length == 2) {
            accentColor = "#" + backgroundElmt.style.background.split("#")[1].slice(0, 6)
          }

          entry.style.setProperty("--background-extract-color", accentColor)

          ///console.log('_SLIDE: ' + sceneID)

          // Progress Circle Values
          progressBase.push([0])
          progressBase[index][mosIndex] = 0

          /*
          //let firstFrame = entry.getAttribute('data-first-frame')
          let numberOfFrames = entry.getAttribute('data-number-of-frames')
          if(numberOfFrames){
              console.log('number of frames via data-attribute: ' + numberOfFrames)
          }
          */


          // CALLBACK SLIDE: PRELOAD NEXT ANIMATION
          function slideCallback(e) {
            if (e.type == "enter") {
              console.log("Slide entered: " + sceneID);

              document.getElementById('mo-progress').classList.remove("hidden");

              // Set Active Map Place but remove leading "MO"
              window.setActiveMapPlace(sceneID.slice(2));

              /* DEACTIVATED
              // Set SlideCounter for Progress
              let progressCounterContainer = document.querySelector('#mo-progress--count > span')
              if(e.scrollDirection == 'FORWARD'){
                  slideCounter += 1
                  progressCounterContainer.innerHTML = slideCounter
              } else if(e.scrollDirection == 'REVERSE'){
                  slideCounter -= 1
                  progressCounterContainer.innerHTML = slideCounter
              }
              */

              // Trigger Animation Preloading
              let nextSceneObject
              if (mosIndex < (mos.length - 1)) {
                nextSceneObject = mos[(mosIndex + 1)]
              } else {
                if (moSections[(index + 1)]) {
                  nextSceneObject = moSections[(index + 1)].querySelector('.mo-section')
                }
              }
              if (nextSceneObject) {
                let nextSceneID = nextSceneObject.getAttribute('id')
                // preloadAnimationImages(nextSceneID)
              }
            }
          }

          // Scene Offset
          let sceneOffset = 0 // Startpunkt der Scene in Pixel vom oberen Rand

          // Scene Duration
          // let sceneDuration = ### CALCULATE NO OF FRAMES * FACTOR X

          // Slide Transition
          if (mosIndex != 0) {
            let switchIndicatorText = 'SWITCH ' + mosIndex

            new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: 1, offset: sceneOffset, triggerHook: 'onLeave' })
              .setPin(triggerElmt)
              //.addIndicators({name: switchIndicatorText})
              .on("enter", nextSlide)
              .addTo(slideController);

            sceneOffset += 1
          } else {
            // this is the first slide: do nothing
          }


          // Pause before
          let scenePauseBefore = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: pauseBefore, offset: sceneOffset, triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            //.addIndicators()
            .on("enter", slideCallback)
            .addTo(slideController);

          scenePauseBefore.on('enter', function(e) {
            entry.querySelector('.gif-explanation').style.opacity = 0
            entry.querySelector('.mo-video').style.opacity = 0
            presetSceneProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

          scenePauseBefore.on('progress', function(e) {
            entry.querySelector('.gif-explanation').style.opacity = (-0.5 + e.progress * 2)
            entry.querySelector('.mo-video').style.opacity = (e.progress)
            updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)

          })


          // Animation Appear
          let sceneAnimationAppear = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: animationAppearDuration, offset: (sceneOffset + pauseBefore), triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            //.addIndicators()
            .addTo(slideController);

          /// ON ENTER > remove class scaled > ADD CSS accordingly scale(6), transition: transform 0.2s, pointer-events: none; ...
          /// PUT THIS TO THE BEGINNING OF 

          sceneAnimationAppear.on('progress', function(e) {
            entry.querySelector('.mo-video').style.opacity = (e.progress)


            //updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })
          sceneAnimationAppear.on('leave', function(e) {
            if (e.scrollDirection = 'FORWARD') {
              sceneAnimationAppear.off('progress')
            }
          })


          // Animation
          let sceneAnimation = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: animationDuration, offset: (sceneOffset + pauseBefore + animationAppearDuration), triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            //.addIndicators()
            .addTo(slideController);

          /// TODO
          //# Check if images have been loaded

          let currentFrame = 0
          sceneAnimation.on('enter', function (e) {
            presetSceneProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

          const video = entry.querySelector(".mo-video--content");
          const handleScrollPlay = (e) => {
            if (video.readyState >= 2) { // Ensure video is ready
              if (video.duration) {
                video.currentTime = video.duration * e.progress;
              }
            } else {
              video.addEventListener('loadedmetadata', () => {
                video.currentTime = video.duration * e.progress;
              }, { once: true });
            }
          };

          sceneAnimation.on('progress', function (e) {
            handleScrollPlay(e);
            updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal);
          });


          // Pause between
          let scenePauseBetween = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: pauseBetween, offset: (sceneOffset + pauseBefore + animationAppearDuration + animationDuration), triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            //.addIndicators()
            .addTo(slideController);

          scenePauseBetween.on('enter', function(e) {
            entry.querySelector('.mo-main-content').classList.remove('transition-delay')
            presetSceneProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

          scenePauseBetween.on('progress', function(e) {
            updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })
          scenePauseBetween.on('leave', function(e) {
            entry.querySelector('.mo-main-content').classList.add('transition-delay')
          })


          // Translation
          let translationHandle = entry.querySelector('.mo-translation')
          let sceneTranslation = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: translationDuration, offset: (sceneOffset + pauseBefore + animationAppearDuration + animationDuration + pauseBetween), triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            .setClassToggle(entry, "translation-active")
            //.addIndicators()
            .addTo(slideController);

          sceneTranslation.on('enter', function(e) {
            presetSceneProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

          sceneTranslation.on('progress', function(e) {
            updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })
          sceneTranslation.on('leave', function(e) {
            entry.querySelector('.mo-main-content').classList.remove('transition-delay')
          })



          // Pause after
          let scenePauseAfter = new ScrollMagic.Scene({ triggerElement: triggerElmt, duration: pauseAfter, offset: (sceneOffset + pauseBefore + animationAppearDuration + animationDuration + pauseBetween + translationDuration), triggerHook: 'onLeave' })
            .setPin(triggerElmt)
            .setClassToggle(entry, "pause-out")
            //.addIndicators()
            .addTo(slideController);

          scenePauseAfter.on('enter', function(e) {

            presetSceneProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

          scenePauseAfter.on('progress', function(e) {
            // Fade out original text and animation
            entry.querySelector('.mo-original').style.opacity = (1.5 - e.progress * 2)
            entry.querySelector('.mo-video').style.opacity = (1 - e.progress * 2.4)

            updateProgress(e, index, mosIndex, progressBase, this.duration(), slideTotal)
          })

        })
      }

    })
  }
}


// #################################################################################
// #################################################################################
// PROGRESS CIRCLES

function presetSceneProgress(event, index, mosIndex, progressBase, sceneDuration, slideTotal) {
  let circleObj = document.querySelector('.mo-progress--circle:nth-child(' + (mosIndex + 1) + ')')
  if (circleObj) {
    let circle = circleObj.circleProgress
    if (event.scrollDirection == 'FORWARD') {
      progressBase[index][mosIndex] = circle['value']
    } else if (event.scrollDirection == 'REVERSE') {
      progressBase[index][mosIndex] = circle['value'] - (sceneDuration / slideTotal * 100)
    }
  }
}

function updateProgress(event, index, mosIndex, progressBase, sceneDuration, slideTotal) {
  let circleObj = document.querySelector('.mo-progress--circle:nth-child(' + (mosIndex + 1) + ')')
  if (circleObj) {
    let circle = circleObj.circleProgress
    let newValue = (progressBase[index][mosIndex] + (sceneDuration / slideTotal) * (100 * event.progress)).toFixed(0)
    if (newValue >= 0 && newValue <= 100) {
      circle['value'] = newValue
    }
  }
}

// #################################################################################
// #################################################################################

function handleMOClicks() {

  let firstHeader = document.querySelector('.mo-subheader-10');
  firstHeader.addEventListener('click', function(e) {
    // scroll firstHeader into view
    firstHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    firstHeader.style.cursor = 'default';
  });


  var observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting === true) {
      const id = entries[0].target.id;
      // window.history.replaceState(null, null, '#' + id);
    }
  }, { threshold: [0] });

  document.addEventListener("scroll", e => {
    if (window.scrollY > 20) {
      document.querySelector("#mo-header").style.opacity = 0;
    } else {
      document.querySelector("#mo-header").style.opacity = 1;
    }
    // document.querySelector("#mo-header").style.opacity = 1 - window.scrollY / 100;
  });

  // Find all MOs
  let mos = document.querySelectorAll('.mo-single')

  mos.forEach(function(entry, index) {

    observer.observe(entry);

    // Find all Explanations in each MO Translation
    let explanations = entry.querySelectorAll('.mo-explanation')
    // Find all Anchor-Links in each MO Original
    let explanationLinks = entry.querySelectorAll('a[href^="#"]')


    // Make Explanations clickable
    explanations.forEach(function(entry, index) {

      entry.addEventListener('click', function(e) {

        if (!e.currentTarget.classList.contains('active')) {
          // remove .active if assigned to another explanation                 
          let activeExplanation = document.querySelector('.mo-explanation.active')
          if (activeExplanation) { activeExplanation.classList.remove('active') }

          // remove .active if assigned to another link in original text
          let activeLink = document.querySelector('a[href^="#"].active')
          if (activeLink) { activeLink.classList.remove('active') }
        }

        // activate clicked explanation and link
        explanationLinks[index].classList.toggle('active')
        e.currentTarget.classList.toggle('active')
        e.currentTarget.closest('.mo-translation').classList.toggle('noscroll-portrait')
        e.currentTarget.scrollTop = 0 /* #### */
      })
    })

    // Make Links in Original Text clickable
    explanationLinks.forEach(function(entry, index) {

      entry.addEventListener('click', function(e) {
        e.preventDefault()

        if (!e.currentTarget.classList.contains('active')) {
          // remove .active if assigned to another explanation                 
          let activeExplanation = document.querySelector('.mo-explanation.active')
          if (activeExplanation) { activeExplanation.classList.remove('active') }

          // remove .active if assigned to another link in original text
          let activeLink = document.querySelector('a[href^="#"].active')
          if (activeLink) { activeLink.classList.remove('active') }
        }

        // activate clicked link and explanation
        explanations[index].classList.toggle('active')
        e.currentTarget.classList.toggle('active')
        e.currentTarget.closest('.mo-single').querySelector('.mo-translation').classList.toggle('noscroll-portrait')
        e.currentTarget.scrollTop = 0

      })

      // Show Translation regardless of animation state
      entry.addEventListener('mouseover', function(e) {
        e.currentTarget.closest('.mo-single').querySelector('.mo-translation').classList.add('tease')
      })
      entry.addEventListener('mouseout', function(e) {
        e.currentTarget.closest('.mo-single').querySelector('.mo-translation').classList.remove('tease')
      })
    })
  })
}


// #################################################################################
// #################################################################################

function handleSidenotes() {
  console.log('INIT handleSidenotes')

  // expanders
  let expanders = document.querySelectorAll('.trigger')
  expanders.forEach(function(entry, index) {
    entry.addEventListener('click', function(e) {
      e.stopPropagation()
      e.currentTarget.closest('.expander').classList.toggle('active')
    })
  })

  // sidenotes
  let sidenotes = document.querySelectorAll('.sidenote')
  sidenotes.forEach(function(entry, index) {
    //A) Sidenotes beside text: entry.querySelector('cite').addEventListener('click', function(e){
    //B) Sidenotes within text:
    entry.addEventListener('click', function(e) {
      e.stopPropagation()
      let link = e.currentTarget.querySelector('a').getAttribute('href')

      // LINK internal
      if (link.includes('#')) {
        // do something
        alert('jump to internal link — TO BE IMPLEMENTED')

        // IMAGE lightBox
      } else if (link.includes('cloudinary.com')) {
        // Open image in lightbox
        let lightboxContent = '<div class="mo-lightbox"><img src="' + link + '" /></div><div class="mo-close-handle"></div>'
        let lightboxInstance = basicLightbox.create(lightboxContent, {
          onShow: (instance) => {
            document.getElementsByTagName('body')[0].classList.add('overlay-is-active')
            setTimeout(() => {
              document.querySelector('.mo-lightbox + .mo-close-handle').addEventListener('click', function() {
                instance.close()
              })
            }, 50)
          },
          onClose: () => { document.getElementsByTagName('body')[0].classList.remove('overlay-is-active') }
        }).show()

        // LINK external
      } else {
        window.open(link, '_blank')
      }
    })
  })
}


// #################################################################################
// #################################################################################

function handleCTAs() {
  console.log('INIT handleCTAs')

  let ctas = document.querySelectorAll('.mo-cta-button > button')
  if (ctas.length > 0) {
    ctas.forEach(function(entry) {
      entry.addEventListener('click', function(e) {
        e.currentTarget.closest('.mo-translation').querySelector('.mo-cta-wrapper').classList.add('active')
      })
    })
  }

  let ctaCloseButtons = document.querySelectorAll('.mo-cta-wrapper .mo-close-handle')
  if (ctaCloseButtons.length > 0) {
    ctaCloseButtons.forEach(function(entry) {
      entry.addEventListener('click', function(e) {
        e.currentTarget.closest('.mo-cta-wrapper').classList.remove('active')
      })
    })
  }
}

window.scrollToMo = (order, scrollToStart) => {
  if (scrollToStart) {
    window.scrollTo(0, 0);
  }
  document.getElementById(`article-no-${order}`).scrollIntoView({ behavior: 'instant', block: 'start' });
  setTimeout(() => {
    window.scrollBy({
      top: 1300,
      left: 0,
      behavior: 'smooth'
    });
  }, 50);
  window.setActiveMapPlace(order);
  setTimeout(() => document.getElementById('mo-progress').classList.remove("hidden"), 200);
}
