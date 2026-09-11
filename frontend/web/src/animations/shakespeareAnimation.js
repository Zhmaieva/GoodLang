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

export function createShakespeareTrainerAnimation() {
    const skeleton = new AnimationSkeleton(AnimationParts.Shakespeare, 0.65, 2, 0);
    const shakespeareImg = skeleton.baseImage;
    const thumbsUpHandImg = skeleton.AddChild(AnimationParts.ThumbsUp, -.4, 0.3, 1, false);
    const animation = new Animation(skeleton);

    animation.toggleVisible(thumbsUpHandImg, true);
    animation.rotateRelative(thumbsUpHandImg, -70, .95, .75, 0);
    animation.translateYRelative(shakespeareImg, 0.75, 1000);
    animation.Idle(1000);
    animation.rotateRelative(thumbsUpHandImg, 90, .95, .75, 250);
    const rotateStartStep = animation.rotateRelative(thumbsUpHandImg, 30, .95, .75, 500);
    animation.rotateRelative(thumbsUpHandImg, -30, .95, .75, 500);
    animation.loop(rotateStartStep, 3);
    const hideStep = animation.translateYRelative(shakespeareImg, 2, 1000);

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
        images: { shakespeareImg, thumbsUpHandImg },
        steps: { rotateStartStep, hideStep },
    };
}
