<?php
/*
Plugin Name: Club Mahabaleshwar Booking
Description: Room booking system.
Version: 1.0
*/

function club_booking_enqueue() {
  wp_enqueue_script('club-bundle', plugins_url('/dist/bundle.js', __FILE__), array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'club_booking_enqueue');

function club_booking_shortcode() {
  return '<div id="root"></div>';
}
add_shortcode('club_booking', 'club_booking_shortcode');
?>
