import { Animation, AnimationSkeleton } from "./AnimationSkeleton.js";

export const AnimationParts = Object.freeze({
    Shakespeare: "/animations/shakespeare.png",
    ThumbsUp: "/animations/shakespeare-thumbs-up.png",
});

export const TRAINER_ANIMATION_EVENTS = Object.freeze({
    START: "trainerAnimationStart",
    NEXT_SENTENCE: "trainerNextSentence",
});

export const TRAINER_ANIMATION_PENDING_KEY = "goodlang:trainer-animation-pending";

export function createShakespeareTrainerAnimation(isMobile = false) {
    const offsets = isMobile
        ? {
            initialX: 0.65,
            initialY: 2,
            visibleY: 0.5,
            hiddenY: 2,
            handAnchorX: -0.4,
            handAnchorY: 0.3,
        }
        : {
            initialX: 0.65,
            initialY: 2,
            visibleY: 0.75,
            hiddenY: 2,
            handAnchorX: -0.4,
            handAnchorY: 0.3,
        };

    const skeleton = new AnimationSkeleton(
        AnimationParts.Shakespeare,
        offsets.initialX,
        offsets.initialY,
        0,
    );
    const shakespeareImg = skeleton.baseImage;
    const thumbsUpHandImg = skeleton.AddChild(
        AnimationParts.ThumbsUp,
        offsets.handAnchorX,
        offsets.handAnchorY,
        1,
        false,
    );
    const animation = new Animation(skeleton);

    animation.toggleVisible(thumbsUpHandImg, true);
    animation.rotateRelative(thumbsUpHandImg, -70, .95, .75, 0);
    animation.translateYRelative(shakespeareImg, offsets.visibleY, 1000);
    animation.Idle(1000);
    animation.rotateRelative(thumbsUpHandImg, 90, .95, .75, 250);
    animation.rotateRelative(thumbsUpHandImg, 10, .95, .75, 300);
    animation.rotateRelative(thumbsUpHandImg, -5, .95, .75, 300);
    animation.rotateRelative(thumbsUpHandImg, -30, .95, .75, 200);
    const rotateStartStep = animation.rotateRelative(thumbsUpHandImg, 2, .95, .75, 100);
    animation.rotateRelative(thumbsUpHandImg, -2, .95, .75, 100);
    animation.Idle(1000);
    const hideStep = animation.translateYRelative(shakespeareImg, offsets.hiddenY, 1000);

    animation.on(TRAINER_ANIMATION_EVENTS.NEXT_SENTENCE, () => {
        if (!skeleton.visible) {
            animation.reset();
            return;
        }

        animation.executeForce(hideStep).finally(() => animation.reset());
    });

    return {
        skeleton,
        animation,
        isMobile,
        offsets,
        images: { shakespeareImg, thumbsUpHandImg },
        steps: { rotateStartStep, hideStep },
    };
}
