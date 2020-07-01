<!DOCTYPE html>
<html lang="en" class="no-javascript">
<?php include 'site-partials/_head.php'; ?>
<body>
<a class="visuallyhidden focusable" href="#content">Skip to the content</a>
<?php include 'site-partials/_header-logo.php';?>
<?php include 'site-partials/_hamburger-menu-trigger.html';?>
<?php include 'site-partials/_primary-navigation.php';?>
<?php include 'site-partials/_svg-shapeholder-a.php'; ?>
<?php include 'site-partials/_global-navigation-arrows.html'; ?>
<button name="scroll to explore the site" class="eit-homepage-scroll-indicator hide-small-screen">
    <span class="visuallyhidden">Scroll the site to explore</span>
	<?php include $_SERVER['DOCUMENT_ROOT'] . '/svgAssets/_eit-homepage-scroll-to-explore.html';?>
</button>
<main class="eit-content-wrapper" id="content">
<div class="eit-content-inner" id="js-section-container">
    <?php include 'site-partials/_section-homepage.php'; ?>
	<?php include 'site-partials/_section-introduction.html'; ?>
	<?php include 'site-partials/_section-tackling-challenges.html'; ?>
    <?php include 'site-partials/_section-eit-role.php'; ?>
    <?php include 'site-partials/_section-in-2020.php'; ?>
    <?php include 'site-partials/_section-six-focus-areas.php'; ?>
    <?php include 'site-partials/_section-digital-transformation.php'; ?>
    <?php include 'site-partials/_section-tackling-cancer.html'; ?>
    <?php include 'site-partials/_section-fighting-covid.html'; ?>
    <?php include 'site-partials/_section-global-impact.html'; ?>
    <?php include 'site-partials/_section-in-numbers.html'; ?>
    <?php include 'site-partials/_section-site-footer.php'; ?>
</div>
</main>
<div class="eit-fixed-elements">
    <div class="eit-fixed-elements-content-wrapper">
        <?php include 'site-partials/_section-global-impact-images.html'; ?>
        <?php include 'site-partials/_section-six-focus-areas-fixed-elements.html'; ?>
        <?php include 'site-partials/_section-in-numbers-fixed-elements.php'; ?>
    </div>
</div>
<?php include 'site-partials/_site-location-indicator.html'; ?>
<?php include 'site-partials/_footer-scripts.html'; ?>
</body>
</html>