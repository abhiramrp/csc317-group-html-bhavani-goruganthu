// fetch categories from backend and display in the select dropdown
fetch('http://localhost:4000/api/products/getAllCategories')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const categories = [];
    Object.values(data).forEach((data) =>
      categories.push(data.productCategory)
    );
    return categories;
  })
  .then((categories) => {
    let dropdown = document.getElementById('category');
    // calculate the length of the categories and add 1 for "All Products"
    dropdown.options.length = categories.length + 1;
    // insert "All Products as the first option"
    dropdown.options[0] = new Option('All Products', 0);
    // insert the rest of the categories in the dropdown
    categories.forEach((category, i) => {
      dropdown.options[i + 1] = new Option(category, i + 1);
    });
  });

// handle cart count update - get count from localStorage cartProducts
const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
if (cartProducts.length === 0) {
  document.getElementById('cart-count').innerText = cartProducts.length;
} else {
  let cartLength = 0;
  Object.values(cartProducts).filter((prod) => {
    cartLength += parseInt(prod.quantity);
  });
  document.getElementById('cart-count').innerText = cartLength;
}

// handle key press of Enter in the Search Input Field
document
  .querySelector('.search-input')
  .addEventListener('keypress', handleSearchEnterKey);
function handleSearchEnterKey(e) {
  if (e.key === 'Enter') {
    searchClick();
    window.parent.location.href = document.getElementById('search-icon').href;
  }
}

// handle click of the search-icon
document.getElementById('search-icon').addEventListener('click', searchClick);
function searchClick() {
  // get the category selected from the dropdown and the search keyword
  let select = document.getElementById('category');
  let selectedCategory = 'All Products';
  selectedCategory = select.options[select.selectedIndex].text;
  let searchKeyword = '';
  searchKeyword = document.querySelector('.search-input').value.trim();
  // add parameters to the href of the search-icon
  document.getElementById(
    'search-icon'
  ).href = `./src/search.html?category=${selectedCategory}&keyword=${searchKeyword}`;
}

// adding login button click event to show login page
document
  .getElementById('login-logout-btn-div')
  .addEventListener('click', handleLogInClick);
function handleLogInClick() {
  let loginLogoutIconText =
    document.getElementById('login-logout-icon').innerText;
  if (loginLogoutIconText === 'login') {
    window.parent.location.pathname = '/src/login.html';
  }
}

// code for changing login/signup button on the navbar to change to Logout for sysPref pagevar url =
// fetch login status from backend auth route
fetch('http://localhost:4000/userAuth/getUser', {
  // Adding method type
  method: 'GET',
  credentials: 'include', // use this to include cookies in your response
})
  .then((response) => {
    if (!response.ok) {
      // get the text from the response object
      const text = response.text();
      throw new Error(text);
    } else {
      return response.json();
    }
  })
  .then((data) => {
    updateNavIconsAfterLogin();
  })
  .catch((err) => {
    // throw caught error as an alert
    console.log(err);
  });

function updateNavIconsAfterLogin() {
  //remove Log In Button div from the navbar
  document.getElementById(
    'login-logout-btn-div'
  ).innerHTML = `<a target="_parent" class="all-links-text-decoration">
<button class="all-nav-btns">
    <span class="material-icons"  id="login-logout-icon">
        logout
    </span>
</button>
<br />
<h5 class="nav-link-name" id="login-logout-text"> Logout</h5>
</a>`;
  let settingsElement = `<div class="nav-links">
  <a href="./src/sysPref.html" target="_parent" class="all-links-text-decoration">
      <button class="all-nav-btns">
          <span class="material-icons">
              settings
          </span>
      </button>
      <br />
      <h5 class="nav-link-name"> Settings</h5>
  </a>
</div>`;
  let orderElement = `<div class="nav-links">
<a href="./src/userOrders.html" target="_parent" class="all-links-text-decoration">
    <button class="all-nav-btns">
        <span class="material-icons-outlined">
            list_alt
        </span>
    </button>
    <br />
    <h5 class="nav-link-name"> Orders</h5>
</a>
</div>`;
  document.getElementById('nav-btns-div').innerHTML += settingsElement;
  document.getElementById('nav-btns-div').innerHTML += orderElement;

  document
    .getElementById('login-logout-btn-div')
    .addEventListener('click', handleLogout);
  function handleLogout() {
    let loginLogoutIconText =
      document.getElementById('login-logout-icon').innerText;
    if (loginLogoutIconText === 'login') {
      window.parent.location.pathname = '/src/login.html';
    } else if (loginLogoutIconText === 'logout') {
      var userAnswer = window.confirm('You will be logged out. Are you sure?');
      if (userAnswer) {
        fetch('http://localhost:4000/userAuth/logout', {
          // Adding method type
          method: 'GET',
          credentials: 'include', // use this to get cookies in your response & delete them
        })
          .then((response) => {
            if (!response.ok) {
              // get the text from the response object
              const text = response.text();
              throw new Error(text);
            } else {
              return response.text();
            }
          })
          .then((data) => {
            parent.window.location.pathname = '/index.html';
          })
          .catch((err) => {
            // throw caught error as an alert
            console.log(err);
          });
      }
    }
  }
}
