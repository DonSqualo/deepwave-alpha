console.log('deepwave-mo-custom.js init')


document.addEventListener('DOMContentLoaded', function(e){
    
    handleMOClicks()
    //handleMOScrollMagic()
    handleMOAnimation()
    handleSidenotes()
    handleCTAs()
    
})



// #################################################################################
// #################################################################################
// CHECKING WEBP SUPPORT

// via https://developpaper.com/determine-whether-the-browser-supports-webp-images/

//The developer tool of Chrome browser is used to capture and display packages, and the fields related to response header and request header can be viewed;
//Judge whether the accept contains the image / webp field. If it does, webp is supported. Otherwise, it is not supported.
//Function returns true or false; true is supported, but false is not;
function browser_check_webp( ) {
    try{
        //!]. Map is mainly used to judge whether the browser is IE9 +, so as to avoid the todataurl method hanging up;
        //If you directly extend the map method to the array prototype, you need to use methods other than!]. Map to judge, for example!! window.addEventListener  Etc;
        return ( !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0 );
    }catch( err ) {
        return  false;
    }
}



// #################################################################################
// #################################################################################
// PRELOADING IMAGES WITH JS

// via https://www.codegrepper.com/code-examples/javascript/javascript+preload+images

/* 
  Standards friendly image preloading
  Generates `<link rel="preload" as="image" href="important_image.png">`
  Ref: https://web.dev/preload-responsive-images/#preload-overview
*/
 
function preloadImages(images) {
  for (i = 0; i < images.length; i++) {
    let l = document.createElement('link')
    l.rel = 'preload'
    l.as = 'image'
    l.href = images[i]
    document.head.appendChild(l)
  }
}

// Usage:
imageUrlHeap = ['http://example.com/test/img-1.jpg','http://example.com/test/img-2.jpg','http://example.com/test/img-3.jpg'];
//preloadImages(imageUrlHeap);


// #################################################################################
// #################################################################################
// EASING FUNCTIONS

// t = time, b = beginning value, c = change in value, d = duration
function easeInOutQuad (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
function easeInOutBack (t, b, c, d) {
    let s = 1.70158
    //if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
function easeInOutBackS (t, b, c, d, s) {
    //let s = 1.70158
    //if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
function easeInOutExpo (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}




// #################################################################################
// #################################################################################
// HANDLING FRAME BY FRAME ANIMATION

// via https://scrollmagic.io/examples/expert/image_sequence.html

function handleMOAnimation(){
    
    /// TIMING VARS
    let pauseBefore = 200           // Pause before animation
    let animationDuration = 400     // ## Multiply with number of frames
    let pauseBetween = 200          // Pause after animation
    let translationDuration = 500   // Translation visibility
    let pauseAfter = 200            // Pause before next slide
    
    let slideTotal = pauseBefore + animationDuration + pauseBetween + translationDuration + pauseAfter
    console.log('slideTotal: ' + slideTotal)
    
    /// ERFASSE ALLE SECTIONS
    let moSections = document.querySelectorAll('.mo-sections-wrapper')
    if(moSections.length > 0){
        moSections.forEach(function(entry, index){
            
            console.log('SECTION WRAPPER START')
            
            // init ScrollMagic controller
            let controller = new ScrollMagic.Controller({
                globalSceneOptions: {
                    triggerHook: 'onLeave', // onEnter // onCenter // onLeave
                    reverse: true
                }
            });
            
            // CALLBACK SLIDETRANSITION
            let counter = 0

            function nextSlide(e){
                if(e.scrollDirection == 'FORWARD'){
                    counter += 1
                    document.querySelector('#MS' + counter).classList.add('visited')
                } else if(e.scrollDirection == 'REVERSE'){
                    document.querySelector('#MS' + counter).classList.remove('visited')
                    counter -= 1
                } else{
                    // do nothing
                }
            }
            
            // SECTION DURATION
            let sectionDuration = 0
            
    
            /// ERFASSE ALLE MOs
            let mos = entry.querySelectorAll('.mo-section')
            if( mos.length > 0 ){
                mos.forEach(function(entry, index){
                    
                    // Scene ID
                    var sceneID = entry.getAttribute('id')
                    var sceneSelector = '#' + sceneID
                    var triggerElmt = entry.querySelector('.mo-single')
                    
                    console.log('_SLIDE: ' + sceneID)
                    //TEST console.log('__sceneSelector: ' + sceneSelector)
                    //TEST console.log('__triggerElmt: ')
                    //TEST console.log(triggerElmt)
                    
                    /// PRELOAD IMAGES
    // ###
    // define images
	var images = [
        "",
		"/animations/ms1/Meeresschutzgebiet02_00200.png",
        "/animations/ms1/Meeresschutzgebiet02_00199.png",
        "/animations/ms1/Meeresschutzgebiet02_00197.png",
        "/animations/ms1/Meeresschutzgebiet02_00195.png",
        "/animations/ms1/Meeresschutzgebiet02_00193.png",
        "/animations/ms1/Meeresschutzgebiet02_00191.png",
        "/animations/ms1/Meeresschutzgebiet02_00189.png",
        "/animations/ms1/Meeresschutzgebiet02_00187.png",
        "/animations/ms1/Meeresschutzgebiet02_00185.png",
        "/animations/ms1/Meeresschutzgebiet02_00183.png",
        "/animations/ms1/Meeresschutzgebiet02_00181.png",
        "/animations/ms1/Meeresschutzgebiet02_00179.png",
        "/animations/ms1/Meeresschutzgebiet02_00177.png",
        "/animations/ms1/Meeresschutzgebiet02_00175.png"
	];
                    
                    // TweenMax can tween any property of any object. We use this object to cycle through the array
                    let obj = {curImg: 0};

                    // create tween
                    let tween = TweenMax.to(obj, 0.5,
                        {
                            curImg: images.length - 1,       // animate property curImg to number of images
                            roundProps: "curImg",            // only integers so it can be used as an array index
                            repeat: 1,                       // repeat X times
                            immediateRender: false,          // do not load first image automatically
                            ease: Linear.easeNone,           // show every image the same ammount of time
                            onUpdate: function () {
                                entry.querySelector('.mo-animation').style.backgroundImage = ('url("' + images[obj.curImg] + '")' )
                            }
                        }
                    );

                    // Scene Offset
                    let sceneOffset = 0 //slideTotal * index + index // Startpunkt der Scene in Pixel vom oberen Rand

                    console.log('__sceneOffset: ' + sceneOffset)
                    
                    // Scene Duration
                    // let sceneDuration = ### CALCULATE NO OF FRAMES * FACTOR X

                    
                    // Slide Transition
                    if(index != 0){
                        
                        //TEST console.log('   this is not the first slide')
                        let switchIndicatorText = 'SWITCH ' + index
                        
                        new ScrollMagic.Scene({triggerElement: triggerElmt, duration: 1, offset: sceneOffset, triggerHook: 'onLeave'})
                        .setPin(triggerElmt)
                        .addIndicators({name: switchIndicatorText})
                        .on("enter", nextSlide)
                        .addTo(controller);
                        
                        console.log('__sceneOffset from !first: ' + sceneOffset)
                        sceneOffset += 1
                        
                    } else{
                        //TEST console.log('   this IS the first slide')
                    }
                    
                    
                    // Pause before
                    new ScrollMagic.Scene({triggerElement: triggerElmt, duration: pauseBefore, offset: sceneOffset, triggerHook: 'onLeave'})
                        .setPin(triggerElmt)
                        .addIndicators()
                        .addTo(controller);

                    // Animation
                    new ScrollMagic.Scene({triggerElement: triggerElmt, duration: animationDuration, offset: (sceneOffset + pauseBefore), triggerHook: 'onLeave'})
                                    .setTween(tween)
                                    .setPin(triggerElmt)
                                    .addIndicators()
                                    .addTo(controller);

                    // Pause between
                    new ScrollMagic.Scene({triggerElement: triggerElmt, duration: pauseBetween, offset: (sceneOffset + pauseBefore + animationDuration), triggerHook: 'onLeave'})
                        .setPin(triggerElmt)
                        .addIndicators()
                        .addTo(controller);

                    // Translation
                    let translationHandle = entry.querySelector('.mo-translation')
                    new ScrollMagic.Scene({triggerElement: triggerElmt, duration: translationDuration, offset: (sceneOffset + pauseBefore + animationDuration + pauseBetween), triggerHook: 'onLeave'})
                        .setPin(triggerElmt)
                        .setClassToggle(translationHandle, "active")
                        .addIndicators()
                        .addTo(controller);

                    // Pause after
                    new ScrollMagic.Scene({triggerElement: triggerElmt, duration: pauseAfter, offset: (sceneOffset + pauseBefore + animationDuration + pauseBetween + translationDuration), triggerHook: 'onLeave'})
                        .setPin(triggerElmt)
                        .addIndicators()
                        .addTo(controller);
                    
                    
                    
                    
                    
                    /*
                    
                    let sceneVars = {
                        triggerElement: triggerElmt,
                        duration: animationDuration,
                        offset: sceneOffset
                    }

                    createAnimationScene(sceneID, sceneVars)


                    /// FUNCTION: CREATE SCROLLMAGIC SCENE
                    function createAnimationScene(sceneID, sceneVars){

                        /// ERSTELLE SCROLLMAGIC SCENE
                        let scene = {}
                        scene[sceneID] = new ScrollMagic.Scene(sceneVars)
                            .setPin(sceneVars.triggerElement)
                            //.addIndicators() // DEBUG
                            .addTo(controller)

                        runAnimationScene(scene, sceneID)
                    }


                    /// FUNCTION: RUN SCROLLMAGIC SCENE
                    function runAnimationScene(scene, sceneID){
                        /// STARTE SCROLLMAGIC SCENE

                        scene[sceneID].on('enter', function(event){
                            // do something
                            console.log(sceneID + 'entered')
                        })

                        scene[sceneID].on('progress', function(event){
                            // do something
                        })

                        scene[sceneID].on('leave', function(event){
                            // do something
                            console.log('leaving')
                        })
                    }
                    
                    */
                    
                    

                }) 
            }
            
            

            // SECTION
            let sectionTrigger = entry
            let sectionIndicatorName = 'Sec' + index
            console.log('sectionTrigger: ')
            console.log(sectionTrigger)
            new ScrollMagic.Scene({triggerElement: sectionTrigger, duration: (slideTotal * mos.length + mos.length), offset: 0, triggerHook: 'onLeave'})
                //.addIndicators({name: sectionIndicatorName})
                .on("enter leave", sectionCallback)
                .addTo(controller);
            
            // SECTION CALLBACK
            function sectionCallback(e){
                // https://scrollmagic.io/examples/expert/cascading_pins.html
                if(e.type == "enter"){
                    console.log("Scene entered: ")
                    console.log(entry)
                } else if(e.type == "leave"){
                    console.log("Scene left")
                } 
            }
            
        })
    
    }
}


// #################################################################################
// #################################################################################




/*

    #DO
    
    VIDEO
    Control steps framewise
    https://codepen.io/mradionov/pen/vYNvyym?editors=0010

*/


// #################################################################################
// #################################################################################

function handleMOClicks(){
    // Find all MOs
    let mos = document.querySelectorAll('.mo-single')
    
    mos.forEach(function(entry, index){        
        
        // Find all Explanations in each MO Translation
        let explanations = entry.querySelectorAll('.mo-explanation')
        // Find all Anchor-Links in each MO Original
        let explanationLinks = entry.querySelectorAll('a[href^="#"]')
        
        
        // Make Explanations clickable
        explanations.forEach(function(entry, index){
            
            entry.addEventListener('click', function(e){
                
                if(!e.currentTarget.classList.contains('active')){
                    // remove .active if assigned to another explanation                 
                    let activeExplanation = document.querySelector('.mo-explanation.active')
                    if(activeExplanation){ activeExplanation.classList.remove('active') }

                    // remove .active if assigned to another link in original text
                    let activeLink = document.querySelector('a[href^="#"].active')
                    if(activeLink){ activeLink.classList.remove('active') }
                }
                
                // activate clicked explanation and link
                explanationLinks[index].classList.toggle('active')
                e.currentTarget.classList.toggle('active')
                
            })
        })
        
        // Make Links in Original Text clickable
        explanationLinks.forEach(function(entry, index){

            entry.addEventListener('click', function(e){
                e.preventDefault()
                
                if(!e.currentTarget.classList.contains('active')){
                    // remove .active if assigned to another explanation                 
                    let activeExplanation = document.querySelector('.mo-explanation.active')
                    if(activeExplanation){ activeExplanation.classList.remove('active') }

                    // remove .active if assigned to another link in original text
                    let activeLink = document.querySelector('a[href^="#"].active')
                    if(activeLink){ activeLink.classList.remove('active') }
                }
                                
                // activate clicked link and explanation
                explanations[index].classList.toggle('active')
                e.currentTarget.classList.toggle('active')

            })
            
            // Show Translation regardless of animation state
            entry.addEventListener("mouseover", function(e){
                e.currentTarget.closest('.mo-single').querySelector('.mo-translation').classList.add('tease')
            })
            entry.addEventListener("mouseout", function(e){
                e.currentTarget.closest('.mo-single').querySelector('.mo-translation').classList.remove('tease')
            })
        })
    })
}


// #################################################################################
// #################################################################################

function handleSidenotes(){
    console.log('init handleSidenotes')
    
    // expanders
    let expanders = document.querySelectorAll('.trigger')
    expanders.forEach(function(entry, index){
        entry.addEventListener('click', function(e){
            e.stopPropagation()
            e.currentTarget.closest('.expander').classList.toggle('active')
        })
    })
    
    // sidenotes
    let sidenotes = document.querySelectorAll('.sidenote')
    sidenotes.forEach(function(entry, index){
        //#Sidenotes beside: entry.querySelector('cite').addEventListener('click', function(e){
        //#Sidenotes within:
        entry.addEventListener('click', function(e){
            e.stopPropagation()
            let link = e.currentTarget.querySelector('a').getAttribute('href')
            console.log(link)
            if(link.includes('#')){ // Link intern
                // do something
                alert('jump to internal link — TO BE IMPLEMENTED')
            } else if(link.includes('cloudinary.com')){ // Image
                // do something
                alert('open image in lightbox — TO BE IMPLEMENTED')
            } else{ // Link extern
                window.open(link, '_blank')
            }
        })
    })
}

// #################################################################################
// #################################################################################

function handleCTAs(){
    console.log('init handleCTAs')
    
    let ctas = document.querySelectorAll('.mo-cta-button > button')
    if(ctas.length > 0){
        ctas.forEach(function(entry){
            entry.addEventListener('click', function(e){
                e.currentTarget.closest('.mo-translation').querySelector('.mo-cta-wrapper').classList.add('active')
            })
        })
    }
    
    let ctaCloseButtons = document.querySelectorAll('.mo-cta-close')
    if(ctaCloseButtons.length > 0){
        ctaCloseButtons.forEach(function(entry){
            entry.addEventListener('click', function(e){
                e.currentTarget.closest('.mo-cta-wrapper').classList.remove('active')
            })
        })
    }
}