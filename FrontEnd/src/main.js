// filepath: src/main.js
/**
 * CineMax - Main Application Entry Point
 * Initializes the app and handles routing
 */

import { route, setRoute, parseRoute, initRouter } from './utils/router.js';
import { adminPage } from './screens/admin/admin.js';
import { homePage } from './screens/home.js';
import { detailPage } from './screens/movieDetail.js';
import { seatsPage } from './screens/seats.js';
import { checkoutPage } from './screens/checkout.js';
import { confirmationPage } from './screens/confirmation.js';
import { notFound } from './screens/notFound.js';
import { loginPage } from './screens/login.js';
import { registerPage } from './screens/register.js';


/**
 * Main render function - routes to appropriate page based on URL
 */
function render() {
  const { path, query, parts } = parseRoute();
  
  // Route to the appropriate page
  if (path === '/') {
    return homePage();
  }
  
  if (parts[0] === 'movie') {
    return detailPage(parts[1]);
  }
  
  if (parts[0] === 'seats') {
    return seatsPage(parts[1]);
  }
  
  if (parts[0] === 'checkout') {
    return checkoutPage(parts[1], query);
  }
  
  if (parts[0] === 'confirmation') {
    return confirmationPage(parts[1], query);
  }
  
  if (parts[0] === 'login') {
    return loginPage();
  }
  
  if (parts[0] === 'register') {
    return registerPage();
  }

  if (parts[0] === 'admin') {
  return adminPage(parts[1]);
}
  
  return notFound('Page not found');
}

// Initialize the router with hashchange listener
initRouter(render);

// Initial render on page load
render();