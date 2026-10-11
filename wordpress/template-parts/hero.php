<?php
/**
 * Template Part: ITZFIZZ Cinematic Animated Hero Section
 *
 * Description: Production-ready cinematic scroll-driven hero section with
 * GSAP 3 + ScrollTrigger, Bootstrap 5 grid layout for impact metrics,
 * accessible markup, and smooth GPU-accelerated motion choreography.
 *
 * @package Itzfizz
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

$welcome_chars = str_split( 'WELCOME' );
$itzfizz_chars = str_split( 'ITZFIZZ' );

$stats = array(
    array(
        'id'         => 'stat-1',
        'value'      => 58,
        'suffix'     => '%',
        'label'      => __( 'Increase in user interaction', 'itzfizz' ),
        'aria_label' => __( '58 percent increase in user interaction', 'itzfizz' ),
    ),
    array(
        'id'         => 'stat-2',
        'value'      => 23,
        'suffix'     => '%',
        'label'      => __( 'Increase in revenue', 'itzfizz' ),
        'aria_label' => __( '23 percent increase in revenue', 'itzfizz' ),
    ),
    array(
        'id'         => 'stat-3',
        'value'      => 27,
        'suffix'     => '%',
        'label'      => __( 'Boost in engagement', 'itzfizz' ),
        'aria_label' => __( '27 percent boost in engagement', 'itzfizz' ),
    ),
    array(
        'id'         => 'stat-4',
        'value'      => 40,
        'suffix'     => '%',
        'label'      => __( 'Decrease in bounce rate', 'itzfizz' ),
        'aria_label' => __( '40 percent decrease in bounce rate', 'itzfizz' ),
    ),
);
?>

<div id="heroScrollWrapper" class="itz-hero-scroll-wrapper" data-theme="lime">
    
    <!-- Hero Stage: min-height 100svh, exactly fills first screen above the fold -->
    <section id="heroStage" class="itz-hero-stage">
        
        <!-- Ambient Pulsing Radial Glow -->
        <div id="glowOuter" class="itz-glow-outer" aria-hidden="true">
            <div id="glowInner" class="itz-glow-inner"></div>
        </div>

        <!-- Top Header & Brand Bar -->
        <header class="itz-hero-header container-fluid px-3 px-md-5 pt-3 pt-md-4">
            <div class="d-flex justify-content-between align-items-center">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="itz-brand text-decoration-none d-flex align-items-center gap-2">
                    <span class="itz-brand-badge">IF</span>
                    <span class="itz-brand-title">ITZFIZZ</span>
                </a>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-sm itz-btn-glass" onclick="window.replayIntro && window.replayIntro()">
                        <i class="bi bi-arrow-repeat me-1"></i> REPLAY
                    </button>
                    <button type="button" class="btn btn-sm itz-btn-accent" id="wpThemeToggleBtn">
                        <span class="itz-dot"></span> <span id="wpThemeLabel">LIME</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Centered Headline (Outer for Intro, Inner for Scroll) -->
        <div id="headlineOuter" class="itz-headline-outer text-center my-auto">
            <div id="headlineInner" class="itz-headline-inner">
                <div class="itz-kicker font-monospace mb-2">
                    [ <span class="text-accent">HYPER-CINEMATIC</span> MOTION ARCHITECTURE ]
                </div>
                
                <h1 id="headlineText" class="itz-headline" aria-label="<?php esc_attr_e( 'Welcome Itzfizz', 'itzfizz' ); ?>">
                    <span class="itz-word-wrap">
                        <?php foreach ( $welcome_chars as $char ) : ?>
                            <span class="itz-char-mask"><span class="itz-char" aria-hidden="true"><?php echo esc_html( $char ); ?></span></span>
                        <?php endforeach; ?>
                    </span>
                    <span class="itz-word-space">&nbsp;</span>
                    <span class="itz-word-wrap">
                        <?php foreach ( $itzfizz_chars as $char ) : ?>
                            <span class="itz-char-mask"><span class="itz-char" aria-hidden="true"><?php echo esc_html( $char ); ?></span></span>
                        <?php endforeach; ?>
                    </span>
                </h1>

                <div class="itz-accent-line-track mx-auto mt-3">
                    <div id="accentLine" class="itz-accent-line"></div>
                </div>
            </div>
        </div>

        <!-- Main Visual Object: Centered Between Headline and Stats -->
        <div id="objectOuter" class="itz-object-outer text-center my-1 my-md-2">
            <div id="objectInner" class="itz-object-inner">
                <img 
                    src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/car-transparent.png' ); ?>" 
                    alt="" 
                    class="itz-hero-image img-fluid"
                    width="800" 
                    height="400" 
                    aria-hidden="true"
                    loading="eager"
                />
            </div>
        </div>

        <!-- Impact Metrics: Bootstrap 5 Responsive Grid (2x2 on mobile, 4 in a row on desktop) -->
        <div id="statsOuter" class="itz-stats-outer container-xl px-2 px-md-3">
            <div id="statsInner" class="itz-stats-inner">
                <ul class="itz-stats-row row g-0 list-unstyled mb-0" role="list" aria-label="<?php esc_attr_e( 'Impact Metrics', 'itzfizz' ); ?>">
                    <?php foreach ( $stats as $index => $stat ) : ?>
                        <li class="col-6 col-lg-3 itz-stat-block text-center p-3 p-md-4 position-relative">
                            <?php if ( $index < count( $stats ) - 1 ) : ?>
                                <span class="itz-stat-divider d-none d-lg-block" aria-hidden="true"></span>
                            <?php endif; ?>
                            
                            <div class="itz-stat-number-wrap font-heading" aria-label="<?php echo esc_attr( $stat['aria_label'] ); ?>">
                                <span id="stat-num-<?php echo esc_attr( $index ); ?>" class="itz-stat-number tabular-nums">0</span>
                                <span class="itz-stat-suffix"><?php echo esc_html( $stat['suffix'] ); ?></span>
                            </div>
                            <p class="itz-stat-label mb-0 mt-2">
                                <?php echo esc_html( $stat['label'] ); ?>
                            </p>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>

        <!-- Scroll Indicator Prompt -->
        <div class="itz-scroll-hint font-monospace text-center pb-2">
            <span>SCROLL TO ENGAGE</span> <span class="itz-scroll-arrow">↓</span>
        </div>

    </section>
</div>
