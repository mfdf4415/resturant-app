const body = document.querySelector("body")
const menuBar = document.querySelector("#menu-bar")
const nav = document.querySelector(".nav")
const searchIcon = document.querySelector("#search-icon")
const searchBox = document.querySelector(".search-box")
const closeIcon = document.querySelector("#close-search")
const closeCart = document.querySelector("#close-cart")
const menuContainer = document.querySelector("#menu-container")
const cartContainer = document.querySelector("#cart-container")
const shopingCartBox = document.querySelector(".shoping-cart-box")
const cartIcon = document.querySelector("#cart-icon")

let items = []

menuBar.addEventListener("click", () => {
    menuBar.classList.toggle("fa-times")
    nav.classList.toggle("active")
})

window.addEventListener("scroll", () => {
    menuBar.classList.remove("fa-times")
    nav.classList.remove("active")
})

searchIcon.addEventListener("click", () => {
    searchBox.classList.toggle("active")
})

closeIcon.addEventListener("click", () => {
    searchBox.classList.remove("active")
})

cartIcon.addEventListener("click", () => {
    shopingCartBox.classList.toggle("active")
})

closeCart.addEventListener("click",() => {
    shopingCartBox.classList.remove("active")
})


class typeWriter {
    constructor(txtElement, words, wait) {
        this.txtElement = txtElement
        this.words = words
        this.txt = ""
        this.wordindex = 0
        this.wait = wait
        this.type()
        this.isDeleting = false
    }

    type() {
        const current = this.wordindex % this.words.length
        const fullTxt = this.words[current]

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1)
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1)
        }

        this.txtElement.innerHTML = this.txt

        let typeSpeed = 300

        if (this.isDeleting) {
            typeSpeed /= 2
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait
            this.isDeleting = true
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false
            this.wordindex++
            typeSpeed = 500
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}

document.addEventListener("DOMContentLoaded",() => {
    init()
    getMenusItem()
})

function init() {
    const txtElement = document.getElementById("txt-type")
    const words = JSON.parse(txtElement.getAttribute("data-words"))
    const wait = txtElement.getAttribute("data-wait")

    new typeWriter(txtElement, words, wait)
}


function getMenusItem() {
    fetch("./js/menus.json")
    .then(res => res.json())
    .then(data => {
        showProduct(data)
    })
}

function showProduct(data) {
    data.forEach(food => {
        const div = document.createElement("div")
        div.className = "box"
        div.innerHTML = `
        <i class="fa-solid fa-heart"></i>
        <img src="${food.src}" alt="">
        <h3>${food.name}</h3>
        <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
        </div>
        <span>${food.price}</span>
        <button class="btn" id="add-btn">add to cart</button>
        `
        menuContainer.appendChild(div)
    })
    const addBtn = document.querySelectorAll("#add-btn")
    for (let i = 0; i < addBtn.length; i++) {
        addBtn[i].addEventListener("click",addToCart)
        
    }
}

function addToCart (e) {
   let item = {
       name: e.target.parentElement.children[2].textContent,
       src: e.target.parentElement.children[1].src,
       price: +e.target.parentElement.children[4].textContent
   }

   if(localStorage.getItem("prdInCart") === null) {
       items.push(item)
       localStorage.setItem("prdInCart",JSON.stringify(items))  
   }
   else {
       let items = JSON.parse(localStorage.getItem("prdInCart"))
       items.push(item)
       localStorage.setItem("prdInCart", JSON.stringify(items))
   }
   showInCart()
}

body.onload = showInCart()

function showInCart () {
    let foodInCart = JSON.parse(localStorage.getItem("prdInCart"))
    foodInCart.forEach(item => {
        const div = document.createElement("div")
        div.className = "in-cart"
        div.innerHTML = `
        <div class="info">
            <img src="${item.src}" alt="">
            <div class="price">${item.price}</div>
            <div class="cuonter">
                <i class="fa-solid fa-minus"></i>
                <span>2</span>
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="total-price">16.49£</div>
            <i class="fa-solid fa-trash" id="delet-prd"></i>
        </div>
        <div class="name">${item.name}</div>
        <p class="descreption">Lorem ipsum dolor  hello gyse allright how.</p>
        <hr>
        `
        cartContainer.appendChild(div)
    })
}

