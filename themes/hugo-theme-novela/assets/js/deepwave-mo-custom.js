console.log('deepwave-mo-custom.js init')


document.addEventListener('DOMContentLoaded', function(e){
    
    handleMOClicks()
    //handleMOScrollMagic()
    
})

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
        })
    })
}