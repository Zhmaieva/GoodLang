let skeletonSequence = 0;
let imageSequence = 0;
let stepSequence = 0;

const clampDuration = (duration) => Math.max(0, Number(duration) || 0);

const normalizeImage = (image) => {
    if (typeof image === "string") {
        return { src: image, alt: "" };
    }

    if (image && typeof image.src === "string") {
        return {
            src: image.src,
            alt: image.alt || "",
            className: image.className || "",
            style: image.style || null,
        };
    }

    throw new TypeError("Animation images must be a URL string or an object with a src property.");
};

const cloneState = (state) => ({
    ...state,
    pivot: { ...state.pivot },
    transitionMs: { ...state.transitionMs },
});

const normalizeAbsoluteDegrees = (degrees) => {
    const numeric = Number(degrees) || 0;
    return ((numeric % 360) + 360) % 360;
};

const timing = (durationOrOptions = 0, blocking = true) => {
    if (durationOrOptions && typeof durationOrOptions === "object") {
        return {
            duration: clampDuration(durationOrOptions.duration),
            blocking: durationOrOptions.blocking ?? true,
        };
    }

    return {
        duration: clampDuration(durationOrOptions),
        blocking: blocking ?? true,
    };
};

export class AnimationImage {
    constructor({ image, parentId = null, x = 0, y = 0, zIndex = 0, visible = true }) {
        const source = normalizeImage(image);

        this.id = `animation-image-${++imageSequence}`;
        this.parentId = parentId;
        this.src = source.src;
        this.alt = source.alt;
        this.className = source.className;
        this.style = source.style;
        this.initialState = {
            x: Number(x) || 0,
            y: Number(y) || 0,
            xUnit: "relative",
            yUnit: "relative",
            rotation: 0,
            pivot: { x: 0.5, y: 0.5, unit: "relative" },
            visible: visible !== false,
            zIndex: Number(zIndex) || 0,
            transitionMs: { x: 0, y: 0, rotation: 0 },
        };
        this.state = cloneState(this.initialState);
    }
}

export class AnimationSkeleton {
    constructor(baseImage, x = 0, y = 0, zIndex = 0, visible = true) {
        this.id = `animation-skeleton-${++skeletonSequence}`;
        this.baseImage = new AnimationImage({ image: baseImage, x, y, zIndex, visible });
        this.images = [this.baseImage];
        this.visible = false;
        this.animation = null;
        this.listeners = new Set();
    }

    addChild(image, anchorX = 0, anchorY = 0, zIndex = 0, visible = true) {
        const child = new AnimationImage({
            image,
            parentId: this.baseImage.id,
            x: anchorX,
            y: anchorY,
            zIndex,
            visible,
        });
        this.images.push(child);
        this.notify();
        return child;
    }

    AddChild(...args) {
        return this.addChild(...args);
    }

    use(animation) {
        this.animation = animation;
        animation.bind(this);
        return animation;
    }

    render(animation = this.animation) {
        if (!animation) {
            throw new Error("Attach an Animation before rendering an AnimationSkeleton.");
        }

        this.use(animation);
        return animation.render(this);
    }

    reset() {
        this.animation?.stop();
        this.images.forEach((image) => {
            image.state = cloneState(image.initialState);
        });
        this.visible = false;
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this));
    }

    setRendered(visible) {
        this.visible = Boolean(visible);
        this.notify();
    }

    updateImage(image, patch) {
        if (!this.images.includes(image)) {
            throw new Error("The animation step references an image outside this skeleton.");
        }

        image.state = {
            ...image.state,
            ...patch,
            pivot: patch.pivot ? { ...patch.pivot } : image.state.pivot,
            transitionMs: patch.transitionMs
                ? { ...image.state.transitionMs, ...patch.transitionMs }
                : image.state.transitionMs,
        };
        this.notify();
    }
}

export class Animation {
    constructor(skeleton = null) {
        this.skeleton = null;
        this.steps = [];
        this.running = false;
        this.runVersion = 0;
        this.waits = new Map();
        this.completions = new Map();
        this.eventHandlers = new Map();

        if (skeleton) skeleton.use(this);
    }

    bind(skeleton) {
        this.skeleton = skeleton;
        return this;
    }

    addStep(type, image, values = {}, durationOrOptions = 0, blocking = true) {
        const stepTiming = timing(durationOrOptions, blocking);
        const step = {
            id: `animation-step-${++stepSequence}`,
            type,
            image,
            duration: stepTiming.duration,
            blocking: stepTiming.blocking,
            ...values,
        };
        this.steps.push(step);
        return step;
    }

    idle(duration = 0, blocking = true) {
        return this.addStep("idle", null, {}, duration, blocking);
    }

    Idle(...args) {
        return this.idle(...args);
    }

    translateX(image, pixels, duration = 0, blocking = true) {
        return this.addStep("translateX", image, { value: Number(pixels) || 0, unit: "px" }, duration, blocking);
    }

    translateXRelative(image, relativeX, duration = 0, blocking = true) {
        return this.addStep("translateX", image, { value: Number(relativeX) || 0, unit: "relative" }, duration, blocking);
    }

    translateY(image, pixels, duration = 0, blocking = true) {
        return this.addStep("translateY", image, { value: Number(pixels) || 0, unit: "px" }, duration, blocking);
    }

    translateYRelative(image, relativeY, duration = 0, blocking = true) {
        return this.addStep("translateY", image, { value: Number(relativeY) || 0, unit: "relative" }, duration, blocking);
    }

    rotate(image, degrees, pivotX = 0, pivotY = 0, duration = 0, blocking = true) {
        return this.addStep("rotate", image, {
            degrees: normalizeAbsoluteDegrees(degrees),
            relativeRotation: false,
            pivot: { x: Number(pivotX) || 0, y: Number(pivotY) || 0, unit: "px" },
        }, duration, blocking);
    }

    rotateWithRelativePivot(image, degrees, pivotX = 0.5, pivotY = 0.5, duration = 0, blocking = true) {
        return this.addStep("rotate", image, {
            degrees: normalizeAbsoluteDegrees(degrees),
            relativeRotation: false,
            pivot: { x: Number(pivotX) || 0, y: Number(pivotY) || 0, unit: "relative" },
        }, duration, blocking);
    }

    rotateRelative(image, degrees, pivotX = 0.5, pivotY = 0.5, duration = 0, blocking = true) {
        return this.addStep("rotate", image, {
            degrees: Number(degrees) || 0,
            relativeRotation: true,
            pivot: { x: Number(pivotX) || 0, y: Number(pivotY) || 0, unit: "relative" },
        }, duration, blocking);
    }

    rotateRelativeAtPixels(image, degrees, pivotX = 0, pivotY = 0, duration = 0, blocking = true) {
        return this.addStep("rotate", image, {
            degrees: Number(degrees) || 0,
            relativeRotation: true,
            pivot: { x: Number(pivotX) || 0, y: Number(pivotY) || 0, unit: "px" },
        }, duration, blocking);
    }

    toggleVisible(image, visible = true) {
        return this.addStep("toggleVisible", image, { visible: Boolean(visible) }, 0, false);
    }

    zIndex(image, zIndex) {
        return this.addStep("zIndex", image, { zIndex: Number(zIndex) || 0 }, 0, false);
    }

    synchronize(stepIds) {
        const ids = (Array.isArray(stepIds) ? stepIds : [stepIds])
            .map((step) => typeof step === "string" ? step : step?.id)
            .filter(Boolean);
        return this.addStep("synchronize", null, { stepIds: ids }, 0, true);
    }

    loop(stepToReturnTo, count = Infinity) {
        const targetStepId = typeof stepToReturnTo === "string" ? stepToReturnTo : stepToReturnTo?.id;
        if (!targetStepId) throw new Error("loop() requires a prior animation step or step ID.");

        const repetitions = count == null
            ? Infinity
            : Math.max(0, Number(count));
        return this.addStep("loop", null, { targetStepId, count: repetitions }, 0, true);
    }

    on(eventName, handler) {
        const handlers = this.eventHandlers.get(eventName) || new Set();
        handlers.add(handler);
        this.eventHandlers.set(eventName, handlers);
        return () => handlers.delete(handler);
    }

    emit(eventName, payload) {
        const handlers = this.eventHandlers.get(eventName);
        if (!handlers) return;
        [...handlers].forEach((handler) => handler(payload));
    }

    render(skeleton = this.skeleton) {
        if (!skeleton) throw new Error("Animation.render() requires an AnimationSkeleton.");

        this.bind(skeleton);
        this.stop();
        const version = this.runVersion;
        this.running = true;
        this.skeleton.setRendered(true);
        this.runPromise = this.startFrom(0, version);
        return this.runPromise;
    }

    executeForce(stepOrId) {
        if (!this.skeleton) throw new Error("Bind the animation to a skeleton before executing it.");
        const stepId = typeof stepOrId === "string" ? stepOrId : stepOrId?.id;
        const index = this.steps.findIndex((step) => step.id === stepId);
        if (index < 0) throw new Error("executeForce() could not find the requested step.");

        this.stop();
        const version = this.runVersion;
        this.running = true;
        this.skeleton.setRendered(true);
        this.runPromise = this.runFrom(index, version);
        return this.runPromise;
    }

    reset() {
        this.stop();
        this.skeleton?.reset();
    }

    stop() {
        this.runVersion += 1;
        this.running = false;
        this.waits.forEach(({ timer, resolve }) => {
            clearTimeout(timer);
            resolve();
        });
        this.waits.clear();
        this.completions.clear();
    }

    wait(duration, version) {
        if (duration <= 0 || version !== this.runVersion) return Promise.resolve();

        return new Promise((resolve) => {
            const token = Symbol("animation-wait");
            const finish = () => {
                this.waits.delete(token);
                resolve();
            };
            const timer = setTimeout(finish, duration);
            this.waits.set(token, { timer, resolve: finish });
        });
    }

    async executeStep(step, version) {
        if (version !== this.runVersion) return;

        if (step.type === "idle") {
            await this.wait(step.duration, version);
            return;
        }

        if (step.type === "synchronize") {
            await Promise.all(step.stepIds.map((stepId) => this.completions.get(stepId) || Promise.resolve()));
            return;
        }

        if (step.type === "toggleVisible") {
            this.skeleton.updateImage(step.image, { visible: step.visible });
            return;
        }

        if (step.type === "zIndex") {
            this.skeleton.updateImage(step.image, { zIndex: step.zIndex });
            return;
        }

        if (step.type === "translateX") {
            this.skeleton.updateImage(step.image, {
                x: step.value,
                xUnit: step.unit,
                transitionMs: { x: step.duration },
            });
        }

        if (step.type === "translateY") {
            this.skeleton.updateImage(step.image, {
                y: step.value,
                yUnit: step.unit,
                transitionMs: { y: step.duration },
            });
        }

        if (step.type === "rotate") {
            const rotation = step.relativeRotation
                ? step.image.state.rotation + step.degrees
                : step.degrees;
            this.skeleton.updateImage(step.image, {
                rotation,
                pivot: step.pivot,
                transitionMs: { rotation: step.duration },
            });
        }

        await this.wait(step.duration, version);
    }

    async startFrom(index, version) {
        // Give the renderer one committed frame at the initial position before
        // applying the first interpolated movement.
        await this.wait(20, version);
        if (version !== this.runVersion) return;
        await this.runFrom(index, version);
    }

    async runFrom(startIndex, version) {
        let index = startIndex;
        const loopCounts = new Map();

        while (index < this.steps.length && version === this.runVersion) {
            const step = this.steps[index];

            if (step.type === "loop") {
                const completedLoops = loopCounts.get(step.id) || 0;
                if (completedLoops < step.count) {
                    const targetIndex = this.steps.findIndex((candidate) => candidate.id === step.targetStepId);
                    if (targetIndex < 0 || targetIndex >= index) {
                        throw new Error("loop() must target a step earlier in the same animation.");
                    }
                    loopCounts.set(step.id, completedLoops + 1);
                    index = targetIndex;
                    continue;
                }

                index += 1;
                continue;
            }

            const completion = this.executeStep(step, version);
            this.completions.set(step.id, completion);
            if (step.blocking) await completion;
            index += 1;
        }

        if (version === this.runVersion) this.running = false;
    }
}
