## Gigya Markup
All parameters are passed via data-* attributes. Dimensions of UI elements automatically set from CSS. No JavaScript required!

[**View markup-only demo.**](http://scotthovestadt.github.io/gigya-markup/) View [source code](https://github.com/scotthovestadt/gigya-markup/blob/master/index.html).

Install with ````bower install gigya-markup```` and place in ````<head>```` tag:
````html
<!-- Official Gigya SDK -->
<script type="text/javascript" src="http://cdn.gigya.com/JS/socialize.js?apiKey=<API KEY HERE>"></script>

<!-- Gigya Markup (included AFTER official Gigya SDK) -->
<script src="gy.js" type="text/javascript"></script>
````

## Side-by-side code comparison
Compare Gigya SDK-only code with the Gigya Markup alternative. (Note: Gigya Markup sits on top of the Gigya SDK and they can be used together when necessary.)

### Markup only
<a href="http://scotthovestadt.github.io/gigya-markup/examples/code-comparison-markup.html">View code in browser.</a>
````html
<!-- Will only show when the user is logged out, visible by default (gy-hide-if). -->
<div class="gy-hide-if-logged-in">
  <h4>Please login</h4>

  <!-- Render login UI. Dimensions set via CSS (inline CSS is NOT required). -->
  <div class="gy-ui-login"
       data-enabled-providers="facebook, twitter, linkedin, google"
       style="width: 140px; height: 35px;"></div>
</div>

<!-- Will only show when the user is logged in, invisible by default before screen is painted (gy-show-if). -->
<div class="gy-show-if-logged-in">
  <!-- Renders field from account info. -->
  <h4>Welcome back <span class="gy-ui-account-info" data-field="profile.firstName"></span></h4>

  <!-- Logout when clicked. -->
  <a class="gy-click-logout" href="#">Logout</a>
</div>
````

### Gigya SDK only
````html
<script type="text/javascript">
$(document).ready(function() {
  // Render login UI. Dimensions must be set in JavaScript code.
  gigya.socialize.showLoginUI({
    containerID: 'login-ui',
    enabledProviders: 'facebook, twitter, linkedin, google',
    width: 140,
    height: 35
  });

  // Bind to logout link.
  $('.logout').on('click', function() {
    gigya.accounts.logout();
  });

  // Bind to account login events and current session.
  gigya.accounts.addEventHandlers({
    onLogin: drawElements,
    onLogout: drawElements
  });
  gigya.accounts.getAccountInfo({
    callback: drawElements
  });
  function drawElements(account) {
    if(account && account.UID) {
      // User is logged in.
      $('.logged-in-container').show();
      $('.not-logged-in-container').hide();
      $('.first-name').text(account && account.profile ? account.profile.firstName : '');
    } else {
      // User is not logged in.
      $('.logged-in-container').hide();
      $('.not-logged-in-container').show();
      $('.first-name').text('');
    }
  }
});
</script>

<div class="not-logged-in-container">
  <h4>Please login</h4>
  <div id="login-ui"></div>
</div>

<div style="display: none;" class="logged-in-container">
  <h4>Welcome back <span class="first-name"></span></h4>
  <a class="logout" href="#">Logout</a>
</div>
````

## Markup

### ````ui```` markup
````ui```` markup allows rendering of Gigya UI components without JavaScript. Gigya UI methods typically include ````containerID````, ````width````, and ````height````. ````containerID```` is automatically set to the ID of the element (when necessary, a new ID is created and attached). ````width```` and ````height```` are automatically set from CSS and do not need to manually be provided.

If a UI fails to render, the message "An error has occurred. Please try again later." will be shown in place of the UI. To customize this message, the parameter ````data-error-message```` can be passed via markup.

#### Login UI
Documentation: http://developers.gigya.com/display/GD/socialize.showLoginUI+JS
````html
<div class="gy-ui-login" data-enabled-providers="facebook,twitter"></div>
````

#### Screen Set UI
Documentation: http://developers.gigya.com/display/GD/accounts.showScreenSet+JS
````html
<div class="gy-ui-screen-set" data-screen-set="Default-RegistrationLogin"></div>
````

#### Account Info
Binds to [Profile](http://developers.gigya.com/display/GD/Profile+JS) field for logged-in user. Blank when user is not logged in.
````html
<div class="gy-ui-account-info" data-field="profile.firstName"></div>
````

#### Share Bar UI
Documentation: http://developers.gigya.com/display/GD/socialize.showShareBarUI+JS
````html
<div class="gy-ui-share-bar" data-share-buttons="share,facebook,facebook-like,googleplus"></div>
````

#### Leaderboard UI
Documentation: http://developers.gigya.com/display/GD/gm.showLeaderboardUI+JS
````html
<div class="gy-ui-leaderboard"></div>
````

#### Challenge Status UI
Documentation: http://developers.gigya.com/display/GD/gm.showChallengeStatusUI+JS
````html
<div class="gy-ui-challenge-status"></div>
````

#### User Status UI
Documentation: http://developers.gigya.com/display/GD/gm.showUserStatusUI+JS
````html
<div class="gy-ui-user-status"></div>
````

#### Feed UI
Documentation: http://developers.gigya.com/display/GD/socialize.showFeedUI+JS
````html
<div class="gy-ui-feed"></div>
````

### ````if```` markup
````if```` markup allows you to bind element visibility to Gigya state. All bindings are available on both the ````gy-show-if```` and the ````gy-hide-if```` namespaces. ````gy-show-if```` bindings are always **hidden** on page load before the screen is painted and are only revealed when the condition is met (which may require loading state from Gigya). ````gy-hide-if```` bindings are always **visible** on page load and are hidden when the condition is met.

#### Session
Bind element visibility to session. In the example code below, the contents of ````if-logged-out```` is only shown when the user is logged out and the contents of ````if-logged-in```` is only shown when the user is logged in.
````html
<div class="gy-show-if-logged-out">
  <h4>Please login</h4>
  <div class="gy-ui-login"></div>
</div>

<div class="gy-show-if-logged-in">
  <h4>Welcome back <span class="gy-ui-account-info" data-field="profile.firstName"></span></h4>
</div>
````

#### Conditional
Bind element visibility to condition. Use ````account.get```` to safely access even deep fields eg "profile.firstName".
````html
<div class="gy-show-if-condition" data-condition="account.get('loginProvider') === 'facebook'">
  This only shows up if you login with Facebook.
</div>
````

### ````click```` markup
````click```` markup allows you to bind actions to any clickable element.

#### Login
Documentation: http://developers.gigya.com/display/GD/socialize.login+JS
````html
<a class="gy-click-login" data-provider="facebook">Login with Facebook</a>
````

#### Logout
Documentation: http://developers.gigya.com/display/GD/socialize.logout+JS
````html
<a class="gy-click-logout">Logout</a>
````

#### Screen Set
Documentation: http://developers.gigya.com/display/GD/accounts.showScreenSet+JS
````html
<a class="gy-click-screen-set" data-screen-set="Default-RegistrationLogin">Launch Screen Set</a>
````