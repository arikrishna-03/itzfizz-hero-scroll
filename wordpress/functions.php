<?php
/**
 * ITZFIZZ Theme Functions & Enqueues
 *
 * Enqueues GSAP 3, ScrollTrigger, Bootstrap 5 grid/utilities,
 * and the hero animation engine ONLY on the front page.
 *
 * @package Itzfizz
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue scripts and styles for the hero section.
 */
function itzfizz_enqueue_hero_assets() {
    // Only load cinematic assets on the front page or specific template
    if ( is_front_page() || is_home() ) {
        // 1. Google Fonts: Space Grotesk & Inter
        wp_enqueue_style(
            'itzfizz-google-fonts',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700;800&display=swap',
            array(),
            null
        );

        // 2. Bootstrap 5.3 CSS (Layout & utilities only)
        wp_enqueue_style(
            'bootstrap-5-grid',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
            array(),
            '5.3.3'
        );

        // 3. Hero Custom Styles
        wp_enqueue_style(
            'itzfizz-hero-style',
            get_template_directory_uri() . '/assets/css/hero.css',
            array( 'bootstrap-5-grid' ),
            '1.0.0'
        );

        // 4. GSAP 3 (Pinned version 3.12.5)
        wp_enqueue_script(
            'gsap-core',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
            array(),
            '3.12.5',
            true
        );

        // 5. ScrollTrigger (Pinned version 3.12.5)
        wp_enqueue_script(
            'gsap-scroll-trigger',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
            array( 'gsap-core' ),
            '3.12.5',
            true
        );

        // 6. Hero Animation Controller
        wp_enqueue_script(
            'itzfizz-hero-engine',
            get_template_directory_uri() . '/assets/js/hero.js',
            array( 'gsap-core', 'gsap-scroll-trigger' ),
            '1.0.0',
            true
        );

        // Localize config constants for easy tweaking from WordPress admin
        wp_localize_script(
            'itzfizz-hero-engine',
            'ITZFIZZ_HERO_CONFIG',
            array(
                'intro'  => array(
                    'letterStagger'  => 0.045,
                    'letterDuration' => 1.0,
                    'statGap'        => 0.18,
                    'statDuration'   => 0.9,
                    'countDuration'  => 1.6,
                    'ease'           => 'expo.out',
                    'startDelay'     => 0.3,
                ),
                'scroll' => array(
                    'pinDistance' => array(
                        'desktop' => '300%',
                        'tablet'  => '250%',
                        'mobile'  => '200%',
                    ),
                    'scrub'       => 1.2,
                    'travelX'     => array(
                        'desktop' => 30,
                        'tablet'  => 24,
                        'mobile'  => 16,
                    ),
                    'ease'        => 'power2.inOut',
                ),
                'stats'  => array( 58, 23, 27, 40 ),
            )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'itzfizz_enqueue_hero_assets' );
