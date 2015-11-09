## Gigya Markup
All parameters are passed via data-* attributes. No JavaScript required!

[**View markup-only demo online.**](http://scotthovestadt.github.io/gigya-markup/) View [source code](https://github.com/scotthovestadt/gigya-markup/blob/master/index.html).

Install with ````bower install gigya-markup```` and place in ````<head>```` tag:
````html
<!-- Official Gigya SDK -->
<script type="text/javascript" src="http://cdn.gigya.com/JS/socialize.js?apiKey=<API KEY HERE>"></script>

<!-- Gigya Markup (included AFTER official Gigya SDK) -->
<script src="gy.js" type="text/javascript"></script>
````

## Usage Example
````html
<!-- Will only show when the user is logged out, visible by default (gy-hide-if). -->
<div class="gy-hide-if-logged-out">
  <h4>Please login</h4>

    <!-- Render login UI. -->
  <div class="gy-ui-login"></div>
</div>

<!-- Will only show when the user is logged in, invisible by default (gy-show-if). -->
<div class="gy-show-if-logged-in">
  <!-- Renders field from account info. -->
  <h4>Welcome back <span class="gy-ui-account-info" data-field="profile.firstName"></h4>
</div>
````

## Markup

### ````ui```` Markup
````ui```` markup allows rendering of Gigya UI components without JavaScript.

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

#### Login State
Bind element visibility to login state. In the example code below, the contents of ````if-logged-out```` is only shown when the user is logged out and the contents of ````if-logged-in```` is only shown when the user is logged in.
````html
<div class="gy-show-if-logged-out">
  <h4>Please login</h4>
  <div class="gy-ui-login"></div>
</div>

<div class="gy-show-if-logged-in">
  <h4>Welcome back <span class="gy-ui-account-info" data-field="profile.firstName"></h4>
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
