// let productApi = 'http://localhost:8000/products'
// let sellerApi = 'http://localhost:8000/sellers'
// let btnAdd = $('#btnAdd')
let imgOfProducts = $('.imgOfProducts')
let inpName = $('.inpName')
let inpPrice = $('.inpPrice')
let inpQuantity = $('.inpQuantity')
let inpNumber = $('.inpNumber')
let inpSeller = $('.inpSeller')
let products = $('.products')
let editCard = null;
let page = 1
let pageCount = 1
let searchText = '';
// let likes = 0;
let thisPostLike

$('.inp-search').on('input', function (e) {
    searchText = e.target.value
    page = 1
    render()
})
$('#btnAdd').on('click', function () {
    $('#modalBox').css('display', 'block')

})
$('.btn-save').on('click', function () {
    if (!inpName.val() || !inpPrice.val() || !inpQuantity.val() || !inpSeller.val() || !inpNumber.val()) {
        alert('заполните поля')
        return
    }
    let products = {
        url: imgOfProducts.val(),
        name: inpName.val(),
        price: inpPrice.val(),
        quantity: inpQuantity.val(),
        number: inpNumber.val(),
        seller: inpSeller.val(),
        likes: 0
    }

    $('#modalBox').css('display', 'none')
    postNewProducts(products)
    render()
    imgOfProducts.val('')
    inpName.val('')
    inpNumber.val('')
    inpQuantity.val('')
    inpPrice.val('')
    inpSeller.val('')
})




function postNewProducts(products) {
    fetch('http://localhost:8000/products', {
        method: "POST",
        body: JSON.stringify(products),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(() => render())
}

async function render() {
    let res = await fetch(`http://localhost:8000/products?_page=${page}&_limit=4&q=${searchText}`)
    let data = await res.json()
    // console.log(data)
    products.html('')
    getPage()
    data.forEach((item) => {
        console.log(item)
        products.append(`
        <div class="card" id=${item.id}>
        
            <img class="card-img" src=${item.url} style="width: 230px; height: 230px">
                <ul class="card_item">
                <li class="item_li" style="list-style-type: none">${item.name}</li>
                <li class="item_li" style="list-style-type: none">${item.price}</li>
                <li class="item_li" style="list-style-type: none">${item.quantity}</li>
                <li class="item_li" style="list-style-type: none">${item.number}</li>
                <li class="item_li" style="list-style-type: none">${item.seller}</li>
                </ul>
            
                <button class="btn-delete"></button>
                <button class="btn-edit"></button>
                <button style="margin-right: 10px" id="${item.likes}" class="btn-dynamic btn-like">Like</button><span style=" font-size" class="likes">${item.likes}</span>
                
        </div>
        `)
    });
}

$('body').on('click', '.btn-delete', function (event) {
    let id = event.target.parentNode.id
    console.log(id)
    fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE"
    })
        .then(() => render())
})

$('body').on('click', '.btn-edit', function (e) {
    editCard = e.target.parentNode.id
    fetch(`http://localhost:8000/products/${editCard}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            $('.edit1').val(data.url)
            $('.edit2').val(data.name)
            $('.edit3').val(data.price)
            $('.edit4').val(data.quantity)
            $('.edit5').val(data.number)
            $('.edit6').val(data.seller)
            $('#modal').css('display', 'block')
        })
        .then(() => render())
}) 
// button to save edited data
$('.btnSave').on('click', function () {                       
    let producty = {                                       
        url: $('.edit1').val(),
        name: $('.edit2').val(),
        price: $('.edit3').val(),
        quantity: $('.edit4').val(),
        number: $('.edit5').val(),
        seller: $('.edit6').val()
    }
    fetch(`http://localhost:8000/products/${editCard}`, {       
        method: "PUT",                                         
        body: JSON.stringify(producty),                  
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(() => {                                               
            render()
            $('#modal').css('display', 'none')
        })
})

$('body').on('click', '.btn-like', function(event){
    // console.log(event)
    thisPostLike = event.target.parentNode.id;
    let likesCount = event.target.id
    console.log(likesCount)
    likesCount++
    let obj1 = {
        likes: likesCount
    }
    fetch(`http://localhost:8000/products/${thisPostLike}`, {
        method: "PATCH",
        body: JSON.stringify(obj1),
        headers: {
            "Content-type": 'application/json'
        }
    })
        .then(() =>  render())
})

//First modal button close
$('.btn-modal-close').on('click', function () {                   
    $('#modalBox').css('display', 'none')
})                          
function getPage() {                                              
    fetch(`http://localhost:8000/products?q=${searchText}`)      
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4)
            $('.paginationPage').remove()
            for (let i = pageCount; i >= 1; i--) {
                $('.btn-prev').after(`
            <span class="paginationPage">
            <span style="margin: 0 4px; cursor: pointer">${i}</span>
            </span>
            `)
            }
        })
}


//second modal button close
$('.btnModalClose').on('click', function () {                    
    $('#modal').css('display', 'none')
})


$('.btn-prev').on('click', function () {
    if (page <= 1) return
    page--
    render()
})

$('.btn-next').on('click', function () {
    if (page >= pageCount) return
    page++
    render()
})
$('body').on('click', '.paginationPage', function (e) {
    page = e.target.innerText;
    render()
})


render();



