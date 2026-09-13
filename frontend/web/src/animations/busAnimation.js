import { Animation, AnimationSkeleton } from "./AnimationSkeleton.js";
import { TRAINER_ANIMATION_EVENTS } from "./shakespeareAnimation.js";

const DESKTOP_DRIVE_DURATION_MS = Math.round(4000 / 1.3);
const DESKTOP_REFERENCE_WIDTH = 1440;
const DESKTOP_INITIAL_X = -0.5;
const DESKTOP_VISIBLE_X = 0.4;
const DESKTOP_PEEL_FALL_DURATION_MS = 500;
const DESKTOP_PEEL_ROAD_WAIT_MS = 1000;
const DESKTOP_PEEL_INITIAL_IDLE_MS = DESKTOP_DRIVE_DURATION_MS
    - DESKTOP_PEEL_FALL_DURATION_MS
    - DESKTOP_PEEL_ROAD_WAIT_MS;

function getDriveDuration(isMobile, viewportWidth, initialX, visibleX) {
    if (!isMobile) return DESKTOP_DRIVE_DURATION_MS;

    const desktopDistance = (DESKTOP_VISIBLE_X - DESKTOP_INITIAL_X)
        * DESKTOP_REFERENCE_WIDTH;
    const mobileDistance = (visibleX - initialX) * Math.max(1, viewportWidth);
    return Math.max(1, Math.round(
        DESKTOP_DRIVE_DURATION_MS * mobileDistance / desktopDistance,
    ));
}

export const BusAnimationParts = Object.freeze({
    Bus: `${import.meta.env.BASE_URL}animations/london-bus.png`,
    Wheel: `${import.meta.env.BASE_URL}animations/london-bus-wheel.png`,
    BananaPeel: `${import.meta.env.BASE_URL}animations/banana-peel.png`,
});

export function createBusTrainerAnimation(
    isMobile = false,
    viewportWidth = typeof window !== "undefined" ? window.innerWidth : DESKTOP_REFERENCE_WIDTH,
) {
    const offsets = {
        initialX: DESKTOP_INITIAL_X,
        initialY: isMobile ? 0.6 : 0.7,
        visibleX: isMobile ? 0.35 : DESKTOP_VISIBLE_X,
        hiddenY: 2,
        leftWheelAnchorX: 0.13,
        rightWheelAnchorX: 0.77,
        wheelAnchorY: 0.8,
        peelInitialX: 0.5,
        peelInitialY: -0.2,
        peelRoadY: isMobile ? 0.69 : 0.84,
        peelThrownX: 1.5,
        peelThrownY: 0.3,
        hopY: isMobile ? 0.4 : 0.55,
        bounceY: isMobile ? 0.51 : 0.66,
    };
    const driveDuration = getDriveDuration(
        isMobile,
        viewportWidth,
        offsets.initialX,
        offsets.visibleX,
    );
    const timingScale = driveDuration / DESKTOP_DRIVE_DURATION_MS;
    const peelInitialIdleDuration = Math.round(DESKTOP_PEEL_INITIAL_IDLE_MS * timingScale);
    const peelFallDuration = Math.round(DESKTOP_PEEL_FALL_DURATION_MS * timingScale);
    const peelRoadWaitDuration = driveDuration
        - peelInitialIdleDuration
        - peelFallDuration;
    const wheelRotationCount = isMobile ? 2 : 8;
    const wheelRotationDuration = driveDuration / wheelRotationCount;

    const busSkeleton = new AnimationSkeleton(
        BusAnimationParts.Bus,
        offsets.initialX,
        offsets.initialY,
        9990,
    );
    const busImg = busSkeleton.baseImage;
    const leftWheelImg = busSkeleton.AddChild(
        BusAnimationParts.Wheel,
        offsets.leftWheelAnchorX,
        offsets.wheelAnchorY,
        9991,
    );
    const rightWheelImg = busSkeleton.AddChild(
        BusAnimationParts.Wheel,
        offsets.rightWheelAnchorX,
        offsets.wheelAnchorY,
        9991,
    );

    const peelSkeleton = new AnimationSkeleton(
        BusAnimationParts.BananaPeel,
        offsets.peelInitialX,
        offsets.peelInitialY,
        9992,
    );
    const peelImg = peelSkeleton.baseImage;

    const busMotion = new Animation(busSkeleton);
    const peelMotion = new Animation(peelSkeleton);

    const driveStep = busMotion.translateXRelative(
        busImg,
        offsets.visibleX,
        driveDuration,
        false,
    );
    const wheelSpinStartStep = busMotion.rotateRelative(
        leftWheelImg,
        360,
        0.5,
        0.5,
        wheelRotationDuration,
        false,
    );
    const wheelSpinEndStep = busMotion.rotateRelative(
        rightWheelImg,
        360,
        0.5,
        0.5,
        wheelRotationDuration,
        true,
    );

    // Mobile uses two rotations instead of eight, making the wheels spin four
    // times slower without changing the duration of the drive itself.
    busMotion.loop(wheelSpinStartStep, wheelRotationCount - 1);
    busMotion.synchronize([driveStep, wheelSpinEndStep]);

    const flipStep = busMotion.rotateRelative(
        busImg,
        -180,
        0.5,
        0.5,
        300,
        false,
    );
    const hopStep = busMotion.translateYRelative(busImg, offsets.hopY, 250);
    const fallStep = busMotion.translateYRelative(busImg, offsets.initialY, 250);
    const bounceUpStep = busMotion.translateYRelative(busImg, offsets.bounceY, 120);
    const bounceDownStep = busMotion.translateYRelative(busImg, offsets.initialY, 140);
    busMotion.synchronize([flipStep]);
    busMotion.Idle(400);
    const hideStep = busMotion.translateYRelative(busImg, offsets.hiddenY, 1000);

    // Land one second before the bus arrives and remain on the road until impact.
    peelMotion.Idle(peelInitialIdleDuration);
    const peelFallStep = peelMotion.translateYRelative(
        peelImg,
        offsets.peelRoadY,
        peelFallDuration,
    );
    peelMotion.Idle(peelRoadWaitDuration);
    const peelThrowXStep = peelMotion.translateXRelative(
        peelImg,
        offsets.peelThrownX,
        300,
        false,
    );
    const peelThrowYStep = peelMotion.translateYRelative(
        peelImg,
        offsets.peelThrownY,
        300,
    );
    peelMotion.synchronize([peelThrowXStep, peelThrowYStep]);

    busMotion.on(TRAINER_ANIMATION_EVENTS.NEXT_SENTENCE, () => {
        if (!busSkeleton.visible) {
            busMotion.reset();
            return;
        }

        busMotion.executeForce(hideStep).finally(() => busMotion.reset());
    });
    peelMotion.on(TRAINER_ANIMATION_EVENTS.NEXT_SENTENCE, () => peelMotion.reset());

    const animation = {
        render() {
            return Promise.all([
                busMotion.render(),
                peelMotion.render(),
            ]);
        },
        reset() {
            busMotion.reset();
            peelMotion.reset();
        },
        stop() {
            busMotion.stop();
            peelMotion.stop();
        },
        emit(eventName, payload) {
            busMotion.emit(eventName, payload);
            peelMotion.emit(eventName, payload);
        },
    };

    return {
        skeleton: busSkeleton,
        skeletons: { busSkeleton, peelSkeleton },
        animation,
        animations: { busMotion, peelMotion },
        isMobile,
        offsets,
        timings: {
            driveDuration,
            wheelRotationCount,
            wheelRotationDuration,
            peelInitialIdleDuration,
            peelFallDuration,
            peelRoadWaitDuration,
        },
        images: { busImg, leftWheelImg, rightWheelImg, peelImg },
        steps: {
            driveStep,
            wheelSpinStartStep,
            wheelSpinEndStep,
            flipStep,
            hopStep,
            fallStep,
            bounceUpStep,
            bounceDownStep,
            peelFallStep,
            peelThrowXStep,
            peelThrowYStep,
            hideStep,
        },
    };
}
