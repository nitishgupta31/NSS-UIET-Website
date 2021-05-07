burger = document.querySelector('.burger100')
navbar = document.querySelector('.navbar100')
navList = document.querySelector('.nav-list100')
// rightNav = document.querySelector('.rightNav')
 


burger.addEventListener('click', ()=>{
    // rightNav.classList.toggle('v-class-resp');
    navList.classList.toggle('v-class-resp100');
    navbar.classList.toggle('h-nav-resp100');
    
})

navList.addEventListener('click', ()=>{
    navList.classList.toggle('v-class-resp100');
    navbar.classList.toggle('h-nav-resp100');
    
})