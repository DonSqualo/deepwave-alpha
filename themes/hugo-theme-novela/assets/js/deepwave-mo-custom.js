console.log('deepwave-mo-custom.js init')


document.addEventListener('DOMContentLoaded', function(e){
    
    handleMOClicks()
    //handleMOScrollMagic()
    handleMOAnimation()
    handleSidenotes()
    
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
// HANDLING FRAME BY FRAME ANIMATION

// via https://scrollmagic.io/examples/expert/image_sequence.html

function handleMOAnimation(){
    // define images
	var images = [
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
	var obj = {curImg: 0};

	// create tween
	var tween = TweenMax.to(obj, 0.5,
		{
			curImg: images.length - 1,       // animate propery curImg to number of images
			roundProps: "curImg",            // only integers so it can be used as an array index
			repeat: 1,                       // repeat X times
			immediateRender: true,           // load first image automatically
			ease: Linear.easeNone,           // show every image the same ammount of time
			onUpdate: function () {
                console.log(images[obj.curImg])
                document.querySelector('.mo-animation').style.backgroundImage = ('url("' + images[obj.curImg] + '")' )
			}
		}
	);

	// init controller
	var controller = new ScrollMagic.Controller();

	// build scene
	//var scene = 
    new ScrollMagic.Scene({triggerElement: "#MS1", duration: 400, offset: 0, triggerHook: 'onLeave'}) // , duration: 300
					.setTween(tween)
                    .setPin("#MS1")
					.addIndicators() // add indicators (requires plugin)
					.addTo(controller);
    
    // 
    new ScrollMagic.Scene({triggerElement: "#MS1", duration: 500, offset: 400, triggerHook: 'onLeave'})
        .setPin("#MS1")
        .setClassToggle("#MS1 .mo-translation", "myExtraClass")
        .addIndicators()
        .on("enter leave", myFunction)
        .addTo(controller);
    
    function myFunction(e){
        // https://scrollmagic.io/examples/expert/cascading_pins.html
        if(e.type == "enter"){}
        console.log("Scene entered")
    }
}




// #################################################################################
// #################################################################################

function handleMOScrollMagic(){

    //
    // init ScrollMagic controller
    //

    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave', // onEnter // onCenter // onLeave
            reverse: true
        }
    });


    /// EASING FUNCTIONS
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
    

    //
    // MO ScrollMagic
    //

    /// ERFASSE ALLE MOs
    let mos = document.querySelectorAll('.mo-section')

    if( mos.length > 0 ){

        /// FÜR JEDE MO SETUP SCROLLMAGIC SCENE
        mos.forEach(function(entry, index){
            
            // Animated elements
            let pOriginal = entry.querySelector('.mo-original p')

            
            // Scene ID
            var my_scene_id = entry.getAttribute('id')
            var scene_selector = '#' + my_scene_id

            // Scene Offset
            let scene_offset = 0 // Startpunkt der Scene in Pixel vom oberen Rand

            // Scene Duration
            let scene_duration = 300 // Dauer der Scene in Pixel

            let scene_vars = {
                triggerElement: scene_selector,
                duration: scene_duration,
                offset: scene_offset
            }

            createAnimationScene(my_scene_id, scene_vars)


            /// FUNCTION: CREATE SCROLLMAGIC SCENE
            function createAnimationScene(scene_id, scene_vars){

                /// ERSTELLE SCROLLMAGIC SCENE
                let scene = {}
                scene[scene_id] = new ScrollMagic.Scene(scene_vars)
                    .setPin(scene_vars.triggerElement)
                    //.addIndicators() // DEBUG
                    .addTo(controller)

                runAnimationScene(scene, scene_id)
            }


            /// FUNCTION: RUN SCROLLMAGIC SCENE
            function runAnimationScene(scene, scene_id){
                /// STARTE SCROLLMAGIC SCENE

                scene[scene_id].on('enter', function(event){
                    // Action here
                    console.log('entering')
                })
                
                scene[scene_id].on('progress', function(event){
                    //let padding = (50 * event.progress) + 'px'
                    let padding = easeInOutQuad((scene_duration * event.progress), 25.6, 60, scene_duration) + 'px'
                    pOriginal.style.setProperty('padding-bottom', padding)
                })

                scene[scene_id].on('leave', function(event){
                    // Action here
                    console.log('leaving')
                })
            }

        }) 
    } // END — MO ScrollMagic
    
}


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
    let expanders = document.querySelectorAll('.trigger')
    
    expanders.forEach(function(entry, index){
        entry.addEventListener('click', function(e){
            e.stopPropagation()
            e.currentTarget.closest('.expander').classList.toggle('active')
        })
    })
}