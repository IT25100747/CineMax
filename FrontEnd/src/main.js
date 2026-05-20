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
import { profilePage } from './screens/profile.js';

/**
 * Main render function - routes to appropriate page based on URL
 */
function render() {
  const { path, query, parts } = parseRoute();

  console.log("Current Path:", path);
  console.log("Route Parts:", parts);

  // Home Page
  if (path === '/') {
    homePage();
    return;
  }

  // Movie Detail Page
  // Example: /movie/1
  if (parts[0] === 'movie' && parts[1]) {
    console.log("Opening Movie Detail Page:", parts[1]);
    detailPage(parts[1]);
    return;
  }

  // Seats Page
  // Example: /seats/1
  if (parts[0] === 'seats' && parts[1]) {
    console.log("Opening Seats Page:", parts[1]);
    seatsPage(parts[1], query);
    return;
  }

  // Checkout Page
  // Example: /checkout/1
  if (parts[0] === 'checkout' && parts[1]) {
    console.log("Opening Checkout Page:", parts[1]);
    checkoutPage(parts[1], query);
    return;
  }

  // Confirmation Page
  // Example: /confirmation/1
  if (parts[0] === 'confirmation' && parts[1]) {
    console.log("Opening Confirmation Page:", parts[1]);
    confirmationPage(parts[1], query);
    return;
  }

  // Login Page
  if (parts[0] === 'login') {
    loginPage();
    return;
  }

  // Register Page
  if (parts[0] === 'register') {
    registerPage();
    return;
  }

  // Profile Page
  if (parts[0] === 'profile') {
    profilePage();
    return;
  }

  // Admin Page
  if (parts[0] === 'admin') {
    adminPage(parts[1]);
    return;
  }

  // My Tickets Page
  if (parts[0] === 'mytickets') {
    import('./screens/mytickets.js').then(module => {
      module.myTicketsPage();
    });
    return;
  }

  // Page Not Found
  notFound('Page not found');
}

// Initialize router
initRouter(render);

// Initial page load
render();